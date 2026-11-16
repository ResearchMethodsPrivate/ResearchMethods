/**
 * Ties every number on the Week 9 slides to the raw files:
 *  - the authors' saved Table 1 files (tests/fixtures/paper/, from github.com/mhmohebbi/CRDA @ 811e82e)
 *  - our runs in ../results/<name>-<laptop>/ (group repository)
 * Run: npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gapPct, ourRunCount, run, signed } from '../../src/content/derive';
import { averaging, filterOn, perSeedSpread, runs, type Run, type Source } from '../../src/content/results';

const RESULTS = resolve(process.cwd(), '..', 'results');
const PAPER = resolve(process.cwd(), 'tests', 'fixtures', 'paper');

interface Seed { seed: string; mse: number; aug: number; delta: number; gate: boolean }

const seedsOf = (path: string): Seed[] =>
  readFileSync(path, 'utf8').trim().split(/\r?\n/).slice(1).map((l) => {
    const c = l.split(',');
    return { seed: c[1], mse: +c[2], aug: +c[3], delta: +c[4], gate: c[6] === 'True' };
  });

const meansOf = (path: string) => Object.fromEntries(
  readFileSync(path, 'utf8').trim().split(/\r?\n/).slice(1).map((l) => { const c = l.split(','); return [c[1], +c[2]]; }),
) as Record<string, number>;

/** The single folder in `dir` that starts with `prefix`. */
const one = (dir: string, prefix: string) => {
  const hits = readdirSync(dir).filter((n) => n.startsWith(prefix));
  assert.equal(hits.length, 1, `${dir}: expected one ${prefix}* folder, found ${hits.length}`);
  return join(dir, hits[0]);
};
const interimIn = (folder: string) => {
  const d = join(folder, 'interim_results');
  return join(d, readdirSync(d)[0]);
};

const ourDir = (source: Source, dataset: Run['dataset']) =>
  source === 'alvi' ? join(RESULTS, 'alvi-windows-ryzen7', 'EnergyEfficiency_n765_15seeds')
  : source === 'anik' ? join(RESULTS, 'anik-mac-m2', 'EnergyEfficiency_n765_15seeds')
  : join(RESULTS, 'samim-windows-i7-13620h', dataset === 'ConcreteStrength' ? 'ConcreteCompressiveStrength_n1005_15seeds' : 'EnergyEfficiency_n765_15seeds_with_filter');

const files = (r: { source: Source; dataset: Run['dataset']; model: Run['model'] }) => {
  const m = r.model === 'MLP' ? 'mlp' : 'xgboost';
  if (r.source === 'paper') {
    const ds = r.dataset === 'EnergyEfficiency' ? 'EnergyEfficiency' : 'ConcreteCompressiveStrength';
    return { results: join(PAPER, `${ds}-${m}-results.csv`), interim: join(PAPER, `${ds}-${m}-interim.csv`) };
  }
  const folder = one(ourDir(r.source, r.dataset), `${m}_`);
  return { results: join(folder, 'results.csv'), interim: interimIn(folder) };
};

const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const close = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

test('the raw result files exist (git config core.longpaths true on Windows)', () => {
  assert.ok(existsSync(RESULTS), `results folder missing at ${RESULTS}`);
  assert.ok(existsSync(PAPER));
});

test('every row in results.ts matches its raw results.csv and per-seed file', () => {
  for (const r of runs) {
    const f = files(r);
    const m = meansOf(f.results);
    const s = seedsOf(f.interim);
    const tag = `${r.source}/${r.dataset}/${r.model}`;
    assert.equal(s.length, r.seeds, `${tag} seeds`);
    assert.ok(close(m.mse, r.plain), `${tag} plain`);
    assert.ok(close(m.aug_mse, r.crda), `${tag} crda`);
    assert.ok(close(m.delta_mse, r.change), `${tag} change`);
    assert.ok(close(m.p_wilcoxon, r.p), `${tag} p`);
    assert.ok(close(mean(s.map((x) => x.delta)), r.change), `${tag} mean of per-seed changes`);
    assert.equal(s.filter((x) => x.delta < 0).length, r.improved, `${tag} improved`);
    assert.equal(s.filter((x) => x.gate).length, r.gate, `${tag} gate`);
  }
});

