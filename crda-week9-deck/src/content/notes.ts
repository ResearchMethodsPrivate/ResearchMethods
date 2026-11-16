/**
 * Speaker notes + target timings. Shown in the speaker view (press S) and
 * exported by `npm run notes` to docs/speaker-notes.md with a timing model.
 *
 * Plain, everyday English on purpose (lecturer feedback: keep it simple).
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
    seconds: 45,
    lines: [
      '[Words appear, then the short answer]',
      'Hi, we’re group Triple A: Anik, Alvi, Atul and Samim. In Week 5 we said we would re-run a paper called CRDA. It is a way to help a model learn when you only have a little data. It makes extra training examples by nudging one input number a little, and keeping the same prediction mistake, so the new example keeps its real-world noise.',
      'The authors say it lowers the error a lot, and we ran everything on ordinary laptops. Today’s question: do those gains hold up when we run their code ourselves? The short answer is on the right: mostly yes, with two catches.',
    ],
  },
  progress: {
    title: 'Where we are',
    seconds: 60,
    lines: [
      '[Click 1 — card 1]',
      'In Week 5 we set four targets, and we have met all of them. First, the code is set up: the authors’ demo runs on all four of our laptops, with exact versions written down.',
      '[Click 2 — card 2]',
      'Second, the plain-model results are saved: both models, both datasets, 15 repeats each, with the settings and results files for every run.',
      '[Click 3 — card 3]',
      'Third, our first CRDA comparison is done, next to the paper’s table, with p-values.',
      '[Click 4 — card 4 and the question]',
      'And the problem log has 17 entries so far. Two of them matter most, and we will come back to both: plain XGBoost gives a different answer on Windows, and the paper’s table keeps runs its own safety test would reject. That takes us back to our question. Alvi will show how we ran it.',
    ],
  },
  method: {
    title: 'What we ran',
    seconds: 80,
    lines: [
      '[{B}]',
      'Thanks, Anik. We wanted our runs as close to the paper’s as possible, so that any difference means something. We used the authors’ code unchanged, and copied the settings from their saved files for the main table. That means 15 repeats of every run. A repeat means we run the whole experiment again, with a different random split of the data into training and test. Doing it 15 times shows how much the result moves. We also used the biggest data subset, and their two models, a neural network and XGBoost, each with and without CRDA.',
      '[Click 1 — who ran what]',
      'Then we split the work. I ran Energy Efficiency on my Windows laptop. Anik ran the same again on his Mac, as an independent check. Samim ran Concrete Strength and the safety-test experiment. Atul built the comparison table and the problem log. Two of us used Windows and two used Macs on purpose, to see whether the operating system matters.',
      '[Click 2 — the numbers]',
      'In total, eight full runs and 120 experiments, six to 22 minutes each, on ordinary laptops with no graphics card.',
    ],
  },
  results: {
    title: 'Results',
    seconds: 110,
    lines: [
      '[Bars on the left appear]',
      'Here are the results. Each bar shows how much lower the error got with CRDA. Error here means how far the predictions are from the true values, on data the model has not seen. So if the plain error is 100 and CRDA’s is 72, the bar says 28 percent. Longer is better. The striped bar is the paper, from its own 15 repeats, and every bar is an average of 15 repeats.',
      '[Click 1 — Energy Efficiency bars grow]',
      'On Energy Efficiency, for the neural network, the paper reports 28 percent. I got 29, and Anik got 32. For XGBoost, the paper reports 21, I got 22, and Anik got 18. So we are close to the paper, but not identical. Windows and Mac give similar answers, so the operating system is not changing the story.',
      '[Click 2 — Concrete Strength bars grow]',
      'On Concrete Strength, Samim’s runs show 24 percent against the paper’s 27 for the neural network, and 15 against 12 for XGBoost. Again close, and the same direction. Both models improved on both datasets. Samim, can we trust that this is more than luck?',
      '[Click 3 — the green box]',
      '[{D}]',
      'Yes. A p-value is the chance of seeing a result like this by luck alone, and below 0.05 is the usual bar. On Concrete Strength, every one of the 15 repeats improved, for both models. A paired Wilcoxon test gives p equals 0.00006, the smallest value possible with 15 repeats. On Energy Efficiency, 12 to 14 of the 15 repeats improved. So CRDA’s gain is real.',
    ],
  },
  matched: {
    title: 'What matched',
    seconds: 75,
    lines: [
      '[{C}]',
      'Thanks, both. I compared the plain models, without CRDA. This matters: if our plain models were different from the authors’, we could not trust any comparison of the gains.',
      '[Click 1 — plain neural network]',
      'The plain neural network matches the paper exactly, on every laptop and both datasets. That is a good sign for our setup.',
      '[Click 2 — plain XGBoost]',
      'Plain XGBoost matches on Anik’s Mac, but it is higher on both Windows laptops: 3.6 percent on Alvi’s and 2.1 on Samim’s. The two Windows laptops give the same number as each other, so it is not random noise. It looks like a Windows effect, but we have not found the cause yet.',
      '[Click 3 — size of the gain]',
      'And the size of CRDA’s gain differs by a few points between laptops. That is expected. From one repeat to the next, the gain on Alvi’s run swings from minus 67 percent to plus 25. So a gap of three or four points between laptops is normal.',
    ],
  },
  safety: {
    title: 'The catch',
    seconds: 90,
    lines: [
      '[{D}]',
      'Now the catch. CRDA has a built-in safety test. It is meant to switch CRDA off when it does not clearly help. Each square here is one repeat. In the paper’s main table that test is switched off, so all 15 repeats count, even ones where the test would have said no.',
      '[Click 1 — the test is switched on]',
      'When we switch the test on, the authors’ code throws away the repeats it rejects: two out of 15 for the neural network, four out of 15 for XGBoost. It does this silently. The run still finishes as normal, so you would not know unless you read the log.',
      '[Click 2 — the comparison]',
      'Does that change the answer? Not much. With the test off, the gain is 29 percent for the neural network and 22 for XGBoost. With it on, it is 32 and 20. But the second set averages over fewer runs. In plain words: on those repeats the test said, CRDA did not clearly help here, so do not use it. The paper’s table counts them anyway.',
      '[Click 3 — the takeaway]',
      'So the paper’s conclusion survives, but its averages include runs that its own test would reject. That is why we say the numbers are not like-for-like. We will state clearly which version we report in the final.',
    ],
  },
  next: {
    title: 'What is left',
    seconds: 75,
    lines: [
      '[{C}]',
      'To sum up, three findings. CRDA’s gains reproduce, on average in every run, within a few points of the paper. Plain XGBoost differs on Windows, for a reason we have not found. And the paper’s table keeps runs its own safety test would reject. One more question is open. The plain score comes from one model, but the CRDA score averages 10 models. Averaging usually lowers error by itself, so part of the gain might not come from CRDA. We have not tested that yet. If it explains much of the gain, we will say so honestly in the final.',
      '[Click — what we do before the final]',
      'Before the final presentation on 11 December, Alvi will test that question. Samim and I will write up the statistics and check every number. All four of us will make the final slides and rehearse to time. Our problem log has 17 entries: 8 resolved, 3 tested, 6 still open. Everything is in our group repository, so anyone can check our numbers. Thank you. Happy to take questions.',
    ],
  },
  references: {
    title: 'References',
    seconds: 8,
    lines: [
      '[Leave up during questions]',
      'Our sources are listed here. Happy to take questions.',
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
