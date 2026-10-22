/**
 * Speaker notes + target timings. Shown in the speaker view (press S) and
 * exported by `npm run notes` to docs/speaker-notes.md with a timing model.
 *
 * Lines starting with "[" are stage cues (when to click) and are not counted
 * towards spoken time. {A} {B} {C} are replaced with names from deck.config.ts
 * (A = Anik, B = Alvi, C = Atul). If you change the milestones in
 * deck.config.ts, update `targets` below too (validate:deck checks the count).
 */
import { rolesStatus, team } from '../config/deck.config';

export interface SlideNotes {
  title: string;
  /** Target LIVE seconds, including clicks, motion and handoffs. */
  seconds: number;
  lines: string[];
}

const handoff: Record<string, string> = { A: 'Alvi?', B: 'Atul?', C: '' };

const teamLines = (): string[] => {
  const proposed = rolesStatus !== 'confirmed';
  const lines = team.members.flatMap((m) => [
    `[{${m.id}}]`,
    `${proposed ? 'The proposal is that I take' : 'I’m taking'} ${m.role.toLowerCase()}: ${m.owns
      .slice(0, 2)
      .map((o) => o.replace(/^./, (c) => c.toLowerCase()))
      .join('; ')}. ${handoff[m.id]}`.trim(),
  ]);
  return [
    '[Cards appear — Atul opens, then each person speaks to their own card]',
    '[{C}]',
    proposed
      ? 'Here’s how we propose to split the work — we’re still confirming it. Anik?'
      : 'Here’s how we’ve split the work. Anik?',
    ...lines,
    '[{C}] [Click — cross-check arrows draw]',
    'And the arrows: each of us re-checks someone else’s work, so no result rests on one laptop. The research tasks themselves are still the plan.',
  ];
};

