/**
 * Speaker notes + target timings. Shown in the speaker view (press S) and
 * exported by `npm run notes` to docs/speaker-notes.md with a timing check.
 *
 * Lines starting with "[" are stage cues (when to click) and are not counted
 * towards spoken time. {A} {B} {C} are replaced with names from deck.config.ts.
 * If you change the milestones in deck.config.ts, update `targets` below too.
 */
import { team } from '../config/deck.config';

export interface SlideNotes {
  title: string;
  seconds: number;
  lines: string[];
}

const teamLines = (): string[] => {
  const lines = team.members.flatMap((m) => [
    `[{${m.id}}]`,
    `I’m looking after ${m.role.toLowerCase()}: ${m.owns
      .map((o) => o.replace(/^./, (c) => c.toLowerCase()))
      .join('; ')}.`,
  ]);
  return [
    '[Cards appear one by one — each person speaks to their own card]',
    ...lines,
    '[Click — cross-check arrows draw]',
    'The arrows matter as much as the boxes. Each of us independently checks someone else’s work, so no result rests on one person’s laptop. We’ve also tried to keep the load even: each of us owns one stage of the pipeline end to end, and the speaking is split fairly evenly too. And to be clear, all of this is planned — nothing here is finished yet.',
  ];
};

export const notes = {
  title: {
    title: 'Opening',
    seconds: 25,
    lines: [
      '[Hook types in, then the paper details]',
      'Hi, I’m {A}. The question that drew us to this paper is a simple one: can a model learn more when you just can’t collect more data?',
      'The paper is “Counterfactual Residual Data Augmentation for Regression”, or CRDA, by Mohebbi, Schulte, Li and Poupart, at ICML this year. In the next seven minutes: the problem, the idea, and how we’ll test whether it reproduces.',
    ],
  },
  problem: {
    title: 'The problem',
    seconds: 50,
    lines: [
      '[Points fade in]',
      'Quick bit of vocabulary first. Regression just means predicting a number — say, how much energy a building needs for heating — from a row of features.',
      '[Click — fitted curve draws]',
      'Here are ten noisy observations and a model fitted to them.',
      '[Click — residual lines drop]',
      'The residual is the gap between what we observed and what the model predicted: the part it couldn’t explain.',
      '[Click — the larger cloud appears]',
      'With plenty of data, the model would settle on this underlying trend. With ten points, it wobbles around it. That’s the setting the paper targets: small tabular datasets where every new sample costs time or money, and the measurements are noisy. Just to be clear, this plot is an illustrative sketch we generated, not the paper’s data.',
    ],
  },
  naive: {
    title: 'Why naive augmentation is hard',
    seconds: 45,
    lines: [
      '[Image tile rotates — label stays]',
      'So why not augment, like we do with images? Rotate a photo of a seven and it’s still a seven. The label survives, so you get a free training example.',
      '[Click — floor area changes, price doesn’t]',
      'Tables don’t have that symmetry. Take this made-up house: nudge the floor area up by twenty percent, keep the price, and the row is now just wrong.',
      '[Click — existing approaches]',
      'Existing options either interpolate between rows, like SMOTE or C-Mixup, or train a generative model that treats price as just another column. The authors argue neither keeps each row’s own noise intact, and that’s the gap CRDA goes after. {B} will take you through how.',
    ],
  },
  mechanism: {
    title: 'The CRDA idea',
    seconds: 75,
    lines: [
      '[Curve draws, one house is highlighted]',
      'Thanks. This is the core idea, and it’s simpler than the name. Step one: train an ordinary model, an MLP or XGBoost, on the data we have. That’s this curve, g-hat.',
      '[Click — residual vector]',
      'Step two: for every training row, work out its residual. Using the paper’s own house example: this house sold for more than the model expected, maybe because of a bidding war. That gap is z.',
      '[Click — feature is perturbed]',
      'Step three: nudge only features that were judged safe to change — say, the garage finish — by a random factor within plus or minus p. Location and size stay fixed. The model gives a new price for this slightly different house.',
      '[Click — same residual is added back]',
      'Step four, the key move: add the same residual back on. So we get a counterfactual house: different garage, updated price, same bidding war. In other words: what would this exact house have sold for if only the garage had been different?',
      '[Click — repeat M times]',
      'Repeat that M times per row and you have an augmented training set. We never invent new noise; we reuse the noise we actually observed. This is a one-dimensional sketch — the real method can perturb several selected features at once.',
    ],
  },
  assumption: {
    title: 'What must be true',
    seconds: 55,
    lines: [
      '[Equation appears]',
      'That only works if one thing holds: once we know the fixed features, the residual mustn’t tell us anything about the features we perturb. That’s the paper’s Assumption 3.1, and it’s an assumption, not a guarantee.',
      '[Click — diagram (a)]',
      'Here it holds: the perturbed feature affects price, but not the noise.',
      '[Click — diagram (b), confounder appears]',
      'Here it breaks: a hidden factor U drives both the feature and the price, so the residual soaks up U, and changing the feature drags the noise with it.',
      '[Click — screening pipeline]',
      'So CRDA screens features first, with a PC causal-discovery check and a correlation check against the residual.',
      '[Click — Wilcoxon gate]',
      'Then it keeps the augmentation only if ten-fold cross-validation shows a significant improvement on a Wilcoxon test; otherwise it falls back to the plain model. The authors call the screens a first line of defence, not proof. Over to {C} for what we’ll actually do.',
    ],
  },
  plan: {
    title: 'What we will replicate',
    seconds: 55,
    lines: [
      '[Plan steps appear]',
      'Thanks. Our aim is to test whether the results reproduce, not to improve the method. We’ll install the authors’ repository exactly as pinned and run their demo. Then we narrow the scope to two datasets, comparing plain and CRDA-augmented MLP and XGBoost on the same splits and seeds.',
      '[Click — reported numbers count up]',
      'These are the paper’s numbers, not ours: across nine datasets they report about 23 percent lower MSE for MLPs and about 6 percent for XGBoost. On our two datasets, Table 1 reports drops of roughly twelve to twenty-eight percent, so that’s the bar we’ll hold our runs up against.',
      '[Click — audit questions]',
      'Reading the code, we already have two questions: the main table forces augmentation on, and the augmented score averages ten fold-models. We’ll pin those down, because they change what “reproduced” should mean. All of this is proposed; none of it has been run yet.',
    ],
  },
  team: {
    title: 'Who does what',
    seconds: 50,
    lines: teamLines(),
  },
  targets: {
    title: 'Targets before Week 9',
    seconds: 50,
    lines: [
      '[Timeline draws]',
      'So what will we bring to Week 9? Four targets, each with evidence we can actually show.',
      '[Click]',
      'One: the environment reproduced, with the demo running and the exact package versions written down.',
      '[Click]',
      'Two: baseline runs logged, with fixed seeds and every config saved.',
      '[Click]',
      'Three: our first CRDA comparison, side by side with the paper’s Table 1, including the Wilcoxon p-values.',
      '[Click]',
      'Four: an honest obstacle log — every place we had to deviate, and why. We’d rather come back with a smaller comparison we fully understand than a big table we can’t explain.',
      '[Click — research question]',
      'Which brings us back to the question we actually want to answer: do the reported gains hold when we re-run the authors’ own pipeline, and where do they not? Thank you.',
    ],
  },
  references: {
    title: 'References',
    seconds: 10,
    lines: [
      '[Leave up during questions]',
      'Our sources are here: the paper, the authors’ code and project page, the datasets and the methods we mentioned. Happy to take questions.',
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
