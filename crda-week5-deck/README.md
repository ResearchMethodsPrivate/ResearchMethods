# CRDA · Week 5 interim presentation

Animated browser slide deck for **ECS7029P Research Methods — First Interim Presentation (Week 5)**, presented by **Anik, Alvi and Atul**.
Paper: Mohebbi, Schulte, Li & Poupart (2026), *Counterfactual Residual Data Augmentation for Regression*, ICML 2026.

Scope is **Week 5 only**: the problem the paper addresses, enough background to explain the method, the proposed replication and who does what, and targets before Week 9. The deck contains **no Table 1 replication results**. Its only results are our one-seed runs of the authors’ demo on three laptops (slide 6, evidence in `docs/demo-reports/`).

## Run it

```bash
npm ci
```

```bash
npm run dev
```

Open **http://localhost:5173/** and press **F** for fullscreen.

> `npm ci` runs OpenUI’s install-time telemetry (a pseudonymous event sent to PostHog — see `docs/OPENUI_DECISION.md`). To opt out, set `OPENUI_TELEMETRY_DISABLED=1` first. In PowerShell: `$env:OPENUI_TELEMETRY_DISABLED=1; npm ci`.

| Command | What it does |
|---|---|
| `npm run build` | Type-checks and builds a fully offline copy into `dist/` |
| `npm run preview` | Serves `dist/` at http://localhost:4173/ |
| `npm run notes` | Writes `docs/speaker-notes.md`: the script, a timing model and a stopwatch log |
| `npm run pdf` | After `build`, writes the static fallback `docs/crda-week5-deck.pdf` (Playwright Chromium) |
| `npm run validate:deck` | Development checks: names, slide ↔ notes ↔ speaker ids, owners, required labels, citations, timing. Passes even while team decisions are open |
| `npm run validate:ready` | Presentation-ready check. **Fails until every open team decision is confirmed** (see the checklist below) |
| `npm test` | Unit tests: the CRDA invariant `y′ = ĝ(x′) + z`, signed ΔMSE bars, the OpenUI fixture |
| `npm run test:browser` | Real-browser tests: navigation, rapid clicks, back/forward, deep links, overview, `R`, `S`, reduced motion, print, explorer, offline |
| `npm run qa:visual` | Screenshots of every step plus 25/50/75 % frames, other viewports, the slide-4 video and a contact sheet → `docs/visual-qa/` |

Browser tests and QA use Playwright’s Chromium. If it is missing, run `npx playwright-core install chromium ffmpeg` once.

### Presenting offline

1. Run `npm run build`.
2. Copy `dist/` to the presenting laptop.
3. Serve it with `npm run preview`, or `npx serve dist` — opening `index.html` straight from disk can be blocked by browser module rules.

Fonts, KaTeX and every library are bundled, so the deck makes no network requests (tested). Bring `docs/crda-week5-deck.pdf` as a backup.

## Controls

| Key | Action |
|---|---|
| → / Space / ↓ | Next animation step, then next slide |
| ← / ↑ | Previous step (quick rewind) |
| **S** | Speaker view: notes with presenter names, timer, next slide |
| **O** / Esc | Overview |
| **R** | Replay the current slide’s animation (useful on slide 4) |
| **E** | Optional “Explore CRDA” panel (OpenUI); Esc or E closes it. Not a counted slide |
| **F** | Fullscreen |
| ? | All shortcuts |

Each click is a hidden Reveal fragment that drives a labelled GSAP step (`s0`…`sN`). Going back, using the overview or opening a deep link lands on the exact state, so nothing is replayed or duplicated. `prefers-reduced-motion` or `?static` turns tweening off.

## What to edit

| File | Controls |
|---|---|
| `src/config/deck.config.ts` | **Team-specific facts.** Presenters, research roles, speaking split, scope, seeds, milestones, group name/date. The header says what is confirmed and what isn't |
| `src/content/notes.ts` | Speaker notes and target seconds |
| `src/content/paper.ts` | Verified numbers from the paper/repo (Table 1, headline averages, code-reading questions) |
| `src/content/references.ts` | Reference list; dataset references follow `scope.datasets` |
| `src/slides/*.ts` | One file per slide: markup + GSAP timeline |
| `src/lib/crda-geometry.ts` | The tested maths behind the slide-4 sketch |
| `src/explore/` | The optional OpenUI explorer |

## Checklist — team decisions (`npm run validate:ready` lists any still open)

Presenter names, group name and date, roles, scope and milestones are all **confirmed** (22 Oct 2026) and `npm run validate:ready` passes.

- [x] Group name → `group.name` = Triple A
- [x] Presentation date → `group.date` = 23 October 2026
- [x] Research roles and cross-check pairs (Anik environment, Alvi experiments, Atul analysis/delivery) → `rolesStatus = 'confirmed'`
- [x] Replication scope (Energy Efficiency + Concrete Strength, MLP + XGBoost, 3 seeds first pass) → `scope.status = 'confirmed'`
- [x] Milestone weeks and owners → `milestonesStatus = 'confirmed'`
- [ ] **Stopwatch rehearsal** of the full talk. The ~7:20 figure is a model, not a measurement; record runs in `docs/speaker-notes.md`
- [ ] After any edit: `npm run validate:deck && npm test && npm run build && npm run pdf`

If the group changes its mind about any of these, set the matching `*Status` back to `'proposed'` in `src/config/deck.config.ts` and the slides show "Proposed" labels again.

## Timing

`npm run notes` gives per-slide speech and *modelled live* time. The model includes transitions, clicks, speaker handoffs and the measured GSAP durations from `qa:visual`. Current figures (10 slides): target 7:20, speech 6:14, **modelled live 7:18**, inside the 6:00–8:00 brief. The demo slide (6) is shared by all three presenters, one row each.

## Evidence

- `docs/demo-reports/` — the three laptops' reports from running the authors' demo (22 Oct 2026): Anik (Mac, M2), Alvi (Windows, Ryzen 7 + RTX 3070), Atul (Mac, M5 Pro). The slide-6 numbers in `src/content/machines.ts` are copied from these, and `npm test` checks them.

- `docs/VISUAL_REVIEW.md` — what was rendered and inspected, what was fixed, and what is still unverified.
- `docs/OPENUI_DECISION.md` — the OpenUI integration and the risks it brings.
- `docs/visual-qa/` — screenshots, intermediate frames, slide-4 video, contact sheet, `qa-report.json`.

## Source integrity

- Equations and numbers come from `paper.pdf` (abstract, Assumption 3.1, Algorithm 1, §3.3, §6, Tables 1–2) or the official repo (`src/utils/config.py`, `experiments/*/config.json`, `src/experiment.py`).
- The −22.9 % / −6.4 % headline and the Table 1 bars are labelled **“Original authors’ reported results — not our group’s reproduced results.”**
- The plots on slides 1, 2 and 4, the housing row on slide 3 and the feature chips on slide 5 are invented and labelled **illustrative**. Slide 4 uses the repo’s default ±10 % perturbation range; the garage example appears only as the paper’s analogy.
- The two code-reading items on slide 6 are lines found in the authors’ repo; what they *imply* is framed as open questions.

## AI assistance disclosure

Claude (an AI assistant) helped to build this deck’s code, animations and tests, to draft speaker-note wording, and to cross-check paper claims against the PDF and repository. It did not run any CRDA experiments, and the deck doesn't claim the group has. The presenters are responsible for checking the content, confirming the proposed roles, scope and dates, and rehearsing the delivery.
