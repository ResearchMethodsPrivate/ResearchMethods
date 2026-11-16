# Problem log

Every difference or problem we found, and what we did. Add new entries at the bottom; keep the numbers. Sources for each entry are listed under the table.

| # | What happened | Where | What we did | Status |
|---|---|---|---|---|
| 1 | The pinned scipy 1.15.3 would not load on macOS 27 (`ImportError` from a compiled scipy file), which also broke scikit-learn and xgboost; scipy 1.16.0 gave the same demo results to every digit | Atul's Mac (macOS 27). Anik's Mac (macOS 14) used the pinned version without trouble | Used scipy 1.16.0 on Atul's Mac only | Resolved |
| 2 | Plain XGBoost differs from the authors': 0.00127 vs 0.00130 in the demo (same seed, 985772); 3.6 % higher in the Table 1 run (0.001003 vs 0.000968). Plain MLP matches | Demo: both Windows laptops, identical to every digit on both. Table 1 run: Alvi's laptop (Samim has not run it). Both Macs match the authors | Recorded it. Same seed and same data, so it most likely comes from the xgboost build or platform | Cause unknown |
| 3 | The paper's Table 1 runs switch the safety filter off (`ignore_filter: true`), so the reported change includes seeds where the gate failed. In Alvi's Energy Efficiency run, 3 of 15 MLP seeds and 4 of 15 XGBoost seeds failed the gate but still count in the average | Authors' config, all Table 1 datasets | Samim re-ran Energy Efficiency with the filter on: the code then drops 2 of 15 MLP and 4 of 15 XGBoost seeds (entry 16). The 4 XGBoost seeds are exactly the 4 that failed the gate in Alvi's run | Tested |
| 4 | The CRDA score averages the predictions of 10 cross-validation models, while the plain score comes from one model. The paper describes one retrained model. Averaging models usually lowers error by itself, so part of the gain may come from the averaging, not from CRDA | Authors' code (`src/experiment.py`) | Tested on three runs (16 Nov): the plain model scored as a 10-model average too. Energy Efficiency, neural network: +0.1 % (no effect). XGBoost: −15.3 % on Alvi's laptop and −12.9 % on Anik's Mac, out of CRDA's −21.7 % and −18.2 %, so CRDA adds −7.9 % and −6.1 % (p = 0.007 and 0.064). Concrete Strength (Samim): neural network −16.7 % out of −24.2 % (CRDA adds −8.7 %); XGBoost −14.4 % out of −14.6 % (CRDA adds 0.0 %). Much of the paper's gain is averaging. To decide: which version we report in the final | Tested |
| 5 | The demo always runs one fixed seed (985772), so it cannot show variation between runs | Authors' demo | Used the Table 1 settings with 15 seeds | Resolved |
| 6 | With the filter off, if no feature passes the screens, the code perturbs a placeholder feature (column 0) and carries on. This happened on 2 of Alvi's 15 MLP seeds (117952, 359783), and both still improved (−43.2 % and −25.1 %) | Authors' code; Alvi's Energy Efficiency MLP run | Recorded it. It fits entry 4 (a gain without a screened feature) but does not prove it. Samim's filter-on run drops exactly these 2 seeds because no feature passes the screens, which confirms it | Tested |
| 7 | "Change" in `results.csv` is the average of the per-seed % changes, not the change between the two average errors. They can differ a lot: Alvi's MLP is −28.7 % one way and −36.4 % the other | Authors' code; affects every results table | Our comparison table uses the per-seed average, like the paper; to state in the write-up | Open: decide what we report |
| 8 | The `std` columns in our `results.csv` and the authors' saved files are not comparable: ours is a standard error over seeds, and the authors' saved values are larger | Alvi's Table 1 run vs the authors' saved files | Compare means only | Open: cause not checked |
| 9 | Homebrew does not work on macOS 14 (unsupported), so installing Graphviz and `uv` started compiling from source. It was stopped after about 20 minutes and left about 50 extra packages installed | Anik's Mac | Got Graphviz from conda-forge through micromamba, and Python 3.11 from the existing python.org install | Resolved |
| 10 | Graphviz is a required system program, not only a Python package: the feature screen draws its causal graph with it | Every laptop | Installed Graphviz outside the repo on each laptop | Resolved |
| 11 | The authors' code refuses to re-run a config it has already run ("Config has already been run in a previous experiment. Exiting.") | Samim's laptop (any machine) | Use a different config or delete the earlier results folder before re-running | Resolved |
| 12 | Running the Table 1 settings needed a small script of our own; the authors' code itself was not changed | Alvi's laptop | Added `results/scripts/run_table1.py` and recorded the exact command | Resolved |
| 13 | One install attempt failed on a network (DNS) error while downloading `catboost` | Samim's laptop | Re-ran the same command; it worked | Resolved |
| 14 | Plain XGBoost matches the authors' error exactly on Anik's Mac but not on either Windows laptop, on both datasets: Energy Efficiency +3.6 % (Alvi), Concrete Strength +2.1 % (Samim), plus the demo gap on both Windows laptops (entry 2). Plain MLP matches everywhere. This points to a Windows build effect | Anik's Mac vs Alvi's and Samim's Windows laptops | Recorded it | Cause not checked |
| 15 | CRDA gains differ by 3–4 points between machines even where the plain error is identical: Energy Efficiency MLP −32.2 % (Anik, Mac), −28.7 % (Alvi, Windows), −28.3 % (paper). On seed 735831 the plain MLP error is identical on Alvi's and Samim's laptops, but CRDA gives −6.9 % on Alvi's (gate failed) and −29.6 % on Samim's (gate passed). The differences are within about one standard error (4.6 points for Anik's MLP) | All three laptops | Recorded it | Cause not investigated |
| 16 | With the filter on, the code drops seeds without failing: it logs `ERROR - No results were possible ...`, skips the seed, averages the rest and exits 0. Samim's Energy Efficiency runs dropped 2 of 15 MLP seeds (117952, 359783) and 4 of 15 XGBoost seeds (117952, 963395, 359783, 735831) | Authors' code; Samim's filter-on runs | Reported "seeds kept" next to every filter-on result ([comparison_table.md](comparison_table.md)) | Tested |
| 17 | A default git clone on Windows of the authors' repo silently left out the whole `src/` folder because of long paths; `core.longpaths true` fixed it. Our own repo's longest path is 173 characters, so it needs the same setting only when cloned into a deep folder | Alvi's Windows laptop (authors' repo); any Windows clone of ours | Clone with `git -c core.longpaths=true clone`; Alvi's round 2 instructions set `git config core.longpaths true` for our repo too | Resolved |

