import katex from 'katex';
import { gsap } from 'gsap';
import { team, type MemberId } from '../config/deck.config';

/** Deterministic PRNG so "illustrative" point clouds are identical every run. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gaussian(rand: () => number) {
  const u = 1 - rand();
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Least-squares polynomial fit (normal equations + Gaussian elimination).
 * Used to draw a *real* fitted curve through the illustrative points.
 */
export function polyfit(xs: number[], ys: number[], degree: number): (x: number) => number {
  const lo = Math.min(...xs);
  const hi = Math.max(...xs);
  const norm = (x: number) => (2 * (x - lo)) / (hi - lo) - 1; // conditioning
  const n = degree + 1;
  const A = Array.from({ length: n }, () => new Array(n + 1).fill(0));
  xs.forEach((x, k) => {
    const t = norm(x);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) A[i][j] += t ** (i + j);
      A[i][n] += ys[k] * t ** i;
    }
  });
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k];
    }
  }
  const coef = A.map((row, i) => row[n] / row[i]);
  return (x: number) => {
    const t = norm(x);
    return coef.reduce((s, c, i) => s + c * t ** i, 0);
  };
}

export const tex = (src: string, display = false) =>
  katex.renderToString(src, { throwOnError: false, displayMode: display, output: 'html' });


export const memberName = (id: MemberId) => team.members.find((m) => m.id === id)?.name ?? id;

/** Animate a number from 0 to `to` inside `el` (keeps sign + decimals). */
export function countUp(el: Element, to: number, decimals = 1, suffix = '%') {
  const o = { v: 0 };
  return gsap.to(o, {
    v: to,
    duration: 1.2,
    ease: 'power2.out',
    onUpdate: () => {
      const v = o.v;
      el.textContent = `${v < 0 ? '−' : v > 0 ? '+' : ''}${Math.abs(v).toFixed(decimals)}${suffix}`;
    },
  });
}

/** Deterministic initial state: hidden at t=0 of the timeline (re-applied on rewind). */
export const hide = (tl: gsap.core.Timeline, targets: gsap.TweenTarget, extra: gsap.TweenVars = {}) =>
  tl.fromTo(targets, { opacity: 0, ...extra }, { opacity: 0, ...extra, duration: 0.001 }, 0);

export const $ = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  root.querySelector(sel) as T;
export const $$ = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  Array.from(root.querySelectorAll(sel)) as T[];
