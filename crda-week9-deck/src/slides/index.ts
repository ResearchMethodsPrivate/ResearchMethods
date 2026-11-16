import type { SlideDef } from '../lib/slide';
import { titleSlide } from './01-title';
import { progressSlide } from './02-progress';
import { methodSlide } from './03-method';
import { resultsSlide } from './04-results';
import { matchedSlide } from './05-matched';
import { safetySlide } from './06-safety';
import { averagingSlide } from './07-averaging';
import { nextSlide } from './08-next';
import { referencesSlide } from './09-references';

/** Presentation order. Notes keys and the speaking split must match these ids. */
export const slides: SlideDef[] = [
  titleSlide, progressSlide, methodSlide, resultsSlide, matchedSlide, safetySlide, averagingSlide, nextSlide, referencesSlide,
];
