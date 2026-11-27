/** Screenshots every slide in its final state to docs/slides-png/ (not committed). Run: npm run shots */
import { mkdirSync } from 'node:fs';
import { goSlide, launch, openDeck, serveDist, settle } from '../tests/browser/harness';

const served = await serveDist();
const browser = await launch();
try {
  const { page } = await openDeck(browser, served.url + '?static');
  const count = await page.evaluate(() => (window as unknown as { __crda: { ids: string[] } }).__crda.ids.length);
  mkdirSync('docs/slides-png', { recursive: true });
  for (let i = 0; i < count; i++) {
    await goSlide(page, i);
    await settle(page);
    await page.waitForTimeout(250);
    await page.screenshot({ path: `docs/slides-png/${String(i + 1).padStart(2, '0')}.png` });
  }
  console.log(`${count} screenshots in docs/slides-png/`);
} finally {
  await browser.close();
  served.stop();
}
