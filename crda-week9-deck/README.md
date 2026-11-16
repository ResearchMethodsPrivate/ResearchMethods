# CRDA · Week 9 progress update

Animated browser slide deck for **ECS7029P Research Methods, Week 9 progress update** (8–10 minutes), presented by **Anik, Alvi, Atul and Samim** (group Triple A). It reports our re-run of *Counterfactual Residual Data Augmentation for Regression* (Mohebbi et al., ICML 2026) at the paper's Table 1 settings. The Week 5 deck is in [`../crda-week5-deck/`](../crda-week5-deck/).

Nine slides: title and short answer · where we are · what we ran · results · what matched · the first catch (safety test) · the second catch (10-model averaging) · what is left · references.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173 · arrow keys, S = speaker view, R = replay slide, F = fullscreen, O = overview
npm run build        # static site in dist/ (works from a USB stick or any static host)
npm run pdf          # docs/crda-week9-deck.pdf (needs a build first)
```

## Where every number comes from

All numbers are in [`src/content/results.ts`](src/content/results.ts). `npm test` re-computes each one from the raw files and fails if a slide and a file disagree:

- **Paper:** the authors' saved Table 1 files for Energy Efficiency (765 rows) and Concrete Strength (1,005 rows), copied to `tests/fixtures/paper/` from github.com/mhmohebbi/CRDA at commit `811e82e`.
- **Ours:** `../results/<name>-<laptop>/` in the group repository (Alvi, Anik, Samim) and the problem-log counts in `../results/atul/problem_log.md`.

On Windows run `git config core.longpaths true` before cloning: Samim's result folders have long names.

If a result file changes, update `results.ts`, the wording in `src/content/notes.ts` and the slides, then run `npm test`.

## Checks

| Command | What it does |
|---|---|
| `npm test` | Data tests: every number on the slides against the raw files |
| `npm run test:browser` | Real-browser tests: steps, offline, no console errors, back-navigation, speaker view, print mode |
| `npm run validate:deck` | Click cues in the notes match the slides, speaker split, sources, timing (8:00–10:00) |
| `npm run validate:ready` | The same, and fails while a team decision is open (the presentation date, `group.date` in `src/config/deck.config.ts`, is set: 20 November 2026) |
| `npm run qa:visual` | Screenshots of every step at 1920×1080 (and two smaller sizes) in `docs/visual-qa/`; measures animation time for the timing model |
| `npm run notes` | `docs/speaker-notes.md`: the script with a timing model |

## Still open

- **Rehearsal:** the timing (about 9:20) is a model, not a stopwatch run. Rehearse with all four speakers; log the times in `docs/speaker-notes.md`.
- **The 10-model test** (slide 7) is one dataset and one laptop (Alvi's, Energy Efficiency). The notes propose that Anik repeats it on a Mac and Samim on Concrete Strength (`results/scripts/run_plain_ensemble.py`); confirm that with them, and update `results.ts` and the slides when the results are in.
- **Speaker split** is suggested from each person's role (`speaking` in `src/config/deck.config.ts`).
