# Atul, round 2 (Week 9): everything is in, finish the table, log and outline

Give this file to your coding agent and say: **"Do round 2 for Atul, step by step."** One step at a time. Never invent numbers: copy them from the files in `results/`. Edit only files in `results/atul/`. Push on a branch (`results-atul-2`) and tell Alvi. Alvi merges it.

## Setup

```powershell
cd $HOME\ResearchMethods
git config core.longpaths true
git checkout main
git pull
git checkout -b results-atul-2
```

`git config core.longpaths true` matters on Windows: Samim's folders have very long file names and git will otherwise fail or drop files. Check the pull brought `results/samim-windows-i7-13620h/` and `results/anik-mac-m2/`.

Read: `results/README.md` (Alvi), `results/anik-mac-m2/README.md`, `results/samim-windows-i7-13620h/README.md` and `stats.txt`. All three already have the numbers worked out. Check them against the `results.csv` and `interim_results/*.csv` files yourself.

## Job 1: finish `comparison_table.md`

1. Replace the two `Anik (Mac) pending` rows and the `Samim pending` row with real numbers. Values (check each against the files):

| Dataset | Model | Source | Plain MSE | CRDA MSE | Change | Seeds improved | Gate passed |
|---|---|---|---|---|---|---|---|
| Energy Efficiency (765) | MLP | Anik (Mac M2) | 0.000527375 | 0.000321129 | −32.2 % | 14 of 15 | 13 of 15 |
| Energy Efficiency (765) | XGBoost | Anik (Mac M2) | 0.000967501 | 0.000778616 | −18.2 % | 12 of 15 | 12 of 15 |
| Concrete Strength (1005) | MLP | Samim (Windows i7) | 0.004223894 | 0.003179708 | −24.2 % | 15 of 15 | 15 of 15 |
| Concrete Strength (1005) | XGBoost | Samim (Windows i7) | 0.002958475 | 0.002532706 | −14.6 % | 15 of 15 | 14 of 15 |

   Read the `Wilcoxon p (mean)` column yourself from each `results.csv` (`p_wilcoxon`, `mean` column). Round all values the way the existing rows do. Do not copy my values for it.
2. Add a second table: **filter on vs off** (Energy Efficiency 765). It is the code-question test:

| Model | Run | Seeds kept | Plain MSE | CRDA MSE | Change (mean of kept seeds) | Seeds improved |
|---|---|---|---|---|---|---|
| MLP | Samim, filter ON | 13 of 15 | 0.000536363 | 0.000331461 | −31.6 % | 11 of 13 |
| XGBoost | Samim, filter ON | 11 of 15 | 0.001005485 | 0.000800703 | −19.8 % | 9 of 11 |
| MLP | Alvi, filter OFF | 15 of 15 | 0.000527375 | 0.000335347 | −28.7 % | 13 of 15 |
| XGBoost | Alvi, filter OFF | 15 of 15 | 0.001002546 | 0.000782705 | −21.7 % | 13 of 15 |

   State plainly under it: with the filter on, the code drops 2 MLP and 4 XGBoost seeds (MLP: 117952, 359783; XGBoost: 117952, 963395, 359783, 735831) and still exits normally, so those means are over survivors and not comparable like-for-like.
3. Rewrite the three-sentence paragraph under the table. It must say: (a) plain models reproduce, except plain XGBoost on both Windows laptops and on both datasets (EE +3.6 %, Concrete +2.1 %); on Anik's Mac it matches the paper exactly; (b) CRDA helps on all machines and both datasets, but the size differs by about 2–4 points between machines and the paper; (c) the paper's `ignore_filter: true` means its averages include seeds the safety filter would reject.

## Job 2: update `problem_log.md`

Add these entries at the bottom (new numbers, keep the old ones). Fix any claim you cannot match to a file:

- Plain XGBoost matches the authors on Anik's Mac but not on either Windows laptop, on two datasets: points to a Windows build effect (cause not checked). Sources: Anik's and Samim's READMEs.
- CRDA gains differ by 3–4 points across machines even where the plain error is identical (EE MLP: −32.2 % Mac, −28.7 % Windows, −28.3 % paper). Within about one standard error; cause not investigated.
- With the filter on the code silently drops seeds and still exits 0 (see Job 1 table). Source: Samim's logs, `ERROR - No results were possible ...`.
- Git on Windows fails on Samim's long result paths unless `core.longpaths true`.
- Update entries 3 and 6 with Samim's confirmation (status: tested).
- Entry 4 (10-model averaging) stays **Open**: Alvi will test it.

## Job 3: check Samim's statistics

Write `results/atul/stats_check.md`. For each of Samim's four runs, re-run the paired Wilcoxon test (`mse` vs `aug_mse`, per seed, from `interim_results/*.csv`) and compare with `results/samim-windows-i7-13620h/stats.txt`. Say whether each matches. Alvi already recomputed them and they matched: Concrete MLP 0.000061, Concrete XGBoost 0.000061, EE filter-on MLP 0.00122, XGBoost 0.00977. Do it yourself; don't just trust that.

## Job 4: update `week9_outline.md`

- Slide 3 (results) and 4 (matched / did not): use the final numbers from the table, including Anik's and Samim's rows. Remove "pending".
- Add the three headline messages: (1) plain models reproduce, Windows XGBoost excepted; (2) CRDA's gains reproduce in direction on both datasets, within a few points; (3) Table 1 runs with the filter off, so its averages include seeds the filter would reject.
- Slide 6 (what is left): Alvi tests the 10-model averaging; the team writes up and rehearses for Week 12 (11 Dec 2026). Remove Anik's and Samim's tasks, now done.
- Keep `TO DECIDE` only for what truly is undecided (the Week 9 date, speaker split).

## Hand back

```powershell
git add results/atul
git commit -m "Atul round 2: final table, problem log, stats check, outline"
git push -u origin results-atul-2
```
Do not merge into `main`. Tell Alvi when it is pushed.
