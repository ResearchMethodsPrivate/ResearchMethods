/** Slides 5–10: hypotheses, design, replication, platforms, extension, weaknesses. */
import { exactRuns, fresh, MODEL, NAMES, plainGap, signed, tally, tallyHolm } from '../content/derive';
import { cite } from '../content/references';
import type { SlideDef } from '../lib/slide';
import { coverage, forest, scatter, scatterKey } from './charts';
import { enter, head, pendingBadge } from './shared';

export const hypothesesSlide: SlideDef = {
  id: 'hypotheses',
  steps: 0,
  source: `results/hypotheses.md · paired Wilcoxon test ${cite('wilcoxon')} over 15 seeds, one-sided · Holm correction ${cite('holm')}`,
  html: () => `
    ${head('04 — Hypotheses', 'What we expected, written down first')}
    <table class="hyp">
      <thead><tr><th></th><th>In each result we expect</th><th>It counts when</th></tr></thead>
      <tbody>
        <tr data-in><td><b>H1</b></td><td>CRDA has lower error than one plain model</td><td>lower on average, p &lt; 0.05</td></tr>
        <tr data-in><td><b>H2</b></td><td>We match the paper</td><td>within 5 percentage points</td></tr>
        <tr data-in><td><b>H3a</b></td><td>Averaging 10 plain models helps by itself</td><td>p &lt; 0.05</td></tr>
        <tr data-in><td><b>H3b</b></td><td>CRDA still beats that average of 10</td><td>p &lt; 0.05</td></tr>
      </tbody>
    </table>
    <p class="takeaway" data-in>Written on 27 November, before the 30 new results. We had already seen 4 results, so those are not counted.</p>`,
  build: enter,
};

export const designSlide: SlideDef = {
  id: 'design',
  steps: 0,
  source: `Authors’ code ${cite('code')}, unchanged · tuning with Optuna ${cite('optuna')} · datasets ${cite('concrete', 'energy', 'house', 'parkinsons', 'pmlb', 'wind', 'wine')}`,
  html: () => `
    ${head('05 — Study design', '34 of the paper’s 90 results')}
    <div class="split design">
      <div>${coverage()}</div>
      <ul class="why">
        <li data-in><b>Their code and settings</b>so any difference is not from our rewriting.</li>
        <li data-in><b>15 random splits per result</b>the same splits as the authors, compared pair by pair.</li>
        <li data-in><b>Two models, with and without CRDA</b>a neural network and XGBoost.</li>
        <li data-in><b>All sizes of two datasets, smallest of seven</b>to cover all nine on laptop time.</li>
        <li data-in><b>Four laptops</b>two Windows, two Mac. Each dataset stays on one.</li>
      </ul>
    </div>`,
  build: enter,
};

export const replicationSlide: SlideDef = {
  id: 'replication',
  steps: 0,
  source: `Paper values: authors’ saved results for Table 1 ${cite('crda', 'code')} · negative = lower error · band = ±5 points`,
  html: () => {
    const h1 = tally('h1'), h2 = tally('h2');
    return `
    ${head('06 — Results', 'Most of the paper’s gains reproduce')}
    <div class="split fig">
      <figure class="plot chart" data-in>${scatter()}<figcaption class="key">${scatterKey()}</figcaption></figure>
      <div class="col">
        <div class="stat" data-in><b>${h2.yes}<i> of ${h2.of}</i></b><p>within 5 points of the paper (H2)</p></div>
        <div class="stat" data-in><b>${h1.yes}<i> of ${h1.of}</i></b><p>CRDA clearly beats one plain model (H1)<br><span>${tallyHolm('h1')} after correcting for many tests</span></p></div>
        ${pendingBadge()}
      </div>
    </div>`;
  },
  build: enter,
};

