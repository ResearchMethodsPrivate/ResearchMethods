import { gsap } from 'gsap';
import { ourRunCount } from '../content/derive';
import type { SlideDef } from '../lib/slide';
import { $, $$, hide } from '../lib/util';

const REPEATS = 15;

export const methodSlide: SlideDef = {
  id: 'method',
  steps: 2,
  source: 'Settings: the authors’ saved config files for their main table · our runs: results/',
  html: () => `
    <header class="slide-head">
      <p class="kicker">02 — What we ran</p>
      <h2>We ran the paper’s own code, with its settings</h2>
    </header>
    <div class="method-grid">
      <div class="panel mpanel" data-part="copied">
        <h3>What we copied from the paper</h3>
        <div class="mrow"><span class="mnum">1</span><div><p class="mt">Their code</p><p class="md">We did not change it.</p></div></div>
        <div class="mrow"><span class="mnum">2</span><div><p class="mt">Their settings</p><p class="md">${REPEATS} repeats of every run, and the biggest part of the data.</p></div></div>
        <div class="mrow"><span class="mnum">3</span><div><p class="mt">Their two models</p><p class="md">A neural network and XGBoost, each with and without CRDA.</p></div></div>
      </div>
      <div class="panel mpanel" data-part="who">
        <h3>Who ran what</h3>
        <div class="who-row"><p class="who-name">Alvi<span class="who-hw">Windows · Ryzen 7</span></p><p class="who-job">Energy Efficiency</p></div>
        <div class="who-row"><p class="who-name">Anik<span class="who-hw">Mac · M2</span></p><p class="who-job">The same again, as a check</p></div>
        <div class="who-row"><p class="who-name">Samim<span class="who-hw">Windows · i7</span></p><p class="who-job">Concrete Strength</p></div>
        <div class="who-row"><p class="who-name">Atul<span class="who-hw">Mac · M5 Pro</span></p><p class="who-job">The table and the problem list</p></div>
      </div>
    </div>
    <div class="stat-strip">
      <p class="stat"><b>${ourRunCount}</b><span>full runs</span></p>
      <p class="stat"><b>${ourRunCount * REPEATS}</b><span>experiments</span></p>
      <p class="stat"><b>4</b><span>laptops</span></p>
    </div>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    const who = $(root, '[data-part="who"]');
    hide(tl, who, { x: 40 });
    hide(tl, $(root, '.stat-strip'), { y: 20 });
    tl.fromTo($(root, '.slide-head'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo($(root, '[data-part="copied"]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2')
      .fromTo($$(root, '[data-part="copied"] .mrow'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.18 }, '-=0.4')
      .addLabel('s0')
      .to(who, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' })
      .fromTo($$(root, '.who-row'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.14 }, '-=0.3')
      .addLabel('s1')
      .to($(root, '.stat-strip'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .addLabel('s2');
    return tl;
  },
};
