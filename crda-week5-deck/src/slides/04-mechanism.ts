import { gsap } from 'gsap';
import { line, curveMonotoneX } from 'd3-shape';
import type { SlideDef } from '../lib/slide';
import { $, $$, gaussian, hide, mulberry32, tex } from '../lib/util';
import {
  H, M, P, W, carryTranslation, counterfactual, deltaI, extraDeltasI, extraDeltasJ, g,
  observedY, residualArrow, sampleI, sampleJ, sx, sy,
} from '../lib/crda-geometry';

// Illustrative 1-D sketch of Algorithm 1 — invented ĝ and points (see crda-geometry.ts).
const curve = line<number>().x((x) => sx(x)).y((x) => sy(g(x))).curve(curveMonotoneX)(
  Array.from({ length: 160 }, (_, i) => 4.7 + (i / 159) * 2.8),
) ?? '';

const rand = mulberry32(23);
const bg = Array.from({ length: 16 }, () => {
  const x = 4.75 + rand() * 2.75;
  return { x, y: g(x) + gaussian(rand) * 0.45 };
}).filter((p) => Math.abs(p.x - sampleI.x) > 0.12 && Math.abs(p.x - sampleI.x * (1 + deltaI)) > 0.12);

const R_OBS = 12;
const R_SYN = 11;
const cf = counterfactual(sampleI, deltaI);
const zI = residualArrow(sampleI.x, sampleI.z, R_OBS + 1);
const carry = carryTranslation(sampleI.x, cf.x);
const zJ = residualArrow(sampleJ.x, sampleJ.z, 10);
const extras = [
  ...extraDeltasI.map((d) => counterfactual(sampleI, d)),
  ...extraDeltasJ.map((d) => counterfactual(sampleJ, d)),
];
const bandLo = sx(sampleI.x * (1 - P));
const bandHi = sx(sampleI.x * (1 + P));
const axisY = H - M.b;

const marker = (id: string, color: string) => `
  <marker id="${id}" viewBox="0 0 10 10" refX="10" refY="5" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" orient="auto-start-reverse">
    <path d="M0 0 L10 5 L0 10 z" fill="${color}" /></marker>`;

const steps = [
  { k: '1', h: 'Fit a baseline predictor', eq: '\\hat g \\leftarrow \\text{MLP or XGBoost on } \\mathcal{D}_{\\text{train}}' },
  { k: '2', h: 'Compute the original residual', eq: 'z_i = y_i - \\hat g(x_i)' },
  { k: '3', h: 'Scale selected numeric features', eq: "x'_{i,P} = x_{i,P}\\,(1+\\delta),\\;\\; \\delta \\sim \\mathcal{U}[-p,\\,p]",
    sub: `${tex('x_{i,R}')} held fixed · repo default p&nbsp;=&nbsp;0.1 · shown: δ&nbsp;=&nbsp;+0.09` },
  { k: '4', h: 'Reuse the same residual', eq: "y'_i = \\hat g(x'_i) + z_i" },
  { k: '5', h: 'Repeat M times per row', eq: '\\mathcal{D}_{\\text{aug}} = \\{(x\'_i,\\, y\'_i)\\}' },
];

