import type { SlideDef } from '../lib/slide';
import { titleSlide } from './01-title';
import { problemSlide } from './02-problem';
import { naiveSlide } from './03-naive';
import { mechanismSlide } from './04-mechanism';
import { assumptionSlide } from './05-assumption';
import { planSlide } from './06-plan';
import { demoSlide } from './07-demo';
import { teamSlide } from './08-team';
import { targetsSlide } from './09-targets';
import { referencesSlide } from './10-references';

/** Presentation order. Notes keys and the speaking split must match these ids. */
export const slides: SlideDef[] = [
  titleSlide, problemSlide, naiveSlide, mechanismSlide, assumptionSlide,
  planSlide, demoSlide, teamSlide, targetsSlide, referencesSlide,
];
