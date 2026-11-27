"""Our reproduction of the paper's Table 1 settings for one dataset and one model.
Settings copied from the authors' saved config.json in experiments/<dataset>/ :
  num_seeds=15 (we pass fewer), hyperparam_tune=True, ignore_filter=True,
  sample_sizes=[the subset size you pass].
With hyperparam_tune=True the authors' code tunes the CRDA settings for every seed (features perturbed,
augmentation size, augmented-data weight, perturbation range), so the Config defaults are not used.
Run from inside demo/:  python run_table1.py <mlp|xgboost> <num_seeds> <dataset file name without .csv> <sample_size> [--no-ignore-filter]
"""
import os
import sys

os.environ.setdefault("MPLBACKEND", "Agg")
sys.path.append(os.path.dirname(os.getcwd()))

from src.experiment import Experiment
from src.utils.config import Config
from src.utils.logger import Logger

baseline, num_seeds, dataset, sample_size = sys.argv[1], int(sys.argv[2]), sys.argv[3], int(sys.argv[4])
ignore_filter = "--no-ignore-filter" not in sys.argv
tag = "" if ignore_filter else "_with_filter"

config = Config(
    baseline=baseline,
    dataset_path=f"../data/{dataset}.csv",
    results_dir=f"../ours/{dataset}{tag}",
    num_seeds=num_seeds,
    sample_sizes=[sample_size],
    hyperparam_tune=True,
    ignore_filter=ignore_filter,
    save_params=True,
    save_plots=False,
    save_models=False,
)
exp = Experiment(config, Logger())
exp.run()
