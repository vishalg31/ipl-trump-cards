# IPL Trump Cards

Local lab build of a web game prototype for `IPL Trump Cards`.

## Stack
- Next.js
- React
- Tailwind CSS
- Framer Motion

## Current Status
- Built in `vishal-lab/` only
- Uses a real top-50 IPL batting deck generated from Cricsheet 2016 -2025 data
- Final UI is locked to the current live board experience
- Older board and card experiments are kept in the codebase for future local testing, but are not wired into the live app


## Main Features
- Player onboarding with name entry
- Real batting data with raw stat display and normalized gameplay values
- Round-based stat battles with one player card per side
- First-to-10 scoring system
- Round result feedback
- Match point and final showdown tension states
- Cinematic final-round reveal at `9-9`
- Final winner and restart flow
- Achievement tracking
- Shareable postcard export

## Main Entry
- `app/page.js`

## Important Notes
- Keep architecture simple
- Real player data now comes from `players_deck.json`
- The current live app is locked to the final UI version
- Legacy UI variants remain on disk for future testing only
- No live version toggle, theme query, or alternate board selection remains in the active app
- Lab first, validate locally, then promote later
