import { gsap } from 'gsap';
import { drop, run, signed, sourceLabel } from '../content/derive';
import type { Dataset, Model, Source } from '../content/results';
import { runs } from '../content/results';
import type { SlideDef } from '../lib/slide';
import { $, $$, hide } from '../lib/util';

/** Bars show how far the error FELL (positive = better). 0–40 % is enough for every run. */
const MAX = 40;
const MODEL_LABEL: Record<Model, string> = { MLP: 'Neural network (MLP)', XGBoost: 'XGBoost' };

const bars = (dataset: Dataset, model: Model, sources: Source[]) => `
  <p class="rmodel">${MODEL_LABEL[model]}</p>
  ${sources.map((s) => {
    const r = run(s, dataset, model);
    return `<div class="rbar c-${s}" data-fill="${(drop(r) / MAX) * 100}">
      <span class="rb-who ${s === 'paper' ? 'paper' : ''}">${sourceLabel[s]}</span>
      <span class="rb-track"><i class="rb-fill" style="--w:${(drop(r) / MAX) * 100}%"></i></span>
      <span class="rb-val">${signed(r.change)}</span></div>`;
  }).join('')}`;

// Concrete: all 15 repeats improved on Samim's laptop for both models.
const concrete = runs.filter((r) => r.source === 'samim');
const allImproved = concrete.every((r) => r.improved === r.seeds);

export const resultsSlide: SlideDef = {
  id: 'results',
  steps: 3,
  source: 'Paper: authors’ saved Table 1 files · ours: results/ · each bar = mean of the 15 per-repeat changes in error',
  html: () => `
    <header class="slide-head">
      <p class="kicker">03 — Results</p>
      <h2>CRDA cut the error in every run, close to the paper</h2>
    </header>
    <div class="res-grid">
      <div class="panel rpanel" data-part="ee">
        <h3>Energy Efficiency<small>765 rows</small></h3>
        ${bars('EnergyEfficiency', 'MLP', ['paper', 'alvi', 'anik'])}
        ${bars('EnergyEfficiency', 'XGBoost', ['paper', 'alvi', 'anik'])}
        <p class="axis-note">How much lower the error got · longer bar = better</p>
        <p class="legend">
          <span class="c-paper">Paper</span><span class="c-alvi">Alvi · Windows</span><span class="c-anik">Anik · Mac</span><span class="c-samim">Samim · Windows</span>
        </p>
        <div class="howto"><span class="lbl">How to read a bar</span><p>Plain error <b>100</b> → with CRDA <b>72</b> → bar says <b>28%</b> <em>(made-up numbers)</em></p></div>
      </div>
      <div class="rcol">
        <div class="panel rpanel" data-part="cs">
          <h3>Concrete Strength<small>1,005 rows</small></h3>
          ${bars('ConcreteStrength', 'MLP', ['paper', 'samim'])}
          ${bars('ConcreteStrength', 'XGBoost', ['paper', 'samim'])}
        </div>
        <div class="stats-box" data-part="stats">
          <p class="stats-k">Is it just luck?</p>
          <p class="stats-big">${allImproved ? 'All <b>15 of 15</b> repeats improved' : 'Most repeats improved'}, for both models</p>
          <div class="dots15">${'<i></i>'.repeat(15)}</div>
          <p class="stats-small">Very unlikely: p = 0.00006. Under 0.05 counts as “not luck”.</p>
        </div>
      </div>
    </div>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    const ee = $(root, '[data-part="ee"]');
    const cs = $(root, '[data-part="cs"]');
    const stats = $(root, '[data-part="stats"]');
    const grow = (panel: HTMLElement, at?: string | number) =>
      tl.fromTo($$(panel, '.rb-fill'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, at)
        .fromTo($$(panel, '.rb-val, .rb-who'), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.06 }, '<');
    hide(tl, [ee, cs, stats]);
    hide(tl, $$(root, '.dots15 i'), { scale: 0 });
    tl.fromTo($(root, '.slide-head'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 })
      .addLabel('s0')
      .to(ee, { opacity: 1, duration: 0.4 });
    grow(ee, '<0.1');
    tl.addLabel('s1')
      .to(cs, { opacity: 1, duration: 0.4 });
    grow(cs, '<0.1');
    tl.addLabel('s2')
      .to(stats, { opacity: 1, duration: 0.5 })
      .to($$(root, '.dots15 i'), { scale: 1, duration: 0.3, stagger: 0.05, ease: 'back.out(2)' }, '<0.2')
      .addLabel('s3');
    return tl;
  },
};
