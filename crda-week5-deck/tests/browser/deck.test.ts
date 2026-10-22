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

const MECH = slides.findIndex((s) => s.id === 'mechanism');

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

test('slide 4: rapid double-clicks before tweens finish still settle exactly on the step label', async () => {
  const w = await openDeck(browser, served.url + `#/${MECH}`);
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

test('slide 4: final step → back to s0 → forward again leaves no duplicate or detached elements', async () => {
  const w = await openDeck(browser, served.url + `#/${MECH}`);
  await settle(w.page);
  const count = () => w.page.evaluate(() => {
    const s = (window as unknown as { deck: { getCurrentSlide(): HTMLElement } }).deck.getCurrentSlide();
    return { circles: s.querySelectorAll('circle').length, lines: s.querySelectorAll('line').length, copies: s.querySelectorAll('.zcopy').length };
  });
  const before = await count();
  for (let k = 0; k < 4; k++) await w.page.keyboard.press('ArrowRight');
  await settle(w.page);
  for (let k = 0; k < 4; k++) await w.page.keyboard.press('ArrowLeft');
  await settle(w.page);
  const atStart = await w.page.evaluate(() => {
    const s = (window as unknown as { deck: { getCurrentSlide(): HTMLElement } }).deck.getCurrentSlide();
    return { copy: Number(getComputedStyle(s.querySelector('.zcopy')!).opacity), syn: Number(getComputedStyle(s.querySelector('.syn-p')!).opacity) };
  });
  assert.deepEqual(atStart, { copy: 0, syn: 0 }, 'residual copy / synthetic point must be hidden again at s0');
  for (let k = 0; k < 3; k++) await w.page.keyboard.press('ArrowRight');
  await settle(w.page);
  // carried arrow tip must sit on the synthetic point (within the arrowhead inset)
  const geo = await w.page.evaluate(() => {
    const s = (window as unknown as { deck: { getCurrentSlide(): HTMLElement } }).deck.getCurrentSlide();
    const tip = (s.querySelector('.zcopy line') as SVGGraphicsElement).getBoundingClientRect();
    const dot = (s.querySelector('.syn-p') as SVGGraphicsElement).getBoundingClientRect();
    return { tipX: tip.left + tip.width / 2, dotX: dot.left + dot.width / 2, gap: dot.bottom - tip.top };
  });
  assert.ok(Math.abs(geo.tipX - geo.dotX) < 1.5, `arrow x ${geo.tipX} vs dot x ${geo.dotX}`);
  assert.deepEqual(await count(), before, 'element counts unchanged');
  await w.page.context().close();
});

test('deep link, overview and back-navigation restore the exact step state', async () => {
  const w = await openDeck(browser, served.url + `#/${MECH}/0/2`);
  await settle(w.page);
  let st = await state(w.page);
  assert.equal(st.step, 3);
  await w.page.keyboard.press('o');
  await w.page.waitForTimeout(400);
  await w.page.keyboard.press('o');
  await settle(w.page);
  st = await state(w.page);
  assert.ok(Math.abs((st.time ?? -1) - st.labels.s3) < 1e-3, 'overview round-trip');
  await goSlide(w.page, MECH + 1);
  await settle(w.page);
  await w.page.keyboard.press('ArrowLeft'); // back from slide 5 → lands on slide 4 final state
  await settle(w.page);
  st = await state(w.page);
  assert.equal((await indices(w.page)).h, MECH);
  assert.ok(Math.abs((st.time ?? -1) - st.duration) < 1e-3, 'arrives back in final state');
  await w.page.context().close();
});

test('R replays to the current step; S opens the speaker view with the presenter name', async () => {
  const w = await openDeck(browser, served.url + `#/${MECH}/0/1`);
  await settle(w.page);
  await w.page.keyboard.press('r');
  await w.page.waitForTimeout(150);
  assert.equal((await state(w.page)).animating, true, 'replay animates');
  await settle(w.page);
  assert.equal((await state(w.page)).step, 2);
  const [popup] = await Promise.all([w.page.waitForEvent('popup'), w.page.keyboard.press('s')]);
  await popup.waitForLoadState();
  await popup.waitForFunction(() => document.body.innerText.includes('Alvi'), undefined, { timeout: 8000 });
  await popup.close();
  await w.page.context().close();
});

test('?static and prefers-reduced-motion never tween; ?print-pdf lays out every slide as a page, without the explorer', async () => {
  const s = await openDeck(browser, served.url + `?static#/${MECH}`);
  await s.page.keyboard.press('ArrowRight');
  assert.equal((await state(s.page)).animating, false);
  await s.page.context().close();

  const r = await openDeck(browser, served.url + `#/${MECH}`, { reducedMotion: 'reduce' });
  assert.equal(await r.page.evaluate(() => document.documentElement.classList.contains('reduced-motion')), true);
  await r.page.keyboard.press('ArrowRight');
  assert.equal((await state(r.page)).animating, false);
  await r.page.context().close();

  const p = await openDeck(browser, served.url + '?print-pdf');
  await p.page.waitForSelector('.pdf-page');
  await p.page.keyboard.press('e');
  await p.page.waitForTimeout(500);
  assert.equal(await p.page.locator('.pdf-page').count(), slides.length);
  assert.equal(await p.page.locator('.ox-overlay').count(), 0, 'explorer must not open in print mode');
  await p.page.context().close();
});

test('OpenUI explorer: E opens, toggles work, Esc closes, slide position unchanged, still offline', async () => {
  const w = await openDeck(browser, served.url + `#/${MECH}`);
  await settle(w.page);
  const before = await indices(w.page);
  await w.page.keyboard.press('e');
  await w.page.waitForSelector('[data-openui="Explorer"]');
  assert.equal(await w.page.locator('[data-openui="StageCard"]').count(), 4);
  await w.page.keyboard.press('ArrowRight'); // must NOT advance slides while open
  await w.page.getByRole('tab', { name: 'Assumption' }).click();
  await w.page.getByRole('radio', { name: /Violated/ }).click();
  assert.equal(await w.page.locator('[data-state="breaks"]').count(), 1);
  await w.page.getByRole('tab', { name: 'Claims vs plan' }).click();
  assert.match(await w.page.locator('[data-openui="ClaimsVsPlan"]').innerText(), /Not our group’s reproduced results/);
  await w.page.keyboard.press('Escape');
  assert.equal(await w.page.locator('.ox-overlay').count(), 0);
  assert.deepEqual(await indices(w.page), before);
  await w.page.keyboard.press('ArrowRight'); // keyboard handed back to Reveal
  await settle(w.page);
  assert.equal((await state(w.page)).step, 1);
  assert.deepEqual(w.remote, [], 'remote requests');
  assert.deepEqual(w.consoleErrors, [], 'console errors');
  await w.page.context().close();
});
