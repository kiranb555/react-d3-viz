// Capture PNG screenshots of every chart from the screenshot gallery page.
//
//   1. npm run dev            (Vite dev server, default :5173)
//   2. node scripts/shots.mjs (drives your installed Chrome via puppeteer-core)
//
// Output: assets/*.png  (committed; embedded in README.md)

import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import puppeteer from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'assets');

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173';
const URL = `${BASE_URL}/screenshots/gallery.html`;

// Common Chrome locations on macOS; override with CHROME_PATH.
const CHROME =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const SHOTS = [
  'shot-hero',
  'shot-line',
  'shot-area',
  'shot-bar',
  'shot-bar-stacked',
  'shot-scatter',
  'shot-bubble',
  'shot-pie',
  'shot-donut',
  'shot-histogram',
  'shot-radar',
  'shot-treemap',
  'shot-butterfly',
];

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--force-color-profile=srgb'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 2400, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });

  // Let fonts settle so text metrics are final.
  await page.evaluateHandle('document.fonts.ready');
  await new Promise((r) => setTimeout(r, 400));

  for (const id of SHOTS) {
    const el = await page.$(`#${id}`);
    if (!el) {
      console.warn(`! missing #${id}`);
      continue;
    }
    const file = join(OUT, `${id.replace(/^shot-/, '')}.png`);
    await el.screenshot({ path: file });
    console.log(`✓ ${file.replace(ROOT + '/', '')}`);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