export const platformsSlide: SlideDef = {
  id: 'platforms',
  steps: 0,
  source: `Per-seed errors compared with the authors’ saved files ${cite('code')} · new results only`,
  html: () => {
    const mac = exactRuns('Mac'), win = exactRuns('Windows');
    const winX = plainGap('Windows', 'xgboost'), winN = plainGap('Windows', 'mlp'), macX = plainGap('Mac', 'xgboost');
    const missed = fresh.filter((c) => !c.h2);
    return `
    ${head('07 — Where it differs', 'A match depends on the laptop')}
    <div class="cards two">
      <div class="panel" data-in><p class="tag">Mac</p><p class="big">${mac.yes}<i> of ${mac.of}</i></p><p>results give the authors’ CRDA errors <b>exactly</b>, on all 15 splits.</p></div>
      <div class="panel" data-in><p class="tag">Windows</p><p class="big">${win.yes}<i> of ${win.of}</i></p><p>results are exactly the same. They are close, not identical.</p></div>
    </div>
    <ul class="points">
      <li data-in>So many Mac matches show the code <b>repeats</b> on similar hardware. They are weaker proof than an independent match.</li>
      <li data-in>Without CRDA: the neural network is exact in ${winN.exact} of ${winN.of} Windows results; XGBoost in ${winX.exact} of ${winX.of} (Mac: ${macX.exact} of ${macX.of}). We do not know why.</li>
      ${missed.map((c) => `<li data-in>Outside 5 points: ${NAMES[c.dataset]}, ${c.rows} rows, ${MODEL[c.model]}: ours ${signed(c.change)}, paper ${signed(c.paperChange)}.</li>`).join('')}
    </ul>
    ${pendingBadge()}`;
  },
  build: enter,
};

export const extensionSlide: SlideDef = {
  id: 'extension',
  steps: 0,
  source: `Our extension: results/scripts/run_plain_ensemble.py · filled mark = clearly better (p < 0.05) · change in error vs the 10-model average`,
  html: () => {
    const a = tally('h3a'), n = tally('h3b', 'mlp'), x = tally('h3b', 'xgboost');
    return `
    ${head('08 — Going further: a like-for-like test', 'CRDA gets 10 models. So we gave the plain model 10.')}
    <div class="cards two forests">
      <div data-in><h3>Neural network: clearly better in ${n.yes} of ${n.of}</h3><figure class="plot chart">${forest('mlp')}</figure></div>
      <div data-in><h3>XGBoost: clearly better in ${x.yes} of ${x.of}</h3><figure class="plot chart">${forest('xgboost')}</figure></div>
    </div>
    <p class="takeaway" data-in>Averaging alone already helps in <strong>${a.yes} of ${a.of}</strong> results (H3a; ${tallyHolm('h3a')} after correction).</p>
    ${pendingBadge()}`;
  },
  build: enter,
};

export const weaknessesSlide: SlideDef = {
  id: 'weaknesses',
  steps: 0,
  source: `Paper §5.1 and appendix; Table 1 caption ${cite('crda')} · code: src/experiment.py ${cite('code')} · full list: results/atul/problem_log.md`,
  html: () => {
    const mac = exactRuns('Mac');
    return `
    ${head('09 — Weaknesses we found', 'Four things a reader should know')}
    <div class="cards two weak">
      <div class="panel" data-in><h3>1 · Unequal comparison</h3><p>The code scores CRDA as an average of 10 models, but plain as one model. The paper describes one retrained model.</p><p class="so">Effect: part of the gain is averaging. Tested.</p></div>
      <div class="panel" data-in><h3>2 · A tuned setting is dropped</h3><p>The weight for new rows is tuned, then not passed to the 10 scoring models. We found no mention of it in the paper.</p><p class="so">Effect: unknown. Found by reading code.</p></div>
      <div class="panel" data-in><h3>3 · Safety check compares unlike groups</h3><p>Real and new rows are mixed across its folds, so a copy can be tested while its original trains.</p><p class="so">Effect: likely favours CRDA. Not tested.</p></div>
      <div class="panel" data-in><h3>4 · Which computer?</h3><p>The paper names an Intel cloud server. Our Macs reproduce the saved errors exactly in ${mac.yes} of ${mac.of} results.</p><p class="so">The saved files may come from a Mac. Not proven.</p></div>
    </div>
    <p class="takeaway" data-in>To be fair: the paper says openly that Table 1 ignores the safety check.</p>`;
  },
  build: enter,
};
