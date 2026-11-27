/** The three figures, drawn as SVG from the checked results. */
import { data, fresh, MODEL, NAMES, signed, type Scored } from '../content/derive';
import type { Model, Person } from '../content/types';

const COLOUR: Record<Person, string> = { Alvi: 'var(--cyan)', Anik: 'var(--violet)', Atul: 'var(--green)', Samim: 'var(--amber)' };
const short = (c: { dataset: string; rows: number }) => `${NAMES[c.dataset]} ${c.rows}`;

const dot = (x: number, y: number, model: Model, colour: string, filled = true) => {
  const paint = `fill="${filled ? colour : 'transparent'}" stroke="${colour}" stroke-width="3"`;
  return model === 'mlp' ? `<circle cx="${x}" cy="${y}" r="10" ${paint}/>` : `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" ${paint}/>`;
};

/** Our change against the paper's change, with the ±5-point band of H2. */
export function scatter(): string {
  const W = 1060, H = 650, L = 100, B = 80, T = 16, R = 20;
  const values = fresh.flatMap((c) => [c.change, c.paperChange]);
  const lo = Math.floor((Math.min(...values) - 3) / 10) * 10;
  const hi = Math.ceil((Math.max(...values) + 3) / 10) * 10;
  const x = (v: number) => L + ((v - lo) / (hi - lo)) * (W - L - R);
  const y = (v: number) => H - B - ((v - lo) / (hi - lo)) * (H - B - T);
  const ticks = Array.from({ length: (hi - lo) / 10 + 1 }, (_, i) => lo + i * 10);
  const grid = ticks.map((t) => `
    <line class="g" x1="${x(t)}" x2="${x(t)}" y1="${T}" y2="${H - B}"/><line class="g" x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}"/>
    <text x="${x(t)}" y="${H - B + 32}" text-anchor="middle">${t}%</text><text x="${L - 14}" y="${y(t) + 8}" text-anchor="end">${t}%</text>`).join('');
  const band = `<polygon class="band" points="${x(lo)},${y(lo + 5)} ${x(hi - 5)},${y(hi)} ${x(hi)},${y(hi)} ${x(hi)},${y(hi - 5)} ${x(lo + 5)},${y(lo)} ${x(lo)},${y(lo)}"/>`;
  const outside = fresh.filter((c) => !c.h2).map((c) =>
    `<text class="call" text-anchor="end" x="${x(c.paperChange) - 18}" y="${y(c.change) + 7}">${short(c)}, ${MODEL[c.model]}</text>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Our change against the paper's change for each new result">
    ${grid}${band}<line class="same" x1="${x(lo)}" y1="${y(lo)}" x2="${x(hi)}" y2="${y(hi)}"/>
    ${fresh.map((c) => dot(x(c.paperChange), y(c.change), c.model, COLOUR[c.who])).join('')}${outside}
    <text class="axis" x="${(L + W) / 2}" y="${H - 8}" text-anchor="middle">Paper: change in error</text>
    <text class="axis" transform="translate(24 ${(H - B) / 2}) rotate(-90)" text-anchor="middle">Ours: change in error</text>
  </svg>`;
}

export const scatterKey = () =>
  `${(Object.keys(COLOUR) as Person[]).filter((p) => fresh.some((c) => c.who === p)).map((p) => `<span><i style="background:${COLOUR[p]}"></i>${p}</span>`).join('')}
   <span>● neural network</span><span>■ XGBoost</span>`;

/** CRDA against the average of 10 plain models, one row per result. Filled = clearly better. */
export function forest(model: Model): string {
  const rows: Scored[] = fresh.filter((c) => c.model === model).sort((a, b) => NAMES[a.dataset].localeCompare(NAMES[b.dataset]) || a.rows - b.rows);
  const all = fresh.map((c) => c.over);
  const lo = Math.floor(Math.min(...all, -10) / 10) * 10;
  const hi = Math.ceil(Math.max(...all, 10) / 10) * 10;
  const W = 820, L = 340, R = 100, step = 46, T = 44;
  const H = T + rows.length * step + 30;
  const x = (v: number) => L + ((v - lo) / (hi - lo)) * (W - L - R);
  const colour = model === 'mlp' ? 'var(--cyan)' : 'var(--violet)';
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${MODEL[model]}: CRDA compared with the 10-model average">
    <text class="side" x="${x(0) - 12}" y="20" text-anchor="end">← CRDA better</text><text class="side" x="${x(0) + 12}" y="20">worse →</text>
    <line class="zero" x1="${x(0)}" x2="${x(0)}" y1="${T - 8}" y2="${H - 22}"/>
    ${rows.map((c, i) => {
      const y = T + i * step + 12;
      return `<text x="${L - 24}" y="${y + 7}" text-anchor="end">${short(c)}</text>
        <line class="stem" x1="${x(0)}" x2="${x(c.over)}" y1="${y}" y2="${y}" stroke="${colour}"/>
        ${dot(x(c.over), y, model, colour, c.h3b)}<text class="val" x="${W}" y="${y + 7}" text-anchor="end">${signed(c.over)}</text>`;
    }).join('')}
  </svg>`;
}

/** The paper's 9 datasets × 5 sizes, coloured by who ran each (both models). */
export function coverage(): string {
  const sizes: Record<string, number[]> = {
    EnergyEfficiency: [153, 306, 459, 612, 765], ConcreteCompressiveStrength: [201, 402, 603, 804, 1005],
    HousePrice: [200, 400, 600, 800, 1000], '623_fri_c4_1000_10': [200, 400, 600, 800, 1000],
    WineQuality: [1063, 2126, 3189, 4252, 5315], ParkinsonsTelemonitoring: [1175, 2350, 3525, 4700, 5875],
    '294_satellite_image': [1287, 2574, 3861, 5148, 6435], '503_wind': [1314, 2628, 3942, 5256, 6570],
    '227_cpu_small': [1638, 3276, 4914, 6552, 8190],
  };
  const rows = Object.entries(sizes).map(([d, list]) => {
    const boxes = list.map((n) => {
      const done = data.cells.filter((c) => c.dataset === d && c.rows === n);
      const wait = data.pending.find((c) => c.dataset === d && c.rows === n);
      if (done.length) {
        const known = done.every((c) => c.known);
        return `<span class="box ${known ? 'known' : ''}" style="--c:${COLOUR[done[0].who]}">${n}</span>`;
      }
      if (wait) return `<span class="box wait" style="--c:${COLOUR[wait.who]}">${n}</span>`;
      return `<span class="box off">${n}</span>`;
    }).join('');
    return `<div class="cov-row" data-in><b>${NAMES[d]}</b>${boxes}</div>`;
  }).join('');
  const people = (Object.keys(COLOUR) as Person[]).map((p) => `<span><i style="background:${COLOUR[p]}"></i>${p}</span>`).join('');
  return `<div class="cov">${rows}</div><p class="key">${people}<span class="k-known">outline = run before the hypotheses</span><span class="k-off">grey = not run</span></p>`;
}
