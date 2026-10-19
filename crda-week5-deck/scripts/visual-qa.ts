/**
 * Real-browser visual QA (Playwright Chromium, headless) against dist/.
 * Writes docs/visual-qa/:
 *   NN-id-sK.png          every Reveal fragment / GSAP step (s0 = intro end)
 *   NN-id-sK-PP.jpg       25/50/75 % through every animated segment (exact timeline seek)
 *   04-mechanism-mid-copy.png   halfway through the residual carry
 *   vp-1366x768/, vp-1280x720/  full-state captures at other 16:9 sizes
 *   explore-*.png         the optional OpenUI panel
 *   04-mechanism.webm     real-time clip of slide 4 with natural click timing
 *   contact-sheet.png     every step state on one page
 *   qa-report.json        automated findings (requests, console, overflow, scrollbars)
 * and src/content/motion.json (measured animation durations for the timing model).
 * Run: npm run qa:visual
 */
import { mkdirSync, rmSync, writeFileSync, readdirSync, renameSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Page } from 'playwright-core';
import { goSlide, launch, openDeck, serveDist, settle, state } from '../tests/browser/harness';
import { slides } from '../src/slides/index';

const OUT = resolve('docs/visual-qa');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const nn = (i: number) => String(i + 1).padStart(2, '0');
const seek = (page: Page, t: number) =>
  page.evaluate((tt) => (window as unknown as { __crda: { stage: { seek(t: number): void } } }).__crda.stage.seek(tt), t);

/** Visible elements of the current slide that stick out of the 1920×1080 frame. */
const outOfFrame = (page: Page) => page.evaluate(() => {
  const sec = (window as unknown as { deck: { getCurrentSlide(): HTMLElement } }).deck.getCurrentSlide();
  const f = sec.getBoundingClientRect();
  const bad: string[] = [];
  sec.querySelectorAll('*').forEach((el) => {
    if (el.closest('aside.notes') || el.classList.contains('step-marker')) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    let n: Element | null = el, op = 1;
    while (n && n !== sec) { op *= Number(getComputedStyle(n).opacity); n = n.parentElement; }
    if (op < 0.05) return;
    if (r.left < f.left - 2 || r.top < f.top - 2 || r.right > f.right + 2 || r.bottom > f.bottom + 2) {
      bad.push(`${el.tagName.toLowerCase()}.${(el.getAttribute('class') ?? '').split(' ')[0]} "${(el.textContent ?? '').trim().slice(0, 40)}"`);
    }
  });
  return [...new Set(bad)].slice(0, 12);
});

const scrollbars = (page: Page) => page.evaluate(() => {
  const d = document.documentElement;
  return d.scrollWidth > innerWidth + 1 || d.scrollHeight > innerHeight + 1;
});

const report: Record<string, unknown> = { generated: new Date().toISOString() };
const served = await serveDist();
const browser = await launch();
report.browser = `Chromium ${browser.version()} (Playwright ${(await import('playwright-core/package.json', { with: { type: 'json' } })).default.version}, headless)`;