export const mechanismSlide: SlideDef = {
  id: 'mechanism',
  steps: 4,
  className: 'slide-mechanism',
  source: 'Mohebbi et al. (2026), Alg. 1 & §4.1; repo default p from src/utils/config.py · Plot: illustrative sketch',
  html: () => `
    <header class="slide-head">
      <p class="kicker">03 — The CRDA idea</p>
      <h2>Move a safe numeric feature. Keep the observed noise.</h2>
    </header>
    <div class="mech-grid">
      <figure class="plot plot-mech">
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Illustrative sketch: an observed sample above the fitted curve, its residual, a numeric feature scaled by 9 percent, and the same residual re-attached to form a synthetic sample.">
          <defs>${marker('arr-cyan', 'var(--cyan)')}${marker('arr-violet', 'var(--violet)')}${marker('arr-dim', 'var(--ink-dim)')}</defs>
          <rect class="band" x="${bandLo}" y="${axisY - 46}" width="${bandHi - bandLo}" height="46" rx="6" />
          <text class="lbl-band" x="${(bandLo + bandHi) / 2}" y="${axisY + 34}" text-anchor="middle">±10% range (p = 0.1)</text>
          <g class="axes">
            <line x1="${M.l}" y1="${axisY}" x2="${W - M.r}" y2="${axisY}" />
            <line x1="${M.l}" y1="${M.t}" x2="${M.l}" y2="${axisY}" />
            <text x="${W - M.r}" y="${axisY + 70}" text-anchor="end">x<tspan baseline-shift="sub" font-size="20">P</tspan>: numeric feature (e.g. wall area)</text>
            <text x="${M.l - 24}" y="${M.t + 8}" text-anchor="end" transform="rotate(-90 ${M.l - 24} ${M.t + 8})">target y (e.g. heating load)</text>
          </g>
          <g class="bg">${bg.map((p) => `<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="6" />`).join('')}</g>
          <path class="g-curve" d="${curve}" />
          <text class="lbl-g" x="${sx(4.78)}" y="${sy(g(4.78)) + 52}">ĝ(x)</text>

          <!-- step 1: residual of sample i -->
          <circle class="proj proj-i" cx="${sx(sampleI.x)}" cy="${sy(g(sampleI.x))}" r="7" />
          <line class="zvec z-i" x1="${zI.x1}" y1="${zI.y1}" x2="${zI.x2}" y2="${zI.y2}" marker-end="url(#arr-cyan)" />
          <text class="lbl-z" x="${zI.x1 - 20}" y="${(zI.y1 + zI.tipY) / 2 + 12}" text-anchor="end">z<tspan baseline-shift="sub" font-size="22">i</tspan></text>

          <!-- step 2: scale x_P by (1 + δ) -->
          <line class="guide guide-i" x1="${sx(sampleI.x)}" y1="${sy(g(sampleI.x))}" x2="${sx(sampleI.x)}" y2="${axisY}" />
          <line class="guide guide-p" x1="${sx(cf.x)}" y1="${sy(g(cf.x))}" x2="${sx(cf.x)}" y2="${axisY}" />
          <line class="shift" x1="${sx(sampleI.x)}" y1="${axisY - 22}" x2="${sx(cf.x)}" y2="${axisY - 22}" marker-end="url(#arr-dim)" />
          <text class="lbl-shift" x="${sx(cf.x) + 14}" y="${axisY - 14}">×(1 + 0.09)</text>
          <circle class="proj proj-p" cx="${sx(cf.x)}" cy="${sy(g(cf.x))}" r="7" />
          <text class="lbl-gp" x="${sx(cf.x) + 16}" y="${sy(g(cf.x)) + 36}">ĝ(x′)</text>

          <!-- step 3: the SAME residual vector, carried to x′ -->
          <g class="zcopy">
            <line class="zvec" x1="${zI.x1}" y1="${zI.y1}" x2="${zI.x2}" y2="${zI.y2}" marker-end="url(#arr-violet)" />
          </g>
          <circle class="syn syn-p" cx="${sx(cf.x)}" cy="${sy(cf.y)}" r="${R_SYN}" />
          <text class="lbl-syn" x="${sx(cf.x)}" y="${sy(cf.y) - 30}" text-anchor="middle">synthetic: y′ = ĝ(x′) + z<tspan baseline-shift="sub" font-size="18">i</tspan></text>

          <!-- observed sample i (on top) -->
          <circle class="obs obs-i" cx="${sx(sampleI.x)}" cy="${sy(observedY(sampleI))}" r="${R_OBS}" />
          <text class="lbl-obs" x="${sx(sampleI.x) - 22}" y="${sy(observedY(sampleI)) - 22}" text-anchor="end">observed sample i</text>

          <!-- step 4: repeat M times -->
          <g class="more">
            <line class="zvec zvec-thin z-j" x1="${zJ.x1}" y1="${zJ.y1}" x2="${zJ.x2}" y2="${zJ.tipY}" />
            <circle class="obs obs-j" cx="${sx(sampleJ.x)}" cy="${sy(observedY(sampleJ))}" r="10" />
            ${extras.map((c) => `<g class="more-pt"><line class="zvec zvec-thin" x1="${sx(c.x)}" y1="${sy(g(c.x))}" x2="${sx(c.x)}" y2="${sy(c.y)}" /><circle class="syn" cx="${sx(c.x)}" cy="${sy(c.y)}" r="8" /></g>`).join('')}
          </g>
          <text class="lbl-more" x="${W - M.r}" y="${M.t + 24}" text-anchor="end">repeat M times per row → 𝒟<tspan baseline-shift="sub" font-size="20">aug</tspan></text>
        </svg>
        <figcaption>
          <span class="illus">Illustrative sketch — invented points, not paper data. One feature shown; CRDA may scale several screened numeric features.</span>
          <span class="analogy"><strong>Paper’s analogy (§1):</strong> change a house’s garage finish, keep its “bidding-war” residual.</span>
        </figcaption>
      </figure>
      <ol class="mech-steps">
        ${steps.map((s) => `
          <li class="mstep" data-k="${s.k}">
            <span class="mstep-k">${s.k}</span>
            <div><p class="mstep-h">${s.h}</p><div class="mstep-eq">${tex(s.eq)}</div>${s.sub ? `<p class="mstep-sub">${s.sub}</p>` : ''}</div>
          </li>`).join('')}
      </ol>
    </div>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    const ms = $$(root, '.mstep');
    const focus = (k: number) => ms.forEach((el, i) =>
      tl.to(el, { opacity: i + 1 === k ? 1 : i + 1 < k ? 0.55 : 0.28, duration: 0.4 }, '<'));

    hide(tl, [$(root, '.proj-i'), $(root, '.lbl-z'), $$(root, '.guide'), $(root, '.lbl-shift'), $(root, '.band'), $(root, '.lbl-band'),
      $(root, '.proj-p'), $(root, '.lbl-gp'), $(root, '.zcopy'), $(root, '.syn-p'), $(root, '.lbl-syn'),
      $(root, '.lbl-more'), $(root, '.obs-j'), $(root, '.z-j'), $(root, '.z-i'), $(root, '.shift')]);
    hide(tl, $$(root, '.more-pt'), { scale: 0, transformOrigin: '50% 100%' });
    tl.fromTo(ms, { opacity: 0, x: 30 }, { opacity: 0.28, x: 0, stagger: 0.07, duration: 0.45 })
      .fromTo($(root, '.axes'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0)
      .fromTo($$(root, '.bg circle'), { opacity: 0 }, { opacity: 1, stagger: 0.03, duration: 0.3 }, 0.1)
      .fromTo($(root, '.g-curve'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.2, ease: 'power2.inOut' }, 0.3)
      .fromTo($(root, '.lbl-g'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.3)
      .fromTo($(root, '.obs-i'), { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.4)' }, 1.4)
      .fromTo($(root, '.lbl-obs'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.6);
    focus(1);
    tl.addLabel('s0');

    // Step 1 → residual vector z_i
    tl.to($(root, '.proj-i'), { opacity: 1, duration: 0.3 })
      .to($(root, '.z-i'), { opacity: 1, duration: 0.01 })
      .fromTo($(root, '.z-i'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7, ease: 'power2.out' })
      .to($(root, '.lbl-z'), { opacity: 1, duration: 0.4 }, '-=0.2');
    focus(2);
    tl.addLabel('s1');

    // Step 2 → scale x_P inside the ±p band
    tl.to([$(root, '.band'), $(root, '.lbl-band')], { opacity: 1, duration: 0.4 })
      .to($(root, '.guide-i'), { opacity: 1, duration: 0.3 }, '<')
      .to($(root, '.shift'), { opacity: 1, duration: 0.01 })
      .fromTo($(root, '.shift'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' })
      .to($(root, '.lbl-shift'), { opacity: 1, duration: 0.3 }, '<0.3')
      .to($(root, '.guide-p'), { opacity: 1, duration: 0.3 })
      .to([$(root, '.proj-p'), $(root, '.lbl-gp')], { opacity: 1, duration: 0.4 });
    focus(3);
    tl.addLabel('s2');

    // Step 3 → carry the SAME residual (exact translation, see carryTranslation)
    tl.to([$(root, '.lbl-shift'), $(root, '.lbl-band')], { opacity: 0.35, duration: 0.3 })
      .to($(root, '.zcopy'), { opacity: 1, duration: 0.2 }, '<')
      .fromTo($(root, '.zcopy'), { x: 0, y: 0 }, { x: carry.dx, y: carry.dy, duration: 1.1, ease: 'power3.inOut' })
      .to($(root, '.syn-p'), { opacity: 1, duration: 0.3 })
      .fromTo($(root, '.syn-p'), { scale: 0.2, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.45, ease: 'back.out(3)' }, '<')
      .to($(root, '.lbl-syn'), { opacity: 1, duration: 0.4 });
    focus(4);
    tl.addLabel('s3');

    // Step 4 → repeat for every row
    tl.to([$(root, '.lbl-syn'), $(root, '.lbl-shift'), $(root, '.lbl-gp'), $(root, '.lbl-band')], { opacity: 0, duration: 0.4 })
      .to([$(root, '.band'), $(root, '.guide-i'), $(root, '.guide-p')], { opacity: 0.25, duration: 0.4 }, '<')
      .to($(root, '.lbl-obs'), { opacity: 0.45, duration: 0.4 }, '<')
      .to([$(root, '.obs-j'), $(root, '.z-j')], { opacity: 1, duration: 0.4 }, '<')
      .to($$(root, '.more-pt'), { opacity: 1, scale: 1, stagger: 0.12, duration: 0.45, ease: 'back.out(2)' })
      .to($(root, '.lbl-more'), { opacity: 1, duration: 0.4 });
    focus(5);
    tl.addLabel('s4');
    return tl;
  },
};
