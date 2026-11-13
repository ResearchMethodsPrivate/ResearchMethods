# Week 9 progress update: slide outline

For Alvi to build the deck from. **8–10 minutes, four speakers, about two minutes each.** Planned total below: about 9 minutes, including handovers.

- **Date:** probably Fri 20 Nov 2026 (Week 5 was Fri 23 Oct; Week 12 is Fri 11 Dec). TO DECIDE: confirm.
- **Speakers:** the split below follows each person's role. TO DECIDE.
- **Numbers:** copy them from [comparison_table.md](comparison_table.md) and [problem_log.md](problem_log.md), not from this outline.

| # | Slide | Speaker (suggested) | Time |
|---|---|---|---|
| 1 | Where we are | Anik | 1:00 |
| 2 | What we ran and how | Anik | 1:30 |
| 3 | Results table | Alvi | 2:00 |
| 4 | What matched and what did not | Samim | 1:30 |
| 5 | Problem log | Atul | 1:30 |
| 6 | What is left before Week 12 | Atul | 1:00 |
| 7 | References | Atul | 0:15 |

## 1. Where we are
- The four Week 5 targets, with status: code set up (done 22 Oct, 4 laptops); plain-model results and first CRDA comparison (done for Energy Efficiency on Alvi's laptop, 13 Nov); problem log (13 entries so far).
- Samim joined as fourth member: statistics and code checks.
- Research question unchanged: do the authors' improvements hold up when we re-run their own code, and where do they not?

## 2. What we ran and how
- The authors' code, unchanged, at commit `811e82e`. One small script of ours to start the runs.
- Table 1 settings copied from the authors' saved configs: 15 seeds, the largest subset (765 rows for Energy Efficiency), filter off, tuning on.
- We planned 3 seeds as a first pass but ran the paper's 15 straight away, so our numbers compare directly.
- Run time on one laptop: about 16 minutes (MLP) and 11 minutes (XGBoost).

## 3. Results table
- The comparison table: paper vs ours, per dataset, model and laptop.
- Energy Efficiency: −28.7 % vs the paper's −28.3 % (MLP), −21.7 % vs −21.0 % (XGBoost).
- Anik's repeat and Samim's Concrete Strength rows: show them if they arrive in time, otherwise mark them "pending". TO DECIDE: the cut-off date for including new results.

## 4. What matched and what did not
- **Matched:** plain MLP error identical on all 15 seeds; the same number of seeds improved (13 of 15) and passed the safety gate.
- **Did not:** plain XGBoost is 3.6 % higher on Windows, the same gap the demo showed on both Windows laptops.
- **Careful:** the `std` columns are not comparable, so we compare means only.
- Samim's Wilcoxon results, if ready. TO DECIDE.

## 5. Problem log
- Lead with the three that affect what "reproduced" means:
  - The filter is off in Table 1, so seeds that failed the gate still count (entry 3).
  - The CRDA score averages 10 models, while the plain score uses one (entry 4).
  - The code perturbs a placeholder feature when none passes the screens, and those seeds still improved (entry 6).
- One line on the rest: setup problems, all resolved.
- TO DECIDE: show the full log as a backup slide or as a handout.

## 6. What is left before Week 12 (11 Dec 2026)
- Anik: repeat Energy Efficiency on a Mac. This is the independent check, and it tells us whether XGBoost matches the paper there.
- Samim: Concrete Strength (15 seeds), the filter-on test, and the statistics.
- Atul: check Samim's statistics; keep the table and log up to date.
- TO DECIDE: how to test the 10-model averaging (entry 4), for example by scoring the plain model the same way.
- TO DECIDE: which "Change" we report in the write-up, the per-seed average or the change of averages (entry 7).

## 7. References
- The paper, the authors' code at commit `811e82e`, the two datasets, and our `results/` folder.
