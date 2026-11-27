# Hypotheses and analysis plan

Written 27 November 2026, **before the new runs** listed at the end. Status: agreed by all four on 27 November 2026, before the new runs started (as confirmed by Alvi).

**What we already knew when writing this:** the Table 1 results for four cells (Energy Efficiency 765 rows and Concrete Strength 1005 rows, MLP and XGBoost) and the 10-model test on them. For those four, these hypotheses are **not** set in advance. They are set in advance only for the 30 new cells.

## Research question

Do the authors' improvements hold up when we re-run their own code, and where do they not?

A **cell** is one dataset, one subset size and one model.

## Hypotheses

| | We expect, in each cell | A cell supports it when |
|---|---|---|
| **H1** CRDA helps | Test error is lower with CRDA than with one plain model | Mean change is below 0 **and** one-sided paired Wilcoxon test over the 15 seeds gives p < 0.05 |
| **H2** We match the paper | Our change is close to the paper's | Our mean change is within 5 percentage points of the paper's |
| **H3a** Averaging helps by itself | The average of 10 plain models has lower error than one plain model | One-sided paired Wilcoxon p < 0.05 |
| **H3b** CRDA adds more than averaging | CRDA has lower error than the average of 10 plain models | One-sided paired Wilcoxon p < 0.05 |

- The paper itself reports no improvement for XGBoost on Wine Quality (+0.31 %), so we do not expect H1 there.
- H3a already failed for the neural network on Energy Efficiency (+0.1 %). A hypothesis can fail in some cells.
- The 5-point margin for H2 is about one standard error between seeds in our Energy Efficiency runs (about 4.6 points), and a little above the 3–4 points seen between laptops. We chose it after seeing the first four cells, and all four fall inside it.

## How we analyse

- **Change** = mean over seeds of 100 × (CRDA error − plain error) / plain error. Negative is better. We also report the change between the two average errors, because the two can differ a lot (problem 7).
- **Both comparisons are reported:** against one plain model (as the paper's code does) and against the 10-model average (like for like).
- **Settings:** as in the authors' saved configs: 15 seeds, tuning on, safety filter ignored, `random_seed=0`. Authors' code at `811e82ef29f34488384bffaa2fccf7775810345e`, unmodified.
- **Many tests:** for each hypothesis we report how many cells pass, with and without a Holm correction.
- **Failures:** a run that fails is repeated once with the same settings. Every cell that is still missing, and every dropped seed, is reported.
- **No cherry-picking:** every cell we run is reported, whatever the result.

## Paper values and new runs

Change with CRDA in the paper (Table 1), checked against the authors' saved `experiments/*/*/results.csv`.

| Dataset (file in `data/`) | Rows | MLP | XGBoost | Status |
|---|---|---|---|---|
| EnergyEfficiency | 765 | −28.31 % | −20.96 % | Done |
| ConcreteCompressiveStrength | 1005 | −26.90 % | −12.19 % | Done |
| EnergyEfficiency | 153 | −25.10 % | −13.33 % | New |
| EnergyEfficiency | 306 | −28.13 % | −12.20 % | New |
| EnergyEfficiency | 459 | −42.98 % | −10.55 % | New |
| EnergyEfficiency | 612 | −40.71 % | −19.35 % | New |
| ConcreteCompressiveStrength | 201 | −17.80 % | −8.01 % | New |
| ConcreteCompressiveStrength | 402 | −19.83 % | −8.43 % | New |
| ConcreteCompressiveStrength | 603 | −17.64 % | −9.75 % | New |
| ConcreteCompressiveStrength | 804 | −24.77 % | −15.72 % | New |
| HousePrice | 200 | −40.57 % | −14.23 % | New |
| 623_fri_c4_1000_10 (synthetic) | 200 | −28.80 % | −12.00 % | New |
| 227_cpu_small | 1638 | −20.24 % | −6.99 % | New |
| 294_satellite_image | 1287 | −18.36 % | −4.54 % | New |
| 503_wind | 1314 | −7.22 % | −2.82 % | New |
| ParkinsonsTelemonitoring | 1175 | −36.17 % | −8.40 % | New |
| WineQuality | 1063 | −0.34 % | +0.31 % | New |

That is 34 of the paper's 90 cells: all five sizes of two datasets, and the smallest size of the other seven. We chose the smallest sizes because of laptop run time.
