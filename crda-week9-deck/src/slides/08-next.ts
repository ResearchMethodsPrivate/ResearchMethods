import { gsap } from 'gsap';
import type { SlideDef } from '../lib/slide';
import { $, $$, hide } from '../lib/util';

const found = [
  { t: 'CRDA’s gains reproduce', d: 'On average, in every run, within a few points of the paper.' },
  { t: 'Catch 1: rejected runs are kept', d: 'The paper’s table counts runs its own safety test would drop.' },
  { t: 'Catch 2: XGBoost’s gain is mostly averaging', d: 'CRDA’s score averages 10 models; the plain score uses one.' },
];

const todo = [
  { t: 'Repeat the 10-model test: Mac, Concrete Strength', who: 'Anik · Samim' },
  { t: 'Write up the statistics, check every number', who: 'Samim · Atul' },
  { t: 'Final slides: 12–15 min, 10–12 slides', who: 'Everyone' },
  { t: 'Rehearse to time', who: 'Everyone' },
];

export const nextSlide: SlideDef = {
  id: 'next',
  steps: 1,
  source: 'Final presentation: Week 12, 11 Dec 2026, 12–15 min, 10–12 slides (module slides) · problem log: results/atul/',
  html: () => `
    <header class="slide-head">
      <p class="kicker">07 — What is left</p>
      <h2>Three findings, and what we do before the final</h2>
    </header>
    <div class="next-grid">
      <div class="panel npanel" data-part="found">
        <h3>What we found</h3>
        ${found.map((f, i) => `<div class="nrow"><span class="mnum">${i + 1}</span><div><p class="mt">${f.t}</p><p class="md">${f.d}</p></div></div>`).join('')}
        <p class="log-chip">Also open: plain XGBoost is a few percent off on <b>both Windows laptops</b>. Cause not found yet.</p>
      </div>
      <div class="panel npanel" data-part="todo">
        <h3>Before the final · 11 Dec</h3>
        ${todo.map((x) => `<div class="todo"><span>${x.t}</span><span class="owner">${x.who}</span></div>`).join('')}
        <p class="log-chip">Problem log: <b>17 entries</b> · 8 resolved · 4 tested · 5 open</p>
      </div>
    </div>
    <p class="bottomline" data-part="bottom"><strong>Bottom line:</strong> CRDA works, but less than the paper’s XGBoost number suggests.</p>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    const todoPanel = $(root, '[data-part="todo"]');
    hide(tl, todoPanel, { x: 40 });
    hide(tl, $(root, '[data-part="bottom"]'), { y: 14 });
    tl.fromTo($(root, '.slide-head'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo($(root, '[data-part="found"]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2')
      .fromTo($$(root, '[data-part="found"] .nrow'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.2 }, '-=0.4')
      .fromTo($(root, '[data-part="found"] .log-chip'), { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .addLabel('s0')
      .to(todoPanel, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' })
      .fromTo($$(root, '.todo'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.14 }, '-=0.3')
      .fromTo($(root, '[data-part="todo"] .log-chip'), { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .to($(root, '[data-part="bottom"]'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .addLabel('s1');
    return tl;
  },
};