## Sources

1. `crda-week5-deck/docs/demo-reports/atul-mac-m5-pro.md` (Install section); `anik-mac-m2.md` ("versions exactly as the requirements pin").
2. `docs/demo-reports/alvi-windows-ryzen-rtx3070.md` and `samim-windows-i7-13620h.md` (section 10); `results/README.md`; [comparison_table.md](comparison_table.md).
3. `config.json` in the authors' `experiments/EnergyEfficiency/` and `experiments/ConcreteCompressiveStrength/` folders; `src/experiment.py` lines 585–590; gate counts from Alvi's `interim_results/*.csv` (`should_proceed`).
4. `src/experiment.py`: the plain error from one model at lines 527–539, the CRDA error from the 10-model average at lines 594–596. Test: `results/alvi-windows-ryzen7/EnergyEfficiency_n765_plain_10model/` and `results/scripts/run_plain_ensemble.py`.
5. `docs/demo-reports/samim-windows-i7-13620h.md`, section 10.
6. `src/experiment.py` lines 551–555; Alvi's `table1-mlp-15seeds.log` ("No candidate features found", seeds 117952 and 359783) and his MLP `interim_results` CSV.
7. Alvi's MLP `results.csv` (`delta_mse` mean −28.69) against the two average errors in the same file (0.000527 → 0.000335).
8. `results/README.md`, caveats.
9. `docs/demo-reports/anik-mac-m2.md`, "Anything odd / workarounds".
10. `src/filter.py` line 54 (`graph_viz.render`); `docs/demo-reports/samim-windows-i7-13620h.md`, caveat 4.
11. `docs/demo-reports/samim-windows-i7-13620h.md`, section 12.1.
12. `results/README.md` (Code and Command lines).
13. `docs/demo-reports/samim-windows-i7-13620h.md`, caveat 5.
14. `results/anik-mac-m2/README.md` and `results/samim-windows-i7-13620h/README.md`; plain errors in each run's `results.csv`.
15. `results/anik-mac-m2/README.md` (standard error); seed 735831 rows in Alvi's MLP and Samim's filter-on MLP `interim_results/*.csv`.
16. `results/samim-windows-i7-13620h/EnergyEfficiency_n765_15seeds_with_filter/table1-ee-filter-*.log`; `EXIT=0` in `run_all_samim.summary`; `src/experiment.py` lines 659–661 (`continue`).
17. `crda-week5-deck/docs/demo-reports/alvi-windows-ryzen-rtx3070.md` (Clone row); `results/INSTRUCTIONS_ATUL_ROUND2.md` (Setup); path lengths from `git ls-files`.

Line numbers refer to the authors' repo at `811e82ef29f34488384bffaa2fccf7775810345e`.
