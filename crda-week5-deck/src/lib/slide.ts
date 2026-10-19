import { team } from '../config/deck.config';
import { notes } from '../content/notes';
import { memberName } from './util';

export interface SlideDef {
  /** Matches keys in notes.ts and the speaking split in deck.config.ts. */
  id: keyof typeof notes;
  /** Number of click-steps after the intro animation (rendered as hidden Reveal fragments). */
  steps: number;
  /** Inner HTML of the slide (without frame chrome). */
  html: () => string;
  /** Source label shown bottom-left; empty for none. */
  source?: string;
  /**
   * Build a PAUSED timeline with labels s0..s{steps}. `s0` marks the end of
   * the intro; `sK` the end of click-step K. Called once at start-up, so
   * elements are never duplicated on re-entry.
   */
  build?: (root: HTMLElement) => gsap.core.Timeline;
  /** Extra class on the <section>. */
  className?: string;
}

const presenterLine = (id: string) => {
  const ids = team.speaking[id] ?? [];
  return ids.map((m) => memberName(m)).join(' · ');
};

const renderNotes = (id: keyof typeof notes) => {
  const n = notes[id];
  const speakers = (team.speaking[id] ?? []).map(memberName).join(' + ');
  const body = n.lines
    .map((l) => l.replace(/\{([ABC])\}/g, (_, m) => memberName(m)))
    .map((l) => (l.startsWith('[') ? `<p><strong>${l}</strong></p>` : `<p>${l}</p>`))
    .join('');
  return `<aside class="notes"><p><strong>${n.title} · target ${n.seconds}s · ${speakers}</strong></p>${body}</aside>`;
};

export function renderSlide(def: SlideDef, index: number, total: number): string {
  const markers = Array.from(
    { length: def.steps },
    (_, k) => `<span class="fragment step-marker" data-step="${k + 1}" aria-hidden="true"></span>`,
  ).join('');
  return `
  <section data-slide-id="${def.id}" class="${def.className ?? ''}">
    <div class="frame">
      ${def.html()}
      <footer class="chrome">
        <span class="chrome-source">${def.source ?? ''}</span>
        <span class="chrome-right">
          <span class="chrome-presenter">${presenterLine(def.id)}</span>
          <span class="chrome-num">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
        </span>
      </footer>
    </div>
    ${markers}
    ${renderNotes(def.id)}
  </section>`;
}
