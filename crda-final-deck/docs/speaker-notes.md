# Speaker notes — final presentation (draft)

Say these in your own words. Brackets are not spoken.

Modelled length: **12:21** (the brief is 12–15 minutes; time a real run with a stopwatch).

Words per person: Anik 453 · Alvi 405 · Samim 410 · Atul 343

## 1. Opening — Anik (about 20s)

Hello, we are the Fantastic Four: Anik, Alvi, Samim and Atul.

We took a recent research paper, ran its code ourselves, and asked how much of it holds up.

## 2. Research question — Anik (about 70s)

Many problems ask a computer to predict a number: the strength of concrete, the heat a building needs, the price of a house. Often there are only a few hundred examples to learn from.

The paper we chose promises help. Its method, CRDA, makes extra training examples. Across nine datasets, the authors report that the error falls by about twenty-three percent for a neural network, and six percent for a model called XGBoost.

That is a strong claim, and it can be tested, because the authors published their code, their settings and the result of every run.

Checking matters. Other people build on published results. If a gain depends on how it was measured, someone might choose a method that does not actually help them.

So our question is: do the authors’ improvements hold up when we re-run their own code, and where do they not?

## 3. Background — Anik (about 65s)

Making extra training data is called data augmentation. For images it is easy: you can flip or crop a photo. For a table of numbers it is harder, because a made-up row can easily be wrong.

There are three broad ideas. The first mixes real rows together. The second trains another model to invent new rows. The third is CRDA, which reuses the error the model already made.

Mixing is simple: take two similar houses and blend their numbers. Inventing is more ambitious: a second model learns what rows look like and writes new ones. That needs data too, which is the very thing we are short of.

In the paper’s own comparison, the methods that invent rows often made things worse. CRDA was more reliable. That is why it is worth checking.

## 4. How CRDA works — Anik (about 70s)

CRDA works in five steps. First, train a model on the real data. Second, for each row, keep the error: the true answer minus the model’s guess.

Third, look for inputs that seem to have nothing to do with that error. Fourth, change those inputs a little, ask the model for a new guess, and add the same error back. That gives a new, labelled row.

For example, imagine predicting the strength of concrete. The model guesses thirty, the truth is thirty-three, so the error is three. We change one safe ingredient slightly, the model now guesses thirty-one, and the new row gets the answer thirty-four.

Fifth, a safety check tests whether the new rows really help, before the final training.

The whole method rests on one assumption: the error does not depend on the inputs we changed. Alvi will explain how we tested it.

## 5. Hypotheses — Alvi (about 70s)

Before running anything new, we wrote down what we expected.

One: CRDA has lower error than one plain model. Two: our result is within five points of the paper’s. Three comes in two parts: averaging ten plain models helps by itself, and CRDA still beats that average.

To decide whether a difference is real, we use a standard test that compares the two errors split by split, over fifteen splits. A p-value under 0.05 counts.

A p-value under 0.05 means a difference this one-sided would be unusual if there were no real effect. Because we run many such tests, some could pass by luck, so we also apply a correction called Holm, which makes the bar stricter.

We had already seen four results when we wrote this, so we leave those out. These hypotheses were set in advance for the thirty new results only.

## 6. Study design — Alvi (about 75s)

The paper’s main table has ninety results: nine datasets, five sizes, two models. This picture shows what we ran.

We ran all five sizes of two datasets, and the smallest size of the other seven. That covers every dataset while fitting on our laptops.

We used the authors’ code without changing it, their settings, and the same fifteen random splits, so we can compare split by split.

A split decides which rows train the model and which rows test it. One split can be lucky, so fifteen give a fairer picture. The two models are quite different: a small neural network, and XGBoost, which combines many decision trees.

We shared the work across four laptops, two Windows and two Mac, and kept each dataset on one laptop. That is a limit we return to.

## 7. Results — Alvi (about 80s)

[Not all results are in yet: 22 of 30. Re-check these numbers before rehearsing.]

Each point here is one result. Across is the paper’s change in error, up is ours. A point on the dashed line matches exactly. The green band is five points either side.

21 of 22 results fall within the band. So on the whole, the paper’s numbers reproduce.

