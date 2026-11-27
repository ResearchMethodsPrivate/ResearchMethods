/**
 * Reads the raw result files in ../results and the paper's saved values in data/paper.json,
 * and writes src/content/data.json. Every number on the slides comes from that file.
 * Run after any new result arrives:  npm run collect
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Cell, Data, Model, Person } from '../src/content/types';

const RESULTS = resolve('..', 'results');
const PAPER = JSON.parse(readFileSync(resolve('data/paper.json'), 'utf8')) as {
  cells: Record<string, { change: number; seeds: [number, number, number][] }>;
};

const FOLDERS: Record<Person, { dir: string; platform: 'Windows' | 'Mac' }> = {
  Alvi: { dir: 'alvi-windows-ryzen7', platform: 'Windows' },
  Anik: { dir: 'anik-mac-m2', platform: 'Mac' },
  Atul: { dir: 'atul-mac-m5-pro', platform: 'Mac' },
  Samim: { dir: 'samim-windows-i7-13620h', platform: 'Windows' },
};

/** The 30 new cells and who runs them (results/hypotheses.md and INSTRUCTIONS_WEEK12_RUNS.md). */
const NEW: [Person, string, number][] = [
  ...[153, 306, 459, 612].map((n): [Person, string, number] => ['Alvi', 'EnergyEfficiency', n]),
  ...[201, 402, 603, 804].map((n): [Person, string, number] => ['Samim', 'ConcreteCompressiveStrength', n]),
  ['Anik', 'HousePrice', 200], ['Anik', '503_wind', 1314], ['Anik', 'WineQuality', 1063],
  ['Atul', '623_fri_c4_1000_10', 200], ['Atul', '294_satellite_image', 1287],
  ['Atul', '227_cpu_small', 1638], ['Atul', 'ParkinsonsTelemonitoring', 1175],
];
/** Runs whose results we already knew when the hypotheses were written. */
const KNOWN: [Person, string, number][] = [
  ['Alvi', 'EnergyEfficiency', 765], ['Anik', 'EnergyEfficiency', 765], ['Samim', 'ConcreteCompressiveStrength', 1005],
];

const csv = (path: string) => {
  const [head, ...rows] = readFileSync(path, 'utf8').trim().split(/\r?\n/);
  const keys = head.split(',');
  return rows.map((r) => Object.fromEntries(r.split(',').map((v, i) => [keys[i], v])));
};
const dirs = (path: string) => readdirSync(path, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
const close = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.abs(b);

function readCell(who: Person, dataset: string, rows: number, model: Model, known: boolean): Cell | null {
  const base = join(RESULTS, FOLDERS[who].dir);
  const runDir = join(base, `${dataset}_n${rows}_15seeds`);
  const tenFile = join(base, `${dataset}_n${rows}_plain_10model`, `${model}.csv`);
  if (!existsSync(runDir) || !existsSync(tenFile)) return null;
  const runs = dirs(runDir).filter((d) => d.startsWith(`${model}_`)).sort();
  if (runs.length !== 1) throw new Error(`${runDir}: expected one ${model} run, found ${runs.length}`);
  const interim = join(runDir, runs[0], 'interim_results', `${dataset}_sample_${rows}_interim_results.csv`);
  const run = csv(interim);
  const ten = csv(tenFile);
  const paper = PAPER.cells[`${dataset}|${rows}|${model}`];
  const num = (list: Record<string, string>[], key: string) => list.map((r) => Number(r[key]));
  const mse = num(run, 'mse');
  const crda = num(run, 'aug_mse');
  if (run.length !== 15 || ten.length !== 15) throw new Error(`${interim}: expected 15 seeds`);
  run.forEach((r, i) => {
    if (Number(r.seed) !== paper.seeds[i][0] || ten[i].seed !== r.seed) throw new Error(`${interim}: seeds differ`);
    if (!close(Number(ten[i].plain_single_mse), mse[i]) || !close(Number(ten[i].crda_10model_mse), crda[i])) {
      throw new Error(`${tenFile}: does not match the run on seed ${r.seed}`);
    }
  });
  return {
    who, platform: FOLDERS[who].platform, dataset, rows, model, known,
    plain: mse, crda, plain10: num(ten, 'plain_10model_mse'),
    paperChange: paper.change,
    sameAsPaperPlain: mse.filter((v, i) => close(v, paper.seeds[i][1])).length,
    sameAsPaperCrda: crda.filter((v, i) => close(v, paper.seeds[i][2])).length,
  };
}

/** Total time of every main (Table 1) run in the repository, from the logs. */
function runHours(): number {
  let seconds = 0;
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { if (!['params', 'interim_results'].includes(e.name)) walk(p); }
      else if (/^table1.*\.log$/.test(e.name)) {
        for (const m of readFileSync(p, 'utf8').matchAll(/Total time taken: ([\d.]+) seconds/g)) seconds += Number(m[1]);
      }
    }
  };
  for (const f of Object.values(FOLDERS)) walk(join(RESULTS, f.dir));
  return seconds / 3600;
}

export function collect(): Data {
  const cells: Cell[] = [];
  const pending: Data['pending'] = [];
  for (const [list, known] of [[NEW, false], [KNOWN, true]] as const) {
    for (const [who, dataset, rows] of list) {
      for (const model of ['mlp', 'xgboost'] as const) {
        const cell = readCell(who, dataset, rows, model, known);
        if (cell) cells.push(cell);
        else if (known) throw new Error(`Missing known run: ${who} ${dataset} ${rows} ${model}`);
        else pending.push({ who, dataset, rows, model });
      }
    }
  }
  return { cells, pending, runHours: Math.round(runHours() * 10) / 10 };
}

if (process.argv[1]?.endsWith('collect.ts')) {
  const data = collect();
  writeFileSync(resolve('src/content/data.json'), JSON.stringify(data) + '\n');
  console.log(`cells: ${data.cells.filter((c) => !c.known).length} new, ${data.cells.filter((c) => c.known).length} known runs, ${data.pending.length} pending | main runs ${data.runHours} h`);
}
