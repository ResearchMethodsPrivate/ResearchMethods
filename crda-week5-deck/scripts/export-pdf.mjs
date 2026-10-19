/**
 * Static PDF fallback: serves dist/ with `vite preview`, opens it in headless
 * Chrome / Edge (via puppeteer-core, no browser download) with Reveal's ?print-pdf mode (every animation in its final
 * state, one slide per 1920×1080 page) and writes docs/crda-week5-deck.pdf.
 *
 * Run: npm run build && npm run pdf
 * Set CHROME_PATH if your browser is not in a standard location.
 */
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const PORT = 4174;
const OUT = resolve('docs/crda-week5-deck.pdf');

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);
const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error('No Chrome/Edge found. Set CHROME_PATH, or print manually (see README).');
  process.exit(1);
}
if (!existsSync('dist/index.html')) {
  console.error('dist/ missing — run `npm run build` first.');
  process.exit(1);
}

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: 'ignore',
});

const url = `http://localhost:${PORT}/?print-pdf`;
for (let i = 0; i < 50; i++) {
  try {
    const r = await fetch(url);
    if (r.ok) break;
  } catch { /* not up yet */ }
  await new Promise((r) => setTimeout(r, 200));
}

mkdirSync('docs', { recursive: true });
const chrome = await puppeteer.launch({ executablePath: browser, headless: true });
try {
  const page = await chrome.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pdf-page');
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1500)); // let Reveal finish laying out pages
  await page.pdf({ path: OUT, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
  console.log(`Wrote ${OUT}`);
} finally {
  await chrome.close();
  server.kill();
}