test('filter-on runs: kept seeds, dropped seeds and means match Samim’s files and Alvi’s seed order', () => {
  for (const f of filterOn) {
    const m = f.model === 'MLP' ? 'mlp' : 'xgboost';
    const on = one(ourDir('samim', 'EnergyEfficiency'), `${m}_`);
    const kept = seedsOf(interimIn(on));
    const alvi = seedsOf(files({ source: 'alvi', dataset: 'EnergyEfficiency', model: f.model }).interim);
    assert.equal(kept.length, f.seeds);
    const keptIds = new Set(kept.map((x) => x.seed));
    const dropped = alvi.filter((x) => !keptIds.has(x.seed));
    assert.deepEqual(dropped.map((x) => +x.seed), f.droppedSeeds);
    assert.deepEqual(alvi.flatMap((x, i) => (keptIds.has(x.seed) ? [] : [i])), f.droppedPositions);
    assert.equal(15 - f.seeds, f.droppedSeeds.length);
    const meansFile = meansOf(join(on, 'results.csv'));
    assert.ok(close(meansFile.delta_mse, f.change) && close(mean(kept.map((x) => x.delta)), f.change));
    assert.equal(kept.filter((x) => x.delta < 0).length, f.improved);
    // the log says why they were dropped
    const log = readdirSync(ourDir('samim', 'EnergyEfficiency')).find((n) => n.includes(m === 'mlp' ? 'filter-mlp' : 'filter-xgb'))!;
    const text = readFileSync(join(ourDir('samim', 'EnergyEfficiency'), log), 'utf8');
    assert.equal((text.match(/No results were possible/g) ?? []).length, f.droppedSeeds.length);
  }
});

test('plain-model claims: MLP identical everywhere; XGBoost identical on the Mac, 3.6 % / 2.1 % higher on Windows', () => {
  for (const ds of ['EnergyEfficiency', 'ConcreteStrength'] as const) {
    const paper = run('paper', ds, 'MLP').plain;
    for (const r of runs.filter((x) => x.source !== 'paper' && x.dataset === ds && x.model === 'MLP')) assert.ok(close(r.plain, paper, 1e-9), `${r.source} ${ds}`);
  }
  assert.ok(close(run('anik', 'EnergyEfficiency', 'XGBoost').plain, run('paper', 'EnergyEfficiency', 'XGBoost').plain));
  const ee = gapPct(run('alvi', 'EnergyEfficiency', 'XGBoost').plain, run('paper', 'EnergyEfficiency', 'XGBoost').plain);
  const cs = gapPct(run('samim', 'ConcreteStrength', 'XGBoost').plain, run('paper', 'ConcreteStrength', 'XGBoost').plain);
  assert.equal(ee.toFixed(1), '3.6');
  assert.equal(cs.toFixed(1), '2.1');
});

test('headline claims: CRDA lowers the error on average in every run, and all our runs are counted', () => {
  assert.equal(ourRunCount, 8);
  assert.ok(runs.every((r) => r.change < 0));
  assert.ok(filterOn.every((r) => r.change < 0));
  assert.equal(ourRunCount * 15, 120);
});

test('Concrete Strength: every one of the 15 repeats improved, so the exact paired Wilcoxon p is 2/2^15 = 0.00006', () => {
  for (const model of ['MLP', 'XGBoost'] as const) {
    const s = seedsOf(files({ source: 'samim', dataset: 'ConcreteStrength', model }).interim);
    assert.equal(s.length, 15);
    assert.ok(s.every((x) => x.aug < x.mse), `${model}: every repeat improved`);
    assert.equal((2 / 2 ** 15).toFixed(5), '0.00006');
  }
});

test('Energy Efficiency: “12 to 14 of 15 repeats improved” (our runs)', () => {
  const n = runs.filter((r) => r.dataset === 'EnergyEfficiency' && r.source !== 'paper').map((r) => r.improved);
  assert.equal(Math.min(...n), 12);
  assert.equal(Math.max(...n), 14);
});

