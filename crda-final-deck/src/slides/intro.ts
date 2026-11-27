/** Slides 1–4: title, question, background, how CRDA works. */
import { group, members, researchQuestion } from '../config/deck.config';
import { cite } from '../content/references';
import type { SlideDef } from '../lib/slide';
import { enter, head } from './shared';

export const titleSlide: SlideDef = {
  id: 'title',
  steps: 0,
  html: () => `
    <div class="title-wrap">
      <p class="kicker" data-in>${group.module} · Assessment 2</p>
      <h1 data-in>Does CRDA<br>hold up?</h1>
      <p class="title-sub" data-in>A reproduction of <em>Counterfactual Residual Data Augmentation for Regression</em> ${cite('crda')}</p>
      <p class="title-team" data-in><strong>${group.name}</strong> · ${members.map((m) => m.name).join(', ')}</p>
      <p class="title-date" data-in>${group.date}</p>
    </div>`,
  build: enter,
};

export const questionSlide: SlideDef = {
  id: 'question',
  steps: 0,
  source: `Averages over nine datasets: paper §5.2 ${cite('crda')} · code ${cite('code')}`,
  html: () => `
    ${head('01 — The research question', 'Can we trust a promising result?')}
    <blockquote class="rq" data-in>${researchQuestion}</blockquote>
    <div class="cards three">
      <div class="panel" data-in><h3>Little data is common</h3><p>Many tasks that predict a number have only a few hundred examples.</p></div>
      <div class="panel" data-in><h3>The promise</h3><p>CRDA makes extra training data. The paper reports error down <b>22.9%</b> (neural network) and <b>6.4%</b> (XGBoost) on average.</p></div>
      <div class="panel" data-in><h3>It can be checked</h3><p>The authors published code, settings and per-run results, so we can compare run by run.</p></div>
    </div>`,
  build: enter,
};

export const backgroundSlide: SlideDef = {
  id: 'background',
  steps: 0,
  source: `${cite('cmixup', 'ada')} mixing · ${cite('tabddpm', 'ctgan')} generative · ${cite('crda')}, Table 2 · base models ${cite('xgboost')}`,
  html: () => `
    ${head('02 — Background', 'Three ways to make more training data')}
    <div class="cards three tall">
      <div class="panel" data-in><p class="tag">Mix examples</p><h3>C-Mixup, Anchor augmentation</h3><p>Blend or shift real rows to create new ones.</p></div>
      <div class="panel" data-in><p class="tag">Learn to generate</p><h3>CTGAN, TVAE, TabDDPM</h3><p>Train a second model that invents whole rows.</p></div>
      <div class="panel hl" data-in><p class="tag tag-cyan">Reuse the error</p><h3>CRDA</h3><p>Keep what the model got wrong, change a few inputs, and compute a matching new answer.</p></div>
    </div>
    <p class="takeaway" data-in>In the paper’s comparison, generative methods often made error worse, while CRDA improved it more reliably.</p>`,
  build: enter,
};

export const methodSlide: SlideDef = {
  id: 'method',
  steps: 0,
  source: `Algorithm 1 and Assumption 3.1 ${cite('crda')} · safety check: Wilcoxon test ${cite('wilcoxon')} over 10 folds`,
  html: () => `
    ${head('03 — The method', 'How CRDA works')}
    <ol class="flow">
      <li data-in><span>1</span><h3>Train</h3><p>Fit a model on the real data.</p></li>
      <li data-in><span>2</span><h3>Keep the error</h3><p>For each row:<br><code>z = y − g(x)</code></p></li>
      <li data-in><span>3</span><h3>Pick safe inputs</h3><p>Inputs that look unrelated to the error.</p></li>
      <li data-in><span>4</span><h3>Nudge them</h3><p>New answer:<br><code>y′ = g(x′) + z</code></p></li>
      <li data-in><span>5</span><h3>Check, retrain</h3><p>Use the new rows only if a test says they help.</p></li>
    </ol>
    <p class="takeaway" data-in><strong>Key assumption:</strong> the error does not depend on the inputs that are changed. If it does, the new rows are wrong.</p>`,
  build: enter,
};
