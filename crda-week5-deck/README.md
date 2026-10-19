# CRDA · Week 5 interim presentation

Browser-based, animated slide deck for **ECS7029P Research Methods: First Interim Presentation (Week 5)**.
Paper: Mohebbi, Schulte, Li & Poupart (2026), *Counterfactual Residual Data Augmentation for Regression*, ICML 2026.

Scope is **Week 5 only**: the problem the paper addresses, our proposed replication, group responsibilities and targets before Week 9. There are **no replication results** in this deck, because we don't have any yet.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open **http://localhost:5173/**. Press **F** for fullscreen.

| Command | What it does |
|---|---|
| `npm run build` | Type-checks and builds a static, fully offline copy into `dist/` |
| `npm run preview` | Serves `dist/` at http://localhost:4173/ |
| `npm run notes` | Writes `docs/speaker-notes.md`, the rehearsal script with a timing check |
| `npm run pdf` | After `build`, writes the static fallback `docs/crda-week5-deck.pdf` (needs Chrome or Edge installed) |

### Presenting offline
All fonts, KaTeX and libraries are bundled, so nothing is fetched at runtime. Before the day:
1. Run `npm run build`.
2. Copy `dist/` onto the presenting machine.
3. Serve it with `npm run preview`, or any static server (e.g. `npx serve dist`).

Opening `dist/index.html` straight from disk can be blocked by browser module rules, so serve it instead. Bring `docs/crda-week5-deck.pdf` as a backup too.

## Controls

| Key | Action |
|---|---|
| → / Space / ↓ | Next animation step, then next slide |
| ← / ↑ | Previous step (rewinds quickly) |
| **S** | Speaker view: notes, timer, next slide |
| **O** / Esc | Overview |
| **R** | Replay the current slide's animation (handy on slide 4, the mechanism) |
| **F** | Fullscreen |
| ? | All shortcuts |

Each click on an animated slide is one hidden Reveal fragment that drives a labelled GSAP timeline step. If you go backwards, use the overview, or open a deep link, the slide jumps straight to its exact state, so nothing gets duplicated or replayed. `prefers-reduced-motion` or `?static` in the URL turns off all tweening.

## What to edit

| File | What it controls |
|---|---|
| `src/config/deck.config.ts` | **Everything team-specific.** Group name, date, `MEMBER_COUNT` (2 or 3), names, roles, cross-checks, speaking split, datasets in scope, seeds, Week 9 milestones and the closing research question |
| `src/content/notes.ts` | Speaker notes and per-slide target seconds |
| `src/content/paper.ts` | Verified numbers from the paper and repo (Table 1, headline averages, audit questions) |
| `src/content/references.ts` | Reference list. Dataset references follow `scope.datasets` automatically |
| `src/slides/*.ts` | One file per slide: markup plus its GSAP timeline |
| `src/styles/*.css` | Design tokens, layout and per-slide styles |

On screen, any value that still contains `TODO` / `PLACEHOLDER` gets a **dashed amber outline**.

**Later on:** if you add your own results, put them in a new data file and label them clearly as ours. Keep `paper.ts` for the authors' reported numbers only. Week 9 belongs in a separate deck, not this one.

## Checklist: what we still need to fill in

- [ ] `group.name` and `group.date` in `deck.config.ts`
- [ ] `MEMBER_COUNT`: 2 or 3
- [ ] Real names for Member A / B / C (`name` fields)
- [ ] Confirm roles, owned tasks and cross-checks, and the speaking split (`team.speaking`)
- [ ] Confirm the replication scope: `scope.datasets` (default Energy Efficiency + Concrete Strength), models, `scope.seeds`
- [ ] If the scope changes, update the sentence on slide 6's notes ("roughly twelve to twenty-eight percent") so it matches Table 1 for the new datasets
- [ ] Milestone due weeks (`due: 'TODO: Week 6'` …). If you add or remove milestones, update `notes.targets`
- [ ] Rehearse with `npm run notes` and a stopwatch. The brief allows 6–8 minutes
- [ ] Re-export the PDF after editing: `npm run build && npm run pdf`

## Timing

Run `npm run notes` to regenerate the table. At 150 wpm the current notes give:

| Slide | Target | Estimate |
|---|---:|---:|
| 1 Opening | 25s | 26s |
| 2 The problem | 50s | 46s |
| 3 Why naive augmentation is hard | 45s | 41s |
| 4 The CRDA idea | 75s | 76s |
| 5 What must be true | 55s | 56s |
| 6 What we will replicate | 55s | 56s |
| 7 Who does what | 50s | 53s |
| 8 Targets before Week 9 | 50s | 49s |
| 9 References | 10s | 9s |
| **Total** | **6:55** | **6:52** |

## Source integrity

- Every equation and number traces back to `paper.pdf` (abstract, Assumption 3.1, Algorithm 1, §3.3, §6, Table 1) or to the official repo (`README`, `experiments/*/config.json`, `src/experiment.py`, `src/filter.py`).
- The −22.9% / −6.4% headline and the Table 1 bars are labelled **"Reported by the original paper — not yet replicated by our group"**.
- The plots on slides 1, 2 and 4, the housing row on slide 3 and the feature chips on slide 5 are **illustrative**, and each is labelled that way on the slide.
- The two "audit questions" on slide 6 come from our own reading of the repo. They are framed as things to check, not as findings:
  - The Table 1 configs use `ignore_filter: true`.
  - The augmented MSE is the average of 10 CV-fold models.
- Reference URLs were checked live on 19 Oct 2026.
