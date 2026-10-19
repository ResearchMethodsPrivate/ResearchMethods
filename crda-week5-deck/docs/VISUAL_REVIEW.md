# Visual review — Week 5 deck

What was actually rendered, what was looked at, what was found and fixed, and what is still unverified.

## Environment

| Item | Value |
|---|---|
| Machine | Windows 11 Home (10.0.26340), the development machine — not a restricted reviewer browser |
| Renderer | Playwright 1.63.0 bundled **Chromium 153.0.8010.12**, headless, deviceScaleFactor 1, sRGB |
| Served from | production `dist/` via `vite preview` (Vite 6.3.5), i.e. the offline build, not the dev server |
| Node / npm | 26.10.0 / 11.13.0 |
| PDF check | PyMuPDF (scratch venv) re-rendered every page of `docs/crda-week5-deck.pdf` |
| Video check | frames extracted from the `.webm` with ffmpeg and inspected |

Nothing was blocked: local URLs loaded normally, so no administrator-policy workaround was needed or attempted.

## What was captured (`docs/visual-qa/`)

| Evidence | Count | How |
|---|---:|---|
| Every Reveal fragment / GSAP step at 1920×1080 (`NN-id-sK.png`, s0 = intro end) | 30 | real `ArrowRight` key presses, waiting until the timeline sits exactly on its step label **and** Reveal’s fade has finished |
| Intermediate frames at 25 / 50 / 75 % of every animated segment (`NN-id-sK-PP.jpg`) | 90 | exact `timeline.pause(t)` seeks — genuine in-between frames, not end states |
| Slide 4 residual carry, mid-flight (`04-mechanism-mid-copy.png`) | 1 | seek to 40 % of the carry segment |
| Final state of every slide at 1366×768 and 1280×720 (`vp-*/`) | 18 | deep-link to last fragment |
| Fullscreen (`fullscreen.png`) | 1 | `F` key; `document.fullscreenElement` confirmed non-null |
| OpenUI explorer (`explore-*.png`) | 3 | `E` key, then real clicks on tabs/toggles |
| Real-time clip of slide 4 (`04-mechanism.webm`, 26 s, 1920×1080, 25 fps) | 1 | Playwright video; enters from slide 3, five clicks with 3.2–4.4 s natural pauses |
| Contact sheet of all step states (`contact-sheet.png`) | 1 | |
| Automated findings (`qa-report.json`) | 1 | requests, console, failed loads, out-of-frame elements, scrollbars |

Regenerate everything with `npm run qa:visual` (≈ 2 min). It also writes the measured animation durations to `src/content/motion.json`, which the timing model uses.

## Images I actually looked at

Inspected by eye (multimodal): the contact sheet; every slide-4 step (s0–s4) plus `04-mechanism-mid-copy` and `04-mechanism-s4-50`; slide 2 `s1-50`; slide 3 `s2`; slide 5 `s4`; slide 6 `s2`; slide 7 `s1`; slide 8 `s5`; title `s0`; all three explorer captures; `vp-1280x720/05`; a 3×3 render of every PDF page; a 12-frame sheet extracted from the slide-4 video.

**Not individually inspected:** the remaining ~80 intermediate JPEGs and the other 1366/1280 captures. These were covered only by the automated checks (out-of-frame, scrollbars) and, for step states, by the contact sheet at thumbnail size.

## Automated results (final run)

- Remote requests: **none** (production build, every slide, explorer opened).
- Console errors / failed asset loads: **none**. Fonts and KaTeX load from local `assets/`.
- Visible elements outside the 1920×1080 frame: **none** on any slide.
- Document scrollbars: **none** at 1920×1080, 1366×768 or 1280×720.
- `npm test` — 10/10 unit tests: `y′ − ĝ(x′) = z` for every animated sample, |δ| ≤ 0.1, the arrow tip lands on the synthetic point, signed ΔMSE bars for positive and negative values, and the OpenUI fixture parses and renders.
- `npm run test:browser` — 7/7: step markers ↔ labels on every slide, rapid double-clicks, s4 → s0 → s3 with no duplicates and the arrow on the dot, deep link + overview + back-navigation, `R` replay, `S` speaker view showing “Alvi”, `?static`, reduced motion, `?print-pdf` (9 pages, no explorer), explorer open/toggle/close without moving slides.

## Problems found and fixed

| Sev. | Slide | Problem (verified in a capture) | Fix |
|---|---|---|---|
| High | 4 | Science: “garage finish ×1.45” presented as a numeric perturbation; δ = 0.45 looked like a default | numeric `x_P` axis, repo default p = 0.1 band, δ = +0.09; the garage story is kept only as a labelled analogy |
| High | 6 | Bar width from `−ΔMSE` would go negative for a positive ΔMSE | zero-centred signed scale; bars grow from zero in either direction; unit-tested with Table 1’s +1.65 |
| High | 5 | “Allowed dependence” edge rendered **solid**, though the legend says dotted — DrawSVG overwrites `stroke-dasharray` | that edge now fades in instead of drawing |
| Med | 4 | `×(1 + 0.09)` label crossed the dashed guide; synthetic label ran through a background point; ĝ(x) label covered by a synthetic sample at s4; “δ =” / “+0.09” split across lines | labels repositioned; non-breaking spaces |
| Med | 7 | C→A cross-check arrow crossed the B→C arrow | wrap-around arc routed outside both short arcs |
| Med | 5 | DAG cards mostly empty; legend wrapped onto two lines; inconsistent “(a)/(B)/(C)” casing | bigger diagrams, one-line legend, consistent (A)/(B)/(C) tiers |
| Med | — | `fmtDelta(1.65)` displayed “+1.6%” (binary float `toFixed`) | half-away-from-zero rounding |
| Low | explorer | DAG labels showed literal `X_R` | real subscripts |
| QA | — | First 1280×720 capture of slide 5 caught Reveal mid-fade (slide 4 showing through) — a capture bug, not a deck bug | QA waits for the slide transition as well as GSAP |

## Remaining concerns / not verified

1. **No human has rehearsed it.** The 6:55 figure is a *model* (words at 150 wpm, plus measured motion, clicks, transitions and handoffs). Anik, Alvi and Atul need a stopwatch run; there's a log table in `docs/speaker-notes.md`.
2. **Real projector not tested.** Colour and contrast were judged on screenshots only. The amber footnotes (≈19–21 px at 1080p) are the smallest text — check them from the back of the room.
3. **Headless only.** Fullscreen was confirmed headless; headed Chrome/Edge on the presenting laptop has not been tried. The speaker-view popup works, but its layout wasn't reviewed visually.
4. The ~80 intermediate JPEGs listed above were checked automatically, not by eye.
