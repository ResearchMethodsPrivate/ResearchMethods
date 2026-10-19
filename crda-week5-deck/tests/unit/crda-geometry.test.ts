import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  P, carryTranslation, counterfactual, deltaI, extraDeltasI, extraDeltasJ, g, observedY,
  residualArrow, sampleI, sampleJ, sx, sy,
} from '../../src/lib/crda-geometry';

const close = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);

test('residual of each observed sample is y − ĝ(x)', () => {
  for (const s of [sampleI, sampleJ]) close(observedY(s) - g(s.x), s.z);
});

test('every animated synthetic sample satisfies y′ − ĝ(x′) = z (same residual, same sign)', () => {
  const all = [
    counterfactual(sampleI, deltaI),
    ...extraDeltasI.map((d) => counterfactual(sampleI, d)),
    ...extraDeltasJ.map((d) => counterfactual(sampleJ, d)),
  ];
  for (const c of all) {
    close(c.y - g(c.x), c.z);
    const src = c.z === sampleI.z ? sampleI : sampleJ;
    close(c.x, src.x * (1 + c.delta));
    assert.equal(Math.sign(c.y - g(c.x)), Math.sign(src.z));
  }
});

test('all illustrated δ draws respect the repo default |δ| ≤ p = 0.1', () => {
  assert.equal(P, 0.1);
  for (const d of [deltaI, ...extraDeltasI, ...extraDeltasJ]) assert.ok(Math.abs(d) <= P);
  assert.throws(() => counterfactual(sampleI, 0.45), RangeError);
});

test('carrying the residual arrow lands its tip exactly on the synthetic point (pixel space)', () => {
  const cf = counterfactual(sampleI, deltaI);
  const arrow = residualArrow(sampleI.x, sampleI.z, 13);
  const { dx, dy } = carryTranslation(sampleI.x, cf.x);
  close(arrow.x1 + dx, sx(cf.x), 1e-6);
  close(arrow.y1 + dy, sy(g(cf.x)), 1e-6); // tail on ĝ(x′)
  close(arrow.tipY + dy, sy(cf.y), 1e-6); // tip on y′ = ĝ(x′) + z
  // magnitude preserved: the copied vector is the original one, translated
  close(arrow.tipY - arrow.y1, sy(g(cf.x) + cf.z) - sy(g(cf.x)), 1e-6);
});
