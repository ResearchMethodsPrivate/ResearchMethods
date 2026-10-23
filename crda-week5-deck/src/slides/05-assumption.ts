import { gsap } from 'gsap';
import type { SlideDef } from '../lib/slide';
import { $, $$, hide, tex } from '../lib/util';

type Node = { id: string; x: number; y: number; label: string; cls?: string };
const node = (n: Node) => `
  <g class="dag-node ${n.cls ?? ''}" data-id="${n.id}">
    <circle cx="${n.x}" cy="${n.y}" r="34" />
    <text x="${n.x}" y="${n.y + 10}" text-anchor="middle">${n.label}</text>
  </g>`;
const edge = (a: Node, b: Node, cls = '') => {
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const r = 40;
  return `<line class="dag-edge ${cls}" x1="${a.x + r * Math.cos(ang)}" y1="${a.y + r * Math.sin(ang)}" x2="${b.x - (r + 6) * Math.cos(ang)}" y2="${b.y - (r + 6) * Math.sin(ang)}" ${cls.includes('dep') ? '' : 'marker-end="url(#dag-arr)"'} />`;
};

const XR: Node = { id: 'xr', x: 70, y: 70, label: 'X<tspan baseline-shift="sub" font-size="18">R</tspan>' };
const XP: Node = { id: 'xp', x: 70, y: 250, label: 'X<tspan baseline-shift="sub" font-size="18">P</tspan>' };
const Y: Node = { id: 'y', x: 300, y: 160, label: 'Y' };
const Z: Node = { id: 'z', x: 300, y: 30, label: 'Z', cls: 'node-z' };
const U: Node = { id: 'u', x: 170, y: 300, label: 'U', cls: 'node-u' };

const dagA = `
  ${edge(XR, Y)}${edge(XP, Y)}${edge(Z, Y)}${edge(XR, Z, 'dep dep-ok')}
  ${[XR, XP, Y, Z].map(node).join('')}`;
const dagB = `
  ${edge(XR, Y)}${edge(XP, Y)}${edge(Z, Y)}${edge(U, XP, 'edge-u')}${edge(U, Y, 'edge-u')}${edge(XP, Z, 'dep dep-bad')}
  ${[XR, XP, Y, Z, U].map(node).join('')}`;

const features = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'];
const pcDrop = ['F2', 'F5'];
const corrDrop = ['F7'];

