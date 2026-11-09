import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authors, deviations, machines, matchesAuthors, pctChange } from '../../src/content/machines';

test('each machine belongs to a different member, once', () => {
  assert.deepEqual(machines.map((m) => m.owner).sort(), ['A', 'B', 'C', 'D']);
});

test('percentage changes follow the repo formula and agree with the reports', () => {
  // delta_mse values copied from each machine's results.csv (docs/demo-reports/)
  const reported: Record<string, [number, number]> = {
    A: [-51.659340420226265, -28.549481708189344],
    B: [-51.65934042022624, -24.75867087493691],
    C: [-51.659340420226265, -28.549481708189344],
    D: [-51.65934042022624, -24.75867087493691],
  };
  for (const m of machines) {
    assert.ok(Math.abs(pctChange(m.mlp) - reported[m.owner][0]) < 1e-9, `${m.owner} MLP`);
    assert.ok(Math.abs(pctChange(m.xgb) - reported[m.owner][1]) < 1e-9, `${m.owner} XGB`);
  }
});

test('MLP matches the authors on all four laptops; XGBoost matches on both Macs and differs on both Windows laptops', () => {
  const byOwner = Object.fromEntries(machines.map((m) => [m.owner, m]));
  for (const m of machines) assert.equal(matchesAuthors(m.mlp, authors.mlp), true, `${m.owner} MLP`);
  assert.equal(matchesAuthors(byOwner.A.xgb, authors.xgb), true);
  assert.equal(matchesAuthors(byOwner.C.xgb, authors.xgb), true);
  assert.equal(matchesAuthors(byOwner.B.xgb, authors.xgb), false);
  assert.equal(matchesAuthors(byOwner.D.xgb, authors.xgb), false);
  // Two different Windows laptops give the same XGBoost numbers.
  assert.equal(byOwner.D.xgb.before, byOwner.B.xgb.before);
  assert.equal(byOwner.D.xgb.after, byOwner.B.xgb.after);
});

test('Windows XGBoost already differs before augmentation (so CRDA is not the cause)', () => {
  for (const id of ['B', 'D']) {
    const win = machines.find((m) => m.owner === id)!;
    const gap = Math.abs(win.xgb.before - authors.xgb.before) / authors.xgb.before;
    assert.ok(gap > 0.02 && gap < 0.04, `${id} baseline gap ${gap}`);
  }
});

test('wilcoxon p-values are multiples of 1/1024 (10 folds, exact test)', () => {
  for (const r of [authors.mlp, authors.xgb, ...machines.flatMap((m) => [m.mlp, m.xgb])]) {
    assert.ok(Math.abs(r.p * 1024 - Math.round(r.p * 1024)) < 1e-9, `${r.p}`);
  }
});

test('two deviations are recorded', () => assert.equal(deviations.length, 2));
