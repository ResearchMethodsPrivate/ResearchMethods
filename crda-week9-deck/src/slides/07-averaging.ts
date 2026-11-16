import { gsap } from 'gsap';
import { averaged, signed } from '../content/derive';
import type { Dataset, Model } from '../content/results';
import type { SlideDef } from '../lib/slide';
import { $, $$, hide } from '../lib/util';

/** Bars show how far the error fell below the plain single model, 0–30 %. */
const MAX = 30;
const NAME: Record<Model, string> = { MLP: 'Neural network (MLP)', XGBoost: 'XGBoost' };

/** Averaging 10 plain models can make the error a hair worse (the neural network on Energy Efficiency: +0.1 %); draw that as an empty bar. */
const fall = (v: number) => Math.max(0, -v);

const panel = (dataset: Dataset, model: Model, bars: 'alvi' | 'samim', repeat?: 'anik') => {
  const a = averaged(bars, dataset, model);
  const bar = (cls: string, who: string, v: number) => `
    <div class="rbar ${cls}">
      <span class="rb-who">${who}</span>
      <span class="rb-track"><i class="rb-fill" style="--w:${(fall(v) / MAX) * 100}%"></i></span>
      <span class="rb-val">${signed(v)}</span>
    </div>`;
  const mac = repeat ? ` · Mac ${signed(averaged(repeat, dataset, model).crdaVsAveraged)}` : '';
  return `
  <div class="panel avpanel">
    <h3>${NAME[model]}</h3>
    ${bar('c-avg', 'Plain · 10 averaged', a.averagingVsSingle)}
    ${bar('c-alvi', 'CRDA · 10 averaged', a.crdaVsSingle)}
    <p class="like"><span class="lbl">CRDA on top of averaging</span><b>${signed(a.crdaVsAveraged)}</b><span class="like-more">Windows${mac}</span></p>
  </div>`;
};

export const averagingSlide: SlideDef = {
  id: 'averaging',
  steps: 3,
  source: 'Bars: Alvi (Energy Efficiency), Samim (Concrete) · Mac = Anik’s repeat · 15 repeats · change vs one plain model',
  html: () => `
    <header class="slide-head">
      <p class="kicker">06 — The second catch</p>
      <h2>Much of CRDA’s gain is just averaging 10 models</h2>
    </header>
    <div class="score-how" data-part="how">
      <div class="how-box"><span class="lbl">The plain score</span><div class="how-models"><i></i></div><p>one model</p></div>
      <span class="how-vs">vs</span>
      <div class="how-box"><span class="lbl">The CRDA score</span><div class="how-models"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><p>the average of 10 models</p></div>
      <p class="how-note">Averaging usually lowers error by itself. So we scored the plain model the same way.</p>
    </div>
    <div class="av-grid">
      <div class="av-col" data-part="EE">
        <p class="av-ds">Energy Efficiency</p>
        ${panel('EnergyEfficiency', 'MLP', 'alvi', 'anik')}
        ${panel('EnergyEfficiency', 'XGBoost', 'alvi', 'anik')}
      </div>
      <div class="av-col" data-part="CS">
        <p class="av-ds">Concrete Strength</p>
        ${panel('ConcreteStrength', 'MLP', 'samim')}
        ${panel('ConcreteStrength', 'XGBoost', 'samim')}
      </div>
    </div>
    <p class="takeaway" data-part="take"><strong>Like for like, CRDA adds less than the paper’s way of scoring suggests.</strong></p>`,
  build: (root) => {
    const ee = $(root, '[data-part="EE"]');
    const cs = $(root, '[data-part="CS"]');
    const take = $(root, '[data-part="take"]');
    const tl = gsap.timeline({ paused: true });
    hide(tl, [ee, cs], { y: 20 });
    hide(tl, take, { y: 14 });
    const grow = (p: HTMLElement) =>
      tl.fromTo($$(p, '.rb-fill'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out' }, '<0.15')
        .fromTo($$(p, '.rb-val, .rb-who, .like'), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.06 }, '<');
    tl.fromTo($(root, '.slide-head'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo($(root, '[data-part="how"]'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2')
      .fromTo($$(root, '.how-models i'), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.25, stagger: 0.05, ease: 'back.out(2)' }, '-=0.3')
      .addLabel('s0')
      .to(ee, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    grow(ee);
    tl.addLabel('s1').to(cs, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    grow(cs);
    tl.addLabel('s2').to(take, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }).addLabel('s3');
    return tl;
  },
};
