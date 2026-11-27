import { gsap } from 'gsap';
import { data, fresh, PLANNED } from '../content/derive';

export const head = (kicker: string, title: string) =>
  `<header class="slide-head"><p class="kicker" data-in>${kicker}</p><h2 data-in>${title}</h2></header>`;

/** Shown on every results slide until all new results are in. */
export const pendingBadge = () => {
  if (!data.pending.length) return '';
  const who = [...new Set(data.pending.map((p) => p.who))].join(', ');
  return `<p class="pending" data-in>${fresh.length} of ${PLANNED} new results in · waiting for ${who}</p>`;
};

/** One intro animation per slide: everything marked data-in fades up in turn. No clicks. */
export const enter = (root: HTMLElement) =>
  gsap
    .timeline({ paused: true })
    .fromTo(root.querySelectorAll('[data-in]'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.09, ease: 'power2.out' })
    .addLabel('s0');
