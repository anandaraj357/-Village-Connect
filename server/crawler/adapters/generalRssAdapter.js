import { BaseAdapter } from './baseAdapter.js';
import { parseRssFeed } from '../core/rssParser.js';

export class GeneralRssAdapter extends BaseAdapter {
  async crawl() {
    const feedUrl = this.source.rssFeedUrl || this.source.url;
    const feed = await parseRssFeed(feedUrl);
    const items = [];

    feed.items.slice(0, 10).forEach((item) => {
      if (this.source.category === 'job') {
        items.push(this.normalizeJob({
          jobTitle: item.title,
          organizationName: item.creator || this.source.name,
          jobCategory: 'Government',
          jobDescription: item.fullDescription,
          url: item.link,
          canonicalUrl: item.link,
          datePublished: item.publishedDate,
          rawContent: item.rawContent
        }));
      } else if (this.source.category === 'recruitment') {
        items.push(this.normalizeRecruitment({
          recruitmentName: item.title,
          organization: item.creator || this.source.name,
          sourceUrl: item.link,
          canonicalUrl: item.link,
          rawContent: item.rawContent
        }));
      } else {
        items.push(this.normalizeNews({
          headline: item.title,
          shortDescription: item.shortDescription,
          category: this.source.subCategory || 'District News',
          thumbnailUrl: item.thumbnailUrl,
          url: item.link,
          canonicalUrl: item.link,
          publishedDate: item.publishedDate,
          rawContent: item.rawContent
        }));
      }
    });

    return items;
  }
}
