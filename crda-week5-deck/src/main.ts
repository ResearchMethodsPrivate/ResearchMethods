import Reveal from 'reveal.js';
import Notes from 'reveal.js/plugin/notes/notes.esm.js';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

import 'reveal.js/dist/reveal.css';
import 'katex/dist/katex.min.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/jetbrains-mono';
import './styles/tokens.css';
import './styles/base.css';
import './styles/slides.css';
import './styles/slides-2.css';

import { renderSlide, type SlideDef } from './lib/slide';
import { Stage, prefersReducedMotion } from './lib/stage';
import { titleSlide } from './slides/01-title';
import { problemSlide } from './slides/02-problem';
import { naiveSlide } from './slides/03-naive';
import { mechanismSlide } from './slides/04-mechanism';
import { assumptionSlide } from './slides/05-assumption';
import { planSlide } from './slides/06-plan';
import { teamSlide } from './slides/07-team';
import { targetsSlide } from './slides/08-targets';
import { referencesSlide } from './slides/09-references';

gsap.registerPlugin(DrawSVGPlugin);

const slides: SlideDef[] = [
  titleSlide, problemSlide, naiveSlide, mechanismSlide, assumptionSlide,
  planSlide, teamSlide, targetsSlide, referencesSlide,
];

const container = document.getElementById('slides')!;
container.innerHTML = slides.map((s, i) => renderSlide(s, i, slides.length)).join('');

const printing = /print-pdf/i.test(location.search);
const reduced = prefersReducedMotion() || printing;
if (reduced) document.documentElement.classList.add('reduced-motion');

const deck = new Reveal({
  width: 1920,
  height: 1080,
  margin: 0,
  minScale: 0.1,
  maxScale: 3,
  hash: true,
  controls: true,
  controlsTutorial: false,
  progress: true,
  slideNumber: false, // our own discreet number lives in the footer chrome
  center: false,
  transition: reduced ? 'none' : 'fade',
  transitionSpeed: 'default',
  backgroundTransition: 'none',
  viewDistance: 20, // keep every slide laid out so SVG lengths can be measured
  pdfSeparateFragments: false,
  showNotes: false,
  plugins: [Notes],
});

const stage = new Stage(deck, reduced);
const sections = Array.from(container.querySelectorAll<HTMLElement>(':scope > section'));
stage.bind();

deck.initialize().then(() => {
  // Timelines are built after layout so DrawSVG can measure path lengths.
  sections.forEach((section, i) => {
    const tl = slides[i].build?.(section);
    if (tl) stage.register(section, tl);
  });
  deck.addKeyBinding({ keyCode: 82, key: 'R', description: 'Replay slide animation' }, () => stage.replay());
  if (printing) stage.finishAll();
  else stage.replay();
});

// Expose for debugging / screenshots.
(window as unknown as { deck: Reveal.Api }).deck = deck;
