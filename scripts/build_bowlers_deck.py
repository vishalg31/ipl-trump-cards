from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable

import pandas as pd


APP_ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_INPUT_DIR = WORKSPACE_ROOT / "ipldata"
DEFAULT_OUTPUT_PATH = APP_ROOT / "bowlers_deck.json"
DISPLAY_NAME_OVERRIDES_PATH = APP_ROOT / "data" / "player_display_names.json"


def safe_read_json(file_path: Path) -> dict:
    with file_path.open("r", encoding="utf-8") as file:
        return json.load(file)


def load_display_name_overrides(file_path: Path = DISPLAY_NAME_OVERRIDES_PATH) -> dict[str, str]:
    # We load the exact same JSON file you just updated for the batters!
    overrides = {}
    if not file_path.exists():
        return overrides

    data = safe_read_json(file_path)
    if isinstance(data, dict):
        for key, value in data.items():
            overrides[str(key)] = str(value)
            
    return overrides


def extract_match_year(match_data: dict) -> int | None:
    info = match_data.get("info") or {}
    dates = info.get("dates") or []

    if not dates:
        return None

    try:
        return int(str(dates[0])[:4])
    except (TypeError, ValueError):
        return None


def parse_match(file_path: Path, allowed_years: set[int]) -> list[dict]:
    match_data = safe_read_json(file_path)
    match_year = extract_match_year(match_data)

    if match_year not in allowed_years:
        return []

    rows: list[dict] = []
    innings = match_data.get("innings") or []

    for inning in innings:
        overs = inning.get("overs") or []

        for over in overs:
            deliveries = over.get("deliveries") or []

            for delivery in deliveries:
                bowler = delivery.get("bowler")
                if not bowler:
                    continue

                runs = delivery.get("runs") or {}
                extras = delivery.get("extras") or {}
                
                # In cricket, wides and no-balls do NOT count as legal deliveries bowled
                is_wide = "wides" in extras
                is_noball = "noballs" in extras
                legal_ball = 0 if (is_wide or is_noball) else 1

                # Runs charged to the bowler = Total runs minus byes, legbyes, and penalties
                total_runs = runs.get("total", 0)
                byes = extras.get("byes", 0)
                legbyes = extras.get("legbyes", 0)
                penalty = extras.get("penalty", 0)
                bowler_runs = total_runs - byes - legbyes - penalty

                is_dot_ball = 1 if (legal_ball == 1 and bowler_runs == 0) else 0

                # Wickets (excluding run outs, retired hurts, etc.)
                wickets_data = delivery.get("wickets") or []
                bowler_wickets = 0
                for w in wickets_data:
                    if w.get("kind") not in ["run out", "retired hurt", "obstructing the field"]:
                        bowler_wickets += 1

                rows.append(
                    {
                        "name": bowler,
                        "match_id": file_path.stem,
                        "runs_conceded": bowler_runs,
                        "legal_balls": legal_ball,
                        "dot_balls": is_dot_ball,
                        "wickets": bowler_wickets,
                    }
                )

    return rows


def aggregate_stats(parsed_rows: Iterable[dict], min_balls: int) -> pd.DataFrame:
    dataframe = pd.DataFrame(parsed_rows)

    if dataframe.empty:
        return pd.DataFrame(
            columns=[
                "name", "runs_conceded", "balls", "dot_balls", "wickets", "matches",
                "economy_raw", "strike_rate_raw", "dot_ball_percentage_raw"
            ]
        )

    grouped = (
        dataframe.groupby("name", as_index=False)
        .agg(
            runs_conceded=("runs_conceded", "sum"),
            balls=("legal_balls", "sum"),
            dot_balls=("dot_balls", "sum"),
            wickets=("wickets", "sum"),
            matches=("match_id", "nunique"),
        )
    )

    # Apply the 500 ball cutoff
    qualified = grouped[grouped["balls"] >= min_balls].copy()

    if qualified.empty:
        return qualified

    qualified["economy_raw"] = (qualified["runs_conceded"] / qualified["balls"]) * 6
    
    # Avoid division by zero if a bowler somehow bowled 500 balls and took 0 wickets
    qualified["strike_rate_raw"] = qualified.apply(
        lambda row: (row["balls"] / row["wickets"]) if row["wickets"] > 0 else row["balls"], axis=1
    )
    qualified["dot_ball_percentage_raw"] = (qualified["dot_balls"] / qualified["balls"]) * 100

    return qualified


def normalize_series(series: pd.Series) -> pd.Series:
    minimum = series.min()
    maximum = series.max()
    if pd.isna(minimum) or pd.isna(maximum) or maximum == minimum:
        return pd.Series([0.0] * len(series), index=series.index)
    return ((series - minimum) / (maximum - minimum)) * 100


def normalize_series_inverse(series: pd.Series) -> pd.Series:
    # INVERSE NORMALIZATION: The lowest stat gets 100, the highest stat gets 0
    minimum = series.min()
    maximum = series.max()
    if pd.isna(minimum) or pd.isna(maximum) or maximum == minimum:
        return pd.Series([0.0] * len(series), index=series.index)
    return ((maximum - series) / (maximum - minimum)) * 100


