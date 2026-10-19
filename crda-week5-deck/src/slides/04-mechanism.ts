import { gsap } from 'gsap';
import { scaleLinear } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import type { SlideDef } from '../lib/slide';
import { $, $$, gaussian, hide, mulberry32, tex } from '../lib/util';

// Illustrative 1-D sketch of Algorithm 1. ĝ and all points are invented.
const g = (x: number) => 1.1 + 0.42 * x + 0.32 * Math.sin(0.9 * x);
const W = 1040, H = 700, M = { l: 80, r: 40, t: 30, b: 92 };
const sx = scaleLinear().domain([0, 10]).range([M.l, W - M.r]);
const sy = scaleLinear().domain([0, 7]).range([H - M.b, M.t]);
const curve = line<number>().x((x) => sx(x)).y((x) => sy(g(x))).curve(curveMonotoneX)(
  Array.from({ length: 160 }, (_, i) => 0.3 + (i / 159) * 9.5),
) ?? '';

const rand = mulberry32(23);
const bg = Array.from({ length: 18 }, () => {
  const x = 0.6 + rand() * 8.9;
  return { x, y: g(x) + gaussian(rand) * 0.55 };
});

// House i: positive residual ("bidding war"). House j: negative residual.
const xi = 3.0, zi = 1.25, delta = 0.45;
const xp = xi * (1 + delta);
const xj = 7.2, zj = -0.85;
const extra = [
  ...[-0.3, 0.2, 0.68].map((d) => ({ x: xi * (1 + d), z: zi })),
  ...[-0.16, 0.1, 0.27].map((d) => ({ x: xj * (1 + d), z: zj })),
];

const arrowDefs = `
  <defs>
    <marker id="arr-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--cyan)" /></marker>
    <marker id="arr-violet" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--violet)" /></marker>
    <marker id="arr-dim" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--ink-dim)" /></marker>
  </defs>`;

const steps = [
  { k: '1', h: 'Fit a baseline', eq: '\\hat g \\leftarrow \\text{MLP or XGBoost on } \\mathcal{D}_{\\text{train}}' },
  { k: '2', h: 'Compute each residual', eq: 'z_i = y_i - \\hat g(x_i)' },
  { k: '3', h: 'Perturb selected features only', eq: "x'_{i,P} = x_{i,P}\\,(1+\\delta),\\;\\; \\delta \\sim \\mathcal{U}[-p,\\,p]", sub: `${tex('x_{i,R}')} held fixed` },
  { k: '4', h: 'Reuse the same residual', eq: "y'_i = \\hat g(x'_i) + z_i" },
];

