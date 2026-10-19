import { gsap } from 'gsap';
import { group } from '../config/deck.config';
import { paper } from '../content/paper';
import type { SlideDef } from '../lib/slide';
import { $, $$, gaussian, mulberry32, ph } from '../lib/util';

// Illustrative constellation: solid = observed rows, hollow = synthetic rows.
const rand = mulberry32(7);
const observed = Array.from({ length: 14 }, (_, i) => {
  const x = 40 + i * 44 + rand() * 18;
  const y = 380 - 0.42 * x + 46 * Math.sin(x / 90) + gaussian(rand) * 26;
  return { x, y };
});
const synthetic = observed.flatMap((p) =>
  [1, 2].map(() => {
    const dx = (rand() - 0.5) * 60;
    return { x: p.x + dx, y: p.y - 0.42 * dx + 46 * (Math.sin((p.x + dx) / 90) - Math.sin(p.x / 90)) };
  }),
);

export const titleSlide: SlideDef = {
  id: 'title',
  steps: 0,
  className: 'slide-title',
  source: `${paper.cite} · ${paper.repo}`,
  html: () => `
    <div class="title-grid">
      <div class="title-copy">
        <p class="kicker">${group.session} · ${group.module}</p>
        <h1 class="hook">
          <span class="w">Can</span> <span class="w">we</span> <span class="w">learn</span> <span class="w accent">more</span>
          <span class="w">when</span> <span class="w">we</span> <span class="w">cannot</span> <span class="w">collect</span> <span class="w accent">more</span> <span class="w">data?</span>
        </h1>
        <div class="paper-card">
          <p class="paper-title">${paper.title}</p>
          <p class="paper-authors">${paper.authors.join(' · ')}</p>
          <p class="paper-meta">${paper.affiliations.join(' · ')} — <strong>${paper.venue}</strong></p>
        </div>
        <div class="title-foot">
          <span class="chip chip-amber">Proposal stage · no replication results yet</span>
          <span class="group-line">${ph(group.name)} · ${ph(group.date)}</span>
        </div>
      </div>
      <figure class="title-figure" aria-hidden="true">
        <svg viewBox="0 0 680 420">
          <g class="obs">${observed.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="7" />`).join('')}</g>
          <g class="syn">${synthetic.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="6" />`).join('')}</g>
        </svg>
        <figcaption><span class="dot dot-obs"></span> observed &nbsp; <span class="dot dot-syn"></span> synthetic · illustrative</figcaption>
      </figure>
    </div>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    tl.fromTo($$(root, '.hook .w'), { opacity: 0, y: 28, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.07, ease: 'power3.out' })
      .fromTo($(root, '.kicker'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.2)
      .fromTo($$(root, '.obs circle'), { opacity: 0, scale: 0, transformOrigin: '50% 50%' },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.04, ease: 'back.out(2)' }, 0.5)
      .fromTo($(root, '.paper-card'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 1.1)
      .fromTo($$(root, '.syn circle'), { opacity: 0, scale: 0, transformOrigin: '50% 50%' },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.025, ease: 'power2.out' }, 1.5)
      .fromTo([$(root, '.title-foot'), $(root, '.title-figure figcaption')], { opacity: 0 }, { opacity: 1, duration: 0.6 }, 2.0)
      .addLabel('s0');
    return tl;
  },
};
