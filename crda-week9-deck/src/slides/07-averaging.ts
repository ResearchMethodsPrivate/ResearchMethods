import { gsap } from 'gsap';
import { gainSplit } from '../content/derive';
import type { Dataset, Model } from '../content/results';
import type { SlideDef } from '../lib/slide';
import { $, $$, hide } from '../lib/util';

/** Bar length: gain in points of error, 0–30. */
const MAX = 30;
const NAME: Record<Model, string> = { MLP: 'Neural network', XGBoost: 'XGBoost' };

const row = (dataset: Dataset, model: Model, source: 'alvi' | 'samim') => {
  const g = gainSplit(source, dataset, model);
  const pct = (v: number) => `${(v / MAX) * 100}%`;
  return `
    <div class="sbar" data-row>
      <span class="sb-name">${NAME[model]}</span>
      <span class="sb-track"><i class="sb-avg" style="--w:${pct(g.averaging)}"></i><i class="sb-own" style="--w:${pct(g.own)}"></i></span>
      <span class="sb-val"><b>${Math.round(g.averaging)}</b> of ${Math.round(g.total)}</span>
    </div>`;
};

export const averagingSlide: SlideDef = {
  id: 'averaging',
  steps: 3,
  source: 'Gain = how much lower the error got · Energy Efficiency: Alvi’s run · Concrete Strength: Samim’s run · Anik’s Mac repeat agrees',
  html: () => `
    <header class="slide-head">
      <p class="kicker">06 — The second catch</p>
      <h2>Much of CRDA’s gain is just averaging</h2>
    </header>
    <div class="score-how" data-part="how">
      <div class="how-box"><span class="lbl">The plain score</span><div class="how-models"><i></i></div><p>one model</p></div>
      <span class="how-vs">vs</span>
      <div class="how-box"><span class="lbl">The CRDA score</span><div class="how-models"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><p>10 models, averaged</p></div>
      <p class="how-note">Averaging helps by itself. So we averaged the plain model too.</p>
    </div>
    <p class="split-key"><span class="k-avg">Just averaging</span><span class="k-own">CRDA’s own gain</span></p>
    <div class="split-grid">
      <div class="split-col" data-part="EE">
        <p class="av-ds">Energy Efficiency</p>
        ${row('EnergyEfficiency', 'MLP', 'alvi')}
        ${row('EnergyEfficiency', 'XGBoost', 'alvi')}
      </div>
      <div class="split-col" data-part="CS">
        <p class="av-ds">Concrete Strength</p>
        ${row('ConcreteStrength', 'MLP', 'samim')}
        ${row('ConcreteStrength', 'XGBoost', 'samim')}
      </div>
    </div>
    <p class="takeaway" data-part="take"><strong>CRDA helps, but less than the paper’s way of scoring suggests.</strong></p>`,
  build: (root) => {
    const ee = $(root, '[data-part="EE"]');
    const cs = $(root, '[data-part="CS"]');
    const take = $(root, '[data-part="take"]');
    const tl = gsap.timeline({ paused: true });
    hide(tl, [ee, cs], { y: 20 });
    hide(tl, take, { y: 14 });
    const grow = (p: HTMLElement) =>
      tl.fromTo($$(p, '.sb-avg, .sb-own'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, '<0.15')
        .fromTo($$(p, '.sb-val, .sb-name'), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.08 }, '<');
    tl.fromTo($(root, '.slide-head'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo($(root, '[data-part="how"]'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2')
      .fromTo($$(root, '.how-models i'), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.25, stagger: 0.05, ease: 'back.out(2)' }, '-=0.3')
      .fromTo($(root, '.split-key'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.1')
      .addLabel('s0')
      .to(ee, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    grow(ee);
    tl.addLabel('s1').to(cs, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    grow(cs);
    tl.addLabel('s2').to(take, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }).addLabel('s3');
    return tl;
  },
};
