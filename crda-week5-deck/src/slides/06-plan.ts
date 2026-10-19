import { gsap } from 'gsap';
import { scaleLinear } from 'd3-scale';
import { scope } from '../config/deck.config';
import { auditQuestions, datasets, paper } from '../content/paper';
import type { SlideDef } from '../lib/slide';
import { $, $$, countUp, hide, ph } from '../lib/util';

const scoped = scope.datasets.map((k) => datasets[k]);
const dsNames = scoped.map((d) => d.label).join(' + ');

const plan = [
  ['Install & audit', 'authors’ repo, Python 3.11, pinned <code>requirements.txt</code>'],
  ['Run the demo', '<code>demo/demonstration.ipynb</code> — Energy Efficiency'],
  ['Narrow the scope', `${dsNames} · ${scope.models.join(' & ')}`],
  ['Controlled comparison', `unaugmented vs CRDA on identical splits & seeds (${ph(scope.seeds)})`],
  ['Compare with published', 'our ΔMSE next to Table 1, matching their protocol'],
  ['Document', 'differences, obstacles, versions, runtimes'],
];

// Bars: Table 1 row at each dataset's largest training-subset size.
const rows = scoped.map((d) => {
  const [n, xgb, mlp] = d.table1[d.table1.length - 1];
  return { label: d.label, n, xgb, mlp };
});
const BW = 640, rowH = 120;
const bx = scaleLinear().domain([0, 50]).range([0, BW - 250]);

export const planSlide: SlideDef = {
  id: 'plan',
  steps: 2,
  source: 'Reported: Mohebbi et al. (2026), abstract & Table 1 · Audit: our reading of repo configs + src/experiment.py',
  html: () => `
    <header class="slide-head">
      <p class="kicker">05 — What we will replicate</p>
      <h2>A focused, checkable reproduction — not a re-invention</h2>
    </header>
    <div class="split split-55 plan-grid">
      <div class="col">
        <ol class="plan-list">
          ${plan.map(([h, d], i) => `<li><span class="plan-k">${i + 1}</span><div><p class="plan-h">${h}</p><p class="plan-d">${d}</p></div></li>`).join('')}
        </ol>
        <p class="stamp">Proposed targets — not completed work · <span>${scope.status}</span></p>
      </div>
      <aside class="reported">
        <p class="reported-h">Reported by the original paper — <strong>not yet replicated by our group</strong></p>
        <div class="big-nums">
          <div><span class="big" data-to="${paper.headline.mlp}">${paper.headline.mlp}%</span><span class="big-l">MLP</span></div>
          <div><span class="big big-x" data-to="${paper.headline.xgb}">${paper.headline.xgb}%</span><span class="big-l">XGBoost</span></div>
        </div>
        <p class="big-cap">average test-MSE change across 9 benchmark datasets</p>
        <svg class="bars" viewBox="0 0 ${BW} ${rows.length * rowH + 10}" role="img" aria-label="Paper Table 1 MSE changes for our chosen datasets">
          ${rows.map((r, i) => `
            <g transform="translate(0 ${i * rowH})">
              <text class="bar-ds" x="0" y="26">${r.label} <tspan class="bar-n">n = ${r.n}</tspan></text>
              <rect class="bar bar-mlp" x="250" y="40" height="28" width="${bx(-r.mlp)}" rx="4" />
              <text class="bar-v" x="${250 + bx(-r.mlp) + 12}" y="63">${r.mlp.toFixed(1)}% MLP</text>
              <rect class="bar bar-xgb" x="250" y="76" height="28" width="${bx(-r.xgb)}" rx="4" />
              <text class="bar-v" x="${250 + bx(-r.xgb) + 12}" y="99">${r.xgb.toFixed(1)}% XGB</text>
            </g>`).join('')}
        </svg>
        <p class="bar-cap">Our comparison targets: Table 1, mean of 15 seeds, largest subset size</p>
      </aside>
    </div>
    <div class="audit">
      <p class="audit-h">Questions from reading the code — to verify, not conclusions</p>
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
    tl.fromTo($$(root, '.bar'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' }, '-=0.6')
      .fromTo($$(root, '.bar-v'), { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.3 }, '-=0.4')
      .addLabel('s1')
      .to($(root, '.audit'), { opacity: 1, y: 0, duration: 0.5 })
      .addLabel('s2');
    return tl;
  },
};