The size of the gain varies a lot between datasets. Towards the bottom left, CRDA cuts the error by around forty percent. Near the top right, for example on Wine Quality, it barely changes anything, in the paper and in our runs.

And in 19 of 22, CRDA clearly beats one plain model. We ran many tests, so some could pass by luck. After correcting for that, 15 still pass. Samim will show where the picture is less simple.

## 8. Where it differs — Samim (about 70s)

Thanks. How close we got depends on the computer.

On the Macs, 11 of 14 results give exactly the authors’ numbers, on every split. On Windows, 0 of 8 do.

So an exact match on a Mac mostly shows that the code repeats on similar hardware. It is weaker proof than an independent match.

The Windows results are the more independent check, and they are mostly close. The clearest miss is on the smallest Energy Efficiency size with XGBoost, where our gain is about three percent and the paper reports thirteen.

On Windows, even plain XGBoost, without CRDA, differs from the authors: it is exact in 0 of 4 results. We do not know why.

## 9. Our extension — Samim (about 85s)

Next, our own test. In the code, the CRDA score is the average of ten models, but the plain score comes from just one. Averaging helps by itself, so that is not a fair race. We gave the plain model ten as well.

Think of guessing the number of sweets in a jar. The average of ten people is usually closer than one person. So part of any ten-model score can come simply from averaging, with no new data at all.

Averaging alone clearly helps in 17 of 22 results.

In these charts, a mark to the left means CRDA is better than the ten plain models. A filled mark means the difference is clear.

For the neural network, CRDA still clearly wins in 7 of 11. For XGBoost, it clearly wins in 0 of 11.

So for XGBoost, we found no clear gain that belongs to CRDA itself.

## 10. Weaknesses — Samim (about 80s)

We found four weaknesses. First, the unequal comparison you just saw. The paper describes one retrained model, but the code averages ten.

Second, a setting that gives new rows less weight is carefully tuned, then not used by the models that produce the score. We have not tested the effect.

Third, the safety check mixes real and new rows, so a copy can be tested while its original is used for training. That likely favours CRDA.

That matters because the check is meant to protect users from cases where the new rows do harm. If it is too generous, harmful rows could get through.

Fourth, the paper names an Intel server, yet our Macs often reproduce the saved numbers exactly. The files may come from a Mac. We cannot prove it.

To be fair, the paper says openly that its main table ignores the safety check.

## 11. Ethics — Atul (about 70s)

Thanks, Samim. We recruited no people, so we needed no consent forms. But one dataset comes from people with Parkinson’s disease, so we use the public file and do not copy it into our repository.

The authors’ code has an open licence. Computing costs energy: the authors report about eight kilowatt hours on their server. Our main runs took the laptop hours shown here; we did not measure energy.

The datasets come from public collections, and we are checking the licence of each one. We point readers to the authors’ copy instead of passing the data on ourselves.

Finally, honest reporting. We wrote our hypotheses first and show every result. CRDA can also make error worse, which matters if it is used for important decisions.

## 12. Conclusion — Atul (about 70s)

To conclude: the numbers mostly reproduce, with 21 of 22 within five points. But not all of the gain belongs to CRDA. In a fair test it clearly wins in 7 of 11 neural network results and 0 of 11 XGBoost results.

Our advice to a reader is simple. If you can train ten models, compare CRDA with ten plain models first. It may be CRDA that you need for a neural network, but for XGBoost we would not assume it.

Our limits: thirty-four of ninety results, mostly small sizes, and each dataset on only one kind of laptop.

Next we would pass the tuned weight into the scoring models, compare with one retrained model, run everything on one system, and explain the Windows difference.

## 13. Who did what — Atul (about 45s)

Each of us ran experiments on our own laptop and pushed the results to a shared repository, where they were checked against the raw files.

Anik repeated our first results on a Mac and ran three datasets. I kept the comparison table and the problem log, and ran four datasets. Alvi ran Energy Efficiency and maintained the run scripts. Samim ran Concrete Strength and the safety check test.

This slide shows each person’s part. Our statements give the details, including how we used AI tools.

Thank you. We are happy to take questions.

## 14. References — Atul (about 5s)

[Leave up during questions]