export const notes = {
  title: {
    title: 'Opening',
    seconds: 28,
    lines: [
      '[Hook types in, then the paper details]',
      'Hi, I’m Anik, and with me are Alvi and Atul. The question that drew us to this paper is simple: can a model learn more when you can’t collect more data?',
      'The paper is “Counterfactual Residual Data Augmentation for Regression” — CRDA — by Mohebbi and colleagues, at ICML this year. We’ll cover the problem, the idea, and our plan to test it.',
    ],
  },
  problem: {
    title: 'The problem',
    seconds: 40,
    lines: [
      '[Points fade in]',
      'First, regression just means predicting a number — say a building’s heating load — from a row of features.',
      '[Click — fitted curve draws]',
      'Here are ten noisy observations and a model fitted to them.',
      '[Click — residual lines drop]',
      'The residual is the gap between what we observed and what the model predicted.',
      '[Click — the larger cloud appears]',
      'With plenty of data the model would settle on this trend; with ten points it wobbles. That’s the paper’s setting: small, noisy tables where more data is expensive. This plot is our own illustrative sketch, not the paper’s data.',
    ],
  },
  naive: {
    title: 'Why naive augmentation is hard',
    seconds: 40,
    lines: [
      '[Image tile rotates — label stays]',
      'Why not augment like we do with images? Rotate a seven slightly and it’s still a seven — but turn a six upside down and it’s a nine. The transformation has to suit the label.',
      '[Click — floor area changes, price is copied]',
      'Tables don’t. Nudge this made-up house’s floor area up twenty percent and copy the price: nothing justifies that label.',
      '[Click — existing approaches]',
      'Interpolation and generative models can help in places, but the authors argue they don’t keep each row’s own noise, and report they can raise error on their benchmarks. That’s the gap CRDA targets. Alvi?',
    ],
  },
  mechanism: {
    title: 'The CRDA idea',
    seconds: 66,
    lines: [
      '[Curve draws, one sample is highlighted]',
      'Thanks, Anik. The core idea is simpler than the name. Step one: train an ordinary model — an MLP or XGBoost. That’s this curve, g-hat.',
      '[Click — residual vector]',
      'Step two: work out each row’s residual. This point sits above the curve, so its residual z is positive.',
      '[Click — numeric feature is scaled]',
      'Step three: take a numeric feature that passed the screens and scale it by one plus delta, with delta between minus p and plus p. The repo’s default p is ten percent; this draw is plus nine. Everything else stays fixed.',
      '[Click — the same residual is carried across]',
      'Step four, the key move: carry the same residual across and add it back. New label equals new prediction plus old residual. The paper’s analogy: change a house’s garage, keep the bidding war that pushed its price up.',
      '[Click — repeat M times]',
      'Repeat that M times per row for an augmented training set — reusing noise we actually observed.',
    ],
  },
  assumption: {
    title: 'What must be true',
    seconds: 48,
    lines: [
      '[Equation appears]',
      'That only works if, given the fixed features, the residual tells us nothing about the ones we perturb. That’s Assumption 3.1 — assumed, not guaranteed.',
      '[Click — diagram (a)]',
      'Here it holds: the feature moves the target, not the noise.',
      '[Click — diagram (b), confounder appears]',
      'Here it breaks: a hidden factor U drives both, so the residual soaks up U.',
      '[Click — screening pipeline]',
      'CRDA can’t see the true graph, so it screens features with two heuristics: a PC causal-discovery check and a simple correlation check, both against the residual.',
      '[Click — Wilcoxon gate]',
      'Then a separate gate keeps the augmentation only if cross-validation shows a significant improvement. That’s evidence, not a guarantee, and neither screen proves the causal story. Atul?',
    ],
  },
  plan: {
    title: 'What we will replicate',
    seconds: 48,
    lines: [
      '[Plan steps appear]',
      'Thanks, Alvi. We want to test whether the results reproduce, not improve the method. The first two steps are already done — more on that next. From there, our proposed starting scope is two small datasets, comparing plain and CRDA models on the same splits and seeds.',
      '[Click — reported numbers count up]',
      'These are the authors’ numbers, not ours: about 23 percent lower MSE for MLPs and 6 for XGBoost on average. On our two datasets Table 1 reports twelve to twenty-eight percent — that’s our bar.',
      '[Click — code-reading questions]',
      'Reading their code, two questions: the main table’s configs force augmentation on, and the augmented score averages ten fold-models. Both affect what “reproduced” means.',
    ],
  },
  demo: {
    title: 'Our first check',
    seconds: 68,
    lines: [
      '[Table header and the authors’ own output appear]',
      '[{C}]',
      'Steps one and two are done: each of us ran the authors’ demo on our own laptop — same pinned libraries, one dataset, one seed, CPU only. The top row is the authors’ own stored output. Anik?',
      '[Click — Anik’s row]',
      '[{A}]',
      'I’m on an M2 Mac: forty seconds, and both results match the authors’ exactly. Alvi?',
      '[Click — Alvi’s row]',
      '[{B}]',
      'Mine’s Windows — a Ryzen 7, and a 3070 the demo doesn’t use. The MLP matches, but the XGBoost baseline already differs from the authors’ before CRDA starts. We don’t know why yet. Atul?',
      '[Click — Atul’s row]',
      '[{C}]',
      'Mine’s an M5 Pro Mac, and both results match too. So the MLP reproduces on all three laptops, XGBoost on two.',
      '[Click — pinned versions and deviations]',
      'One obstacle so far: a pinned library won’t load on the newest macOS, so we upgraded it — numbers unchanged. Both findings go in our obstacle log. One seed — not Table 1.',
    ],
  },
  team: {
    title: 'Who does what',
    seconds: 48,
    lines: teamLines(),
  },
  targets: {
    title: 'Targets before Week 9',
    seconds: 44,
    lines: [
      '[Timeline draws]',
      'So, four targets for Week 9, each with evidence we can show.',
      '[Click]',
      'One is already done: the environment, with exact versions logged on all three laptops.',
      '[Click]',
      'Two: baseline runs logged, with fixed seeds and saved configs.',
      '[Click]',
      'Three: our first CRDA comparison next to the paper’s Table 1, with p-values.',
      '[Click]',
      'Four: an honest log of every deviation and why — we already have two entries.',
      '[Click — research question]',
      'Which leaves our real question: do the reported gains hold when we re-run the authors’ own pipeline — and where don’t they? Thank you.',
    ],
  },
  references: {
    title: 'References',
    seconds: 10,
    lines: [
      '[Leave up during questions]',
      'Our sources are here — the paper, the authors’ code, the datasets and methods we mentioned. Happy to take questions.',
    ],
  },
} satisfies Record<string, SlideNotes>;

export const WORDS_PER_MINUTE = 150;

export const spokenWords = (n: SlideNotes) =>
  n.lines
    .filter((l) => !l.startsWith('['))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
