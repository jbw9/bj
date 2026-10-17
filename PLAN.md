# bj — Hi-Lo card counter

Static site, no build step, no dependencies. Plain HTML/CSS/JS. Hosted on GitHub Pages (jbw9/bj, main branch root).

## Counting
Hi-Lo. Card ranks are 1–10 (1 = Ace; 10 = any ten-value card).
2–6 → +1, 7–9 → 0, 1 (Ace) and 10 → −1.
True count = running count / decks remaining (decks setting, default 6; remaining = decks − cardsSeen/52, floor 0.5).

## Contract (frozen) — `app.js` exposes on `window`:
- `addCard(rank: 1..10): void` — records a card, re-renders.
- `undoCard(): void`
- `setVoiceState(state: "off" | "listening" | "error", message?: string): void` — updates mic button/label.
`voice.js` is loaded after `app.js`, owns `#mic` button click behaviour, and calls only these.

## Workstreams
- W1 (main thread): `index.html`, `style.css`, `app.js` — UI, keyboard, count.
- W2 (voice): `voice.js` — Web Speech API (free, in-browser, zero config). Continuous recognition,
  auto-restart on end while enabled, parse final transcripts into ranks: digits ("1 2 10", and run-together
  "123456" split per digit, "10" kept as ten), number words (one…ten), homophones (won, to/too, for, ate),
  ace → 1, jack/queen/king/face/ten → 10, "undo"/"back" → undoCard(). Unsupported browser → setVoiceState("error", "Voice needs Chrome, Edge or Safari").
