# CRDA demo test report
Name / laptop owner: Atul
Date / time: 2026-10-22, 09:59–10:02 BST
OS + version: macOS 27.0.1 (build 26A434), arm64
CPU / RAM / GPU: Apple M5 Pro / 24 GB / integrated Apple M5 Pro GPU, 16 cores, Metal 4 (not used; demo is CPU-only)
Default `python --version` on this machine (not used): no `python` command; `python3 --version` = Python 3.9.6 (Apple system Python)
Test environment: Python 3.11.17 / torch 2.7.0 / scikit-learn 1.7.0rc1 / xgboost 3.0.1 (scipy 1.16.0 instead of pinned 1.15.3, see below)
Graphviz (`dot -V`): dot - graphviz version 16.1.0 (20260904.0139)
Clone complete (src/experiment.py present): yes
Install (step 3): worked, with one fix. `uv pip install -r requirements.txt` succeeded, but the import check failed because the pinned scipy 1.15.3 wheel will not load on macOS 27:
  ImportError: dlopen(.../scipy/sparse/linalg/_propack/_spropack.cpython-311-darwin.so, 0x0002): tried: '...' (section '__DATA/__thread_bss' has a zero-fill section type, but offset field is not zero)
  This broke scipy.stats, scipy.linalg, scikit-learn, xgboost and catboost (all import scipy). numpy, torch, pandas, matplotlib, causal-learn, graphviz and numba imported fine.
  Fix: `uv pip install --python .venv/bin/python "scipy==1.16.0"` (1.15.3 is the last 1.15.x). After that, every import in the step-3 check worked.
Demo (step 5): ran fully. Exit code 0, SUMMARY block printed, both results.csv files present:
  EnergyEfficiency/mlp_20261022-100126/results.csv
  EnergyEfficiency/xgboost_20261022-100135/results.csv
  No errors or tracebacks in demo-run.log. Only the expected NumPy "Degrees of freedom <= 0" warnings.
Wall-clock time for the demo: 34 seconds (including the first-run Matplotlib font cache build)
SUMMARY lines, copied exactly:
  mlp      MSE 0.00132 -> 0.00064 | change -51.7% | Wilcoxon p = 0.00098 | gate passed: True
  xgboost  MSE 0.00130 -> 0.00093 | change -28.5% | Wilcoxon p = 0.04199 | gate passed: True
Compared with the authors' recorded demo (MLP 0.00132 -> 0.00064, -51.7 %, p = 0.00098; XGBoost 0.00130 -> 0.00093, -28.6 %, p = 0.042):
  MLP: identical. Raw values: MSE 0.0013208531242431085 -> 0.0006385091123391665, p = 0.0009765625. The notebook's recorded output is 0.0013208531242431083 -> 0.0006385091123391668, so it differs only in the 17th significant digit (floating-point noise).
  XGBoost: identical. Raw values: MSE 0.001300772579836663 -> 0.0009294087500910523, p = 0.0419921875, the same to every digit as the notebook's recorded output. The exact change is -28.549 %, so the summary prints -28.5 %; the "-28.6 %" in the brief is a rounding of the same number, not a real difference.
Anything odd, workarounds you needed, commands you changed:
  - Installed Graphviz 16.1.0 and uv 0.13.5 with `brew install graphviz uv` (no sudo).
  - Used the macOS commands from the brief (`.venv/bin/python`, `tee`, no long-paths flag) and `sw_vers`/`sysctl` instead of `systeminfo`.
  - Replaced pinned scipy 1.15.3 with 1.16.0 in the venv (see Install). This is a deviation from requirements.txt. It probably affects anyone on macOS 27 and should be noted as a reproducibility finding. The demo numbers were unaffected.
  - No changes to the authors' files. Only demo/run_demo.py, demo/demo-run.log and demo/EnergyEfficiency/ were added. No commits or pushes.
Verdict: PASS (installed with one documented scipy version bump, ran fully, numbers identical to the authors' recorded demo)
