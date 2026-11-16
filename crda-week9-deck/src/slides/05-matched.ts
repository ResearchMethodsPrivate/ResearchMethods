import { gsap } from 'gsap';
import { gapPct, mse6, run, signed } from '../content/derive';
import { perSeedSpread } from '../content/results';
import type { SlideDef } from '../lib/slide';
import { $, $$, hide } from '../lib/util';

const eeMlp = run('paper', 'EnergyEfficiency', 'MLP');
const csMlp = run('paper', 'ConcreteStrength', 'MLP');
const eeXgbPaper = run('paper', 'EnergyEfficiency', 'XGBoost');
const eeXgbAlvi = run('alvi', 'EnergyEfficiency', 'XGBoost');
const csXgbPaper = run('paper', 'ConcreteStrength', 'XGBoost');
const csXgbSamim = run('samim', 'ConcreteStrength', 'XGBoost');

const whole = (v: number) => `${v < 0 ? '−' : '+'}${Math.round(Math.abs(v))}%`;
const plusPct = (v: number) => `+${v.toFixed(1)}%`;

export const matchedSlide: SlideDef = {
  id: 'matched',
  steps: 3,
  source: 'Plain = without CRDA · test error (MSE), mean of 15 repeats · paper: authors’ Table 1 files · ours: results/',
  html: () => `
    <header class="slide-head">
      <p class="kicker">04 — What matched, what did not</p>
      <h2>Plain models match, except XGBoost on Windows</h2>
    </header>
    <div class="cmp-cards">
      <article class="cc" data-card="1">
        <span class="cc-ico ok">✓</span>
        <p class="cc-title">Plain neural network</p>
        <p class="cc-lead"><b>The same error as the paper</b> on every laptop and both datasets.</p>
        <ul class="cc-list">
          <li class="good"><span>Energy Efficiency</span><span>${mse6(eeMlp.plain)}</span></li>
          <li class="good"><span>Concrete Strength</span><span>${mse6(csMlp.plain)}</span></li>
        </ul>
        <p class="cc-note">Why it matters: if the plain models differed, we could not compare the gains.</p>
      </article>
      <article class="cc" data-card="2">
        <span class="cc-ico mix">±</span>
        <p class="cc-title">Plain XGBoost</p>
        <p class="cc-lead"><b>Matches on the Mac.</b> <b class="amber">Higher on both Windows laptops.</b> We do not know why yet.</p>
        <ul class="cc-list">
          <li class="good"><span>Anik · Mac</span><span>same as paper</span></li>
          <li class="bad"><span>Alvi · Windows</span><span>${plusPct(gapPct(eeXgbAlvi.plain, eeXgbPaper.plain))}</span></li>
          <li class="bad"><span>Samim · Windows</span><span>${plusPct(gapPct(csXgbSamim.plain, csXgbPaper.plain))}</span></li>
        </ul>
        <p class="cc-note">The two Windows laptops give the same number as each other, so it is not random noise.</p>
      </article>
      <article class="cc" data-card="3">
        <span class="cc-ico info">≈</span>
        <p class="cc-title">Size of the CRDA gain</p>
        <p class="cc-lead"><b class="cyan">Close, not identical.</b> One repeat to the next, the gain swings from ${whole(perSeedSpread.min)} to ${whole(perSeedSpread.max)}, so a few points’ gap is expected.</p>
        <ul class="cc-list">
          <li><span>Paper</span><span>${signed(eeMlp.change)}</span></li>
          <li><span>Alvi · Windows</span><span>${signed(run('alvi', 'EnergyEfficiency', 'MLP').change)}</span></li>
          <li><span>Anik · Mac</span><span>${signed(run('anik', 'EnergyEfficiency', 'MLP').change)}</span></li>
        </ul>
        <p class="cc-note">Energy Efficiency, neural network: mean change in error.</p>
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
