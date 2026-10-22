import { gsap } from 'gsap';
import { rolesStatus, team, type MemberId } from '../config/deck.config';
import { notes } from '../content/notes';
import type { SlideDef } from '../lib/slide';
import { $, $$, hide } from '../lib/util';

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
  // Neighbour arcs leave 70px right of centre and land 20px left of the next centre.
  // The long wrap-around arc (e.g. C → A) starts/ends on the far side of the cards,
  // outside both short arcs, so no two arrows cross.
  const wrap = dir < 0;
  const x1 = wrap ? cx(i) + 40 : cx(i) + 70;
  const x2 = wrap ? cx(j) - 40 : cx(j) - 20;
  const depth = wrap ? 112 : 56;
  return `<path class="xarc" d="M${x1} 6 C ${x1} ${depth + 30}, ${x2} ${depth + 30}, ${x2} 14" marker-end="url(#x-arr)" />`;
});

export const teamSlide: SlideDef = {
  id: 'team',
  steps: 1,
  source: 'Presenters confirmed · research roles and cross-checks proposed, pending team agreement · research tasks planned',
  html: () => `
    <header class="slide-head">
      <p class="kicker">07 — Who does what</p>
      <h2>Clear ownership, balanced load, every result cross-checked</h2>
      ${rolesStatus === 'confirmed' ? '' : '<p class="head-chip"><span class="chip chip-amber">Proposed roles — confirm with team</span></p>'}
    </header>
    <div class="cards cards-${n}">
      ${team.members.map((m) => `
        <article class="card" data-id="${m.id}">
          <div class="card-top"><span class="card-id">${m.id}</span><span class="status">${rolesStatus === 'confirmed' ? 'Planned' : 'Proposed'}</span></div>
          <p class="card-name">${m.name}</p>
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
