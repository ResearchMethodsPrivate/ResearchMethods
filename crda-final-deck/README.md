# Final presentation (draft)

Week 12, 11 December 2026. 14 slides: title, 12 content slides, references.

- **Read it:** [`docs/crda-final-slides.pdf`](docs/crda-final-slides.pdf) and [`docs/speaker-notes.md`](docs/speaker-notes.md).
- **Run it** (Node 20 or newer): `npm ci`, then `npm run dev`. Press `S` for speaker view.

## When new results arrive

```
npm run collect        # re-reads ../results and updates every number
npm test               # numbers match the raw files; slide wording still holds
npm run build && npm run pdf && npm run notes
npm run test:browser   # nothing runs off a slide
```

If the last unit test fails, the new results contradict a sentence on a slide: reword it.

## Where things are

| What | File |
|---|---|
| Speakers, draft mark, items to confirm | `src/config/deck.config.ts` |
| Slide text | `src/slides/` |
| Speaker notes | `src/content/notes.ts` |
| References (ACM style, numbered automatically) | `src/content/references.ts` |
| Paper values (from the authors' saved results, MIT licence) | `data/paper.json` |

## Before submitting (`npm run validate:ready` lists what is open)

1. Samim's 8 results in, then `npm run collect`.
2. Dataset licences checked, then clear `toConfirm.dataLicences`.
3. Everyone checks their line on "Who did what".
4. Everyone rewrites their slides and notes **in their own words**; then set `DRAFT = false`.
5. Rehearse with a stopwatch: 12 to 15 minutes.
