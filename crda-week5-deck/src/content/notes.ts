/**
 * Speaker notes + target timings. Shown in the speaker view (press S) and
 * exported by `npm run notes` to docs/speaker-notes.md with a timing model.
 *
 * Written in plain, everyday English on purpose (lecturer feedback: keep the
 * talk and slides simple for a general audience).
 *
 * Lines starting with "[" are stage cues (when to click) and are not counted
 * towards spoken time. {A} {B} {C} are replaced with names from deck.config.ts
 * (A = Anik, B = Alvi, C = Atul). If you change the milestones in
 * deck.config.ts, update `targets` below too (validate:deck checks the count).
 */

export interface SlideNotes {
  title: string;
  /** Target LIVE seconds, including clicks, motion and handoffs. */
  seconds: number;
  lines: string[];
}

export const notes = {
  title: {
    title: 'Opening',
    seconds: 30,
    lines: [
      '[Hook types in, then the paper details]',
      'Hi, I’m Anik, and with me are Alvi and Atul — we’re group Triple A. Here’s the question that drew us to this paper: can a model learn more when we can’t collect more data?',
      'The paper is “Counterfactual Residual Data Augmentation for Regression”, or CRDA, from ICML this year. We’ll cover the problem, the idea, and our plan to test it.',
    ],
  },
  problem: {
    title: 'The problem',
    seconds: 38,
    lines: [
      '[Points fade in]',
      'Regression just means predicting a number, like how much heating a building needs.',
      '[Click — curve draws]',
      'Here are ten noisy examples, and a model that learned from them.',
      '[Click — gaps drop]',
      'The gap between each point and the curve is the residual: how far off the guess was.',
      '[Click — bigger cloud]',
      'With lots of data, the model finds the real trend. With ten examples, it wobbles. That’s the problem: little data, noisy measurements, and more data is expensive. This plot is a made-up illustration.',
    ],
  },
  naive: {
    title: 'Why simple copying fails',
    seconds: 40,
    lines: [
      '[Image tile rotates — label stays]',
      'Why not just copy the data, like we do with pictures? Rotate a 7 a little and it’s still a 7. But turn a 6 upside down and it becomes a 9.',
      '[Click — house row]',
      'Tables don’t have a safe trick like that. Make this made-up house 20% bigger and keep the price, and the price is now wrong.',
      '[Click — other fixes]',
      'Other methods blend rows together, or make them up with another model. They can help, but the authors say they lose each row’s own noise, and sometimes make results worse. That’s the gap CRDA goes after. Alvi?',
    ],
  },
  mechanism: {
    title: 'The CRDA idea',
    seconds: 62,
    lines: [
      '[Curve draws, one real row appears]',
      'Thanks, Anik. The idea is simple. First, train a normal model. That’s this curve.',
      '[Click 1 — the cyan arrow]',
      'For each real row, we measure how wrong the model was. That gap is the residual.',
      '[Click 2 — the strip and the arrow]',
      'Now nudge one number in that row by a small amount, up to 10%. Here it’s 9%. The model gives a new guess.',
      '[Click 3 — purple arrow carried across]',
      'The key move: add the same gap back. New label equals new guess plus old gap. So the new row keeps real-world noise.',
      '[Click 4 — more purple dots]',
      'Repeat that to get extra training rows.',
    ],
  },
  assumption: {
    title: 'When it can go wrong',
    seconds: 46,
    lines: [
      '[Equation appears]',
      'This only works if one thing is true: the noise doesn’t depend on the number we nudge. That’s an assumption, not a guarantee.',
      '[Click 1 — left diagram]',
      'Left is fine: the number affects the result, not the noise.',
      '[Click 2 — right diagram, hidden factor appears]',
      'Right is broken: a hidden factor affects both, so the noise moves when we nudge.',
      '[Click 3 — the two checks]',
      'So CRDA runs two rough checks to pick safe numbers to nudge.',
      '[Click 4 — the final test]',
      'Then a final test: keep the extra rows only if they clearly help. That’s evidence, not proof. Atul?',
    ],
  },
  plan: {
    title: 'Our plan',
    seconds: 46,
    lines: [
      '[Plan steps appear]',
      'Thanks, Alvi. We want to check whether the authors’ results hold up. We’re not trying to improve their method. The first two steps are done, more on that next. Then we compare plain and CRDA models on two small datasets.',
      '[Click — reported numbers count up]',
      'These are the authors’ numbers, not ours. On average, CRDA cut the error by about 23% for neural networks and 6% for XGBoost. On our two datasets, their table shows drops of 12% to 28%. That’s our bar.',
      '[Click — code questions]',
      'Reading their code, we found two questions. One: the main table switches CRDA on even when the safety test says no. Two: the final score averages 10 models, not one. Both change what “reproduced” means.',
    ],
  },
  demo: {
    title: 'Our first check',
    seconds: 64,
    lines: [
      '[Table header and the authors’ own result appear]',
      '[{C}]',
      'Steps one and two are done: each of us ran the authors’ demo on our own laptop, with the same fixed library versions. One dataset, one run, CPU only. The top row is the authors’ own saved result. Anik?',
      '[Click — Anik’s row]',
      '[{A}]',
      'I’m on an M2 Mac: forty seconds, and both results match the authors’ exactly. Alvi?',
      '[Click — Alvi’s row]',
      '[{B}]',
      'Mine’s Windows, with a Ryzen 7 and a 3070 that the demo doesn’t use. The MLP matches the authors. XGBoost is a bit different, and it was already different before CRDA ran. We don’t know why yet. Atul?',
      '[Click — Atul’s row]',
      '[{C}]',
      'Mine’s an M5 Pro Mac. Both results match. So the MLP matched on all three laptops, and XGBoost on two.',
      '[Click — library versions and problems]',
      'One problem so far: a library version wouldn’t run on the newest macOS, so we used a newer one. The numbers didn’t change. Both findings go in our problem log. This is one run, not the paper’s main results.',
    ],
  },
  team: {
    title: 'Who does what',
    seconds: 50,
    lines: [
      '[Cards appear — Atul opens, then each person speaks to their own card]',
      '[{C}]',
      'Here’s how we’ve split the work. Anik?',
      '[{A}]',
      'I’m setting up the code, and keeping notes on what works on each kind of computer. Alvi?',
      '[{B}]',
      'I’m running the experiments: plain model versus CRDA, same data splits, every setting saved. Atul?',
      '[{C}]',
      'I’m comparing our results with the paper’s table, keeping the problem log, and handling the slides and rehearsals.',
      '[Click — arrows draw]',
      'The arrows show who double-checks whom, so no result depends on one laptop. The research tasks themselves are still ahead of us.',
    ],
  },
  targets: {
    title: 'Targets before Week 9',
    seconds: 42,
    lines: [
      '[Timeline draws]',
      'So, four targets for Week 9, each with proof we can show.',
      '[Click]',
      'One is done: the code is set up and running, with exact versions written down on all three laptops.',
      '[Click]',
      'Two: saved results for the plain models, with fixed settings.',
      '[Click]',
      'Three: our first CRDA comparison next to the paper’s table, with p-values.',
      '[Click]',
      'Four: an honest list of every difference we hit and why. We already have two.',
      '[Click — research question]',
      'Which leaves our real question: do the authors’ improvements hold up when we re-run their own code, and where don’t they? Thank you.',
    ],
  },
  references: {
    title: 'References',
    seconds: 10,
    lines: [
      '[Leave up during questions]',
      'These are our sources: the paper and its code, the other methods we mentioned, and the data we use. Happy to take questions.',
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