export const assumptionSlide: SlideDef = {
  id: 'assumption',
  steps: 4,
  source: 'Mohebbi et al. (2026): Assumption 3.1, Fig. 1 (adapted), §3.3, §6 · PC: Spirtes et al. (2000) · final test: Wilcoxon (1945)',
  html: () => `
    <header class="slide-head">
      <p class="kicker">04 — What must be true</p>
      <h2>It only works if the noise ignores the number we nudge</h2>
    </header>
    <div class="assume-bar">
      <div class="assume-eq">${tex('P(Z \\mid X_P, X_R) \\;=\\; P(Z \\mid X_R)', true)}</div>
      <p class="assume-gloss">In plain words: once we know the other inputs, the noise tells us nothing about the number we nudge.
        <span class="chip chip-amber">1 · An assumption — not a guarantee</span></p>
    </div>
    <div class="assume-grid">
      <div class="dags">
        <svg class="dag-defs" width="0" height="0" aria-hidden="true"><defs>
          <marker id="dag-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--ink-dim)" /></marker>
        </defs></svg>
        <figure class="dag dag-a">
          <svg viewBox="-10 -20 380 360" aria-label="Causal diagram where the assumption holds">${dagA}</svg>
          <figcaption><span class="ok">✓ Fine:</span> the number affects the result, not the noise.</figcaption>
        </figure>
        <figure class="dag dag-b">
          <svg viewBox="-10 -20 380 360" aria-label="Causal diagram where a hidden confounder U breaks the assumption">${dagB}</svg>
          <figcaption><span class="bad">✗ Broken:</span> a hidden factor affects both, so the noise moves when we nudge.</figcaption>
        </figure>
        <p class="dag-legend"><span>→ affects</span><span class="lg-ok">┈ link that is allowed</span><span class="lg-bad">━ link that breaks the rule</span></p>
        <p class="dag-legend dag-key"><span>X<sub>P</sub> number we nudge</span><span>X<sub>R</sub> other inputs</span><span>Y result</span><span>Z noise</span><span>U hidden factor</span><span class="lg-src">after Fig. 1 of the paper</span></p>
      </div>
      <div class="screen">
        <p class="tier">2 · Two rough checks to pick safe numbers</p>
        <div class="feat-row">${features.map((f) => `<span class="feat" data-f="${f}">${f}</span>`).join('')}<span class="feat-note">illustration: example inputs</span></div>
        <div class="screen-step s-pc"><span class="screen-k">Check 1 (PC)</span> drop inputs that seem linked to the noise</div>
        <div class="screen-step s-corr"><span class="screen-k">Check 2</span> drop inputs that move together with the noise</div>
        <div class="screen-out">what is left → safe to nudge</div>
        <div class="gate">
          <p class="gate-h">3 · A final test</p>
          <p>10 test rounds, with and without the extra rows</p>
          <p class="gate-rule"><span class="ok">clearly better (p &lt; 0.05) → use CRDA</span><span class="bad">otherwise → keep the plain model</span></p>
          <p class="gate-note">p &lt; 0.05 means under a 5% chance it’s luck. Evidence, not a guarantee.</p>
        </div>
      </div>
    </div>
    <div class="fail-strip">
      <span><strong>A weak starting model spoils the noise estimates,</strong> so the method can fail.</span>
      <span><strong>The two checks are rough guesses:</strong> they can miss hidden factors and curved links.</span>
    </div>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    const feat = (ids: string[]) => ids.map((f) => $(root, `.feat[data-f="${f}"]`));
    hide(tl, [$(root, '.dag-a'), $(root, '.dag-b'), ...$$(root, '.dag-legend')], { y: 20 });
    hide(tl, [$(root, '.tier'), $(root, '.feat-row'), $(root, '.s-pc'), $(root, '.s-corr'), $(root, '.screen-out'), $(root, '.gate'), $(root, '.fail-strip')], { y: 14 });
    tl.fromTo($(root, '.assume-eq'), { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' })
      .fromTo($(root, '.assume-gloss'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3')
      .addLabel('s0')
      // Step 1 — diagram (a)
      .to([$(root, '.dag-a'), ...$$(root, '.dag-legend')], { opacity: 1, y: 0, duration: 0.5 })
      .fromTo($$(root, '.dag-a .dag-edge:not(.dep-ok)'), { drawSVG: '0%', opacity: 0 }, { drawSVG: '100%', opacity: 1, stagger: 0.12, duration: 0.5 }, '<0.1')
      // dotted "allowed dependence" edge fades in: DrawSVG would overwrite its dash pattern
      .fromTo($(root, '.dag-a .dep-ok'), { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .addLabel('s1')
      // Step 2 — diagram (b): U appears and the X_P–Z dependency lights up
      .to($(root, '.dag-b'), { opacity: 1, y: 0, duration: 0.5 })
      .fromTo($$(root, '.dag-b .dag-edge:not(.edge-u):not(.dep-bad)'), { drawSVG: '0%', opacity: 0 }, { drawSVG: '100%', opacity: 1, stagger: 0.1, duration: 0.4 }, '<0.1')
      .fromTo($(root, '.dag-b .node-u'), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' })
      .fromTo($$(root, '.dag-b .edge-u'), { drawSVG: '0%', opacity: 0 }, { drawSVG: '100%', opacity: 1, stagger: 0.15, duration: 0.5 })
      .fromTo($(root, '.dep-bad'), { drawSVG: '0%', opacity: 0 }, { drawSVG: '100%', opacity: 1, duration: 0.6 })
      .addLabel('s2')
      // Step 3 — screening funnel (illustrative chips)
      .to([$(root, '.tier'), $(root, '.feat-row')], { opacity: 1, y: 0, duration: 0.4 })
      .to($(root, '.s-pc'), { opacity: 1, y: 0, duration: 0.4 })
      .to(feat(pcDrop), { opacity: 0.18, textDecoration: 'line-through', duration: 0.4 })
      .to($(root, '.s-corr'), { opacity: 1, y: 0, duration: 0.4 })
      .to(feat(corrDrop), { opacity: 0.18, textDecoration: 'line-through', duration: 0.4 })
      .to($(root, '.screen-out'), { opacity: 1, y: 0, duration: 0.4 })
      .to(feat(features.filter((f) => !pcDrop.includes(f) && !corrDrop.includes(f))),
        { borderColor: 'rgba(167,139,250,0.95)', color: 'var(--violet)', duration: 0.4 }, '<')
      .addLabel('s3')
      // Step 4 — Wilcoxon gate + caveats
      .to($(root, '.gate'), { opacity: 1, y: 0, duration: 0.5 })
      .to($(root, '.fail-strip'), { opacity: 1, y: 0, duration: 0.5 }, '+=0.2')
      .addLabel('s4');
    return tl;
  },
};
