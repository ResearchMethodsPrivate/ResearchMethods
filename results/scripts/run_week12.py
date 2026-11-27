"""Run one person's share of the Week 12 cells: Table 1 settings, then the 10-model test.

Use the Python of the authors' virtual environment (see ../INSTRUCTIONS_WEEK12_RUNS.md):
  <CRDA>/.venv/.../python run_week12.py <alvi|anik|atul|samim> [--crda PATH] [--check] [--test]

  --check   check the setup and print the plan; runs nothing
  --test    one seed of an already-finished cell (Energy Efficiency, 765 rows) into <CRDA>/ours/_test_results

Safe to start again after a stop: finished parts are skipped and unfinished runs are moved aside.
The authors' code is not changed.
"""
import argparse
import csv
import json
import os
import platform
import shutil
import subprocess
import sys
import time
from datetime import datetime
from importlib import metadata
from pathlib import Path

COMMIT = "811e82ef29f34488384bffaa2fccf7775810345e"
EE, CS = "EnergyEfficiency", "ConcreteCompressiveStrength"
PEOPLE = {
    "alvi": ("alvi-windows-ryzen7", [(EE, 153), (EE, 306), (EE, 459), (EE, 612)]),
    "samim": ("samim-windows-i7-13620h", [(CS, 201), (CS, 402), (CS, 603), (CS, 804)]),
    "anik": ("anik-mac-m2", [("HousePrice", 200), ("503_wind", 1314), ("WineQuality", 1063)]),
    "atul": ("atul-mac-m5-pro", [("623_fri_c4_1000_10", 200), ("294_satellite_image", 1287),
                                 ("227_cpu_small", 1638), ("ParkinsonsTelemonitoring", 1175)]),
}
MODELS = ("mlp", "xgboost")
SCRIPTS = Path(__file__).resolve().parent


def read_csv(path):
    with open(path, newline="") as f:
        return list(csv.DictReader(f))


def check_setup(crda):
    problems = []
    if not (crda / "src" / "experiment.py").exists():
        return [f"No authors' code at {crda} (pass --crda PATH)"]
    git = lambda *a: subprocess.run(["git", "-C", str(crda), *a], capture_output=True, text=True).stdout.strip()
    if git("rev-parse", "HEAD") != COMMIT:
        problems.append(f"Authors' code is not at commit {COMMIT}")
    if git("status", "--porcelain", "--", "src", "data"):
        problems.append("Files under src/ or data/ in the authors' code have been changed")
    if not shutil.which("dot"):
        problems.append("Graphviz 'dot' is not on PATH")
    if sys.version_info[:2] != (3, 11):
        problems.append(f"Python is {platform.python_version()}, expected 3.11 (use the .venv Python)")
    probe = subprocess.run([sys.executable, "-c", "import sklearn, torch, optuna, causallearn, xgboost"],
                           capture_output=True, text=True, env=child_env())
    if probe.returncode:
        problems.append("A library does not import: " + probe.stderr.strip().splitlines()[-1])
    return problems


def child_env():
    env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUTF8="1", MPLBACKEND="Agg")
    if sys.platform == "darwin":
        # Anik's Mac lost Homebrew's libomp; fall back to the copy scikit-learn ships. Used only if the default is missing.
        dylibs = Path(sys.prefix) / "lib" / "python3.11" / "site-packages" / "sklearn" / ".dylibs"
        if dylibs.is_dir():
            env.setdefault("DYLD_FALLBACK_LIBRARY_PATH", str(dylibs))
    return env


