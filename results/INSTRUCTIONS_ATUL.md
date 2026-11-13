# Atul's tasks for Week 9

Give this file to your coding agent and say: **"Do the part for Atul, step by step."** Work one step at a time. Never invent numbers: copy them from the files in `results/`. Only edit files inside `results/atul/`. Do not merge into `main`.

## Your four jobs

1. **Comparison table:** our results next to the paper's Table 1, with p-values.
2. **Problem log:** every difference or problem we found, and what we did.
3. **Check Samim's statistics** (once he pushes them).
4. **Week 9 outline:** a short slide outline for Alvi to build the deck from.

## Setup (2 minutes)

```powershell
cd $HOME
git clone https://github.com/ResearchMethodsPrivate/ResearchMethods.git
cd ResearchMethods
git checkout -b results-atul
mkdir results\atul
```
(Mac: `mkdir -p results/atul`.) If you already cloned it, run `git checkout main` and `git pull` first.

Read `results/README.md`. It has Alvi's Energy Efficiency numbers next to the paper's.

## Job 1: comparison table (do now)

Create `results/atul/comparison_table.md`. One row per dataset, model and machine. Fill what exists now and leave the rest as `pending`. Use this layout:

| Dataset (rows) | Model | Source | Plain MSE | CRDA MSE | Change | Wilcoxon p (mean) | Seeds improved | Gate passed |
|---|---|---|---|---|---|---|---|---|
| Energy Efficiency (765) | MLP | Paper (Table 1) | 0.000527 | 0.000348 | −28.3 % | 0.0130 | n/a | 0.80 |
| Energy Efficiency (765) | MLP | Alvi (Windows) | 0.000527 | 0.000335 | −28.7 % | 0.0160 | 13 of 15 | 12 of 15 |
| Energy Efficiency (765) | MLP | Anik (Mac) | pending | | | | | |
| Energy Efficiency (765) | XGBoost | Paper (Table 1) | 0.000968 | 0.000761 | −21.0 % | 0.0420 | n/a | 0.73 |
| Energy Efficiency (765) | XGBoost | Alvi (Windows) | 0.001003 | 0.000783 | −21.7 % | 0.0410 | 13 of 15 | 11 of 15 |
| Energy Efficiency (765) | XGBoost | Anik (Mac) | pending | | | | | |
| Concrete Strength (1005) | MLP | Paper (Table 1) | 0.004224 | 0.003064 | −26.9 % | 0.0010 | n/a | 1.00 |
| Concrete Strength (1005) | XGBoost | Paper (Table 1) | 0.002898 | 0.002559 | −12.2 % | 0.0100 | n/a | 0.93 |
| Concrete Strength (1005) | both | Samim | pending | | | | | |

- Our numbers come from each folder's `results.csv` (`mse`, `aug_mse`, `delta_mse`, `p_wilcoxon`, `should_proceed` rows) and `interim_results/*.csv` (one row per seed).
- Paper numbers are the authors' saved `results.csv` in `experiments/<dataset>/` of https://github.com/mhmohebbi/CRDA. The ones above are already copied from there; check them.
- Rows for Anik and Samim appear on branches `results-anik` and `results-samim` when they push (`git fetch`, then `git checkout origin/results-anik -- results/`). Don't merge those branches into main.
- Add 3 sentences under the table: where we agree with the paper, where we differ, and one caveat (the `std` columns are not comparable; compare means).

## Job 2: problem log (do now)

Create `results/atul/problem_log.md`. One row per entry: what happened, where (which laptop), what we did, status. Start with these, and add new ones as they come:

| # | What happened | Where | What we did | Status |
|---|---|---|---|---|
| 1 | A pinned library version would not run on the newest macOS; a newer one gave the same results | Mac laptops | Used the newer version | Resolved |
| 2 | Plain XGBoost is different from the authors': 0.00127 vs 0.00130 in the demo; 3.6 % higher in the Table 1 run | Both Windows laptops (identical on both) | Recorded it; Macs match the authors | Cause unknown |
| 3 | The paper's Table 1 runs switch the safety filter off (`ignore_filter: true`) | Authors' config | Samim tests it with the filter on | Open |
| 4 | The final score averages 10 cross-validation models, not one as the paper describes | Authors' code | To note in the write-up | Open |
| 5 | The demo runs one fixed seed, so it cannot show variation | Authors' demo | Used the Table 1 settings with 15 seeds | Resolved |

## Job 3: check Samim's statistics (when he pushes `results-samim`)

1. For each Wilcoxon test he reports, re-run it yourself from the `interim_results/*.csv` (`mse` vs `aug_mse`, paired, 15 seeds).
2. Write in `results/atul/stats_check.md`: do your p-values match his, and is anything unclear?
3. Tell him if they differ.

## Job 4: Week 9 outline (do now, short)

Create `results/atul/week9_outline.md`: the slides we will show. The Week 9 update is **8–10 minutes**. Four speakers, so about two minutes each. Suggested slides: (1) where we are, (2) what we ran and how, (3) results table, (4) what matched and what did not, (5) problem log, (6) what is left before Week 12 (11 Dec 2026), (7) references. Mark anything not decided with `TO DECIDE`.

## Hand back

```powershell
git add results/atul
git commit -m "Add Atul's table, problem log and outline"
git push -u origin results-atul
```
Do not merge into `main`. Tell Alvi when it is pushed.