test('rounded numbers said in the notes match the data', () => {
  const pct = (r: Run) => Math.round(-r.change);
  const ee = (s: Source, m: Run['model']) => pct(run(s, 'EnergyEfficiency', m));
  assert.deepEqual([ee('paper', 'MLP'), ee('alvi', 'MLP'), ee('anik', 'MLP')], [28, 29, 32]);
  assert.deepEqual([ee('paper', 'XGBoost'), ee('alvi', 'XGBoost'), ee('anik', 'XGBoost')], [21, 22, 18]);
  assert.deepEqual([pct(run('paper', 'ConcreteStrength', 'MLP')), pct(run('samim', 'ConcreteStrength', 'MLP'))], [27, 24]);
  assert.deepEqual([pct(run('paper', 'ConcreteStrength', 'XGBoost')), pct(run('samim', 'ConcreteStrength', 'XGBoost'))], [12, 15]);
  assert.deepEqual(filterOn.map((f) => Math.round(-f.change)), [32, 20]);
  assert.equal(signed(run('alvi', 'EnergyEfficiency', 'MLP').change), '−28.7%');
});

test('per-seed spread example is Alvi’s Energy Efficiency neural-network run', () => {
  const d = seedsOf(files({ source: 'alvi', dataset: 'EnergyEfficiency', model: 'MLP' }).interim).map((x) => x.delta);
  assert.equal(Math.min(...d), perSeedSpread.min);
  assert.equal(Math.max(...d), perSeedSpread.max);
  assert.equal(Math.round(perSeedSpread.min), -67);
  assert.equal(Math.round(perSeedSpread.max), 25);
});

test('“6–22 minutes per run” holds for every run log', () => {
  const secs: number[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { if (!['params', 'interim_results', 'causal_graphs', 'correlation_matrices'].includes(e.name)) walk(p); }
      else if (/^table1-.*\.log$/.test(e.name) && !/1seed/.test(e.name)) {
        for (const m of readFileSync(p, 'utf8').matchAll(/Total time taken: ([\d.]+) seconds/g)) secs.push(+m[1]);
      }
    }
  };
  for (const d of ['alvi-windows-ryzen7', 'anik-mac-m2', 'samim-windows-i7-13620h']) walk(join(RESULTS, d));
  assert.equal(secs.length, ourRunCount, 'one timing per run');
  assert.ok(Math.min(...secs) / 60 >= 6, `fastest ${Math.min(...secs)} s`);
  assert.ok(Math.max(...secs) / 60 < 23, `slowest ${Math.max(...secs)} s`);
});

test('problem-log counts on the slides (17 entries · 8 resolved · 4 tested · 5 open) match results/atul/problem_log.md', () => {
  const rows = readFileSync(join(RESULTS, 'atul', 'problem_log.md'), 'utf8').split(/\r?\n/).filter((l) => /^\| \d+ \|/.test(l));
  const status = rows.map((l) => l.split('|')[5].trim());
  assert.equal(rows.length, 17);
  assert.equal(status.filter((s) => s === 'Resolved').length, 8);
  assert.equal(status.filter((s) => s === 'Tested').length, 4);
  assert.equal(status.filter((s) => s !== 'Resolved' && s !== 'Tested').length, 5);
});

/** Exact two-sided Wilcoxon signed-rank p-value for paired samples (no ties, no zeros), by enumerating all sign patterns. */
const wilcoxonExact = (a: number[], b: number[]) => {
  const d = a.map((x, i) => x - b[i]);
  const order = d.map((v, i) => [Math.abs(v), i] as const).sort((x, y) => x[0] - y[0]).map(([, i]) => i);
  const rank = new Array<number>(d.length);
  order.forEach((i, r) => { rank[i] = r + 1; });
  const wPlus = d.reduce((s, v, i) => s + (v > 0 ? rank[i] : 0), 0);
  const total = (d.length * (d.length + 1)) / 2;
  const w = Math.min(wPlus, total - wPlus);
  // count sign patterns with rank-sum <= w
  const counts = new Array(total + 1).fill(0);
  counts[0] = 1;
  for (let r = 1; r <= d.length; r++) for (let s = total; s >= r; s--) counts[s] += counts[s - r];
  let le = 0;
  for (let s = 0; s <= w; s++) le += counts[s];
  return Math.min(1, (2 * le) / 2 ** d.length);
};