def run_logged(args, cwd, log):
    """Run a script, showing its output and saving it. Returns True on success."""
    with open(log, "a", encoding="utf-8") as out:
        out.write(f"\n=== {datetime.now().isoformat(timespec='seconds')} {' '.join(map(str, args))}\n")
        p = subprocess.Popen([sys.executable, "-u", *map(str, args)], cwd=cwd, env=child_env(),
                             stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8", errors="replace")
        for line in p.stdout:
            sys.stdout.write(line.encode(sys.stdout.encoding or "utf-8", "replace").decode(sys.stdout.encoding or "utf-8", "replace"))
            out.write(line)
        return p.wait() == 0


def experiments(crda, dataset, model, rows, seeds):
    """(finished, unfinished) experiment folders in the authors' output matching this cell."""
    done, partial = [], []
    root = crda / "ours" / dataset
    for cfg in sorted(root.glob(f"{model}_*/config.json")):
        c = json.loads(cfg.read_text())
        if (c.get("sample_sizes"), c.get("num_seeds"), c.get("ignore_filter"), c.get("hyperparam_tune")) == ([rows], seeds, True, True):
            (done if (cfg.parent / "results.csv").exists() else partial).append(cfg.parent)
    return done, partial


def table1(crda, dataset, model, rows, seeds, dest):
    log = dest / f"table1-{model}.log"
    for attempt in (1, 2):  # the plan allows one repeat with the same settings
        done, partial = experiments(crda, dataset, model, rows, seeds)
        if done:
            return done[-1]
        for folder in partial:  # the authors' code refuses to re-run a config it has seen
            aside = crda / "ours" / "_incomplete" / f"{dataset}_{folder.name}_{int(time.time())}"
            aside.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(folder), str(aside))
        print(f"\n### {dataset} {rows} {model}: Table 1 run, attempt {attempt}", flush=True)
        run_logged([SCRIPTS / "run_table1.py", model, seeds, dataset, rows], crda / "demo", log)
    done, _ = experiments(crda, dataset, model, rows, seeds)
    return done[-1] if done else None


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("person", choices=sorted(PEOPLE))
    ap.add_argument("--crda", default=Path.home() / "CRDA", type=Path)
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--test", action="store_true")
    a = ap.parse_args()
    crda = a.crda.resolve()
    folder, cells = PEOPLE[a.person]
    results, seeds = SCRIPTS.parent / folder, 15
    if a.test:
        cells, results, seeds = [(EE, 765)], crda / "ours" / "_test_results", 1

    problems = check_setup(crda)
    for p in problems:
        print("PROBLEM:", p)
    print(f"Person: {a.person} | results go to: {results}")
    for dataset, rows in cells:
        print(f"  {dataset} {rows} rows: mlp + xgboost, {seeds} seeds, then the 10-model test")
    if problems or a.check:
        print("Setup OK" if not problems else "Fix the problems above, then run again.")
        sys.exit(1 if problems else 0)

    (crda / "ours").mkdir(exist_ok=True)
    results.mkdir(parents=True, exist_ok=True)
    versions = sorted(f"{d.metadata['Name']}=={d.version}" for d in metadata.distributions())
    (results / "week12_environment.txt").write_text(
        f"{platform.platform()}\n{platform.processor()}\ncpus={os.cpu_count()}\nPython {platform.python_version()}\n"
        f"authors' commit {COMMIT}\n\n" + "\n".join(versions) + "\n", encoding="utf-8")

    failed = []
    for dataset, rows in cells:
        run_dir = results / f"{dataset}_n{rows}_{seeds}seeds"
        ten_dir = results / f"{dataset}_n{rows}_plain_10model"
        run_dir.mkdir(exist_ok=True)
        ten_dir.mkdir(exist_ok=True)
        for model in MODELS:
            (crda / "ours" / dataset).mkdir(exist_ok=True)
            exp = table1(crda, dataset, model, rows, seeds, run_dir)
            if exp is None:
                failed.append(f"{dataset} {rows} {model}: Table 1 run")
                continue
            copied = run_dir / exp.name
            shutil.copytree(exp, copied, dirs_exist_ok=True)
            interim = next(copied.glob("interim_results/*.csv"))
            n = len(read_csv(interim))
            if n != seeds:
                failed.append(f"{dataset} {rows} {model}: only {n} of {seeds} seeds")
            out = ten_dir / f"{model}.csv"
            if not out.exists():
                print(f"\n### {dataset} {rows} {model}: 10-model test", flush=True)
                args = [SCRIPTS / "run_plain_ensemble.py", model, dataset, rows, interim.resolve(), out.resolve()]
                if not (run_logged(args, crda / "demo", ten_dir / f"{model}.log")
                        or run_logged(args, crda / "demo", ten_dir / f"{model}.log")):
                    failed.append(f"{dataset} {rows} {model}: 10-model test")
                    continue
            # The re-computed single plain error should equal the one in the run, seed by seed.
            rows_ = read_csv(out)
            same = sum(abs(float(r["plain_single_mse"]) / float(r["plain_single_mse_in_run"]) - 1) < 1e-9 for r in rows_)
            print(f"{dataset} {rows} {model}: single plain error reproduced on {same} of {len(rows_)} seeds", flush=True)
            if same != len(rows_):
                failed.append(f"{dataset} {rows} {model}: single plain error differs on {len(rows_) - same} seeds")

    summary = "All parts finished.\n" if not failed else "Not finished or needs a look:\n" + "".join(f"- {f}\n" for f in failed)
    (results / "week12_status.txt").write_text(summary, encoding="utf-8")
    print("\n" + summary)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
