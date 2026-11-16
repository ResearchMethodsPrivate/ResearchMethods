import { gsap } from 'gsap';
import { group, team } from '../config/deck.config';
import { ourRunCount, ourRunsThatImproved } from '../content/derive';
import type { SlideDef } from '../lib/slide';
import { $, $$ } from '../lib/util';

const allImproved = ourRunsThatImproved === ourRunCount;

export const titleSlide: SlideDef = {
  id: 'title',
  steps: 0,
  className: 'slide-title',
  source: 'Mohebbi et al. (2026), ICML · github.com/mhmohebbi/CRDA · our results: group repository, results/',
  html: () => `
    <div class="title-grid">
      <div class="title-copy">
        <p class="kicker">${group.session} · ECS7029P Research Methods</p>
        <h1 class="hook">
          <span class="w">Do</span><span class="w">CRDA’s</span><span class="w">gains</span><span class="w">hold</span><span class="w">up</span><span class="w">when</span><span class="w">we</span><span class="w">run</span><span class="w accent">them</span><span class="w accent">ourselves?</span>
        </h1>
        <p class="paper-line"><strong>Counterfactual Residual Data Augmentation for Regression</strong>Mohebbi, Schulte, Li and Poupart · ICML 2026</p>
        <div class="title-foot">
          <span class="chip">4 laptops · 2 datasets · 15 repeats of every run</span>
          <span class="group-line">${[team.members.map((m) => m.name).join(' · '), group.name, group.date].filter(Boolean).join(' — ')}</span>
        </div>
      </div>
      <aside class="answer panel">
        <p class="answer-k">Short answer</p>
        <div class="answer-row">
          <span class="answer-ico ok">✓</span>
          <div><p class="answer-main">Plain models match the paper</p><p class="answer-sub">XGBoost on Windows is a few percent off</p></div>
        </div>
        <div class="answer-row">
          <span class="answer-ico ok">✓</span>
          <div><p class="answer-main">${allImproved ? `CRDA lowers the error in all ${ourRunCount} runs` : 'CRDA lowers the error in most of our runs'}</p><p class="answer-sub">on average, and by about what the paper reports</p></div>
        </div>
        <div class="answer-row">
          <span class="answer-ico warn">!</span>
          <div><p class="answer-main">The paper’s main table keeps runs its own safety test rejects</p><p class="answer-sub">so its averages are not like-for-like</p></div>
        </div>
      </aside>
    </div>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    tl.fromTo($(root, '.kicker'), { opacity: 0 }, { opacity: 1, duration: 0.6 })
      .fromTo($$(root, '.hook .w'), { opacity: 0, y: 30, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.07, ease: 'power3.out' }, 0.1)
      .fromTo([$(root, '.paper-line'), $(root, '.title-foot')], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, 1.0)
      .fromTo($(root, '.answer'), { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, 1.2)
      .fromTo($$(root, '.answer-row'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.3, ease: 'power2.out' }, 1.7)
      .addLabel('s0');
    return tl;
  },
};
