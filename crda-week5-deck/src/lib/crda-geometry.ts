/**
 * Pure maths behind the slide-4 sketch. Kept free of DOM/GSAP so the CRDA
 * invariant can be unit-tested (tests/crda-geometry.test.ts):
 *
 *   z  = y − ĝ(x)          (residual of an observed sample)
 *   x′ = x · (1 + δ),  δ ∈ [−p, p]
 *   y′ = ĝ(x′) + z         (same residual, new prediction)
 *
 * Everything here is ILLUSTRATIVE: an invented ĝ and invented points,
 * not data or a model from the paper.
 */
import { scaleLinear } from 'd3-scale';

/** Invented smooth "baseline predictor" for the sketch. */
export const g = (x: number) => 2 + 0.9 * (x - 4.6) + 0.25 * Math.sin(2.2 * x);

/** Repo default perturbation range: max_perturb_percent = 0.1. */
export const P = 0.1;

export interface Observed { x: number; z: number }
export interface Counterfactual { x: number; y: number; z: number; delta: number }

export const observedY = (o: Observed) => g(o.x) + o.z;

export function counterfactual(o: Observed, delta: number): Counterfactual {
  if (Math.abs(delta) > P + 1e-12) throw new RangeError(`|δ| = ${Math.abs(delta)} exceeds p = ${P}`);
  const x = o.x * (1 + delta);
  return { x, y: g(x) + o.z, z: o.z, delta };
}

// ── The sketch's samples ────────────────────────────────────────────────────
/** Highlighted sample i: positive residual. One δ draw = +0.09. */
export const sampleI: Observed = { x: 5.6, z: 0.9 };
export const deltaI = 0.09;
/** Second sample j: negative residual. */
export const sampleJ: Observed = { x: 6.9, z: -0.7 };
/** Extra draws ("repeat M times") — every |δ| ≤ p. */
export const extraDeltasI = [-0.08, -0.04, 0.05];
export const extraDeltasJ = [-0.09, -0.05, 0.06];

// ── Plot frame (SVG viewBox units) ──────────────────────────────────────────
export const W = 1040;
export const H = 700;
export const M = { l: 80, r: 40, t: 30, b: 92 };
export const sx = scaleLinear().domain([4.6, 7.6]).range([M.l, W - M.r]);
export const sy = scaleLinear().domain([1.0, 6.2]).range([H - M.b, M.t]);

/**
 * Residual arrow for a sample at feature value x: from the prediction ĝ(x)
 * to the sample, stopping `inset` px short so the arrowhead touches the dot.
 */
export function residualArrow(x: number, z: number, inset: number) {
  const x0 = sx(x);
  const y0 = sy(g(x));
  const y1 = sy(g(x) + z);
  const dir = Math.sign(y1 - y0) || 1;
  return { x1: x0, y1: y0, x2: x0, y2: y1 - dir * inset, tipY: y1 };
}

/**
 * Translation that carries sample i's residual arrow from x to x′.
 * Because sy is affine, translating by Δ(sy∘ĝ) lands the tip on sy(ĝ(x′)+z).
 */
export function carryTranslation(from: number, to: number) {
  return { dx: sx(to) - sx(from), dy: sy(g(to)) - sy(g(from)) };
}
