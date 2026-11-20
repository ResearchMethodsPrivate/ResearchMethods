/**
 * Deck validation.
 *   npm run validate:deck   development checks
 *   npm run validate:ready  presentation-ready: also fails on every open team decision (the date)
 */
import { group, members, openDecisions, speaking, team } from '../src/config/deck.config';
import { notes, type SlideNotes } from '../src/content/notes';
import { references } from '../src/content/references';
import { fmt, slideTimings } from '../src/content/timing';
import { slides } from '../src/slides/index';

const ready = process.argv.includes('--ready');
const errors: string[] = [];
const warnings: string[] = [];
const fail = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);

// ── Presenters ───────────────────────────────────────────────────────────────
const expected = { A: 'Anik', B: 'Alvi', C: 'Atul', D: 'Samim' } as const;
if (members.length !== 4) fail(`Expected exactly 4 members, found ${members.length}`);
members.forEach((m) => { if (m.name !== expected[m.id]) fail(`Member ${m.id} should be "${expected[m.id]}", found "${m.name}"`); });

// ── Slide ids ↔ notes ↔ speaking split ───────────────────────────────────────
const ids = slides.map((s) => s.id as string);
const noteIds = Object.keys(notes);
if (ids.join() !== noteIds.join()) fail(`Slide order [${ids}] ≠ notes order [${noteIds}]`);
const spk = Object.keys(speaking);
ids.forEach((id) => {
  if (!spk.includes(id)) fail(`Slide "${id}" has no presenter in the speaking split`);
  (speaking[id] ?? []).forEach((m) => { if (!members.some((x) => x.id === m)) fail(`Slide "${id}": unknown presenter "${m}"`); });
});
spk.forEach((id) => { if (!ids.includes(id)) fail(`Speaking split names unknown slide "${id}"`); });
members.forEach((m) => { if (!ids.some((id) => speaking[id]?.includes(m.id))) fail(`${m.name} presents nothing`); });

// ── Click cues in the notes must match each slide's click-steps ──────────────
const linesOf = (id: string) => (notes as Record<string, SlideNotes>)[id].lines;
slides.forEach((s) => {
  const clicks = linesOf(s.id as string).filter((l) => /^\[Click/.test(l)).length;
  if (clicks !== s.steps) fail(`Slide "${s.id}": notes have ${clicks} click cues but the slide has ${s.steps} steps`);
});
// A slide shared by several people needs a cue naming each speaker after the first.
slides.forEach((s) => {
  (speaking[s.id as string] ?? []).slice(1).forEach((m) => {
    if (!linesOf(s.id as string).some((l) => l === `[{${m}}]`)) fail(`Slide "${s.id}": no speaker cue [{${m}}] in the notes`);
  });
});

// ── Rendered text ────────────────────────────────────────────────────────────
const rendered = Object.fromEntries(slides.map((s) => [s.id, s.html() + (s.source ?? '')]));
const notesText = Object.values(notes as Record<string, SlideNotes>).flatMap((n) => n.lines).join('\n');
const all = Object.values(rendered).join('\n') + notesText;
if (/TODO|PLACEHOLDER|TO DECIDE|Member [ABCD]\b/.test(all)) fail('Unresolved TODO / PLACEHOLDER / "Member X" text on a slide or in the notes');
members.forEach((m) => { if (!notesText.includes(m.name)) fail(`Speaker notes never mention ${m.name}`); });
const need = (id: string, re: RegExp, what: string) => { if (!re.test(rendered[id] ?? '')) fail(`Slide "${id}" is missing ${what}`); };
need('title', /ourselves/, 'the research question');
need('results', /Paper/, 'the “Paper” legend');
need('results', /p = 0\.00006/, 'the paired-test p-value');
need('matched', /Windows/, 'the Windows finding');
need('safety', /compared fairly/, 'the fairness caveat');
need('averaging', /10 models/, 'the 10-model explanation');
need('averaging', /Concrete/, 'the Concrete Strength results');
need('next', /Catch 2/, 'the second catch');
ids.filter((id) => id !== 'title' && id !== 'references').forEach((id) => {
  if (!slides.find((s) => s.id === id)?.source) fail(`Slide "${id}" has no source line`);
});
const refText = references.join(' ');
['Mohebbi', 'Wilcoxon', 'Tsanas', 'Yeh'].forEach((a) => { if (!refText.includes(a)) fail(`Reference list lacks ${a}`); });

// ── Timing: the Week 9 brief was 8–10 minutes; the simplified talk is shorter, so the floor is 6:00 (final: 12–15 min) ────────────────────────────────────────
const t = slideTimings();
const target = t.reduce((s, r) => s + r.target, 0);
const live = t.reduce((s, r) => s + r.live, 0);
if (target < 360 || target > 600) fail(`Target total ${fmt(target)} is outside 6:00–10:00`);
if (live < 360 || live > 600) fail(`Modelled live time ${fmt(live)} is outside 6:00–10:00`);
else if (live < 480) warn(`Modelled live time ${fmt(live)} is under the original Week 9 brief of 8:00–10:00`);
if (!t.every((r) => r.motionMeasured)) warn('motion.json lacks measured animation times — run `npm run qa:visual`');

// ── Presentation-ready decisions ─────────────────────────────────────────────
const open = openDecisions();
if (ready) open.forEach((d) => fail(`Open team decision: ${d}`));
else open.forEach((d) => warn(`Open team decision (fine for development): ${d}`));

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`Deck: ${ids.length} slides · presenters ${team.members.map((m) => m.name).join(', ')} · group ${group.name} · date ${group.date ?? 'not set'}`);
console.log(`Timing: target ${fmt(target)} · modelled live ${fmt(live)}`);
warnings.forEach((w) => console.log(`  ⚠ ${w}`));
errors.forEach((e) => console.log(`  ✗ ${e}`));
console.log(errors.length ? `FAILED (${errors.length})` : `PASSED${ready ? ' — presentation-ready' : ' — development checks'}`);
process.exit(errors.length ? 1 : 0);
