/**
 * Static PDF fallback: serves dist/ with `vite preview`, opens Reveal's
 * ?print-pdf mode in Playwright's headless Chromium (every animation in its
 * final state, one slide per 1920×1080 page) and writes docs/crda-week5-deck.pdf.
 *
 * Run: npm run build && npm run pdf
 */
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { launch, serveDist } from '../tests/browser/harness';

const OUT = resolve('docs/crda-week5-deck.pdf');
const served = await serveDist();
const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(served.url + '?print-pdf', { waitUntil: 'networkidle' });
  await page.waitForSelector('.pdf-page');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500); // Reveal finishes laying out pages
  mkdirSync('docs', { recursive: true });
  await page.pdf({ path: OUT, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
  console.log(`Wrote ${OUT}`);
} finally {
  await browser.close();
  served.stop();
}
