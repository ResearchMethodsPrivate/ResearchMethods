"""Test of the "10 models" question: score the PLAIN model the way CRDA is scored.

In the authors' code (src/experiment.py, _run_crda) the plain score is the test error of ONE model,
while the CRDA score is the test error of the AVERAGE of the 10 cross-validation models trained on
the augmented data (aug_estimators). This script, for the same seeds, splits and tuned settings,
also trains the 10 cross-validation models on the ORIGINAL training data (no CRDA) and scores their
average on the same test data.

It re-runs only the plain model's own tuning (train_and_tune, exactly as the pipeline does) and the
plain 10-fold models. The CRDA numbers are read from a finished run (interim_results csv).
Check: the re-computed single plain error must equal the one in that csv, seed by seed.

Run from inside demo/:
  python run_plain_ensemble.py <mlp|xgboost> <dataset file name without .csv> <rows> <interim csv of a finished run> <out csv> [max_seeds]
"""
import csv
import os
import sys
import time

os.environ.setdefault("MPLBACKEND", "Agg")
sys.path.append(os.path.dirname(os.getcwd()))

import numpy as np
from joblib import parallel_backend
from sklearn.model_selection import KFold, cross_validate

from src.baseline import BaselineRegressor
from src.dataset import AbstractDataset

model, dataset_file, rows, ref_csv, out_csv = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4], sys.argv[5]
max_seeds = int(sys.argv[6]) if len(sys.argv) > 6 else None

with open(ref_csv, newline="") as f:
    ref = list(csv.DictReader(f))
if max_seeds:
    ref = ref[:max_seeds]

dataset = AbstractDataset(f"{dataset_file}_sample_{rows}", f"../data/{dataset_file}.csv", rows, seed=0)  # random_seed=0 as in the run
dataset.preprocess()

out = []
t0 = time.perf_counter()
for r in ref:
    seed = int(r["seed"])
    X_train, X_test, y_train, y_test = dataset.split(test_size=0.2, seed=seed)

    baseline = BaselineRegressor(model)
    baseline.set_params(random_state=seed)
    baseline.train_and_tune(dataset.X_train, dataset.y_train, seed=seed)  # the plain model, as in the pipeline
    single = baseline.evaluate(X_test, y_test, metric="mse")

    params = baseline.get_params()
    if model == "xgboost":
        params["early_stopping_rounds"] = None  # as in the pipeline, before cross-validation
    cv_model = BaselineRegressor(model, **params)
    cv = KFold(n_splits=10, shuffle=True, random_state=seed)
    with parallel_backend("loky", inner_max_num_threads=1):
        cv_plain = cross_validate(cv_model.model, X_train, y_train, cv=cv, scoring="neg_mean_squared_error", n_jobs=-1, return_estimator=True)
    preds = np.column_stack([est.predict(X_test) for est in cv_plain["estimator"]])
    ensemble = float(((y_test - preds.mean(axis=1)) ** 2).mean())

    ref_single, crda = float(r["mse"]), float(r["aug_mse"])
    out.append({
        "seed": seed,
        "plain_single_mse": single,
        "plain_single_mse_in_run": ref_single,
        "plain_10model_mse": ensemble,
        "crda_10model_mse": crda,
        "pct_10model_vs_single": 100.0 * (ensemble - single) / single,
        "pct_crda_vs_single": 100.0 * (crda - ref_single) / ref_single,
        "pct_crda_vs_10model": 100.0 * (crda - ensemble) / ensemble,
    })
    print(f"seed {seed}: single {single:.12g} (run {ref_single:.12g}) | plain 10-model {ensemble:.12g} | CRDA {crda:.12g} | {time.perf_counter() - t0:.0f}s", flush=True)

os.makedirs(os.path.dirname(os.path.abspath(out_csv)), exist_ok=True)
with open(out_csv, "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(out[0]))
    w.writeheader()
    w.writerows(out)
print(f"Wrote {out_csv}")
