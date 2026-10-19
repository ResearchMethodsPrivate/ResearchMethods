import { gsap } from 'gsap';
import type { SlideDef } from '../lib/slide';
import { $, $$, hide } from '../lib/util';

const pixels = Array.from({ length: 64 }, (_, i) => {
  const x = (i % 8) * 50 + 10, y = Math.floor(i / 8) * 50 + 10;
  return `<rect x="${x}" y="${y}" width="46" height="46" rx="4" />`;
}).join('');

const tile = (cls: string) => `
  <g class="${cls}">
    <rect class="tile-bg" x="0" y="0" width="420" height="420" rx="22" />
    <g class="tile-px">${pixels}</g>
    <path class="seven" d="M118 112 H300 L190 320" />
  </g>`;

export const naiveSlide: SlideDef = {
  id: 'naive',
  steps: 2,
  source: 'Row: illustrative, invented values · Approaches as characterised by Mohebbi et al. (2026), §2 & Table 2',
  html: () => `
    <header class="slide-head">
      <p class="kicker">02 — Why not just augment?</p>
      <h2>Images have label-safe transformations. Tables rarely do.</h2>
    </header>
    <div class="split split-even naive-grid">
      <div class="panel panel-img">
        <h3>Images: <span class="accent">label-preserving</span> for suitable transforms</h3>
        <div class="tile-stage">
          <svg viewBox="-80 -80 580 580" aria-label="A handwritten seven rotated in both directions keeps its label.">
            <g transform="translate(210 210)">
              <g class="ghost ghost-l" transform="rotate(-16)"><g transform="translate(-210 -210)">${tile('t')}</g></g>
              <g class="ghost ghost-r" transform="rotate(16)"><g transform="translate(-210 -210)">${tile('t')}</g></g>
              <g class="main-tile"><g transform="translate(-210 -210)">${tile('t')}</g></g>
            </g>
          </svg>
        </div>
        <p class="verdict ok"><span class="tag">label</span> “7” <span class="check">✓ small rotations keep it a 7</span></p>
        <p class="caveat">…but rotate a 6 by 180° and it reads as a 9</p>
      </div>
      <div class="panel panel-tab">
        <h3>Tabular regression: <span class="warn">no known label-safe transform</span></h3>
        <div class="row-table" role="table" aria-label="Illustrative house row and a naively perturbed copy">
          <div class="rt-row rt-head" role="row">
            <span role="columnheader">Floor area</span><span role="columnheader">Beds</span><span role="columnheader">Garage</span><span role="columnheader">Location</span><span role="columnheader" class="rt-target">Price&nbsp;(target)</span>
          </div>
          <div class="rt-row rt-orig" role="row">
            <span>92 m²</span><span>3</span><span>basic</span><span>zone B</span><span class="rt-target">£285,000</span>
          </div>
          <div class="rt-row rt-naive" role="row">
            <span class="cell-changed">110 m²</span><span>3</span><span>basic</span><span>zone B</span><span class="rt-target cell-bad">£285,000</span>
          </div>
        </div>
        <p class="rt-note"><span class="tag tag-cyan">naive copy</span> floor area +20%, price copied over</p>
        <p class="verdict bad">✗ Unjustified label: nothing tells us what this house would sell for</p>
        <p class="illus">Illustrative example — invented values</p>
      </div>
    </div>
    <div class="existing">
      <div class="ex-item"><span class="ex-k">Interpolate rows</span> SMOTE-style, C-Mixup <span class="ex-cite">(Chawla et al., 2002; Yao et al., 2022)</span></div>
      <div class="ex-item"><span class="ex-k">Generate rows</span> CTGAN, TabDDPM — target treated as just another column <span class="ex-cite">(Xu et al., 2019; Kotelnikov et al., 2023)</span></div>
      <div class="ex-item ex-gap"><span class="ex-k">Authors’ critique</span> can help in places, but don’t keep each row’s <em>own</em> residual noise; can raise MSE in their benchmarks</div>
    </div>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    const main = $(root, '.main-tile');
    hide(tl, [$(root, '.rt-naive'), $(root, '.rt-note'), $(root, '.panel-tab .verdict'), $(root, '.panel-tab .illus'), $(root, '.caveat')]);
    hide(tl, $$(root, '.ex-item'), { y: 18 });
    tl.fromTo(main, { opacity: 0, scale: 0.85, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' })
      .fromTo($(root, '.seven'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' }, 0.3)
      .fromTo($$(root, '.ghost'), { opacity: 0, rotation: 0, svgOrigin: '0 0' },
        { opacity: 0.35, rotation: (i) => (i === 0 ? -16 : 16), svgOrigin: '0 0', duration: 0.9, ease: 'power3.out', stagger: 0.15 }, 1.0)
      .fromTo($(root, '.panel-img .verdict'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 1.5)
      .to($(root, '.caveat'), { opacity: 1, duration: 0.5 }, 1.9)
      .fromTo([$(root, '.panel-tab h3'), $(root, '.rt-head'), $(root, '.rt-orig')], { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 }, 0.6)
      .addLabel('s0')
      // Step 1 — perturb one numeric cell, keep the label
      .to($(root, '.rt-naive'), { opacity: 1, duration: 0.5 })
      .fromTo($(root, '.cell-changed'), { color: 'var(--ink)' }, { color: 'var(--cyan)', duration: 0.4 })
      .to($(root, '.rt-note'), { opacity: 1, duration: 0.4 }, '<')
      .fromTo($(root, '.cell-bad'), { boxShadow: '0 0 0 0 rgba(255,107,122,0)' }, { boxShadow: '0 0 0 3px rgba(255,107,122,0.9)', duration: 0.4 })
      .to([$(root, '.panel-tab .verdict'), $(root, '.panel-tab .illus')], { opacity: 1, duration: 0.5 }, '<')
      .addLabel('s1')
      // Step 2 — existing approaches
      .to($$(root, '.ex-item'), { opacity: 1, y: 0, stagger: 0.2, duration: 0.5, ease: 'power2.out' })
      .addLabel('s2');
    return tl;
  },
};
