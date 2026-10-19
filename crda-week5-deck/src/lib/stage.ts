import type Reveal from 'reveal.js';

/**
 * Binds one paused GSAP timeline per slide to Reveal's navigation.
 *
 *  - Entering a slide forwards plays its intro (0 → s0).
 *  - Each hidden fragment = one click-step; showing/hiding it tweens to sK / s(K-1).
 *  - Arriving backwards, via overview or a deep link snaps to the exact state
 *    Reveal shows (all fragments visible), so nothing is replayed or duplicated.
 *  - Reduced motion / print: always snap, never tween.
 *  - `R` replays the current slide from the top to the current step.
 */
export class Stage {
  private timelines = new Map<HTMLElement, gsap.core.Timeline>();
  private active: gsap.core.Tween | null = null;
  private lastH = -1;

  constructor(
    private deck: Reveal.Api,
    private reduced: boolean,
  ) {}

  register(section: HTMLElement, tl: gsap.core.Timeline) {
    tl.pause(0);
    this.timelines.set(section, tl);
  }

  /** Put every slide in its final state (print / PDF export). */
  finishAll() {
    this.timelines.forEach((tl) => tl.progress(1).pause());
  }

  bind() {
    this.deck.on('ready', () => this.onSlide());
    this.deck.on('slidechanged', () => this.onSlide());
    this.deck.on('fragmentshown', (e) => this.onFragment(e as unknown as { fragment: HTMLElement }, true));
    this.deck.on('fragmenthidden', (e) => this.onFragment(e as unknown as { fragment: HTMLElement }, false));
    this.deck.on('overviewhidden', () => this.snap());
  }

  replay() {
    const tl = this.current();
    if (!tl) return;
    this.kill();
    tl.pause(0);
    const at = tl.labels[`s${this.step()}`] ?? tl.duration();
    if (this.reduced) tl.pause(at);
    else this.active = tl.tweenTo(at, { ease: 'none', duration: at / 1.6 });
  }

  /** QA/debug (read-only): where the current slide's timeline is, and where it should settle. */
  debugState() {
    const tl = this.current();
    const step = this.step();
    return {
      step,
      time: tl?.time() ?? null,
      target: tl ? (tl.labels[`s${step}`] ?? tl.duration()) : null,
      labels: tl ? { ...tl.labels } : {},
      duration: tl?.duration() ?? 0,
      animating: Boolean(this.active?.isActive()),
    };
  }

  /** QA only: freeze the current slide's timeline at an exact time to capture intermediate frames. */
  seek(time: number) {
    const tl = this.current();
    if (!tl) return;
    this.kill();
    tl.pause(time);
  }

  private current() {
    return this.timelines.get(this.deck.getCurrentSlide() as HTMLElement);
  }

  /** Current step = number of visible step-markers. */
  private step() {
    const f = this.deck.getIndices().f;
    return f === undefined || f < 0 ? 0 : f + 1;
  }

  private kill() {
    this.active?.kill();
    this.active = null;
  }

  private goTo(tl: gsap.core.Timeline, step: number, animate: boolean) {
    const label = `s${step}`;
    const at = tl.labels[label] ?? tl.duration();
    this.kill();
    // Forward plays at authored speed; stepping back rewinds quickly.
    const back = at < tl.time();
    if (animate) this.active = tl.tweenTo(at, back ? { ease: 'power1.out', duration: 0.6 } : { ease: 'none' });
    else tl.pause(at);
  }

  private onSlide() {
    const h = this.deck.getIndices().h;
    const forward = h > this.lastH;
    this.lastH = h;
    // Park every other timeline so nothing runs off-screen.
    this.timelines.forEach((tl, s) => s !== this.deck.getCurrentSlide() && tl.pause());
    const tl = this.current();
    if (!tl) return;
    const step = this.step();
    if (forward && step === 0 && !this.reduced) {
      tl.pause(0);
      this.goTo(tl, 0, true);
    } else {
      this.goTo(tl, step, false);
    }
  }

  private onFragment(e: { fragment: HTMLElement }, shown: boolean) {
    const tl = this.current();
    if (!tl || !e.fragment.classList.contains('step-marker')) return;
    // Reveal may show/hide several fragments in one event, so trust its index.
    const target = this.step();
    // If the intro is still running when the first click lands, finish it first.
    const prev = tl.labels[`s${target - 1}`];
    if (shown && prev !== undefined && tl.time() < prev) tl.pause(prev);
    this.goTo(tl, target, !this.reduced);
  }

  private snap() {
    const tl = this.current();
    if (tl) this.goTo(tl, this.step(), false);
  }
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  new URLSearchParams(location.search).has('static');
