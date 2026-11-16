# Week 9 progress update: slide outline

For Alvi to build the deck from. **8–10 minutes, four speakers, about two minutes each.** Planned total below: about 9 minutes, including handovers.

- **Date:** probably Fri 20 Nov 2026 (Week 5 was Fri 23 Oct; Week 12 is Fri 11 Dec). TO DECIDE: confirm.
- **Speakers:** the split below follows each person's role. TO DECIDE.
- **Numbers:** copy them from [comparison_table.md](comparison_table.md), [problem_log.md](problem_log.md) and [stats_check.md](stats_check.md), not from this outline.

## The three headline messages

1. **Plain models reproduce**, except plain XGBoost on Windows (+3.6 % and +2.1 % on our two datasets; it matches exactly on the Mac).
2. **CRDA's gains reproduce in direction** on both datasets and on every laptop, within a few points of the paper.
3. **The paper's Table 1 runs switch the safety filter off**, so its averages include seeds the filter would reject.

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
- The four Week 5 targets are done: code set up (22 Oct, 4 laptops); plain-model results and the first CRDA comparison (13–16 Nov, both datasets, 3 laptops); problem log (17 entries).
- Samim joined as fourth member: statistics and code checks.
- Research question unchanged: do the authors' improvements hold up when we re-run their own code, and where do they not?
- Lead into the three headline messages.

## 2. What we ran and how
- The authors' code, unchanged, at commit `811e82e`. One small script of ours to start the runs.
- Table 1 settings copied from the authors' saved configs: 15 seeds, the largest subset (765 rows for Energy Efficiency, 1005 for Concrete Strength), filter off, tuning on.
- Who ran what: Energy Efficiency on Alvi's Windows laptop and Anik's Mac; Concrete Strength and the filter-on test on Samim's Windows laptop.
- We planned 3 seeds as a first pass but ran the paper's 15, so our numbers compare directly.
- Each run took between about 6 and 23 minutes, depending on laptop and dataset.

## 3. Results table
- The comparison table: paper vs ours, per dataset, model and laptop.
- Energy Efficiency, MLP: −28.7 % (Alvi) and −32.2 % (Anik) vs the paper's −28.3 %.
- Energy Efficiency, XGBoost: −21.7 % (Alvi) and −18.2 % (Anik) vs −21.0 %.
- Concrete Strength (Samim): −24.2 % vs −26.9 % (MLP), −14.6 % vs −12.2 % (XGBoost); every one of the 15 seeds improved for both models.
- Headline message 2.

## 4. What matched and what did not
- **Matched:** plain MLP error identical to the paper's on every laptop and both datasets; plain XGBoost identical on Anik's Mac.
- **Did not:** plain XGBoost is higher on both Windows laptops (+3.6 % Energy Efficiency, +2.1 % Concrete Strength); cause not checked.
- **Varies:** the CRDA gain differs by up to about 4 points between laptops and the paper, even where the plain error is identical. That is within about one standard error.
- **Statistics:** Samim's paired Wilcoxon tests confirmed independently (Concrete p = 0.000061 for both models: every seed improved).
- Headline message 1.

## 5. Problem log
- Lead with the three that affect what "reproduced" means:
  - The filter is off in Table 1. With it on, the code drops 2 of 15 MLP and 4 of 15 XGBoost seeds and still finishes normally (entries 3 and 16). This is headline message 3.
  - The CRDA score averages 10 models, while the plain score uses one (entry 4, still open).
  - The CRDA gain differs between laptops even with identical plain errors (entry 15).
- One line on the rest: setup problems, all resolved.
- Full log as a backup slide.

## 6. What is left before Week 12 (11 Dec 2026)
- Alvi: test the 10-model averaging (entry 4).
- Everyone: write up and rehearse for Week 12. The write-up states which "Change" we report (entry 7).

## 7. References
- The paper, the authors' code at commit `811e82e`, the two datasets, and our `results/` folder.
