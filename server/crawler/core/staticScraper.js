import axios from 'axios';
import * as cheerio from 'cheerio';
import { validateTargetUrl, sanitizeExtractedHtml, stripToPlainText } from './security.js';

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 (OurVillageCrawler/1.0; +https://ourvillage.gov.in/crawler-policy)';

/**
 * Fetches and parses a static HTML page with security validation and cheerio
 */
export async function fetchAndParseHtml(url, options = {}) {
  const validatedUrl = await validateTargetUrl(url, options.allowedDomains);
  const timeout = options.timeout || 15000;
  const customHeaders = options.headers || {};

  const response = await axios.get(validatedUrl, {
    timeout,
    headers: {
      'User-Agent': customHeaders['User-Agent'] || DEFAULT_USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,te;q=0.8',
      ...customHeaders
    },
    maxRedirects: 3,
    validateStatus: (status) => status >= 200 && status < 400
  });

  const rawHtml = response.data;
  const $ = cheerio.load(rawHtml);

  // Clean out script, style, iframe, ads
  $('script, style, noscript, iframe, link[rel="stylesheet"]').remove();

  return {
    $,
    url: validatedUrl,
    rawHtml,
    statusCode: response.status,
    headers: response.headers
  };
}

/**
 * Generic list extraction using CSS selectors
 */
export function extractListFromHtml($, selectors, baseUrl) {
  const items = [];
  const listElements = $(selectors.listSelector || 'article, .news-item, .job-item, tr.data-row, .recruitment-card');

  listElements.each((i, el) => {
    const $el = $(el);

    const titleEl = selectors.itemTitleSelector ? $el.find(selectors.itemTitleSelector) : $el.find('h2, h3, h4, a.title, .heading, td:nth-child(2)');
    const title = stripToPlainText(titleEl.text());

    if (!title) return; // skip blank rows

    const linkEl = selectors.itemLinkSelector ? $el.find(selectors.itemLinkSelector) : $el.find('a[href]');
    let href = linkEl.attr('href') || '';
    if (href && !href.startsWith('http')) {
      try {
        href = new URL(href, baseUrl).toString();
      } catch (e) {
        // keep as is
      }
    }

    const dateEl = selectors.itemDateSelector ? $el.find(selectors.itemDateSelector) : $el.find('.date, time, .published, td:nth-child(3)');
    const dateText = stripToPlainText(dateEl.text());

    const summaryEl = selectors.itemSummarySelector ? $el.find(selectors.itemSummarySelector) : $el.find('p, .desc, .summary, td:nth-child(4)');
    const summaryText = stripToPlainText(summaryEl.text());

    const pdfEl = selectors.pdfLinkSelector ? $el.find(selectors.pdfLinkSelector) : $el.find('a[href$=".pdf"], a:contains("PDF"), a:contains("Notification")');
    let pdfUrl = pdfEl.attr('href') || '';
    if (pdfUrl && !pdfUrl.startsWith('http')) {
      try {
        pdfUrl = new URL(pdfUrl, baseUrl).toString();
      } catch (e) {}
    }

    items.push({
      title,
      link: href || baseUrl,
      dateText,
      summaryText,
      pdfUrl: pdfUrl || null,
      rawHtml: sanitizeExtractedHtml($el.html())
    });
  });

  return items;
}
