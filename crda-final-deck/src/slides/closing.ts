/** Slides 11–14: ethics, verdict and future work, who did what, references. */
import { toConfirm } from '../config/deck.config';
import { data, fresh, tally } from '../content/derive';
import { cite, references } from '../content/references';
import type { SlideDef } from '../lib/slide';
import { enter, head, pendingBadge } from './shared';

export const ethicsSlide: SlideDef = {
  id: 'ethics',
  steps: 0,
  source: `Paper’s compute and impact statements ${cite('crda')}, appendix M · our hours: run logs · Parkinson’s data ${cite('parkinsons')}`,
  html: () => {
    const worse = fresh.filter((c) => c.change > 0).length;
    return `
    ${head('10 — Ethics and responsible innovation', 'What could go wrong, and what we did')}
    <div class="cards two weak">
      <div class="panel" data-in><h3>People and privacy</h3><p>We recruited no one, so no consent forms. One dataset comes from people with Parkinson’s disease: we use the public file and do not republish it.</p></div>
      <div class="panel" data-in><h3>Licences</h3><p>The authors’ code is MIT licensed. Our repository holds results, not their data.</p>${toConfirm.dataLicences ? `<p><span class="placeholder">${toConfirm.dataLicences}</span></p>` : ''}</div>
      <div class="panel" data-in><h3>Energy</h3><p>Paper: 13.6 hours on a large server, about 8 kWh and 0.28 kg CO₂ (their figures). Our main runs: about <b>${data.runHours} laptop hours</b>; energy not measured.</p></div>
      <div class="panel" data-in><h3>Honest reporting and risk</h3><p>Hypotheses first, every result shown, misses included. CRDA can also make error worse (${worse} of our ${fresh.length} new results), which matters in high-stakes use.</p></div>
    </div>`;
  },
  build: enter,
};

export const verdictSlide: SlideDef = {
  id: 'verdict',
  steps: 0,
  source: 'Counts cover the new results only',
  html: () => {
    const h2 = tally('h2'), n = tally('h3b', 'mlp'), x = tally('h3b', 'xgboost');
    return `
    ${head('11 — Conclusion', 'It reproduces, but not all of the gain is CRDA’s')}
    <ul class="verdict">
      <li data-in><b>${h2.yes} of ${h2.of}</b><p>of our results are within 5 points of the paper.</p></li>
      <li data-in><b>${n.yes} of ${n.of}</b><p>neural network results: CRDA still clearly beats 10 averaged plain models.</p></li>
      <li data-in><b>${x.yes} of ${x.of}</b><p>XGBoost results where it does the same.</p></li>
    </ul>
    <div class="cards two">
      <div class="panel" data-in><h3>Limits</h3><p>34 of 90 results; only the smallest size for seven datasets. Dataset and laptop are mixed together. Exact Mac repeats are not independent proof.</p></div>
      <div class="panel" data-in><h3>Next</h3><p>Pass the tuned weight to the scoring models. Compare with one retrained model. Run all 90 results on one system. Explain the Windows difference.</p></div>
    </div>
    ${pendingBadge()}`;
  },
  build: enter,
};

export const rolesSlide: SlideDef = {
  id: 'roles',
  steps: 0,
  source: 'Details in the Team Reflective Statement · AI assistance is described in our AI Accountability Statement',
  html: () => `
    ${head('12 — Who did what', 'Four people, four laptops')}
    <div class="cards four">
      <div class="panel" data-in><h3>Anik</h3><p>Repeated Energy Efficiency on a Mac, including the 10-model test.</p><p>Ran House Price, Wind and Wine Quality.</p></div>
      <div class="panel" data-in><h3>Alvi</h3><p>Ran Energy Efficiency at all five sizes.</p><p>Run scripts, group repository and slides.</p></div>
      <div class="panel" data-in><h3>Samim</h3><p>Ran Concrete Strength and the safety-check test.</p><p>Statistics checks.</p></div>
      <div class="panel" data-in><h3>Atul</h3><p>Comparison table and problem log from reading the code.</p><p>Ran Synthetic, Satellite, CPU and Parkinson’s.</p></div>
    </div>
    <p class="takeaway" data-in>We worked through a shared repository: each person pushed a branch, and results were checked against the raw files before merging.</p>`,
  build: enter,
};

export const referencesSlide: SlideDef = {
  id: 'references',
  steps: 0,
  html: () => `
    ${head('References', 'References')}
    <ol class="refs">${references.map((r, i) => `<li><span>[${i + 1}]</span><p>${r.text}</p></li>`).join('')}</ol>`,
  build: enter,
};
