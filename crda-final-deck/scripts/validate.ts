/**
 * npm run validate        checks that must always hold
 * npm run validate:ready  also fails while anything is unfinished before submission
 */
import { DRAFT, toConfirm } from '../src/config/deck.config';
import { data } from '../src/content/derive';
import { modelledSeconds } from '../src/content/notes';
import { slides } from '../src/slides/index';

const ready = process.argv.includes('--ready');
const errors: string[] = [];
const open: string[] = [];

const content = slides.length - 2; // title and references do not count
if (content < 10 || content > 12) errors.push(`${content} content slides; the brief asks for 10–12`);
const text = slides.map((s) => s.html()).join(' ').toLowerCase();
for (const [topic, word] of [
  ['research question', 'research question'], ['background', 'background'], ['hypotheses', 'hypotheses'],
  ['ethics', 'ethics'], ['study design', 'study design'], ['results', 'results'], ['future work', '<h3>next</h3>'],
  ['team roles', 'who did what'], ['references', 'references'],
]) if (!text.includes(word)) errors.push(`The brief requires: ${topic}`);

const seconds = modelledSeconds();
const length = `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`;
if (seconds < 12 * 60 || seconds > 15 * 60) open.push(`Modelled talk is ${length}; the brief asks for 12–15 minutes`);

if (data.pending.length) open.push(`${data.pending.length} results still pending (${[...new Set(data.pending.map((p) => p.who))].join(', ')}); run npm run collect when pushed`);
if (toConfirm.dataLicences) open.push('Data licences not checked yet');
if (!toConfirm.rolesAgreed) open.push('“Who did what” not confirmed by everyone');
if (DRAFT) open.push('Still marked DRAFT (the team has not rewritten and approved it)');

console.log(`${slides.length} slides (${content} content) · modelled ${length}`);
errors.forEach((e) => console.log(`  ✖ ${e}`));
open.forEach((o) => console.log(`  ${ready ? '✖' : '⚠'} ${o}`));
const failed = errors.length > 0 || (ready && open.length > 0);
console.log(failed ? 'NOT READY' : 'PASSED');
process.exit(failed ? 1 : 0);
