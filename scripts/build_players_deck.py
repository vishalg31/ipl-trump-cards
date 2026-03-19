from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable

import pandas as pd


APP_ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_INPUT_DIR = WORKSPACE_ROOT / "ipldata"
DEFAULT_OUTPUT_PATH = APP_ROOT / "players_deck.json"
DISPLAY_NAME_OVERRIDES_PATH = APP_ROOT / "data" / "player_display_names.json"


def safe_read_json(file_path: Path) -> dict:
    with file_path.open("r", encoding="utf-8") as file:
        return json.load(file)


def load_display_name_overrides(file_path: Path = DISPLAY_NAME_OVERRIDES_PATH) -> dict[str, str]:
    if not file_path.exists():
        return {}

    data = safe_read_json(file_path)
    if not isinstance(data, dict):
        return {}

    return {str(key): str(value) for key, value in data.items()}


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
                batter = delivery.get("batter")
                if not batter:
                    continue

                runs = delivery.get("runs") or {}
                extras = delivery.get("extras") or {}
                batter_runs = runs.get("batter", 0) or 0
                is_wide = "wides" in extras

                rows.append(
                    {
                        "name": batter,
                        "match_id": file_path.stem,
                        "runs": batter_runs,
                        "ball_faced": 0 if is_wide else 1,
                        "four": 1 if batter_runs == 4 else 0,
                        "six": 1 if batter_runs == 6 else 0,
                    }
                )

    return rows


def aggregate_stats(parsed_rows: Iterable[dict], min_balls: int) -> pd.DataFrame:
    dataframe = pd.DataFrame(parsed_rows)

    if dataframe.empty:
        return pd.DataFrame(
            columns=[
                "name",
                "runs",
                "balls",
                "matches",
                "strike_rate_raw",
                "boundary_rate_raw",
                "consistency_raw",
            ]
        )

    grouped = (
        dataframe.groupby("name", as_index=False)
        .agg(
            runs=("runs", "sum"),
            balls=("ball_faced", "sum"),
            fours=("four", "sum"),
            sixes=("six", "sum"),
            matches=("match_id", "nunique"),
        )
        .sort_values(["runs", "balls", "matches"], ascending=[False, False, False])
    )

    qualified = grouped[grouped["balls"] >= min_balls].copy()

    if qualified.empty:
        return qualified

    qualified["strike_rate_raw"] = (qualified["runs"] / qualified["balls"]) * 100
    qualified["boundary_rate_raw"] = (qualified["fours"] + qualified["sixes"]) / qualified["balls"]
    qualified["consistency_raw"] = qualified["runs"] / qualified["matches"]

    return qualified


def normalize_series(series: pd.Series) -> pd.Series:
    minimum = series.min()
    maximum = series.max()

    if pd.isna(minimum) or pd.isna(maximum):
        return pd.Series([0.0] * len(series), index=series.index)

    if maximum == minimum:
        return pd.Series([100.0] * len(series), index=series.index)

    return ((series - minimum) / (maximum - minimum)) * 100


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
    normalized["strike_rate_normalized"] = normalize_series(normalized["strike_rate_raw"])
    normalized["boundary_rate_normalized"] = normalize_series(normalized["boundary_rate_raw"])
    normalized["consistency_normalized"] = normalize_series(normalized["consistency_raw"])

    normalized["impact_score_raw"] = (
        0.35 * normalized["strike_rate_normalized"]
        + 0.35 * normalized["boundary_rate_normalized"]
        + 0.30 * normalized["consistency_normalized"]
    )
    normalized["impact_score_scaled"] = normalized["impact_score_raw"] ** 1.1
    normalized["impact_score"] = normalize_series(normalized["impact_score_scaled"]).clip(upper=95)
    normalized["impact_score"] = apply_elite_tier_scaling(normalized["impact_score"])

    for column in [
        "strike_rate_raw",
        "boundary_rate_raw",
        "consistency_raw",
        "strike_rate_normalized",
        "boundary_rate_normalized",
        "consistency_normalized",
        "impact_score",
    ]:
        normalized[column] = normalized[column].round(2)

    return normalized


def build_players_deck(
    input_dir: Path,
    output_path: Path,
    seasons: set[int],
    min_balls: int,
    top_n: int,
    max_files: int | None = None,
) -> pd.DataFrame:
    display_name_overrides = load_display_name_overrides()
    candidate_files = sorted(input_dir.glob("*.json"))
    all_files = []

    for file_path in candidate_files:
        try:
            match_data = safe_read_json(file_path)
        except json.JSONDecodeError:
            continue

        if extract_match_year(match_data) in seasons:
            all_files.append(file_path)

    if max_files is not None:
        all_files = all_files[:max_files]

    parsed_rows: list[dict] = []
    for file_path in all_files:
        parsed_rows.extend(parse_match(file_path, seasons))

    aggregated = aggregate_stats(parsed_rows, min_balls=min_balls)
    normalized = normalize_stats(aggregated)
    if not normalized.empty:
        normalized["display_name"] = normalized["name"].map(display_name_overrides).fillna(normalized["name"])

    final_columns = [
        "name",
        "display_name",
        "runs",
        "balls",
        "matches",
        "strike_rate_raw",
        "boundary_rate_raw",
        "consistency_raw",
        "strike_rate_normalized",
        "boundary_rate_normalized",
        "consistency_normalized",
        "impact_score",
    ]
    final_frame = normalized[final_columns].copy() if not normalized.empty else pd.DataFrame(columns=final_columns)

    if not final_frame.empty:
        final_frame = final_frame.sort_values(
            ["impact_score", "runs", "balls", "matches"],
            ascending=[False, False, False, False],
        ).head(top_n)

        for column in ["runs", "balls", "matches"]:
            final_frame[column] = final_frame[column].astype(int)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(final_frame.to_json(orient="records", indent=2), encoding="utf-8")

    return final_frame


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build a normalized IPL Trump Cards deck from Cricsheet JSON match files."
    )
    parser.add_argument("--input-dir", type=Path, default=DEFAULT_INPUT_DIR)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH)
    parser.add_argument("--seasons", nargs="+", type=int, default=[2024, 2025])
    parser.add_argument("--min-balls", type=int, default=100)
    parser.add_argument("--top-n", type=int, default=50)
    parser.add_argument(
        "--max-files",
        type=int,
        default=None,
        help="Limit files for a smaller test run before processing the full dataset.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    final_frame = build_players_deck(
        input_dir=args.input_dir,
        output_path=args.output,
        seasons=set(args.seasons),
        min_balls=args.min_balls,
        top_n=args.top_n,
        max_files=args.max_files,
    )

    print(f"Processed deck written to: {args.output}")
    print(f"Players in deck: {len(final_frame)}")

    if not final_frame.empty:
        print("Top 5 players by impact score:")
        print(final_frame.head(5).to_string(index=False))


if __name__ == "__main__":
    main()
