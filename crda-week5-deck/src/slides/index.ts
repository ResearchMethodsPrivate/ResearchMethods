import type { SlideDef } from '../lib/slide';
import { titleSlide } from './01-title';
import { problemSlide } from './02-problem';
import { naiveSlide } from './03-naive';
import { mechanismSlide } from './04-mechanism';
import { assumptionSlide } from './05-assumption';
import { planSlide } from './06-plan';
import { teamSlide } from './07-team';
import { targetsSlide } from './08-targets';
import { referencesSlide } from './09-references';

/** Presentation order. Notes keys and the speaking split must match these ids. */
export const slides: SlideDef[] = [
  titleSlide, problemSlide, naiveSlide, mechanismSlide, assumptionSlide,
  planSlide, teamSlide, targetsSlide, referencesSlide,
];
