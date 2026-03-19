# IPL Trump Cards

A fast, stat-driven cricket card game powered by real IPL batting data from the 2024 and 2025 seasons.

Players face off against the CPU in quick round-based matchups. Each round reveals one batter for you and one for the CPU. You choose a stat, the higher value wins the round, and the first side to 10 points wins the match.

## What The Game Does

- Uses a real IPL top-50 batting deck built from ball-by-ball Cricsheet data
- Shows real cricket values on cards:
  - Strike Rate
  - Boundary Rate
  - Average
  - Impact Score
- Uses normalized values behind the scenes for fair gameplay balance
- Runs as a round-based stat battle instead of fixed hand/deck play
- Includes match point states, final-showdown tension, and cinematic endgame feedback
- Supports postcard-style match sharing after the game ends

## How Gameplay Works

1. Enter your name and start the game
2. Read the rules popup and continue
3. A short `3, 2, 1` countdown starts the match
4. Each round gives one random player card to you and one different card to the CPU
5. You choose one stat:
   - `Strike Rate`
   - `Boundary Rate`
   - `Average`
   - `Impact Score`
6. The higher stat wins the round
7. First to `10` points wins the match

## Real Data Pipeline

This project uses a generated `players_deck.json` built from IPL ball-by-ball match data.

The pipeline:

- parses Cricsheet JSON match files for IPL 2024 and 2025
- aggregates batter stats from innings -> overs -> deliveries
- excludes wides from balls faced
- filters to players with at least `100` balls faced
- computes:
  - raw strike rate
  - raw boundary rate
  - raw average/consistency
- normalizes gameplay stats to `0-100`
- calculates a weighted impact score
- outputs the top `50` batters into `players_deck.json`

The app displays raw cricket values, while gameplay comparisons use normalized values for balance.

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Framer Motion
- html-to-image

## Project Structure

- `app/`
  - main app shell and page entry
- `components/`
  - game board, cards, overlays, and UI feedback
- `lib/`
  - gameplay hook and deck sanitization
- `data/`
  - player display-name overrides
- `scripts/`
  - data pipeline for rebuilding the player deck
- `players_deck.json`
  - generated public gameplay dataset

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm run start
```

## Rebuild The Player Deck

If you have the IPL JSON data locally, you can regenerate the deck with:

```bash
python scripts/build_players_deck.py
```

For a smaller subset test:

```bash
python scripts/build_players_deck.py --max-files 12 --output players_deck_subset.json
```

## Design Direction

The final live version focuses on:

- one primary board experience
- bold player-vs-CPU contrast
- quick decision-making from readable stat cards
- strong match tension near the endgame

The current live cards use distinct visual identities for:

- the player side
- the CPU side

This helps every round feel more like a face-off than two identical cards.

## Future Scope

- multiplayer gameplay
- expanded player metadata
- richer share/export flows
- additional card archetypes and modes

## Credits

Made by Vishal.
