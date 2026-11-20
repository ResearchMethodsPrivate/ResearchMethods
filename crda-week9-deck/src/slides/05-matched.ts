import { gsap } from 'gsap';
import { gapPct, run } from '../content/derive';
import { perSeedSpread } from '../content/results';
import type { SlideDef } from '../lib/slide';
import { $, $$, hide } from '../lib/util';

const eeXgbPaper = run('paper', 'EnergyEfficiency', 'XGBoost');
const eeXgbAlvi = run('alvi', 'EnergyEfficiency', 'XGBoost');
const csXgbPaper = run('paper', 'ConcreteStrength', 'XGBoost');
const csXgbSamim = run('samim', 'ConcreteStrength', 'XGBoost');

const whole = (v: number) => `${v < 0 ? '−' : '+'}${Math.round(Math.abs(v))}%`;
const plusPct = (v: number) => `+${v.toFixed(1)}%`;

export const matchedSlide: SlideDef = {
  id: 'matched',
  steps: 3,
  source: 'Plain = without CRDA · paper: authors’ saved files · ours: results/',
  html: () => `
    <header class="slide-head">
      <p class="kicker">04 — What matched</p>
      <h2>Plain models match, except XGBoost on Windows</h2>
    </header>
    <div class="cmp-cards">
      <article class="cc" data-card="1">
        <span class="cc-ico ok">✓</span>
        <p class="cc-title">Plain neural network</p>
        <p class="cc-lead"><b>Same as the paper</b> on every laptop.</p>
        <p class="cc-note">Why it matters: if our plain models were different, we could not compare fairly.</p>
      </article>
      <article class="cc" data-card="2">
        <span class="cc-ico mix">±</span>
        <p class="cc-title">Plain XGBoost</p>
        <p class="cc-lead"><b>Same on the Mac.</b> <b class="amber">A little higher on both Windows laptops.</b></p>
        <ul class="cc-list">
          <li class="good"><span>Anik · Mac</span><span>same as paper</span></li>
          <li class="bad"><span>Alvi · Windows</span><span>${plusPct(gapPct(eeXgbAlvi.plain, eeXgbPaper.plain))}</span></li>
          <li class="bad"><span>Samim · Windows</span><span>${plusPct(gapPct(csXgbSamim.plain, csXgbPaper.plain))}</span></li>
        </ul>
        <p class="cc-note">We do not know why yet.</p>
      </article>
      <article class="cc" data-card="3">
        <span class="cc-ico info">≈</span>
        <p class="cc-title">CRDA’s gain</p>
        <p class="cc-lead"><b class="cyan">Close, not identical.</b> It moves a lot from one repeat to the next, so small gaps are normal.</p>
        <p class="cc-note">One repeat: from ${whole(perSeedSpread.min)} to ${whole(perSeedSpread.max)}.</p>
      </article>
    </div>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    const cards = $$(root, '.cc');
    hide(tl, cards, { y: 30 });
    tl.fromTo($(root, '.slide-head'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }).addLabel('s0');
    cards.forEach((c, i) => {
      tl.to(c, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        .fromTo($$(c, '.cc-list li'), { opacity: 0, x: 14 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.12 }, '-=0.25')
        .addLabel(`s${i + 1}`);
    });
    return tl;
  },
};
