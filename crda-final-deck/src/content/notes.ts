/**
 * Draft speaker notes in plain English. Numbers come from derive.ts, so they update with new results.
 * The team should rewrite these in their own words. {A} {B} {C} {D} become names.
 */
import { data, exactRuns, fresh, plainGap, tally, tallyHolm } from './derive';

export interface SlideNotes {
  title: string;
  /** Target seconds. */
  seconds: number;
  lines: string[];
}

const h1 = tally('h1'), h2 = tally('h2'), h3a = tally('h3a');
const nn = tally('h3b', 'mlp'), xg = tally('h3b', 'xgboost');
const mac = exactRuns('Mac'), win = exactRuns('Windows');
const winX = plainGap('Windows', 'xgboost');
const waiting = data.pending.length
  ? `[Not all results are in yet: ${fresh.length} of 30. Re-check these numbers before rehearsing.]`
  : '[All 30 new results are in.]';

export const notes = {
  title: {
    title: 'Opening',
    seconds: 20,
    lines: [
      'Hello, we are the Fantastic Four: Anik, Alvi, Samim and Atul.',
      'We took a recent research paper, ran its code ourselves, and asked how much of it holds up.',
    ],
  },
  question: {
    title: 'Research question',
    seconds: 70,
    lines: [
      'Many problems ask a computer to predict a number: the strength of concrete, the heat a building needs, the price of a house. Often there are only a few hundred examples to learn from.',
      'The paper we chose promises help. Its method, CRDA, makes extra training examples. Across nine datasets, the authors report that the error falls by about twenty-three percent for a neural network, and six percent for a model called XGBoost.',
      'That is a strong claim, and it can be tested, because the authors published their code, their settings and the result of every run.',
      'Checking matters. Other people build on published results. If a gain depends on how it was measured, someone might choose a method that does not actually help them.',
      'So our question is: do the authors’ improvements hold up when we re-run their own code, and where do they not?',
    ],
  },
  background: {
    title: 'Background',
    seconds: 65,
    lines: [
      'Making extra training data is called data augmentation. For images it is easy: you can flip or crop a photo. For a table of numbers it is harder, because a made-up row can easily be wrong.',
      'There are three broad ideas. The first mixes real rows together. The second trains another model to invent new rows. The third is CRDA, which reuses the error the model already made.',
      'Mixing is simple: take two similar houses and blend their numbers. Inventing is more ambitious: a second model learns what rows look like and writes new ones. That needs data too, which is the very thing we are short of.',
      'In the paper’s own comparison, the methods that invent rows often made things worse. CRDA was more reliable. That is why it is worth checking.',
    ],
  },
  method: {
    title: 'How CRDA works',
    seconds: 70,
    lines: [
      'CRDA works in five steps. First, train a model on the real data. Second, for each row, keep the error: the true answer minus the model’s guess.',
      'Third, look for inputs that seem to have nothing to do with that error. Fourth, change those inputs a little, ask the model for a new guess, and add the same error back. That gives a new, labelled row.',
      'For example, imagine predicting the strength of concrete. The model guesses thirty, the truth is thirty-three, so the error is three. We change one safe ingredient slightly, the model now guesses thirty-one, and the new row gets the answer thirty-four.',
      'Fifth, a safety check tests whether the new rows really help, before the final training.',
      'The whole method rests on one assumption: the error does not depend on the inputs we changed. {B} will explain how we tested it.',
    ],
  },
  hypotheses: {
    title: 'Hypotheses',
    seconds: 70,
    lines: [
      'Before running anything new, we wrote down what we expected.',
      'One: CRDA has lower error than one plain model. Two: our result is within five points of the paper’s. Three comes in two parts: averaging ten plain models helps by itself, and CRDA still beats that average.',
      'To decide whether a difference is real, we use a standard test that compares the two errors split by split, over fifteen splits. A p-value under 0.05 counts.',
      'A p-value under 0.05 means a difference this one-sided would be unusual if there were no real effect. Because we run many such tests, some could pass by luck, so we also apply a correction called Holm, which makes the bar stricter.',
      'We had already seen four results when we wrote this, so we leave those out. These hypotheses were set in advance for the thirty new results only.',
    ],
  },
  design: {
    title: 'Study design',
    seconds: 75,
    lines: [
      'The paper’s main table has ninety results: nine datasets, five sizes, two models. This picture shows what we ran.',
      'We ran all five sizes of two datasets, and the smallest size of the other seven. That covers every dataset while fitting on our laptops.',
      'We used the authors’ code without changing it, their settings, and the same fifteen random splits, so we can compare split by split.',
      'A split decides which rows train the model and which rows test it. One split can be lucky, so fifteen give a fairer picture. The two models are quite different: a small neural network, and XGBoost, which combines many decision trees.',
      'We shared the work across four laptops, two Windows and two Mac, and kept each dataset on one laptop. That is a limit we return to.',
    ],
  },
  replication: {
    title: 'Results',
    seconds: 80,
    lines: [
      waiting,
      'Each point here is one result. Across is the paper’s change in error, up is ours. A point on the dashed line matches exactly. The green band is five points either side.',
      `${h2.yes} of ${h2.of} results fall within the band. So on the whole, the paper’s numbers reproduce.`,
      'The size of the gain varies a lot between datasets. Towards the bottom left, CRDA cuts the error by around forty percent. Near the top right, for example on Wine Quality, it barely changes anything, in the paper and in our runs.',
      `And in ${h1.yes} of ${h1.of}, CRDA clearly beats one plain model. We ran many tests, so some could pass by luck. After correcting for that, ${tallyHolm('h1')} still pass. {C} will show where the picture is less simple.`,
    ],
  },
  platforms: {
    title: 'Where it differs',
    seconds: 70,
    lines: [
      'Thanks. How close we got depends on the computer.',
      `On the Macs, ${mac.yes} of ${mac.of} results give exactly the authors’ numbers, on every split. On Windows, ${win.yes} of ${win.of} do.`,
      'So an exact match on a Mac mostly shows that the code repeats on similar hardware. It is weaker proof than an independent match.',
      'The Windows results are the more independent check, and they are mostly close. The clearest miss is on the smallest Energy Efficiency size with XGBoost, where our gain is about three percent and the paper reports thirteen.',
      `On Windows, even plain XGBoost, without CRDA, differs from the authors: it is exact in ${winX.exact} of ${winX.of} results. We do not know why.`,
    ],
  },
  extension: {
    title: 'Our extension',
    seconds: 85,
    lines: [
      'Next, our own test. In the code, the CRDA score is the average of ten models, but the plain score comes from just one. Averaging helps by itself, so that is not a fair race. We gave the plain model ten as well.',
      'Think of guessing the number of sweets in a jar. The average of ten people is usually closer than one person. So part of any ten-model score can come simply from averaging, with no new data at all.',
      `Averaging alone clearly helps in ${h3a.yes} of ${h3a.of} results.`,
      'In these charts, a mark to the left means CRDA is better than the ten plain models. A filled mark means the difference is clear.',
      `For the neural network, CRDA still clearly wins in ${nn.yes} of ${nn.of}. For XGBoost, it clearly wins in ${xg.yes} of ${xg.of}.`,
      'So for XGBoost, we found no clear gain that belongs to CRDA itself.',
    ],
  },
  weaknesses: {
    title: 'Weaknesses',
    seconds: 80,
    lines: [
      'We found four weaknesses. First, the unequal comparison you just saw. The paper describes one retrained model, but the code averages ten.',
      'Second, a setting that gives new rows less weight is carefully tuned, then not used by the models that produce the score. We have not tested the effect.',
      'Third, the safety check mixes real and new rows, so a copy can be tested while its original is used for training. That likely favours CRDA.',
      'That matters because the check is meant to protect users from cases where the new rows do harm. If it is too generous, harmful rows could get through.',
      'Fourth, the paper names an Intel server, yet our Macs often reproduce the saved numbers exactly. The files may come from a Mac. We cannot prove it.',
      'To be fair, the paper says openly that its main table ignores the safety check.',
    ],
  },
  ethics: {
    title: 'Ethics',
    seconds: 70,
    lines: [
      'Thanks, {C}. We recruited no people, so we needed no consent forms. But one dataset comes from people with Parkinson’s disease, so we use the public file and do not copy it into our repository.',
      'The authors’ code has an open licence. Computing costs energy: the authors report about eight kilowatt hours on their server. Our main runs took the laptop hours shown here; we did not measure energy.',
      'The datasets come from public collections, and we are checking the licence of each one. We point readers to the authors’ copy instead of passing the data on ourselves.',
      'Finally, honest reporting. We wrote our hypotheses first and show every result. CRDA can also make error worse, which matters if it is used for important decisions.',
    ],
  },
  verdict: {
    title: 'Conclusion',
    seconds: 70,
    lines: [
      `To conclude: the numbers mostly reproduce, with ${h2.yes} of ${h2.of} within five points. But not all of the gain belongs to CRDA. In a fair test it clearly wins in ${nn.yes} of ${nn.of} neural network results and ${xg.yes} of ${xg.of} XGBoost results.`,
      'Our advice to a reader is simple. If you can train ten models, compare CRDA with ten plain models first. It may be CRDA that you need for a neural network, but for XGBoost we would not assume it.',
      'Our limits: thirty-four of ninety results, mostly small sizes, and each dataset on only one kind of laptop.',
      'Next we would pass the tuned weight into the scoring models, compare with one retrained model, run everything on one system, and explain the Windows difference.',
    ],
  },
  roles: {
    title: 'Who did what',
    seconds: 45,
    lines: [
      'Each of us ran experiments on our own laptop and pushed the results to a shared repository, where they were checked against the raw files.',
      'Anik repeated our first results on a Mac and ran three datasets. I kept the comparison table and the problem log, and ran four datasets. Alvi ran Energy Efficiency and maintained the run scripts. Samim ran Concrete Strength and the safety check test.',
      'This slide shows each person’s part. Our statements give the details, including how we used AI tools.',
      'Thank you. We are happy to take questions.',
    ],
  },
  references: {
    title: 'References',
    seconds: 5,
    lines: ['[Leave up during questions]'],
  },
} satisfies Record<string, SlideNotes>;

export const WORDS_PER_MINUTE = 140;

export const spokenWords = (n: SlideNotes) =>
  n.lines.filter((l) => !l.startsWith('[')).join(' ').split(/\s+/).filter(Boolean).length;

/** Modelled live seconds: speech plus a few seconds per slide change and speaker handover. */
export const modelledSeconds = () =>
  Object.values(notes).reduce((s, n) => s + (spokenWords(n) / WORDS_PER_MINUTE) * 60 + 3, 0) + 3 * 3;
