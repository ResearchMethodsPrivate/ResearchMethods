/**
 * Speaker notes + target timings. Shown in the speaker view (press S) and
 * exported by `npm run notes` to docs/speaker-notes.md with a timing model.
 *
 * Plain, everyday English on purpose (lecturer feedback, twice: keep it simple).
 * Short sentences, few numbers, every technical word explained once.
 * Lines starting with "[" are stage cues (when to click, who speaks) and are
 * not counted as spoken time. {A} {B} {C} {D} become names from deck.config.ts
 * (A Anik, B Alvi, C Atul, D Samim).
 *
 * Every number said here is also on a slide, and slides take their numbers
 * from src/content/results.ts (checked against the raw result files by
 * tests/unit/results.test.ts). Percentages are rounded to whole numbers.
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
    seconds: 32,
    lines: [
      '[Words appear, then the short answer]',
      'Hi, we’re the Fantastic Four: Anik, Alvi, Atul and Samim. Four people, four laptops.',
      'Our topic is a paper called CRDA. It makes extra practice data for a model, when you only have a little. The authors say it works well.',
      'Our question: does it still work when we run their code ourselves? The short answer is on the right. Yes, mostly. But we found two catches.',
    ],
  },
  progress: {
    title: 'Where we are',
    seconds: 34,
    lines: [
      '[Click 1 — card 1]',
      'In Week 5 we made four promises. One: get the code running. Done, on all four laptops.',
      '[Click 2 — card 2]',
      'Two: save the results. Done. Two models, two datasets, fifteen repeats each.',
      '[Click 3 — card 3]',
      'Three: compare with the paper. Done.',
      '[Click 4 — card 4 and the question]',
      'Four: keep a list of problems. We have nineteen. So, back to our question: does CRDA work? Mostly yes, with two catches. Alvi will show how we tested it.',
    ],
  },
  method: {
    title: 'What we ran',
    seconds: 55,
    lines: [
      '[{B}]',
      'Thanks, Anik. We wanted to match the paper as closely as we could. So we used their code, without changing it, and their settings.',
      'Each experiment is repeated fifteen times, each time on a different random split of the data. That shows how much the answer moves. We used their two models: a neural network, and XGBoost. Each one with CRDA and without it.',
      '[Click 1 — who ran what]',
      'We split the runs. I did Energy Efficiency on my Windows laptop. Anik did the same on his Mac, as a check. Samim did Concrete Strength. Atul made the table and the list of problems.',
      '[Click 2 — the numbers]',
      'In total: eight runs, and one hundred and twenty experiments.',
    ],
  },
  results: {
    title: 'Results',
    seconds: 75,
    lines: [
      '[Bars on the left appear]',
      'Here are the results. Each bar shows how much lower the error got with CRDA. Error means how wrong the predictions are. Longer is better. The striped bar is the paper. If the plain error is one hundred, and CRDA’s is seventy-two, the bar says twenty-eight percent.',
      '[Click 1 — Energy Efficiency bars grow]',
      'On Energy Efficiency, the neural network: the paper got twenty-eight, I got twenty-nine, and Anik got thirty-two. For XGBoost: the paper got twenty-one, I got twenty-two, and Anik got eighteen. Close, but not identical.',
      '[Click 2 — Concrete Strength bars grow]',
      'On Concrete Strength, Samim got twenty-four for the neural network, and the paper got twenty-seven. For XGBoost, fifteen against twelve. Samim, could this just be luck?',
      '[Click 3 — the green box]',
      '[{D}]',
      'No. On Concrete Strength, all fifteen repeats got better, for both models. The chance of that happening by luck is tiny. We call it p equals 0.00006. Anything under 0.05 counts as not luck. So the gain is real.',
    ],
  },
  matched: {
    title: 'What matched',
    seconds: 46,
    lines: [
      '[{C}]',
      'Thanks, both. First I checked the plain models, the ones without CRDA. If they did not match the paper, we could not trust anything else.',
      '[Click 1 — plain neural network]',
      'The plain neural network matches the paper exactly, on every laptop.',
      '[Click 2 — plain XGBoost]',
      'Plain XGBoost matches on Anik’s Mac. But on both Windows laptops it is a little higher: about four percent on Alvi’s, and two on Samim’s. We do not know why yet.',
      '[Click 3 — size of the gain]',
      'CRDA’s gain also differs by a few points between laptops. That is normal. One repeat can be very different from the next.',
    ],
  },
  safety: {
    title: 'The first catch',
    seconds: 62,
    lines: [
      '[{D}]',
      'Now the first catch. CRDA has a safety check. It should switch CRDA off when it does not clearly help. Each square here is one repeat. In the paper’s main table, the check is off. So all fifteen repeats count, even the ones the check would reject.',
      '[Click 1 — the check is switched on]',
      'When we switch the check on, the code throws away the rejected repeats. Two for the neural network, four for XGBoost. It does this quietly, and the run still looks fine.',
      '[Click 2 — the comparison]',
      'Does that change the answer? Not much. The gains are about the same. But the two sets of numbers use different runs, so we cannot compare them fairly.',
      '[Click 3 — the takeaway]',
      'So the paper is not wrong. But its numbers include runs that its own check would reject.',
    ],
  },
  averaging: {
    title: 'The second catch',
    seconds: 70,
    lines: [
      '[{B}]',
      'Thanks, Samim. The second catch is about averaging. In the code, the plain score comes from one model. But the CRDA score is the average of ten models. Averaging helps all by itself. So we gave the plain model the same treatment: ten plain models, averaged. Anik and Samim repeated this on a Mac and on Concrete Strength.',
      '[Click 1 — Energy Efficiency]',
      'Each bar shows the gain. The amber part is just averaging. The blue part is CRDA’s own. On Energy Efficiency, for the neural network, none of the gain is averaging. For XGBoost, fifteen of the twenty-two is averaging.',
      '[Click 2 — Concrete Strength]',
      'On Concrete Strength, for the neural network, seventeen of the twenty-four is averaging. For XGBoost, fourteen of the fifteen. Almost all of it.',
      '[Click 3 — the takeaway]',
      'So CRDA helps, but less than the paper’s way of scoring suggests. We will decide how to report this in the final.',
    ],
  },
  next: {
    title: 'What is left',
    seconds: 54,
    lines: [
      '[{C}]',
      'To sum up. CRDA helps, about as much as the paper says. Catch one: the paper counts runs that its own safety check would reject. Catch two: much of the gain is just averaging ten models. Also, plain XGBoost is a little off on Windows, and we do not know why.',
      '[Click — what we do before the final]',
      'Before the final presentation, we will decide which numbers to report. Samim and I will write it up and check the numbers. All four of us will make the final slides and practise. We keep a list of problems: nineteen so far. Everything is in our group repository, so anyone can check it. Thank you. Any questions?',
    ],
  },
  references: {
    title: 'References',
    seconds: 6,
    lines: [
      '[Leave up during questions]',
      'Our sources are listed here. Any questions?',
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
