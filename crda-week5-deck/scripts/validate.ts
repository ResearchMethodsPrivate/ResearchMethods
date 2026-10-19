/**
 * Deck validation.
 *   npm run validate:deck   development checks — passes while roles/scope are proposed
 *   npm run validate:ready  presentation-ready — also fails on every open team decision
 */
import {
  group, members, milestones, openDecisions, rolesStatus, scope, speaking, team,
} from '../src/config/deck.config';
import { notes, type SlideNotes } from '../src/content/notes';
import { datasets } from '../src/content/paper';
import { references } from '../src/content/references';
import { fmt, slideTimings } from '../src/content/timing';
import { slides } from '../src/slides/index';

const ready = process.argv.includes('--ready');
const errors: string[] = [];
const warnings: string[] = [];
const fail = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);

// ── Presenters ───────────────────────────────────────────────────────────────
const expected = { A: 'Anik', B: 'Alvi', C: 'Atul' } as const;
if (members.length !== 3) fail(`Expected exactly 3 presenters, found ${members.length}`);
members.forEach((m) => {
  if (m.name !== expected[m.id]) fail(`Member ${m.id} should be "${expected[m.id]}", found "${m.name}"`);
  if (!members.some((o) => o.id === m.checks) || m.checks === m.id) fail(`${m.name}: invalid cross-check target "${m.checks}"`);
});
members.forEach((m) => {
  if (!members.some((o) => o.checks === m.id)) fail(`Nobody cross-checks ${m.name}'s work`);
});

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
members.forEach((m) => {
  if (!ids.some((id) => id !== 'team' && speaking[id]?.includes(m.id))) fail(`${m.name} presents no slide besides the team slide`);
  if (!speaking.team?.includes(m.id)) fail(`${m.name} does not speak to their own card on the team slide`);
});

// ── Milestones ───────────────────────────────────────────────────────────────
if (milestones.length < 3 || milestones.length > 5) fail(`Brief asks for 3–5 targets; found ${milestones.length}`);
milestones.forEach((m) => {
  if (!m.owners.length) fail(`Milestone "${m.title}" has no owner`);
  m.owners.forEach((o) => { if (!members.some((x) => x.id === o)) fail(`Milestone "${m.title}": unknown owner "${o}"`); });
  if (!m.doneWhen || !m.evidence || !m.due) fail(`Milestone "${m.title}" lacks done-when / evidence / due`);
});
const targetClicks = notes.targets.lines.filter((l) => l.startsWith('[Click')).length;
const targetSlide = slides.find((s) => s.id === 'targets');
if (targetSlide && targetClicks !== targetSlide.steps) fail(`Targets notes have ${targetClicks} click cues but the slide has ${targetSlide.steps} steps`);

// ── Rendered text: unresolved values, required labels, citations ────────────
const rendered = Object.fromEntries(slides.map((s) => [s.id, s.html() + (s.source ?? '')]));
const notesText = Object.values(notes as Record<string, SlideNotes>).flatMap((n) => n.lines).join('\n');
const all = Object.values(rendered).join('\n') + notesText;
if (/TODO|PLACEHOLDER|Member [ABC]\b/.test(all)) fail('Unresolved TODO / PLACEHOLDER / "Member X" text on a slide or in the notes');
['Anik', 'Alvi', 'Atul'].forEach((n) => { if (!notesText.includes(n)) fail(`Speaker notes never mention ${n}`); });

const need = (id: string, re: RegExp, what: string) => { if (!re.test(rendered[id] ?? '')) fail(`Slide "${id}" is missing ${what}`); };
need('plan', /Original authors’ reported results/, 'the "Original authors’ reported results" label');
need('plan', /not our group’s reproduced results/, 'the "not our group’s reproduced results" label');
['title', 'problem', 'naive', 'mechanism', 'assumption'].forEach((id) => need(id, /illustrative/i, 'an "illustrative" label on its graphic'));
need('mechanism', /p = 0\.1/, 'the repo-default perturbation range');
need('mechanism', /numeric feature/, 'the numeric-feature wording');
if (/garage finish \(|×\s*1\.45|garage finish ×/i.test(rendered.mechanism)) fail('Slide 4 still presents garage finish as the perturbed numeric feature');
need('assumption', /not a guarantee/, 'the gate caveat');
ids.filter((id) => id !== 'title' && id !== 'references').forEach((id) => {
  if (!slides.find((s) => s.id === id)?.source) fail(`Slide "${id}" has no source line`);
});
const refText = references.join(' ');
['Mohebbi', 'Chawla', 'Yao', 'Xu', 'Kotelnikov', 'Spirtes', 'Wilcoxon', 'Pearl'].forEach((a) => {
  if (!refText.includes(a)) fail(`Reference list lacks ${a}`);
});
scope.datasets.forEach((d) => { if (!datasets[d]) fail(`Unknown dataset in scope: ${d}`); });

// ── Timing ───────────────────────────────────────────────────────────────────
const t = slideTimings();
const target = t.reduce((s, r) => s + r.target, 0);
const live = t.reduce((s, r) => s + r.live, 0);
if (target < 360 || target > 480) fail(`Target total ${fmt(target)} is outside 6:00–8:00`);
if (live < 360 || live > 480) fail(`Modelled live time ${fmt(live)} is outside 6:00–8:00`);
else if (live < 405 || live > 435) warn(`Modelled live time ${fmt(live)} is outside the 6:45–7:15 sweet spot`);
if (!t.every((r) => r.motionMeasured)) warn('motion.json lacks measured animation times — run `npm run qa:visual`');

// ── Presentation-ready decisions ─────────────────────────────────────────────
const open = openDecisions();
if (ready) open.forEach((d) => fail(`Open team decision: ${d}`));
else open.forEach((d) => warn(`Open team decision (fine for development): ${d}`));

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`Deck: ${ids.length} slides · presenters ${team.members.map((m) => m.name).join(', ')} · roles ${rolesStatus} · group ${group.name ?? '—'}`);
console.log(`Timing: target ${fmt(target)} · modelled live ${fmt(live)}`);
warnings.forEach((w) => console.log(`  ⚠ ${w}`));
errors.forEach((e) => console.log(`  ✗ ${e}`));
console.log(errors.length ? `FAILED (${errors.length})` : `PASSED${ready ? ' — presentation-ready' : ' — development checks'}`);
process.exit(errors.length ? 1 : 0);
