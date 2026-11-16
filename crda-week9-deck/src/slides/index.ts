import type { SlideDef } from '../lib/slide';
import { titleSlide } from './01-title';
import { progressSlide } from './02-progress';
import { methodSlide } from './03-method';
import { resultsSlide } from './04-results';
import { matchedSlide } from './05-matched';
import { safetySlide } from './06-safety';
import { nextSlide } from './07-next';
import { referencesSlide } from './08-references';

/** Presentation order. Notes keys and the speaking split must match these ids. */
export const slides: SlideDef[] = [
  titleSlide, progressSlide, methodSlide, resultsSlide, matchedSlide, safetySlide, nextSlide, referencesSlide,
];
