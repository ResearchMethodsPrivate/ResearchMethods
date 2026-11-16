import { gsap } from 'gsap';
import { researchQuestion } from '../config/deck.config';
import type { SlideDef } from '../lib/slide';
import { $, $$, hide } from '../lib/util';

/** The four targets we set in the Week 5 presentation, with what actually happened. */
const targets = [
  {
    title: 'Code set up and running',
    tag: '✓ Done 22 Oct',
    sum: 'The authors’ demo runs on all four of our laptops.',
    proof: 'Exact versions and laptop details written down',
  },
  {
    title: 'Plain-model results saved',
    tag: '✓ Done 13–16 Nov',
    sum: 'Both models, both datasets, 15 repeats each.',
    proof: 'Settings, results and logs for every run',
  },
  {
    title: 'First CRDA comparison',
    tag: '✓ Done 16 Nov',
    sum: 'Our results next to the paper’s table.',
    proof: 'Side-by-side table with p-values',
  },
  {
    title: 'Problem log',
    tag: '✓ Kept up to date',
    sum: '17 differences and problems written down.',
    proof: '8 resolved · 3 tested · 6 still open',
  },
];

export const progressSlide: SlideDef = {
  id: 'progress',
  steps: targets.length,
  source: 'Week 5 targets: our Week 5 presentation · dates from the files in results/ and the group’s problem log',
  html: () => `
    <header class="slide-head">
      <p class="kicker">01 — Where we are</p>
      <h2>We did what we promised in Week 5</h2>
    </header>
    <div class="prog-cards">
      ${targets.map((t, i) => `
        <article class="pc done">
          <p class="pc-top"><span class="pc-k">${i + 1}</span><span class="pc-tag">${t.tag}</span></p>
          <p class="pc-title">${t.title}</p>
          <p class="pc-sum">${t.sum}</p>
          <p class="pc-proof"><span class="lbl">Proof</span>${t.proof}</p>
        </article>`).join('')}
    </div>
    <div class="rq">
      <div><span class="rq-k">Our research question</span><p class="rq-q">${researchQuestion}</p></div>
      <p class="rq-a"><strong>Short answer: mostly yes.</strong>With two catches, coming up.</p>
    </div>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    const cards = $$(root, '.pc');
    hide(tl, cards, { y: 28 });
    hide(tl, $(root, '.rq'), { y: 20 });
    tl.fromTo($(root, '.slide-head'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .addLabel('s0');
    cards.forEach((c, i) => {
      tl.to(c, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });
      if (i === cards.length - 1) tl.to($(root, '.rq'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.15');
      tl.addLabel(`s${i + 1}`);
    });
    return tl;
  },
};
