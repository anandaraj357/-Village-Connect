import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import { validateTargetUrl, sanitizeExtractedHtml } from './security.js';

let browserInstance = null;

async function getBrowser() {
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ]
    });
  }
  return browserInstance;
}

/**
 * Executes dynamic page extraction for JavaScript-rendered websites
 */
export async function fetchRenderedPage(url, options = {}) {
  const validatedUrl = await validateTargetUrl(url, options.allowedDomains);
  const timeout = options.timeout || 25000;
  const waitForSelector = options.waitForSelector || 'body';

  const browser = await getBrowser();
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 (OurVillageCrawler/1.0)',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  try {
    // Block unnecessary assets like images and fonts to speed up crawling
    await page.route('**/*', (route) => {
      const requestType = route.request().resourceType();
      if (['image', 'font', 'media'].includes(requestType)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto(validatedUrl, {
      waitUntil: 'domcontentloaded',
      timeout
    });

    if (waitForSelector && waitForSelector !== 'body') {
      try {
        await page.waitForSelector(waitForSelector, { timeout: 8000 });
      } catch (selErr) {
        // Continue even if selector wait timed out
      }
    }

    // Give dynamic client-side JS time to settle
    await page.waitForTimeout(1000);

    const content = await page.content();
    const currentUrl = page.url();

    const $ = cheerio.load(content);
    $('script, style, noscript, iframe').remove();

    return {
      $,
      url: currentUrl,
      rawHtml: content
    };
  } finally {
    await page.close().catch(() => {});
    await context.close().catch(() => {});
  }
}

export async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close().catch(() => {});
    browserInstance = null;
  }
}
