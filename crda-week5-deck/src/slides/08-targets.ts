import { gsap } from 'gsap';
import { milestones, researchQuestion } from '../config/deck.config';
import type { SlideDef } from '../lib/slide';
import { $, $$, hide, memberName, ph } from '../lib/util';

const n = milestones.length;

export const targetsSlide: SlideDef = {
  id: 'targets',
  steps: n + 1,
  source: 'Targets and dates: editable in src/config/deck.config.ts · all milestones currently planned',
  html: () => `
    <header class="slide-head">
      <p class="kicker">07 — Targets before Week 9</p>
      <h2>What we will bring to the next update</h2>
    </header>
    <div class="track" style="--n:${n}">
      <div class="track-ends"><span>Week 5 · today</span><span>Week 9 · progress update</span></div>
      <div class="track-line"><div class="track-fill"></div></div>
      <div class="track-dots">${milestones.map((_, i) => `<span class="tdot" style="--i:${i}"></span>`).join('')}</div>
    </div>
    <div class="ms-cards" style="--n:${n}">
      ${milestones.map((m, i) => `
        <article class="ms">
          <p class="ms-top"><span class="ms-k">${i + 1}</span><span class="ms-due">${ph(m.due)}</span></p>
          <p class="ms-title">${m.title}</p>
          <p class="ms-row"><span class="lbl">Done when</span>${m.doneWhen}</p>
          <p class="ms-row"><span class="lbl">Evidence</span>${m.evidence}</p>
          <p class="ms-owner">${m.owners.map((o) => `<span>${ph(memberName(o))}</span>`).join('')}</p>
        </article>`).join('')}
    </div>
    <blockquote class="rq"><span class="rq-k">Our research question</span>${researchQuestion}</blockquote>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    const cards = $$(root, '.ms');
    const dots = $$(root, '.tdot');
    hide(tl, cards, { y: 24 });
    hide(tl, $(root, '.rq'), { y: 20 });
    tl.fromTo($(root, '.track-ends'), { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .fromTo($(root, '.track-fill'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, '<')
      .fromTo(dots, { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.5, stagger: 0.15, duration: 0.4, ease: 'back.out(2)' }, '-=0.8')
      .addLabel('s0');
    cards.forEach((c, i) => {
      tl.to(dots[i], { opacity: 1, scale: 1.35, duration: 0.3 })
        .to(c, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '<')
        .addLabel(`s${i + 1}`);
    });
    tl.to($(root, '.rq'), { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }).addLabel(`s${n + 1}`);
    return tl;
  },
};
