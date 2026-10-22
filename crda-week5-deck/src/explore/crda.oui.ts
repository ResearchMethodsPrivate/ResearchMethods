/**
 * Authored OpenUI Lang program for the "Explore CRDA" panel. Static fixture —
 * no model call. Every claim is from the paper or repo; validated by
 * tests/unit/openui.test.ts (parses with zero errors / unresolved refs).
 */
import { paper, datasets } from '../content/paper';
import { scope } from '../config/deck.config';
import { fmtDelta } from '../lib/delta-bars';

const q = (s: string) => JSON.stringify(s);
const ee = datasets.EnergyEfficiency.table1[4];
const cs = datasets.ConcreteStrength.table1[4];

export const crdaProgram = `
root = Explorer("Explore CRDA", [stages, assumption, claims])
stages = Tab("Four stages", [st1, st2, st3, st4])
st1 = StageCard(1, "Baseline", ${q('\\hat g \\leftarrow \\text{MLP or XGBoost on } \\mathcal{D}_{\\text{train}}')}, "Fit an ordinary regressor on the training data.", "Alg. 1, line 2")
st2 = StageCard(2, "Residual", ${q('z_i = y_i - \\hat g(x_i)')}, "Keep, for every row, the part the model could not explain.", "Alg. 1, line 4")
st3 = StageCard(3, "Perturbation", ${q("x'_{i,P} = x_{i,P}(1+\\delta),\\; \\delta \\sim \\mathcal{U}[-p,p]")}, "Scale only screened numeric features and hold the rest fixed; the new label reuses the old residual. Repo default p = 0.1.", "Alg. 1, lines 10–12; src/utils/config.py")
st4 = StageCard(4, "Safety gate", ${q("y'_i = \\hat g(x'_i) + z_i")}, "Keep the augmented data only if 10-fold CV errors improve significantly on a Wilcoxon signed-rank test (p < 0.05); otherwise fall back to the baseline. Evidence, not a guarantee.", "Alg. 1, lines 14–21")
assumption = Tab("Assumption", [toggle])
toggle = AssumptionToggle("Holds: the perturbed features move the target Y but not the noise Z; Z may still depend on the fixed features.", "Breaks: a hidden U drives both the perturbed feature and Y, so the residual Z absorbs U and becomes dependent on it.", "Residual invariance — P(Z | perturbed, fixed) = P(Z | fixed) — is assumed, not guaranteed. The PC and Pearson screens are heuristics; the Wilcoxon gate is evidence on validation folds.")
claims = Tab("Claims vs plan", [cvp])
cvp = ClaimsVsPlan([c1, c2, c3, c4], ${JSON.stringify([
  'Done 22 Oct: authors’ repo installed as pinned (Python 3.11) and their demo run on 3 laptops',
  `Proposed scope: ${scope.datasets.map((d) => datasets[d].label).join(' + ')} · ${scope.models.join(' & ')}`,
  `Unaugmented vs CRDA on identical splits, ${scope.seeds} seeds first (paper: ${scope.paperSeeds})`,
  'Compare our ΔMSE with Table 1 and log every deviation',
])}, "Demo run on 3 laptops · Table 1 comparison not started")
c1 = Claim("Average MSE change, MLP (9 datasets)", ${q(fmtDelta(paper.headline.mlp))}, "Abstract; §5.2")
c2 = Claim("Average MSE change, XGBoost (9 datasets)", ${q(fmtDelta(paper.headline.xgb))}, "Abstract; §5.2")
c3 = Claim("Energy Efficiency, n = ${ee[0]}: MLP / XGB", ${q(`${fmtDelta(ee[2])} / ${fmtDelta(ee[1])}`)}, "Table 1")
c4 = Claim("Concrete Strength, n = ${cs[0]}: MLP / XGB", ${q(`${fmtDelta(cs[2])} / ${fmtDelta(cs[1])}`)}, "Table 1")
`.trim();
