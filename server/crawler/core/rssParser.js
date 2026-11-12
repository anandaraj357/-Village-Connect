import Parser from 'rss-parser';
import { validateTargetUrl, stripToPlainText } from './security.js';

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 (OurVillageCrawler/1.0)'
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator']
    ]
  }
});

/**
 * Fetches and normalizes an RSS/Atom feed
 */
export async function parseRssFeed(feedUrl, allowedDomains = null) {
  const validatedUrl = await validateTargetUrl(feedUrl, allowedDomains);
  const feed = await parser.parseURL(validatedUrl);

  const normalizedItems = (feed.items || []).map((item) => {
    let thumbnail = null;
    if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image')) {
      thumbnail = item.enclosure.url;
    } else if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
      thumbnail = item.mediaContent.$.url;
    }

    const description = item.contentSnippet || item.summary || item.content || item.contentEncoded || '';
    const cleanDesc = stripToPlainText(description);

    return {
      title: stripToPlainText(item.title || ''),
      link: item.link || '',
      guid: item.guid || item.id || item.link,
      publishedDate: item.isoDate ? new Date(item.isoDate) : (item.pubDate ? new Date(item.pubDate) : new Date()),
      creator: item.creator || item.author || feed.title || 'Official Source',
      shortDescription: cleanDesc.slice(0, 300),
      fullDescription: cleanDesc,
      thumbnailUrl: thumbnail,
      rawContent: item.content || item.contentEncoded || description,
      feedTitle: feed.title || ''
    };
  });

  return {
    title: feed.title || '',
    description: feed.description || '',
    link: feed.link || validatedUrl,
    items: normalizedItems
  };
}
