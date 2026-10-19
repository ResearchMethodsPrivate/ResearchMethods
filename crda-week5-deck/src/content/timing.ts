/**
 * Live-timing MODEL (not a rehearsal). Adds to the spoken-word estimate the
 * time the deck itself takes: slide transitions, clicks, speaker handoffs and
 * the part of each animation a presenter waits through.
 *
 * Motion durations come from motion.json, which `npm run qa:visual` writes
 * after measuring every GSAP timeline in a real browser. Only a stopwatch
 * rehearsal by the three presenters can confirm the total.
 */
import { speaking } from '../config/deck.config';
import motion from './motion.json';
import { notes, spokenWords, WORDS_PER_MINUTE, type SlideNotes } from './notes';

export const TIMING = {
  wpm: WORDS_PER_MINUTE,
  transition: 1.0, // Reveal fade + settling, per slide
  click: 0.6, // finding the clicker / pausing, per step
  handoff: 2.5, // when the speaker changes from the previous slide
  /** Share of the intro animation a presenter waits through before speaking. */
  introWait: 0.6,
  /** Share of each click-step animation a presenter waits through (they usually talk over it). */
  stepWait: 0.35,
};

type Motion = Record<string, { intro: number; steps: number[] }>;
const measured = motion as Motion;

export interface SlideTiming {
  id: string;
  title: string;
  target: number;
  speech: number;
  overhead: number;
  live: number;
  words: number;
  motionMeasured: boolean;
}

export function slideTimings(): SlideTiming[] {
  const ids = Object.keys(notes);
  return ids.map((id, i) => {
    const n = (notes as Record<string, SlideNotes>)[id];
    const words = spokenWords(n);
    const speech = (words / TIMING.wpm) * 60;
    const clicks = n.lines.filter((l) => /^\[Click/.test(l)).length;
    const prev = i > 0 ? speaking[ids[i - 1]]?.join() : undefined;
    const handoffs = i > 0 && prev !== speaking[id]?.join() ? 1 : 0;
    // The team slide passes the word twice more inside the slide.
    const inner = id === 'team' ? Math.max(0, (speaking[id]?.length ?? 1) - 1) : 0;
    const m = measured[id];
    const motionWait = m ? m.intro * TIMING.introWait + m.steps.reduce((a, b) => a + b, 0) * TIMING.stepWait : 0;
    const overhead = TIMING.transition + clicks * TIMING.click + (handoffs + inner) * TIMING.handoff + motionWait;
    return { id, title: n.title, target: n.seconds, speech, overhead, live: speech + overhead, words, motionMeasured: Boolean(m) };
  });
}

export const fmt = (s: number) => {
  const t = Math.round(s);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};
