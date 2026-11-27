/** Writes docs/speaker-notes.md from src/content/notes.ts. Run: npm run notes */
import { mkdirSync, writeFileSync } from 'node:fs';
import { speaking, members } from '../src/config/deck.config';
import { modelledSeconds, notes, spokenWords } from '../src/content/notes';

const name = (id: string) => members.find((m) => m.id === id)?.name ?? id;
const fmt = (s: number) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
const perPerson = new Map<string, number>();

const body = Object.entries(notes).flatMap(([id, n], i) => {
  const who = (speaking[id] ?? []).map(name).join(' + ');
  perPerson.set(who, (perPerson.get(who) ?? 0) + spokenWords(n));
  const lines = n.lines.map((l) => l.replace(/\{([ABCD])\}/g, (_, m) => name(m)));
  return [`## ${i + 1}. ${n.title} — ${who} (about ${n.seconds}s)`, '', ...lines.flatMap((l) => [l, ''])];
});

mkdirSync('docs', { recursive: true });
writeFileSync('docs/speaker-notes.md', [
  '# Speaker notes — final presentation (draft)',
  '',
  'Say these in your own words. Brackets are not spoken.',
  '',
  `Modelled length: **${fmt(modelledSeconds())}** (the brief is 12–15 minutes; time a real run with a stopwatch).`,
  '',
  `Words per person: ${[...perPerson].map(([k, v]) => `${k} ${v}`).join(' · ')}`,
  '',
  ...body,
].join('\n'));
console.log(`Modelled ${fmt(modelledSeconds())} | words ${[...perPerson].map(([k, v]) => `${k} ${v}`).join(', ')}`);
