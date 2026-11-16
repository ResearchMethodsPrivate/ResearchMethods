/**
 * Real-browser regression tests (Playwright Chromium, headless) against dist/.
 * Run: npm run test:browser
 */
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import type { Browser } from 'playwright-core';
import { goSlide, indices, launch, openDeck, serveDist, settle, state, type Served } from './harness';
import { slides } from '../../src/slides/index';

let served: Served;
let browser: Browser;
before(async () => { served = await serveDist(); browser = await launch(); });
after(async () => { await browser?.close(); served?.stop(); });

const SAFETY = slides.findIndex((s) => s.id === 'safety');
const RESULTS = slides.findIndex((s) => s.id === 'results');

test('every slide: hidden step markers match its GSAP labels s0…sN, offline, no console errors', async () => {
  const w = await openDeck(browser, served.url + '#/0');
  for (let i = 0; i < slides.length; i++) {
    await goSlide(w.page, i);
    await settle(w.page);
    const st = await state(w.page);
    const markers = await w.page.evaluate(() =>
      (window as unknown as { deck: { getCurrentSlide(): HTMLElement } }).deck.getCurrentSlide().querySelectorAll('.step-marker').length);
    assert.equal(markers, slides[i].steps, `${slides[i].id}: markers`);
    for (let k = 0; k <= slides[i].steps; k++) assert.ok(`s${k}` in st.labels, `${slides[i].id}: missing label s${k}`);
    assert.ok(!(`s${slides[i].steps + 1}` in st.labels), `${slides[i].id}: extra label`);
  }
  assert.deepEqual(w.remote, [], 'remote requests');
  assert.deepEqual(w.consoleErrors, [], 'console errors');
  assert.deepEqual(w.failed, [], 'failed loads');
  const sb = await w.page.evaluate(() => document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight);
  assert.equal(sb, false, 'document scrollbars');
  await w.page.context().close();
});

test('the deck has exactly one slide per section: no nested vertical slides', async () => {
  const w = await openDeck(browser, served.url + '#/0');
  const n = await w.page.evaluate(() => document.querySelectorAll('.slides > section').length + document.querySelectorAll('.slides section section').length);
  assert.equal(n, slides.length);
  await w.page.context().close();
});

test('results: rapid clicks before tweens finish still settle exactly on the step label', async () => {
  const w = await openDeck(browser, served.url + `#/${RESULTS}`);
  await settle(w.page);
  await w.page.keyboard.press('ArrowRight');
  await w.page.keyboard.press('ArrowRight'); // second click lands mid-tween
  await w.page.keyboard.press('ArrowRight');
  await settle(w.page);
  const st = await state(w.page);
  assert.equal(st.step, 3);
  assert.ok(Math.abs((st.time ?? -1) - st.labels.s3) < 1e-3);
  await w.page.context().close();
});

test('safety: stepping to the end and back to the start hides the rejected-run markers and counts again', async () => {
  const w = await openDeck(browser, served.url + `#/${SAFETY}`);
  await settle(w.page);
  for (let k = 0; k < 3; k++) await w.page.keyboard.press('ArrowRight');
  await settle(w.page);
  const end = await w.page.evaluate(() => {
    const s = (window as unknown as { deck: { getCurrentSlide(): HTMLElement } }).deck.getCurrentSlide();
    return { after: Number(getComputedStyle(s.querySelector('.c-after')!).opacity), take: Number(getComputedStyle(s.querySelector('.takeaway')!).opacity) };
  });
  assert.ok(end.after > 0.99 && end.take > 0.99, 'final state shows the counts and the takeaway');
  for (let k = 0; k < 3; k++) await w.page.keyboard.press('ArrowLeft');
  await settle(w.page);
  const start = await w.page.evaluate(() => {
    const s = (window as unknown as { deck: { getCurrentSlide(): HTMLElement } }).deck.getCurrentSlide();
    return {
      after: Number(getComputedStyle(s.querySelector('.c-after')!).opacity),
      take: Number(getComputedStyle(s.querySelector('.takeaway')!).opacity),
      dropColour: getComputedStyle(s.querySelector('.sq.drop')!).color,
    };
  });
  assert.equal(start.after, 0);
  assert.equal(start.take, 0);
  assert.match(start.dropColour, /rgba\(0, 0, 0, 0\)|transparent/, 'the ✕ is hidden again at s0');
  await w.page.context().close();
});

test('deep link, overview and back-navigation restore the exact step state', async () => {
  const w = await openDeck(browser, served.url + `#/${RESULTS}/0/1`);
  await settle(w.page);
  let st = await state(w.page);
  assert.equal(st.step, 2);
  await w.page.keyboard.press('o');
  await w.page.waitForTimeout(400);
  await w.page.keyboard.press('o');
  await settle(w.page);
  st = await state(w.page);
  assert.ok(Math.abs((st.time ?? -1) - st.labels.s2) < 1e-3, 'overview round-trip');
  await goSlide(w.page, RESULTS + 1);
  await settle(w.page);
  await w.page.keyboard.press('ArrowLeft'); // back from the next slide → lands on results in its final state
  await settle(w.page);
  st = await state(w.page);
  assert.equal((await indices(w.page)).h, RESULTS);
  assert.ok(Math.abs((st.time ?? -1) - st.duration) < 1e-3, 'arrives back in final state');
  await w.page.context().close();
});

test('R replays to the current step; S opens the speaker view with the presenter names', async () => {
  const w = await openDeck(browser, served.url + `#/${RESULTS}/0/0`);
  await settle(w.page);
  await w.page.keyboard.press('r');
  await w.page.waitForTimeout(150);
  assert.equal((await state(w.page)).animating, true, 'replay animates');
  await settle(w.page);
  assert.equal((await state(w.page)).step, 1);
  const [popup] = await Promise.all([w.page.waitForEvent('popup'), w.page.keyboard.press('s')]);
  await popup.waitForLoadState();
  await popup.waitForFunction(() => document.body.innerText.includes('Alvi') && document.body.innerText.includes('Samim'), undefined, { timeout: 8000 });
  await popup.close();
  await w.page.context().close();
});

test('?static and prefers-reduced-motion never tween; ?print-pdf lays out every slide as a page', async () => {
  const s = await openDeck(browser, served.url + `?static#/${RESULTS}`);
  await s.page.keyboard.press('ArrowRight');
  assert.equal((await state(s.page)).animating, false);
  await s.page.context().close();

  const r = await openDeck(browser, served.url + `#/${RESULTS}`, { reducedMotion: 'reduce' });
  assert.equal(await r.page.evaluate(() => document.documentElement.classList.contains('reduced-motion')), true);
  await r.page.keyboard.press('ArrowRight');
  assert.equal((await state(r.page)).animating, false);
  await r.page.context().close();

  const p = await openDeck(browser, served.url + '?print-pdf');
  await p.page.waitForSelector('.pdf-page');
  assert.equal(await p.page.locator('.pdf-page').count(), slides.length);
  await p.page.context().close();
});
