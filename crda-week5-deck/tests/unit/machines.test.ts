import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authors, deviations, machines, matchesAuthors, pctChange } from '../../src/content/machines';

test('each machine is one of the three presenters, once', () => {
  assert.deepEqual(machines.map((m) => m.owner).sort(), ['A', 'B', 'C']);
});

test('percentage changes follow the repo formula and agree with the reports', () => {
  // delta_mse values copied from each machine's results.csv (docs/demo-reports/)
  const reported: Record<string, [number, number]> = {
    A: [-51.659340420226265, -28.549481708189344],
    B: [-51.65934042022624, -24.75867087493691],
    C: [-51.659340420226265, -28.549481708189344],
  };
  for (const m of machines) {
    assert.ok(Math.abs(pctChange(m.mlp) - reported[m.owner][0]) < 1e-9, `${m.owner} MLP`);
    assert.ok(Math.abs(pctChange(m.xgb) - reported[m.owner][1]) < 1e-9, `${m.owner} XGB`);
  }
});

test('MLP matches the authors on all three laptops; XGBoost matches on both Macs and differs on Windows', () => {
  const byOwner = Object.fromEntries(machines.map((m) => [m.owner, m]));
  for (const m of machines) assert.equal(matchesAuthors(m.mlp, authors.mlp), true, `${m.owner} MLP`);
  assert.equal(matchesAuthors(byOwner.A.xgb, authors.xgb), true);
  assert.equal(matchesAuthors(byOwner.C.xgb, authors.xgb), true);
  assert.equal(matchesAuthors(byOwner.B.xgb, authors.xgb), false);
});

test('Windows XGBoost already differs before augmentation (so CRDA is not the cause)', () => {
  const win = machines.find((m) => m.owner === 'B')!;
  const gap = Math.abs(win.xgb.before - authors.xgb.before) / authors.xgb.before;
  assert.ok(gap > 0.02 && gap < 0.04, `baseline gap ${gap}`);
});

test('wilcoxon p-values are multiples of 1/1024 (10 folds, exact test)', () => {
  for (const r of [authors.mlp, authors.xgb, ...machines.flatMap((m) => [m.mlp, m.xgb])]) {
    assert.ok(Math.abs(r.p * 1024 - Math.round(r.p * 1024)) < 1e-9, `${r.p}`);
  }
});

test('two deviations are recorded', () => assert.equal(deviations.length, 2));
