# Spot the Difference — Pasar Malam & More

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/top234/best-spot-the-difference-game-20261121-entry/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/top234/best-spot-the-difference-game-20261121-entry/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

A complete spot-the-difference game for the make.fun competition
**[Make the best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)**.
All art is drawn in code (Canvas 2D) — no external images, no network, no copied assets.

## The game

Five hand-drawn scenes, **38 hidden differences** in all:

| Scene | Differences | Timer |
| --- | --- | --- |
| 1. Pasar Malam — night market lane | 7 | 3:00 |
| 2. The Old Library | 8 | 3:00 |
| 3. Botanical Garden | 8 | 2:30 |
| 4. Bakery at Dawn | 7 | 2:30 |
| 5. Kite Festival | 8 | 2:00 |

Two near-identical pictures side by side. Click or tap a difference on either
picture to circle it in gold on both panels. Every difference is fair at full
size: a missing object, a colour change, a shifted item or an added detail.

- **Counter** — "X of Y found" in the top bar, plus a scene strip showing progress
- **Timer** — a countdown bar that turns red under 25%, with a ticking warning
- **Hints** — 3 per scene (H key or button), a pulsing ring around one unfound difference, −25 points
- **Magnifier** — a round 2.5× lens that follows the pointer (M key or button)
- **Keyboard play** — arrow keys move the golden crosshair, Enter marks the spot
- **Scoring** — +100 per find, streak and speed bonuses, −10 for a wrong click,
  time bonus and up to 3 stars per scene
- **Screens** — title / scene select with live thumbnails, scene-complete with stars,
  game-complete trophy screen, and a time-up retry screen
- **Sound** — small WebAudio chimes made in code (mutable), no audio files

## Play it

```sh
node serve.ts
# open http://localhost:8080
```

Screenshot staging (the same real game states, preset through the URL so the
maker can photograph them): `?shot=cover`, `?shot=scene2`, `?shot=complete`,
`?shot=title`.

## Layout

- `game/index.html` — page shell
- `game/main.js` — game flow: screens, timer, scoring, shot staging
- `game/scenes.js` — the five scenes and every difference (position, radius, label)
- `game/render.js` — all procedural Canvas 2D art, one painter per scene
- `game/differences.js` — hit-testing, gold markers, hint rings, points
- `game/input.js` — mouse / touch / keyboard play and the magnifier lens
- `game/hud.js` — top bar, counter, timer bar, score and scene strip
- `game/audio.js` — WebAudio sounds made in code
- `game/styles.css` — the night-market look
- `main.ts` — the make.fun entrypoint: copies `game/` + `screenshots/` to
  `/output` and writes `dossier.json`
- `vendor/makefun-game.ts` — the kit's library, unchanged
- `screenshots/` — four real renders of the game in a browser

## License

MIT — see [LICENSE](LICENSE).