test('the 10-model test: the single plain error is reproduced exactly and every number on slide 7 matches the files', () => {
  for (const a of averaging) {
    const m = a.model === 'MLP' ? 'mlp' : 'xgboost';
    const csv = readFileSync(join(RESULTS, 'alvi-windows-ryzen7', 'EnergyEfficiency_n765_plain_10model', `${m}.csv`), 'utf8').trim().split(/\r?\n/);
    const head = csv[0].split(',');
    const rows = csv.slice(1).map((l) => Object.fromEntries(l.split(',').map((v, i) => [head[i], +v])) as Record<string, number>);
    assert.equal(rows.length, 15);
    // the check: our re-computed single plain error equals the one in Alvi's Table 1 run, seed by seed
    const table1 = seedsOf(files({ source: 'alvi', dataset: 'EnergyEfficiency', model: a.model }).interim);
    rows.forEach((r, i) => {
      assert.equal(String(r.seed), table1[i].seed);
      assert.ok(close(r.plain_single_mse, table1[i].mse, 1e-11), `${a.model} seed ${r.seed}: single plain error`);
      assert.ok(close(r.crda_10model_mse, table1[i].aug, 1e-11), `${a.model} seed ${r.seed}: CRDA error`);
    });
    assert.ok(close(mean(rows.map((r) => r.pct_10model_vs_single)), a.averagingVsSingle));
    assert.ok(close(mean(rows.map((r) => r.pct_crda_vs_single)), a.crdaVsSingle));
    assert.ok(close(mean(rows.map((r) => r.pct_crda_vs_10model)), a.crdaVsAveraged));
    assert.equal(rows.filter((r) => r.pct_crda_vs_10model < 0).length, a.crdaBeatsAveraged);
    assert.ok(close(a.crdaVsSingle, run('alvi', 'EnergyEfficiency', a.model).change), 'same CRDA change as in the Table 1 run');
  }
  const m = averaging.find((a) => a.model === 'MLP')!;
  const x = averaging.find((a) => a.model === 'XGBoost')!;
  // numbers said in the notes
  assert.equal(m.averagingVsSingle.toFixed(1), '0.1');
  assert.equal(Math.round(-m.crdaVsSingle), 29);
  assert.equal(Math.round(-x.averagingVsSingle), 15);
  assert.equal(Math.round(-x.crdaVsSingle), 22);
  assert.equal(Math.round(-m.crdaVsAveraged), 28);
  assert.equal(Math.round(-x.crdaVsAveraged), 8);
  assert.equal(m.crdaBeatsAveraged + ' ' + x.crdaBeatsAveraged, '14 12');
  // "about two thirds" of XGBoost's gain is averaging: 15.3 of 21.7
  assert.ok(x.averagingVsSingle / x.crdaVsSingle > 0.65 && x.averagingVsSingle / x.crdaVsSingle < 0.75);
});

test('the 10-model test: paired Wilcoxon p-values (XGBoost 0.007 said in the notes)', () => {
  const get = (model: 'mlp' | 'xgboost') => {
    const csv = readFileSync(join(RESULTS, 'alvi-windows-ryzen7', 'EnergyEfficiency_n765_plain_10model', `${model}.csv`), 'utf8').trim().split(/\r?\n/);
    const head = csv[0].split(',');
    const rows = csv.slice(1).map((l) => Object.fromEntries(l.split(',').map((v, i) => [head[i], +v])) as Record<string, number>);
    return { single: rows.map((r) => r.plain_single_mse), avg: rows.map((r) => r.plain_10model_mse), crda: rows.map((r) => r.crda_10model_mse) };
  };
  const x = get('xgboost');
  assert.equal(wilcoxonExact(x.crda, x.avg).toFixed(3), '0.007');
  assert.equal(wilcoxonExact(x.avg, x.single).toFixed(3), '0.002');
  const m = get('mlp');
  assert.equal(wilcoxonExact(m.crda, m.avg).toFixed(5), '0.00012');
});
