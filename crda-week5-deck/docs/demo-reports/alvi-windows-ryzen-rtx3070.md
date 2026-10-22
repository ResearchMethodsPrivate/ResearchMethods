# CRDA demo report — Alvi's laptop

Run on 2026-10-22, 09:33–09:36 BST by Claude Code (Opus 5.5), in a throwaway Python 3.11 environment. **Verdict: PASS (MLP identical to the authors'; XGBoost differs).**

| Item | Value |
|---|---|
| OS | Windows 11 Home (Insider Preview build 26340), x64 |
| CPU / RAM / GPU | AMD Ryzen 7 5800H (8 cores / 16 threads) / 64 GB / NVIDIA GeForce RTX 3070 Laptop + AMD Radeon integrated (demo is CPU-only; GPU not used) |
| Python | 3.11.15 (uv-managed) |
| torch / scikit-learn / xgboost / numpy | 2.7.0+cpu / 1.7.0rc1 / 3.0.1 / 2.2.6 |
| Graphviz | `dot` 14.1.1 |
| Clone | **Needed `git -c core.longpaths=true clone`** — a default Windows clone silently omitted the whole `src/` folder |
| Install | 2 min with `uv`; every pin installed unchanged |
| Demo | exit code 0; script wall-clock 3 min 4 s (MLP 68.3 s, XGBoost 59.0 s inside the experiment) |

## Results (seed 985772, Energy Efficiency, one seed)

| Model | mse | aug_mse | delta_mse (%) | p_wilcoxon | features perturbed |
|---|---|---|---|---|---|
| MLP | 0.0013208531242431085 | 0.0006385091123391672 | −51.65934042022624 | 0.0009765625 | F8 |
| XGBoost | 0.001265737172655872 | 0.0009523574719362728 | −24.75867087493691 | 0.0322265625 | F8, F4, F3, F1, F0 |

Authors' recorded notebook output: MLP 0.0013208531242431083 → 0.0006385091123391668 (p 0.0009765625); XGBoost 0.001300772579836663 → 0.0009294087500910523 (p 0.0419921875).

- **MLP:** identical except for the 16th–17th significant digit.
- **XGBoost:** differs. The *unaugmented* baseline is already 2.7 % lower than the authors' (0.001266 vs 0.001301), so the difference arises before CRDA is applied. Cause not investigated. Both Macs (Anik, Atul) reproduce the authors' XGBoost numbers exactly.

Harmless noise: NumPy `Degrees of freedom <= 0` warnings (single seed), `IProgress` message.

## What this does and does not show

Shows that the authors' pinned environment installs and their demo runs end to end on this machine. Does **not** show that the paper's Table 1 results reproduce (one seed, one dataset).
