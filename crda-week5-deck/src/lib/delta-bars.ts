/**
 * Signed bar geometry for ΔMSE (%). Negative = lower error (improvement,
 * drawn left of the zero line); positive = higher error (drawn right).
 * The domain always contains zero and both signs, so a dataset where CRDA
 * *increases* MSE still gets a valid, non-negative-width rectangle.
 */
export interface SignedScale { lo: number; hi: number; x0: number; x1: number; zeroX: number; pxPerUnit: number }

/** Domain [lo, hi] ⊇ [min(values), max(values)] ∪ [−pad, +pad], rounded to tens. */
export function signedScale(values: number[], x0: number, x1: number, pad = 10): SignedScale {
  const lo = Math.floor(Math.min(-pad, ...values) / 10) * 10;
  const hi = Math.ceil(Math.max(pad, ...values) / 10) * 10;
  const pxPerUnit = (x1 - x0) / (hi - lo);
  return { lo, hi, x0, x1, zeroX: x0 + -lo * pxPerUnit, pxPerUnit };
}

export function bar(value: number, s: SignedScale) {
  const width = Math.abs(value) * s.pxPerUnit;
  const x = value < 0 ? s.zeroX - width : s.zeroX;
  return { x, width, improves: value < 0 };
}

/** One decimal, half away from zero (toFixed alone shows 1.65 as "1.6"). */
export const fmtDelta = (v: number) => {
  const r = Math.round(Math.abs(v) * 10 + 1e-9) / 10;
  return `${v > 0 && r ? '+' : v < 0 && r ? '−' : ''}${r.toFixed(1)}%`;
};
