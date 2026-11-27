import { team, type MemberId } from '../config/deck.config';

export const memberName = (id: MemberId) => team.members.find((m) => m.id === id)?.name ?? id;

/** Deterministic initial state: hidden at t=0 of the timeline (re-applied on rewind). */
export const hide = (tl: gsap.core.Timeline, targets: gsap.TweenTarget, extra: gsap.TweenVars = {}) =>
  tl.fromTo(targets, { opacity: 0, ...extra }, { opacity: 0, ...extra, duration: 0.001 }, 0);

export const $ = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  root.querySelector(sel) as T;
export const $$ = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  Array.from(root.querySelectorAll(sel)) as T[];
