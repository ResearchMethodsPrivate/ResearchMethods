import type { SlideDef } from '../lib/slide';
import { ethicsSlide, referencesSlide, rolesSlide, verdictSlide } from './closing';
import { backgroundSlide, methodSlide, questionSlide, titleSlide } from './intro';
import { designSlide, extensionSlide, hypothesesSlide, platformsSlide, replicationSlide, weaknessesSlide } from './results';

/** Title + 12 content slides + references. */
export const slides: SlideDef[] = [
  titleSlide, questionSlide, backgroundSlide, methodSlide,
  hypothesesSlide, designSlide, replicationSlide,
  platformsSlide, extensionSlide, weaknessesSlide,
  ethicsSlide, verdictSlide, rolesSlide, referencesSlide,
];
