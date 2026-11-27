/** Every slide number comes from data.json; these tests tie that file to the raw results. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { collect } from '../../scripts/collect';
import { data, exactRuns, fresh, tally, tallyHolm } from '../../src/content/derive';
import { holm, wilcoxonLess } from '../../src/lib/stats';

test('data.json is up to date with the raw result files (run npm run collect)', () => {
  assert.deepEqual(data, JSON.parse(JSON.stringify(collect())));
});

test('every planned new result is either present or listed as pending', () => {
  assert.equal(fresh.length + data.pending.length, 30);
  assert.equal(data.cells.filter((c) => c.known).length, 6);
});

test('paper values match the table written before the runs (results/hypotheses.md)', () => {
  const plan = readFileSync(resolve('..', 'results', 'hypotheses.md'), 'utf8');
  for (const c of data.cells) {
    const row = plan.split(/\r?\n/).find((l) => l.startsWith(`| ${c.dataset}`) && l.includes(`| ${c.rows} |`));
    assert.ok(row, `${c.dataset} ${c.rows} is in the plan`);
    const [mlp, xgb] = row.split('|').slice(3, 5).map((v) => Number(v.replace('−', '-').replace('%', '').trim()));
    assert.ok(Math.abs((c.model === 'mlp' ? mlp : xgb) - c.paperChange) < 0.006, `${c.dataset} ${c.rows} ${c.model}`);
  }
});

// Counts checked separately with scipy for the first 22 cells; they stay true when Samim's arrive.
test('hypothesis counts for Alvi, Anik and Atul match the independent scipy check', () => {
  const cells = fresh.filter((c) => c.who !== 'Samim');
  assert.equal(cells.length, 22);
  assert.deepEqual([tally('h1', undefined, cells).yes, tally('h2', undefined, cells).yes, tally('h3a', undefined, cells).yes, tally('h3b', undefined, cells).yes], [19, 21, 17, 7]);
  assert.deepEqual([tallyHolm('h1', cells), tallyHolm('h3a', cells), tallyHolm('h3b', cells)], [15, 13, 6]);
  assert.deepEqual([exactRuns('Mac', cells), exactRuns('Windows', cells)], [{ yes: 11, of: 14 }, { yes: 0, of: 8 }]);
});

test('exact Wilcoxon and Holm behave as defined', () => {
  const up = Array.from({ length: 15 }, (_, i) => i + 1);
  assert.equal(wilcoxonLess(up.map(() => 0), up), 1 / 2 ** 15);
  assert.equal(wilcoxonLess(up, up.map(() => 0)), 1);
  assert.deepEqual(holm([0.01, 0.04, 0.03]), [true, false, false]);
});

test('claims worded on the slides still hold (reword the slide if this fails)', () => {
  assert.ok(tally('h2').yes > tally('h2').of / 2, '“Most of the paper’s gains reproduce”');
  assert.ok(tally('h3b', 'xgboost').yes < tally('h3b', 'xgboost').of / 4, '“for XGBoost we found no clear gain”: check the notes');
  assert.equal(exactRuns('Windows').yes, 0, '“close, not identical” on Windows');
});