export const mechanismSlide: SlideDef = {
  id: 'mechanism',
  steps: 4,
  className: 'slide-mechanism',
  source: 'Mohebbi et al. (2026), Alg. 1 & §4.1; house example §1 · Plot: illustrative 1-D sketch',
  html: () => `
    <header class="slide-head">
      <p class="kicker">03 — The CRDA idea</p>
      <h2>Move the safe features. Keep the observed noise.</h2>
    </header>
    <div class="mech-grid">
      <figure class="plot plot-mech">
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Illustrative sketch: an observed house above the fitted curve, its residual, a perturbed feature value, and the same residual re-attached to form a synthetic sample.">
          ${arrowDefs}
          <g class="axes">
            <line x1="${M.l}" y1="${H - M.b}" x2="${W - M.r}" y2="${H - M.b}" />
            <line x1="${M.l}" y1="${M.t}" x2="${M.l}" y2="${H - M.b}" />
            <text x="${W - M.r}" y="${H - M.b + 56}" text-anchor="end">perturbable feature x<tspan baseline-shift="sub" font-size="20">P</tspan> (e.g. garage finish)</text>
            <text x="${M.l - 24}" y="${M.t + 8}" text-anchor="end" transform="rotate(-90 ${M.l - 24} ${M.t + 8})">price y</text>
          </g>
          <g class="bg">${bg.map((p) => `<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="6" />`).join('')}</g>
          <path class="g-curve" d="${curve}" />
          <text class="lbl-g" x="${sx(9.9)}" y="${sy(g(9.9)) + 58}" text-anchor="end">ĝ(x)</text>

          <!-- step 2: residual of house i -->
          <circle class="proj proj-i" cx="${sx(xi)}" cy="${sy(g(xi))}" r="7" />
          <line class="zvec z-i" x1="${sx(xi)}" y1="${sy(g(xi))}" x2="${sx(xi)}" y2="${sy(g(xi) + zi) + 14}" marker-end="url(#arr-cyan)" />
          <text class="lbl-z" x="${sx(xi) - 18}" y="${sy(g(xi) + zi / 2) + 8}" text-anchor="end">z<tspan baseline-shift="sub" font-size="20">i</tspan></text>
          <text class="lbl-z-sub" x="${sx(xi) - 18}" y="${sy(g(xi) + zi / 2) + 40}" text-anchor="end">“bidding war”</text>

          <!-- step 3: perturb x_P -->
          <line class="guide guide-i" x1="${sx(xi)}" y1="${sy(g(xi))}" x2="${sx(xi)}" y2="${H - M.b}" />
          <line class="guide guide-p" x1="${sx(xp)}" y1="${sy(g(xp))}" x2="${sx(xp)}" y2="${H - M.b}" />
          <line class="shift" x1="${sx(xi)}" y1="${H - M.b - 22}" x2="${sx(xp) - 6}" y2="${H - M.b - 22}" marker-end="url(#arr-dim)" />
          <text class="lbl-shift" x="${(sx(xi) + sx(xp)) / 2}" y="${H - M.b - 36}" text-anchor="middle">×(1+δ)</text>
          <circle class="proj proj-p" cx="${sx(xp)}" cy="${sy(g(xp))}" r="7" />
          <text class="lbl-gp" x="${sx(xp) + 18}" y="${sy(g(xp)) + 34}">ĝ(x′)</text>

          <!-- step 4: same residual, new place -->
          <g class="zcopy">
            <line class="zvec" x1="${sx(xi)}" y1="${sy(g(xi))}" x2="${sx(xi)}" y2="${sy(g(xi) + zi) + 14}" marker-end="url(#arr-violet)" />
          </g>
          <circle class="syn syn-p" cx="${sx(xp)}" cy="${sy(g(xp) + zi)}" r="11" />
          <text class="lbl-syn" x="${sx(xp) + 22}" y="${sy(g(xp) + zi) - 16}">synthetic house: new garage,</text>
          <text class="lbl-syn" x="${sx(xp) + 22}" y="${sy(g(xp) + zi) + 16}">same bidding war</text>

          <!-- observed house i (drawn last to sit on top) -->
          <circle class="obs obs-i" cx="${sx(xi)}" cy="${sy(g(xi) + zi)}" r="12" />
          <text class="lbl-obs" x="${sx(xi) - 20}" y="${sy(g(xi) + zi) - 22}" text-anchor="end">observed house i</text>

          <!-- step 5 (repeat M times) -->
          <g class="more">
            <line class="zvec zvec-thin z-j" x1="${sx(xj)}" y1="${sy(g(xj))}" x2="${sx(xj)}" y2="${sy(g(xj) + zj)}" />
            <circle class="obs obs-j" cx="${sx(xj)}" cy="${sy(g(xj) + zj)}" r="10" />
            ${extra.map((p) => `<g class="more-pt"><line class="zvec zvec-thin" x1="${sx(p.x)}" y1="${sy(g(p.x))}" x2="${sx(p.x)}" y2="${sy(g(p.x) + p.z)}" /><circle class="syn" cx="${sx(p.x)}" cy="${sy(g(p.x) + p.z)}" r="8" /></g>`).join('')}
          </g>
          <text class="lbl-more" x="${sx(9.8)}" y="${sy(6.55)}" text-anchor="end">repeat M times per row → 𝒟<tspan baseline-shift="sub" font-size="20">aug</tspan></text>
        </svg>
        <figcaption class="illus">Illustrative 1-D sketch — the method perturbs up to <em>k</em> screened features of a multi-feature row</figcaption>
      </figure>
      <ol class="mech-steps">
        ${steps.map((s) => `
          <li class="mstep" data-k="${s.k}">
            <span class="mstep-k">${s.k}</span>
            <div><p class="mstep-h">${s.h}</p><div class="mstep-eq">${tex(s.eq)}</div>${s.sub ? `<p class="mstep-sub">${s.sub}</p>` : ''}</div>
          </li>`).join('')}
        <li class="fixed-chip"><span class="chip">${tex('X_R')} fixed: location, floor area</span><span class="chip chip-violet">${tex('X_P')} perturbed: garage finish</span></li>
      </ol>
    </div>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    const ms = $$(root, '.mstep');
    const focus = (k: number) => ms.map((el, i) => tl.to(el, { opacity: i + 1 === k ? 1 : i + 1 < k ? 0.55 : 0.28, duration: 0.4 }, '<'));
    const dx = sx(xp) - sx(xi);
    const dy = sy(g(xp)) - sy(g(xi));

    hide(tl, [$(root, '.proj-i'), $(root, '.lbl-z'), $(root, '.lbl-z-sub'), $$(root, '.guide'), $(root, '.lbl-shift'),
      $(root, '.proj-p'), $(root, '.lbl-gp'), $(root, '.zcopy'), $(root, '.syn-p'), $$(root, '.lbl-syn'), $(root, '.fixed-chip'),
      $(root, '.lbl-more'), $(root, '.obs-j'), $(root, '.z-j'), $(root, '.z-i'), $(root, '.shift')]);
    hide(tl, $$(root, '.more-pt'), { scale: 0, transformOrigin: '50% 100%' });
    tl.fromTo(ms, { opacity: 0, x: 30 }, { opacity: 0.28, x: 0, stagger: 0.08, duration: 0.5 })
      .fromTo($(root, '.axes'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0)
      .fromTo($$(root, '.bg circle'), { opacity: 0 }, { opacity: 1, stagger: 0.03, duration: 0.3 }, 0.1)
      .fromTo($(root, '.g-curve'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.3, ease: 'power2.inOut' }, 0.3)
      .fromTo($(root, '.lbl-g'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.4)
      .fromTo($(root, '.obs-i'), { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.4)' }, 1.5)
      .fromTo($(root, '.lbl-obs'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.7);
    focus(1);
    tl.addLabel('s0');

    // Step 1 → residual vector
    tl.to($(root, '.proj-i'), { opacity: 1, duration: 0.3 })
      .to($(root, '.z-i'), { opacity: 1, duration: 0.01 })
      .fromTo($(root, '.z-i'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7, ease: 'power2.out' })
      .to([$(root, '.lbl-z'), $(root, '.lbl-z-sub')], { opacity: 1, duration: 0.4 }, '-=0.2');
    focus(2);
    tl.addLabel('s1');

    // Step 2 → perturb x_P along the axis
    tl.to($(root, '.guide-i'), { opacity: 1, duration: 0.3 })
      .to($(root, '.fixed-chip'), { opacity: 1, duration: 0.4 }, '<')
      .to($(root, '.shift'), { opacity: 1, duration: 0.01 })
      .fromTo($(root, '.shift'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' })
      .to($(root, '.lbl-shift'), { opacity: 1, duration: 0.3 }, '<0.3')
      .to($(root, '.guide-p'), { opacity: 1, duration: 0.3 })
      .to([$(root, '.proj-p'), $(root, '.lbl-gp')], { opacity: 1, duration: 0.4 });
    focus(3);
    tl.addLabel('s2');

    // Step 3 → carry the same residual over and stack it on ĝ(x′)
    tl.to($(root, '.zcopy'), { opacity: 1, duration: 0.2 })
      .fromTo($(root, '.zcopy'), { x: 0, y: 0 }, { x: dx, y: dy, duration: 1.1, ease: 'power3.inOut' })
      .to($(root, '.syn-p'), { opacity: 1, duration: 0.4 })
      .fromTo($(root, '.syn-p'), { scale: 0.2, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, '<')
      .to($$(root, '.lbl-syn'), { opacity: 1, duration: 0.4, stagger: 0.1 });
    focus(4);
    tl.addLabel('s3');

    // Step 4 → repeat for every row
    tl.to([$$(root, '.lbl-syn'), $(root, '.lbl-z-sub'), $(root, '.lbl-shift'), $(root, '.lbl-gp')], { opacity: 0, duration: 0.4 })
      .to($(root, '.lbl-obs'), { opacity: 0.4, duration: 0.4 }, '<')
      .to([$(root, '.obs-j'), $(root, '.z-j')], { opacity: 1, duration: 0.4 }, '<')
      .to($$(root, '.more-pt'), { opacity: 1, scale: 1, stagger: 0.12, duration: 0.45, ease: 'back.out(2)' })
      .to($(root, '.lbl-more'), { opacity: 1, duration: 0.4 });
    ms.forEach((el) => tl.to(el, { opacity: 1, duration: 0.4 }, '<'));
    tl.addLabel('s4');
    return tl;
  },
};