def apply_elite_tier_scaling(series: pd.Series, threshold: float = 80.0, cap: float = 95.0) -> pd.Series:
    scaled = series.copy()
    mask = scaled > threshold
    if not mask.any():
        return scaled.clip(upper=cap)
    scaled.loc[mask] = threshold + (cap - threshold) * (
        ((scaled.loc[mask] - threshold) / (cap - threshold)) ** 0.95
    )
    return scaled.clip(upper=cap)


def normalize_stats(dataframe: pd.DataFrame) -> pd.DataFrame:
    if dataframe.empty:
        return dataframe

    normalized = dataframe.copy()
    
    # Economy and Strike Rate are inverse (lower is better), Dot Ball % is standard (higher is better)
    normalized["economy_normalized"] = normalize_series_inverse(normalized["economy_raw"])
    normalized["strike_rate_normalized"] = normalize_series_inverse(normalized["strike_rate_raw"])
    normalized["dot_ball_percentage_normalized"] = normalize_series(normalized["dot_ball_percentage_raw"])

    normalized["impact_score_raw"] = (
        0.40 * normalized["economy_normalized"]
        + 0.35 * normalized["strike_rate_normalized"]
        + 0.25 * normalized["dot_ball_percentage_normalized"]
    )
    normalized["impact_score_scaled"] = normalized["impact_score_raw"] ** 1.1
    normalized["impact_score"] = normalize_series(normalized["impact_score_scaled"]).clip(upper=95)
    normalized["impact_score"] = apply_elite_tier_scaling(normalized["impact_score"])

    for column in [
        "economy_raw", "strike_rate_raw", "dot_ball_percentage_raw",
        "economy_normalized", "strike_rate_normalized", "dot_ball_percentage_normalized", "impact_score",
    ]:
        normalized[column] = normalized[column].round(2)

    return normalized


def build_bowlers_deck(
    input_dir: Path, output_path: Path, seasons: set[int], min_balls: int, top_n: int
) -> pd.DataFrame:
    display_name_overrides = load_display_name_overrides()
    candidate_files = sorted(input_dir.glob("*.json"))
    all_files = []
    
    print(f"Scanning {len(candidate_files)} match files for seasons {seasons}...")

    for file_path in candidate_files:
        try:
            match_data = safe_read_json(file_path)
        except json.JSONDecodeError:
            continue
        if extract_match_year(match_data) in seasons:
            all_files.append(file_path)

    parsed_rows: list[dict] = []
    print(f"Parsing {len(all_files)} matching files... (This might take 10-15 seconds)")
    for file_path in all_files:
        parsed_rows.extend(parse_match(file_path, seasons))

    print("Aggregating and calculating bowler impact scores...")
    aggregated = aggregate_stats(parsed_rows, min_balls=min_balls)
    normalized = normalize_stats(aggregated)
    
    if not normalized.empty:
        normalized["display_name"] = normalized["name"].map(display_name_overrides).fillna(normalized["name"])

    final_columns = [
        "name", "display_name", "matches", "wickets", "balls", "runs_conceded", "dot_balls",
        "economy_raw", "strike_rate_raw", "dot_ball_percentage_raw",
        "economy_normalized", "strike_rate_normalized", "dot_ball_percentage_normalized",
        "impact_score",
    ]
    final_frame = normalized[final_columns].copy() if not normalized.empty else pd.DataFrame(columns=final_columns)

    if not final_frame.empty:
        final_frame = final_frame.sort_values(["impact_score", "wickets"], ascending=[False, False]).head(top_n)

        for column in ["matches", "wickets", "balls", "runs_conceded"]:
            final_frame[column] = final_frame[column].astype(int)

        missing_overrides = final_frame[~final_frame["name"].isin(display_name_overrides.keys())]
        if not missing_overrides.empty:
            print("\n" + "="*60)
            print("⚠️ WARNING: MISSING DISPLAY NAMES DETECTED IN BOWLERS DECK!")
            print("Add them to player_display_names.json to fix them:")
            for raw_name in missing_overrides["name"]:
                print(f'  "{raw_name}": "{raw_name}",')
            print("="*60 + "\n")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(final_frame.to_json(orient="records", indent=2), encoding="utf-8")

    excel_path = output_path.with_suffix(".xlsx")
    final_frame.to_excel(excel_path, index=False)

    return final_frame


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build a Bowlers Deck from Cricsheet data.")
    parser.add_argument("--input-dir", type=Path, default=DEFAULT_INPUT_DIR)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH)
    parser.add_argument("--seasons", nargs="+", type=int, default=list(range(2016, 2026)))
    parser.add_argument("--min-balls", type=int, default=500)
    parser.add_argument("--top-n", type=int, default=50)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    final_frame = build_bowlers_deck(
        input_dir=args.input_dir,
        output_path=args.output,
        seasons=set(args.seasons),
        min_balls=args.min_balls,
        top_n=args.top_n,
    )
    
    print(f"Processed bowlers deck written to: {args.output}")
    print(f"Players in deck: {len(final_frame)}")

    if not final_frame.empty:
        print("\n🏆 Top 5 Bowlers by Impact Score:")
        print(final_frame[["display_name", "wickets", "economy_raw", "strike_rate_raw", "dot_ball_percentage_raw", "impact_score"]].head(5).to_string(index=False))


if __name__ == "__main__":
    main()