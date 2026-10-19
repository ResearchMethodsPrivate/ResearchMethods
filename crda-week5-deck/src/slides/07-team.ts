import { gsap } from 'gsap';
import { team, type MemberId } from '../config/deck.config';
import { notes } from '../content/notes';
import type { SlideDef } from '../lib/slide';
import { $, $$, hide, ph } from '../lib/util';

const order = Object.keys(notes);
const speaksFor = (id: MemberId) => {
  const nums = order.filter((s) => s !== 'team' && team.speaking[s]?.includes(id)).map((s) => order.indexOf(s) + 1);
  return nums.length ? `slides ${nums.join(', ')} + own card` : 'own card';
};

// Overlay geometry for the cross-check arrows (content width 1680).
const n = team.members.length;
const CW = 1680, GAP = 36;
const cardW = (CW - GAP * (n - 1)) / n;
const cx = (i: number) => i * (cardW + GAP) + cardW / 2;
const arcs = team.members.map((m, i) => {
  const j = team.members.findIndex((t) => t.id === m.checks);
  const dir = j > i ? 1 : -1;
  // Leave each card 70px off-centre, arrive 20px off-centre, so arcs never share an endpoint.
  const x1 = cx(i) + 70 * dir, x2 = cx(j) - 20 * dir;
  const depth = 26 + Math.abs(j - i) * 40 + (dir < 0 && n === 2 ? 40 : 0);
  return `<path class="xarc" d="M${x1} 6 C ${x1} ${depth + 30}, ${x2} ${depth + 30}, ${x2} 14" marker-end="url(#x-arr)" />`;
});

export const teamSlide: SlideDef = {
  id: 'team',
  steps: 1,
  source: 'Editable in src/config/deck.config.ts · every task: planned',
  html: () => `
    <header class="slide-head">
      <p class="kicker">06 — Who does what</p>
      <h2>Clear ownership, balanced load, every result cross-checked</h2>
    </header>
    <div class="cards cards-${n}">
      ${team.members.map((m) => `
        <article class="card" data-id="${m.id}">
          <div class="card-top"><span class="card-id">${m.id}</span><span class="status">Planned</span></div>
          <p class="card-name">${ph(m.name)}</p>
          <p class="card-role">${m.role}</p>
          <ul class="card-owns">${m.owns.map((o) => `<li>${o}</li>`).join('')}</ul>
          <p class="card-check"><span class="lbl">Cross-check</span>${m.crossCheck}</p>
          <p class="card-speaks"><span class="lbl">Speaks</span>${speaksFor(m.id)}</p>
        </article>`).join('')}
    </div>
    <svg class="xarcs" viewBox="0 0 ${CW} 140" aria-hidden="true">
      <defs><marker id="x-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--violet)" /></marker></defs>
      ${arcs.join('')}
    </svg>
    <p class="team-shared">Shared by everyone: run at least one config end-to-end · review the final slides · rehearse to time</p>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    hide(tl, $(root, '.team-shared'));
    tl.fromTo($$(root, '.card'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.25, duration: 0.6, ease: 'power3.out' })
      .addLabel('s0')
      .fromTo($$(root, '.xarc'), { drawSVG: '0%', opacity: 0 }, { drawSVG: '100%', opacity: 1, stagger: 0.25, duration: 0.8, ease: 'power2.inOut' })
      .fromTo($$(root, '.card-check'), { color: 'var(--ink-dim)' }, { color: 'var(--ink)', duration: 0.4, stagger: 0.15 }, '<')
      .to($(root, '.team-shared'), { opacity: 1, duration: 0.5 })
      .addLabel('s1');
    return tl;
  },
};
