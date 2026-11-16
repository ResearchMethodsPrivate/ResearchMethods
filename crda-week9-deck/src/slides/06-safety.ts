import { gsap } from 'gsap';
import { filtered, run, signed } from '../content/derive';
import type { Model } from '../content/results';
import type { SlideDef } from '../lib/slide';
import { $, $$, hide } from '../lib/util';

const MODELS: { model: Model; name: string }[] = [
  { model: 'MLP', name: 'Neural network' },
  { model: 'XGBoost', name: 'XGBoost' },
];

const row = ({ model, name }: { model: Model; name: string }) => {
  const f = filtered(model);
  const total = 15;
  return `
  <div class="seed-row" data-model="${model}">
    <p class="seed-name">${name}<small>15 repeats</small></p>
    <div class="sq-wrap">${Array.from({ length: total }, (_, i) => `<span class="sq ${f.droppedPositions.includes(i) ? 'drop' : ''}">✕</span>`).join('')}</div>
    <p class="seed-count">
      <span class="c-before">All ${total} count<small>as in the paper’s table</small></span>
      <span class="c-after">${f.seeds} of ${total} kept<small>${f.droppedPositions.length} dropped by the test</small></span>
    </p>
  </div>`;
};

const cell = (model: Model) => {
  const off = run('alvi', 'EnergyEfficiency', model);
  const on = filtered(model);
  return `
    <p class="m">${model === 'MLP' ? 'Neural network' : 'XGBoost'}</p>
    <p class="v off">${signed(off.change)}<small>${off.seeds} repeats</small></p>
    <p class="v on">${signed(on.change)}<small>${on.seeds} repeats</small></p>`;
};

export const safetySlide: SlideDef = {
  id: 'safety',
  steps: 3,
  source: 'Energy Efficiency, 765 rows · test off: Alvi’s run · test on: Samim’s run, dropped repeats from his logs',
  html: () => `
    <header class="slide-head">
      <p class="kicker">05 — The first catch</p>
      <h2>The paper’s table keeps runs its own safety test rejects</h2>
    </header>
    <div class="seeds">${MODELS.map(row).join('')}</div>
    <p class="seed-key">Each square is one repeat. The safety test is meant to switch CRDA off when it does not clearly help.</p>
    <div class="cmp-table" data-part="cmp">
      <p class="h"></p><p class="h">Test off · the paper’s table</p><p class="h">Test on · rejected runs dropped</p>
      ${MODELS.map((m) => cell(m.model)).join('')}
    </div>
    <p class="takeaway" data-part="take"><strong>The gains stay similar, but the numbers are not like-for-like.</strong> With the test on, the code drops runs without any warning and still finishes normally.</p>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    const cmp = $(root, '[data-part="cmp"]');
    const take = $(root, '[data-part="take"]');
    hide(tl, cmp, { y: 16 });
    hide(tl, take, { y: 16 });
    hide(tl, $$(root, '.c-after'));
    hide(tl, $$(root, '.sq.drop'), { scale: 1 });
    tl.fromTo($(root, '.slide-head'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo($$(root, '.sq'), { opacity: 0, scale: 0.6, borderColor: 'rgba(99,227,255,0.7)', backgroundColor: 'rgba(99,227,255,0.13)', color: 'rgba(0,0,0,0)' },
        { opacity: 1, scale: 1, duration: 0.3, stagger: 0.025, ease: 'back.out(2)', borderColor: 'rgba(99,227,255,0.7)', backgroundColor: 'rgba(99,227,255,0.13)', color: 'rgba(0,0,0,0)' }, '-=0.2')
      .fromTo($$(root, '.c-before, .seed-name, .seed-key'), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.05 }, '<0.2')
      .addLabel('s0');
    // Step 1: the test is switched on; rejected repeats turn red and the counts change.
    tl.to($$(root, '.sq.drop'), { borderColor: '#ff7383', backgroundColor: 'rgba(255,115,131,0.16)', color: '#ff7383', opacity: 1, duration: 0.5, stagger: 0.12 })
      .to($$(root, '.c-before'), { opacity: 0, duration: 0.3 }, '<')
      .to($$(root, '.c-after'), { opacity: 1, duration: 0.4 }, '<0.2')
      .addLabel('s1')
      .to(cmp, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .addLabel('s2')
      .to(take, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .addLabel('s3');
    return tl;
  },
};
