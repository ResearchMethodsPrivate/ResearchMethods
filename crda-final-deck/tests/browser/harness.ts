/**
 * Shared browser harness: serves dist/ with `vite preview` and drives
 * Playwright's Chromium. Every request is recorded so tests can assert the
 * deck is fully offline (localhost only).
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium, type Browser, type Page, type BrowserContextOptions } from 'playwright-core';

export interface Served { url: string; stop: () => void }

export async function serveDist(port = 4180 + Math.floor(Math.random() * 400)): Promise<Served> {
  if (!existsSync('dist/index.html')) throw new Error('dist/ missing — run `npm run build` first');
  const child: ChildProcess = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(port), '--strictPort'], { stdio: 'ignore' });
  const url = `http://localhost:${port}/`;
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(url)).ok) return { url, stop: () => child.kill() }; } catch { /* starting */ }
    await new Promise((r) => setTimeout(r, 150));
  }
  child.kill();
  throw new Error('vite preview did not start');
}

export const launch = (): Promise<Browser> =>
  chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--force-color-profile=srgb'] });

export interface Watched { page: Page; remote: string[]; consoleErrors: string[]; failed: string[] }

export async function openDeck(browser: Browser, url: string, opts: BrowserContextOptions = {}): Promise<Watched> {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, ...opts });
  const page = await ctx.newPage();
  const remote: string[] = [];
  const consoleErrors: string[] = [];
  const failed: string[] = [];
  page.on('request', (r) => { const u = new URL(r.url()); if (!['localhost', '127.0.0.1'].includes(u.hostname) && !u.protocol.startsWith('data') && u.protocol !== 'blob:') remote.push(r.url()); });
  page.on('requestfailed', (r) => failed.push(`${r.url()} — ${r.failure()?.errorText}`));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  await page.goto(url);
  await page.waitForFunction(() => (window as unknown as { __crda?: unknown }).__crda !== undefined);
  return { page, remote, consoleErrors, failed };
}

export interface DeckState { step: number; time: number | null; target: number | null; labels: Record<string, number>; duration: number; animating: boolean }

export const state = (page: Page) =>
  page.evaluate(() => (window as unknown as { __crda: { stage: { debugState(): DeckState } } }).__crda.stage.debugState());

export const indices = (page: Page) =>
  page.evaluate(() => (window as unknown as { deck: { getIndices(): { h: number; f?: number } } }).deck.getIndices());

/** Wait until the current slide's timeline has stopped exactly on its step label. */
export async function settle(page: Page, timeout = 20000) {
  await page.waitForFunction(() => {
    const s = (window as unknown as { __crda: { stage: { debugState(): DeckState } } }).__crda.stage.debugState();
    return !s.animating && s.time !== null && s.target !== null && Math.abs(s.time - s.target) < 1e-3;
  }, undefined, { timeout, polling: 50 });
}

export async function goSlide(page: Page, h: number, f = -1) {
  await page.evaluate(([hh, ff]) => (window as unknown as { deck: { slide(h: number, v: number, f: number): void } }).deck.slide(hh, 0, ff), [h, f]);
}
