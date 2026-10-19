import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bar, fmtDelta, signedScale } from '../../src/lib/delta-bars';
import { datasets } from '../../src/content/paper';

test('negative ΔMSE (improvement) draws left of zero with positive width', () => {
  const s = signedScale([-28.31, -20.96], 170, 630);
  const b = bar(-28.31, s);
  assert.ok(b.width > 0);
  assert.ok(b.x + b.width <= s.zeroX + 1e-9);
  assert.equal(b.improves, true);
});

test('positive ΔMSE (CRDA made error worse) still yields a valid rectangle right of zero', () => {
  // Paper Table 1 has real positive cells, e.g. Parkinson’s XGB at n = 5875: +1.65
  const v = datasets.Parkinsons.table1[4][1];
  assert.equal(v, 1.65);
  const s = signedScale([v, -47.23], 170, 630);
  const b = bar(v, s);
  assert.ok(b.width > 0);
  assert.equal(b.x, s.zeroX);
  assert.equal(b.improves, false);
  assert.ok(b.x + b.width <= 630 + 1e-9);
});

test('mixed and all-positive domains always include zero and stay inside the frame', () => {
  for (const vals of [[5, 12.4], [-3, 3], [0], [-60, 40]]) {
    const s = signedScale(vals, 0, 400);
    assert.ok(s.lo <= 0 && s.hi >= 0);
    for (const v of vals) {
      const b = bar(v, s);
      assert.ok(b.width >= 0 && b.x >= -1e-9 && b.x + b.width <= 400 + 1e-9, `${v} out of frame`);
    }
  }
});

test('signed labels', () => {
  assert.equal(fmtDelta(-22.9), '−22.9%');
  assert.equal(fmtDelta(1.65), '+1.7%');
  assert.equal(fmtDelta(0), '0.0%');
});