try {
  // ── 1920×1080: every step + intermediate frames ───────────────────────────
  const w = await openDeck(browser, served.url + '#/0');
  const { page } = w;
  const motion: Record<string, { intro: number; steps: number[] }> = {};
  const overflow: Record<string, string[]> = {};
  const captures: { file: string; caption: string }[] = [];

  for (let i = 0; i < slides.length; i++) {
    const def = slides[i];
    if (i > 0) await page.keyboard.press('ArrowRight'); // real forward navigation → intro plays
    await settle(page);
    await page.waitForTimeout(900); // Reveal fade must also be complete before the s0 capture
    const st = await state(page);
    const labels = st.labels;
    const marks = [0, ...Array.from({ length: def.steps + 1 }, (_, k) => labels[`s${k}`])];
    motion[def.id] = { intro: labels.s0, steps: Array.from({ length: def.steps }, (_, k) => +(labels[`s${k + 1}`] - labels[`s${k}`]).toFixed(3)) };

    for (let k = 0; k <= def.steps; k++) {
      if (k > 0) { await page.keyboard.press('ArrowRight'); await settle(page); }
      const file = `${nn(i)}-${def.id}-s${k}.png`;
      await page.screenshot({ path: join(OUT, file) });
      captures.push({ file, caption: `${nn(i)} ${def.id} · s${k}` });
      const [a, b] = [marks[k], marks[k + 1]];
      if (b - a > 0.4) {
        for (const pct of [25, 50, 75]) {
          await seek(page, a + ((b - a) * pct) / 100);
          await page.screenshot({ path: join(OUT, `${nn(i)}-${def.id}-s${k}-${pct}.jpg`), type: 'jpeg', quality: 72 });
        }
        if (def.id === 'mechanism' && k === 3) {
          await seek(page, a + (b - a) * 0.4);
          await page.screenshot({ path: join(OUT, '04-mechanism-mid-copy.png') });
        }
        await seek(page, b);
      }
    }
    const of = await outOfFrame(page);
    if (of.length) overflow[def.id] = of;
  }
  report.motionSeconds = motion;
  report.outOfFrame1920 = overflow;
  report.scrollbars1920 = await scrollbars(page);

  // ── Optional OpenUI explorer ──────────────────────────────────────────────
  await goSlide(page, 3, 3);
  await settle(page);
  await page.waitForTimeout(900);
  await page.keyboard.press('e');
  await page.waitForSelector('[data-openui="Explorer"]');
  await page.screenshot({ path: join(OUT, 'explore-1-stages.png') });
  await page.getByRole('tab', { name: 'Assumption' }).click();
  await page.getByRole('radio', { name: /Violated/ }).click();
  await page.screenshot({ path: join(OUT, 'explore-2-violated.png') });
  await page.getByRole('tab', { name: 'Claims vs plan' }).click();
  await page.screenshot({ path: join(OUT, 'explore-3-claims.png') });
  await page.keyboard.press('Escape');
  report.exploreClosed = (await page.$('.ox-overlay')) === null;

  // ── Fullscreen ────────────────────────────────────────────────────────────
  await page.keyboard.press('f');
  await page.waitForTimeout(600);
  report.fullscreenEntered = await page.evaluate(() => document.fullscreenElement !== null);
  await page.screenshot({ path: join(OUT, 'fullscreen.png') });
  await page.evaluate(() => document.fullscreenElement && document.exitFullscreen());

  report.remoteRequests = w.remote;
  report.consoleErrors = w.consoleErrors;
  report.failedLoads = w.failed;
  await page.context().close();

  // ── Other 16:9 sizes: full (final) state of every slide ───────────────────
  for (const [vw, vh] of [[1366, 768], [1280, 720]]) {
    const dir = join(OUT, `vp-${vw}x${vh}`);
    mkdirSync(dir, { recursive: true });
    const v = await openDeck(browser, served.url + '#/0', { viewport: { width: vw, height: vh } });
    const sb: string[] = [];
    for (let i = 0; i < slides.length; i++) {
      await goSlide(v.page, i, slides[i].steps - 1);
      await settle(v.page);
      await v.page.waitForTimeout(900); // let Reveal's slide fade finish (settle() tracks GSAP only)
      await v.page.screenshot({ path: join(dir, `${nn(i)}-${slides[i].id}-final.png`) });
      if (await scrollbars(v.page)) sb.push(slides[i].id);
    }
    report[`scrollbars${vw}x${vh}`] = sb;
    await v.page.context().close();
  }

  // ── Real-time clip of slide 4 ─────────────────────────────────────────────
  const vctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, recordVideo: { dir: join(OUT, 'video-tmp'), size: { width: 1920, height: 1080 } } });
  const vp = await vctx.newPage();
  await vp.goto(served.url + '#/2/0/1');
  await vp.waitForFunction(() => (window as unknown as { __crda?: unknown }).__crda !== undefined);
  await settle(vp);
  await vp.waitForTimeout(800);
  await vp.keyboard.press('ArrowRight'); // enter slide 4: curve + sample i
  for (const pause of [3200, 3600, 4200, 4400, 4200]) {
    await vp.waitForTimeout(pause);
    await vp.keyboard.press('ArrowRight');
  }
  await vp.waitForTimeout(1500);
  await vctx.close();
  const [vid] = readdirSync(join(OUT, 'video-tmp'));
  renameSync(join(OUT, 'video-tmp', vid), join(OUT, '04-mechanism.webm'));
  rmSync(join(OUT, 'video-tmp'), { recursive: true });

  // ── Contact sheet ─────────────────────────────────────────────────────────
  const sheet = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#04060d;color:#a7b1ca;font:14px system-ui;padding:16px}
    .g{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
    figure{margin:0} img{width:100%;display:block;border:1px solid #223} figcaption{padding:4px 0}</style>
    <h1 style="color:#eef1f8;font-size:20px">CRDA Week 5 — every step state at 1920×1080 (${report.browser})</h1>
    <div class="g">${captures.map((c) => `<figure><img src="${c.file}"><figcaption>${c.caption}</figcaption></figure>`).join('')}</div>`;
  writeFileSync(join(OUT, 'contact-sheet.html'), sheet);
  const cs = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await cs.goto(pathToFileURL(join(OUT, 'contact-sheet.html')).href);
  await cs.waitForLoadState('load');
  await cs.screenshot({ path: join(OUT, 'contact-sheet.png'), fullPage: true });
  await cs.close();

  writeFileSync('src/content/motion.json', JSON.stringify(motion, null, 2) + '\n');
  writeFileSync(join(OUT, 'qa-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ ...report, motionSeconds: undefined }, null, 2));
  console.log(`Wrote ${readdirSync(OUT).length} entries to ${OUT}`);
} finally {
  await browser.close();
  served.stop();
}
