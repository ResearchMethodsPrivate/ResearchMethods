# Runs for Anik and Samim (Week 9)

Give this file to your coding agent and say: **"Do the part for me (Anik or Samim)."** Run the commands one at a time and check each result. Never invent numbers: copy them from the files the run produces.

Background: Alvi ran the paper's Table 1 settings for Energy Efficiency (15 seeds, 765 rows) and got MLP −28.7 %, XGBoost −21.7 % (see `results/README.md`). The paper reports −28.3 % and −21.0 %. This needs an independent repeat on another machine.

## Setup (both of you, about 5 minutes; skip what you already have from the demo test)

Use Python **3.11** through `uv` (the authors' pinned libraries do not install on newer Python). You can reuse your `~/CRDA` clone from the demo test.

```powershell
cd $HOME
git -c core.longpaths=true clone --depth 1 https://github.com/mhmohebbi/CRDA.git
cd CRDA
git rev-parse HEAD
uv venv --python 3.11 .venv
uv pip install --python .venv\Scripts\python.exe -r requirements.txt
```

- Expect the commit `811e82ef29f34488384bffaa2fccf7775810345e`. Windows only: check `Test-Path src\experiment.py` prints `True`.
- Mac: use `.venv/bin/python` instead of `.venv\Scripts\python.exe`, and `ls src/experiment.py`.
- Graphviz must be installed (`dot -V`), as in the demo test.

Get the run script from the group repo (it is only one file) and put it in the authors' `demo/` folder:

```powershell
cd $HOME
git clone https://github.com/ResearchMethodsPrivate/ResearchMethods.git
copy ResearchMethods\results\scripts\run_table1.py CRDA\demo\run_table1.py
```
(Mac: `cp ResearchMethods/results/scripts/run_table1.py CRDA/demo/`.)

Run everything below **from inside `CRDA/demo/`**:

```powershell
cd $HOME\CRDA\demo
```

If the run stops with "Config has already been run", delete or move the old folder named in the message from `CRDA/ours/` and run again.

## Anik: repeat Alvi's Energy Efficiency runs

Each run takes about 10–17 minutes on Alvi's laptop (about 1 minute per seed). Run them one after the other.

```powershell
..\.venv\Scripts\python.exe run_table1.py mlp 15 EnergyEfficiency 765 2>&1 | Tee-Object table1-mlp.log
```
```powershell
..\.venv\Scripts\python.exe run_table1.py xgboost 15 EnergyEfficiency 765 2>&1 | Tee-Object table1-xgb.log
```
(Mac: `../.venv/bin/python run_table1.py mlp 15 EnergyEfficiency 765 2>&1 | tee table1-mlp.log`, and the same for xgboost.)

Each run ends with `Total time taken` and `All results saved to ...results.csv`. The results are in `CRDA/ours/EnergyEfficiency/mlp_*/` and `xgboost_*/`.

What to compare with Alvi (`results/alvi-windows-ryzen7/EnergyEfficiency_n765_15seeds/*/results.csv`): plain MSE `mse`, augmented `aug_mse`, `delta_mse`. Expected: plain MLP identical to Alvi's; XGBoost on a Mac may match the **paper** (0.000968) rather than Alvi's (0.001003). Report whatever you get.

## Samim: Concrete Strength, and the filter test

Concrete Strength uses the paper's largest subset, 1005 rows. The paper reports MLP −26.9 %, XGBoost −12.2 % there.

```powershell
..\.venv\Scripts\python.exe run_table1.py mlp 15 ConcreteCompressiveStrength 1005 2>&1 | Tee-Object table1-concrete-mlp.log
```
```powershell
..\.venv\Scripts\python.exe run_table1.py xgboost 15 ConcreteCompressiveStrength 1005 2>&1 | Tee-Object table1-concrete-xgb.log
```

Then the code-question test: the paper's Table 1 runs switch the safety filter off (`ignore_filter: true`). Repeat Energy Efficiency with the filter **on** by adding `--no-ignore-filter`. Results go to `ours/EnergyEfficiency_with_filter/`.

```powershell
..\.venv\Scripts\python.exe run_table1.py mlp 15 EnergyEfficiency 765 --no-ignore-filter 2>&1 | Tee-Object table1-ee-filter-mlp.log
```
```powershell
..\.venv\Scripts\python.exe run_table1.py xgboost 15 EnergyEfficiency 765 --no-ignore-filter 2>&1 | Tee-Object table1-ee-filter-xgb.log
```

Then the statistics: for each result, read `interim_results/*.csv` (one row per seed: `mse`, `aug_mse`, `delta_mse`, `p_wilcoxon`, `should_proceed`) and run a paired Wilcoxon signed-rank test on `mse` versus `aug_mse` across the 15 seeds. Report the median change, how many seeds improved, and how many passed the safety gate.

## Hand the results back

Make a folder `results/<name>-<machine>/<dataset>_n<size>_15seeds/` in your clone of the group repo, copy the whole `mlp_*` and `xgboost_*` folders and the `.log` files into it, then:

```powershell
cd $HOME\ResearchMethods
git checkout -b results-<name>
git add results
git commit -m "Add <name>'s Table 1 runs"
git push -u origin results-<name>
```

Do **not** merge into `main` and do not edit anything outside `results/`. Tell Alvi when it is pushed.

## What to report

Machine (OS, CPU, RAM), Python and library versions, run times, the three numbers per model (plain MSE, augmented MSE, change %), and anything that failed with the exact error. Verdict: same as Alvi / close / different, by how much.
