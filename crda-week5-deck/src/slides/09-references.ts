import { gsap } from 'gsap';
import { references } from '../content/references';
import type { SlideDef } from '../lib/slide';
import { $$ } from '../lib/util';

const link = (s: string) => s.replace(/https:\/\/[^\s<]+[^\s<.,)]/g, (u) => `<a href="${u}">${u}</a>`);

export const referencesSlide: SlideDef = {
  id: 'references',
  steps: 0,
  className: 'slide-refs',
  source: 'All URLs checked 19 October 2026',
  html: () => `
    <header class="slide-head">
      <p class="kicker">References</p>
      <h2>Sources</h2>
    </header>
    <ol class="refs">${references.map((r) => `<li>${link(r)}</li>`).join('')}</ol>`,
  build: (root) =>
    gsap.timeline({ paused: true })
      .fromTo($$(root, '.refs li'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.4 })
      .addLabel('s0'),
};
