# Week 12 runs: all four of us

**Push your results by Tuesday 1 December.**

> **Do not start the runs until all four of us have agreed [`hypotheses.md`](hypotheses.md)**, in particular the 5-point margin and reporting both comparisons. Setup and the checks below can be done now.

You can give this file to your coding agent and say: **"Do the part for me (your name)."** It must never invent or edit numbers. Note any AI help for the AI Accountability Statement.

## Who runs what

Each line is run for both models (neural network and XGBoost), 15 seeds, followed by the 10-model test. The script does all of it.

| Name | Datasets and rows | Results folder | Rough time (a guess) |
|---|---|---|---|
| Alvi | Energy Efficiency: 153, 306, 459, 612 | `alvi-windows-ryzen7` | 1–2 hours |
| Samim | Concrete Strength: 201, 402, 603, 804 | `samim-windows-i7-13620h` | 1.5–2.5 hours |
| Anik | House Price 200, Wind 1314, Wine Quality 1063 | `anik-mac-m2` | 1.5–3 hours |
| Atul | Synthetic 200, Satellite 1287, CPU 1638, Parkinson's 1175 | `atul-mac-m5-pro` | 1.5–3 hours |

The times for Anik and Atul are the least certain: nobody has run those datasets yet.

## 1. Setup (skip what you already have)

You need the same setup as for the earlier runs: the authors' code in `CRDA` in your home folder, its `.venv` with **Python 3.11**, and Graphviz (`dot -V` prints a version). Full steps are in [`INSTRUCTIONS_ANIK_AND_SAMIM.md`](INSTRUCTIONS_ANIK_AND_SAMIM.md), "Setup".

- **Atul, macOS 27:** if imports fail with a `scipy` error, install `scipy==1.16.0` in the `.venv`, as for the demo.
- **Anik:** the script already works around the missing `libomp` library.

Then get the newest group repo. Run these inside your copy of it:

```powershell
git checkout main
```
```powershell
git pull
```
Windows only, once:
```powershell
git config core.longpaths true
```

## 2. Check your setup (a few seconds, runs nothing)

Replace `NAME` with `alvi`, `samim`, `anik` or `atul`. Stay inside the group repo.

Windows:
```powershell
& "$HOME\CRDA\.venv\Scripts\python.exe" results\scripts\run_week12.py NAME --check
```
Mac:
```bash
~/CRDA/.venv/bin/python results/scripts/run_week12.py NAME --check
```

It must end with `Setup OK`. If your authors' code is somewhere else, add `--crda` followed by its folder.

Optional, about 5 minutes: use `--test` instead of `--check`. It runs one seed of an already-finished result, to prove everything works.

## 3. Run

Plug the laptop in and stop it sleeping.

Windows (set Settings > System > Power > sleep to "Never" while plugged in, and change it back afterwards):
```powershell
& "$HOME\CRDA\.venv\Scripts\python.exe" results\scripts\run_week12.py NAME
```
Mac (`caffeinate` keeps it awake while the script runs; leave the lid open):
```bash
caffeinate -i ~/CRDA/.venv/bin/python results/scripts/run_week12.py NAME
```

- **If it stops** (crash, closed window, flat battery), run the same command again. It skips finished parts and moves half-finished runs to `CRDA/ours/_incomplete/`.
- It repeats a failed run once, as our plan allows. Do not keep re-running something that fails twice: send Alvi the log.
- Do not change the settings or the authors' code.

## 4. Check the end

The last lines, also saved in `week12_status.txt` in your results folder, say either `All parts finished.` or list what needs a look.

A line such as `single plain error differs on 2 seeds` is a finding, not something to fix. Report it.

## 5. Send your results

Replace `NAME` and `FOLDER` (your results folder from the table). Add **only your own folder**.

```powershell
git checkout -b results-week12-NAME
```
```powershell
git add results/FOLDER
```
```powershell
git commit -m "Add NAME's Week 12 runs"
```
```powershell
git push -u origin results-week12-NAME
```

Do **not** merge into `main`. Tell Alvi when it is pushed, with the status message, roughly how long it took, and any errors.

## Where this comes from

Settings: all 18 of the authors' saved Table 1 configs use the same values as our [`scripts/run_table1.py`](scripts/run_table1.py), apart from dataset, model and sizes. The paper's value for every cell is in [`hypotheses.md`](hypotheses.md).
