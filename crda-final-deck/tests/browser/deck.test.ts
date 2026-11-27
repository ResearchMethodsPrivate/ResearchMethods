/** The built deck: all slides present, offline, no errors, and nothing runs off a slide or into the footer. */
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { Browser } from 'playwright-core';
import { goSlide, launch, openDeck, serveDist, settle, type Served } from './harness';

let served: Served;
let browser: Browser;
before(async () => { served = await serveDist(); browser = await launch(); });
after(async () => { await browser.close(); served.stop(); });

test('14 slides, offline, no console errors', async () => {
  const { page, remote, consoleErrors, failed } = await openDeck(browser, served.url);
  assert.equal(await page.evaluate(() => document.querySelectorAll('#slides > section').length), 14);
  assert.deepEqual([remote, consoleErrors, failed], [[], [], []]);
  await page.context().close();
});

test('in PDF mode there are 14 pages and nothing is left invisible by an animation', async () => {
  const { page } = await openDeck(browser, served.url + '?print-pdf');
  await page.waitForSelector('.pdf-page');
  await page.waitForTimeout(1500);
  const result = await page.evaluate(() => ({
    pages: document.querySelectorAll('.pdf-page').length,
    items: document.querySelectorAll('.pdf-page [data-in]').length,
    hidden: [...document.querySelectorAll('.pdf-page [data-in]')].filter((e) => Number(getComputedStyle(e).opacity) < 0.99).length,
  }));
  assert.equal(result.pages, 14);
  assert.ok(result.items > 40, `only ${result.items} animated items found`);
  assert.equal(result.hidden, 0);
  await page.context().close();
});

test('every slide’s content stays on the slide and above the footer', async () => {
  const { page } = await openDeck(browser, served.url + '?static');
  const problems: string[] = [];
  for (let i = 0; i < 14; i++) {
    await goSlide(page, i);
    await settle(page);
    problems.push(...await page.evaluate((n) => {
      const section = (window as unknown as { deck: { getCurrentSlide(): HTMLElement } }).deck.getCurrentSlide();
      const frame = section.querySelector('.frame')!.getBoundingClientRect();
      const scale = frame.width / 1920;
      const footer = section.querySelector('.chrome')!.getBoundingClientRect();
      const out: string[] = [];
      section.querySelectorAll<Element>('.frame *').forEach((el) => {
        if (el.closest('.chrome')) return;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const name = `slide ${n}: <${el.tagName.toLowerCase()} class="${el.getAttribute('class') ?? ''}"> "${(el.textContent ?? '').trim().slice(0, 40)}"`;
        if (r.right > frame.right - 40 * scale || r.left < frame.left + 40 * scale) out.push(`${name} too close to or past a side`);
        if (r.bottom > footer.top - 2) out.push(`${name} reaches the footer`);
      });
      const cut = [...section.querySelectorAll<HTMLElement>('.panel')].filter((p) => p.scrollHeight > p.clientHeight + 2);
      if (cut.length) out.push(`slide ${n}: text overflows a panel`);
      return out.slice(0, 4);
    }, i + 1));
  }
  assert.deepEqual(problems, []);
  await page.context().close();
});
