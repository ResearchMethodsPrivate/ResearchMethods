import { gsap } from 'gsap';
import { authors, deviations, machines, matchesAuthors, pctChange, pinned, type ModelResult } from '../content/machines';
import type { SlideDef } from '../lib/slide';
import { fmtDelta } from '../lib/delta-bars';
import { $, $$, hide, memberName } from '../lib/util';

const mse = (v: number) => v.toFixed(5);
const secs = (s: number) => (s >= 60 ? `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} s` : `${s} s`);

const result = (r: ModelResult, ref: ModelResult) => {
  const same = matchesAuthors(r, ref);
  const gap = ((r.before - ref.before) / ref.before) * 100;
  const badge = same
    ? '<span class="badge badge-ok">✓ same as the authors’</span>'
    : `<span class="badge badge-diff">different (plain model ${Math.abs(gap).toFixed(1)}% ${gap < 0 ? 'lower' : 'higher'})</span>`;
  return `<div class="dm-res"><p class="dm-mse">${mse(r.before)} <span>→</span> ${mse(r.after)}</p><p class="dm-delta ${same ? '' : 'dm-delta-diff'}">${fmtDelta(pctChange(r))} <span>p = ${r.p.toFixed(r.p < 0.01 ? 5 : 3)}</span></p>${badge}</div>`;
};

export const demoSlide: SlideDef = {
  id: 'demo',
  steps: machines.length + 1,
  className: 'slide-demo',
  source: 'Our runs of the authors’ demo, 22 Oct 2026 (docs/demo-reports/) · authors’ numbers from their saved output',
  html: () => `
    <header class="slide-head">
      <p class="kicker">06 — Our first check</p>
      <h2>The authors’ demo runs on all three of our laptops</h2>
      <p class="head-chip"><span class="chip chip-amber">One run · one dataset · not the paper’s main results</span><span class="dm-key-inline">Each box: error before → after · −51.7% means the error roughly halves · p = chance the gain is just luck (under 0.05 passes)</span></p>
    </header>
    <div class="dm" role="table" aria-label="Authors’ demo results on each presenter’s laptop">
      <div class="dm-row dm-head" role="row">
        <span role="columnheader">Laptop</span><span role="columnheader">Run time</span><span role="columnheader">Neural network (MLP)</span><span role="columnheader">XGBoost</span>
      </div>
      <div class="dm-row dm-ref" role="row">
        <div class="dm-who"><p class="dm-name">Authors’ own saved result</p><p class="dm-hw">from their demo</p></div>
        <span class="dm-time">—</span>
        <div class="dm-res"><p class="dm-mse">${mse(authors.mlp.before)} <span>→</span> ${mse(authors.mlp.after)}</p><p class="dm-delta">${fmtDelta(pctChange(authors.mlp))} <span>p = ${authors.mlp.p.toFixed(5)}</span></p></div>
        <div class="dm-res"><p class="dm-mse">${mse(authors.xgb.before)} <span>→</span> ${mse(authors.xgb.after)}</p><p class="dm-delta">${fmtDelta(pctChange(authors.xgb))} <span>p = ${authors.xgb.p.toFixed(3)}</span></p></div>
      </div>
      ${machines.map((m) => `
      <div class="dm-row dm-m" role="row">
        <div class="dm-who">
          <p class="dm-name">${memberName(m.owner)} <span class="dm-chip">${m.label}</span></p>
          <p class="dm-hw">${m.cpu} · ${m.ram} memory</p>
          <p class="dm-hw dm-gpu">Graphics: ${m.gpu}, not used</p>
          <p class="dm-hw">${m.os} · Python ${m.python}</p>
        </div>
        <span class="dm-time">${secs(m.seconds)}</span>
        ${result(m.mlp, authors.mlp)}${result(m.xgb, authors.xgb)}
      </div>`).join('')}
    </div>
    <div class="dm-foot">
      <p class="dm-pins"><span class="lbl">Same library versions on all three</span>torch ${pinned.torch} · scikit-learn ${pinned.scikitLearn} · xgboost ${pinned.xgboost} · numpy ${pinned.numpy}</p>
      <div class="dm-dev"><span class="lbl">Problems we hit</span><ul>${deviations.map((d) => `<li>${d}</li>`).join('')}</ul></div>
    </div>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    const rows = $$(root, '.dm-m');
    hide(tl, rows, { y: 22 });
    hide(tl, $(root, '.dm-foot'), { y: 18 });
    tl.fromTo($$(root, '.dm-head, .dm-ref'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.5, ease: 'power2.out' })
      .fromTo($(root, '.head-chip'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.2)
      .addLabel('s0');
    rows.forEach((row, i) => {
      tl.to(row, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' })
        .fromTo($$(row, '.badge'), { opacity: 0, scale: 0.9, transformOrigin: '0% 50%' }, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.1 }, '-=0.15')
        .addLabel(`s${i + 1}`);
    });
    tl.to($(root, '.dm-foot'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }).addLabel(`s${machines.length + 1}`);
    return tl;
  },
};
