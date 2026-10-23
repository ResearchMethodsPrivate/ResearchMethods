import { gsap } from 'gsap';
import { scope } from '../config/deck.config';
import { auditQuestions, datasets, paper } from '../content/paper';
import type { SlideDef } from '../lib/slide';
import { bar, fmtDelta, signedScale } from '../lib/delta-bars';
import { $, $$, countUp, hide } from '../lib/util';

const scoped = scope.datasets.map((k) => datasets[k]);
const dsNames = scoped.map((d) => d.label).join(' and ');
const scopeTag = scope.status === 'confirmed' ? '' : ' <span class="tag-proposed">proposed</span>';

const plan: [string, string, boolean?][] = [
  ['Set up the authors’ code', 'Python 3.11 and the exact library versions they list', true],
  ['Run their demo', 'on all three of our laptops', true],
  [`Pick two small datasets${scopeTag}`, `${dsNames}, with two models (a neural network and XGBoost)`],
  ['Compare plain vs CRDA', `same data splits each time; ${scope.seeds} runs at first (the paper uses ${scope.paperSeeds})`],
  ['Compare with the paper’s table', 'do we see similar improvements?'],
  ['Write down every difference', 'problems, library versions, run times'],
];

// Bars: paper Table 1 row at each dataset's largest training-subset size.
export const planRows = scoped.map((d) => {
  const [n, xgb, mlp] = d.table1[d.table1.length - 1];
  return { label: d.label, n, xgb, mlp };
});
const BW = 640, LABEL_W = 170, rowH = 128;
const sc = signedScale(planRows.flatMap((r) => [r.mlp, r.xgb]), LABEL_W, BW - 10);
const chartH = planRows.length * rowH + 44;

const barRow = (model: 'MLP' | 'XGB', v: number, y: number) => {
  const b = bar(v, sc);
  return `
    <text class="bar-m" x="0" y="${y + 21}">${model === 'XGB' ? 'XGBoost' : 'MLP'}</text>
    <text class="bar-v ${b.improves ? 'v-better' : 'v-worse'}" x="${LABEL_W - 16}" y="${y + 21}" text-anchor="end">${fmtDelta(v)}</text>
    <rect class="bar ${model === 'MLP' ? 'bar-mlp' : 'bar-xgb'}" data-sign="${b.improves ? '-' : '+'}" x="${b.x}" y="${y}" height="28" width="${b.width}" rx="4" />`;
};

export const planSlide: SlideDef = {
  id: 'plan',
  steps: 2,
  source: 'Reported by Mohebbi et al. (2026): abstract and Table 1 · Code questions: authors’ repo (experiments/*/config.json, src/experiment.py)',
  html: () => `
    <header class="slide-head">
      <p class="kicker">05 — Our plan</p>
      <h2>Our plan: check whether the authors’ results hold up</h2>
    </header>
    <div class="split split-55 plan-grid">
      <div class="col">
        <ol class="plan-list">
          ${plan.map(([h, d, done], i) => `<li class="${done ? 'plan-done' : ''}"><span class="plan-k">${done ? '✓' : i + 1}</span><div><p class="plan-h">${h}</p><p class="plan-d">${d}</p></div></li>`).join('')}
        </ol>
        <p class="stamp">Steps 1–2 done · steps 3–6 still to do</p>
      </div>
      <aside class="reported">
        <p class="reported-h">Results reported by the paper’s authors — <strong>not ours yet</strong></p>
        <div class="big-nums">
          <div><span class="big" data-to="${paper.headline.mlp}">${fmtDelta(paper.headline.mlp)}</span><span class="big-l">neural network (MLP)</span></div>
          <div><span class="big big-x" data-to="${paper.headline.xgb}">${fmtDelta(paper.headline.xgb)}</span><span class="big-l">XGBoost</span></div>
        </div>
        <p class="big-cap">average drop in error across 9 datasets</p>
        <svg class="bars" viewBox="0 -4 ${BW} ${chartH}" role="img" aria-label="The paper’s results for our chosen datasets; left of the line means less error">
          <line class="zero" x1="${sc.zeroX}" x2="${sc.zeroX}" y1="0" y2="${chartH - 40}" />
          ${planRows.map((r, i) => `
            <g transform="translate(0 ${i * rowH})">
              <text class="bar-ds" x="0" y="22">${r.label} <tspan class="bar-n">${r.n} rows</tspan></text>
              ${barRow('MLP', r.mlp, 36)}
              ${barRow('XGB', r.xgb, 74)}
            </g>`).join('')}
          <text class="axis-note" x="${sc.zeroX - 10}" y="${chartH - 14}" text-anchor="end">← less error</text>
          <text class="axis-note" x="${sc.zeroX + 10}" y="${chartH - 14}">more error →</text>
        </svg>
        <p class="bar-cap">From the paper’s main table · average of 15 runs · largest data size</p>
      </aside>
    </div>
    <div class="audit">
      <p class="audit-h">Two questions from reading their code (we have not checked them yet)</p>
      <ul>${auditQuestions.map((q) => `<li>${q.replace(/ignore_filter: true/, '<code>ignore_filter: true</code>')}</li>`).join('')}</ul>
    </div>`,
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    hide(tl, [$(root, '.reported'), $(root, '.audit')], { y: 20 });
    hide(tl, $(root, '.stamp'));
    tl.fromTo($$(root, '.plan-list li'), { opacity: 0, x: -24 }, { opacity: 1, x: 0, stagger: 0.12, duration: 0.45, ease: 'power2.out' })
      .to($(root, '.stamp'), { opacity: 1, duration: 0.4 })
      .addLabel('s0')
      .to($(root, '.reported'), { opacity: 1, y: 0, duration: 0.5 });
    $$(root, '.big').forEach((el) => tl.add(countUp(el, Number(el.dataset.to)), '<0.2'));
    // Bars grow out of the zero line in whichever direction their sign points.
    $$(root, '.bar').forEach((el, i) => tl.fromTo(el, { scaleX: 0, transformOrigin: el.dataset.sign === '-' ? '100% 50%' : '0% 50%' },
      { scaleX: 1, duration: 0.7, ease: 'power3.out' }, i === 0 ? '-=0.6' : '<0.1'));
    tl.fromTo($$(root, '.bar-v'), { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.3 }, '-=0.4')
      .addLabel('s1')
      .to($(root, '.audit'), { opacity: 1, y: 0, duration: 0.5 })
      .addLabel('s2');
    return tl;
  },
};
