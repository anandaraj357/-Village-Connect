/**
 * Base Crawler Adapter Class
 */
export class BaseAdapter {
  constructor(source) {
    this.source = source;
  }

  /**
   * Main crawl entry point - must be overridden by subclasses
   * @returns {Promise<Array<Object>>} normalized items
   */
  async crawl() {
    throw new Error(`crawl() method not implemented in ${this.constructor.name}`);
  }

  /**
   * Helper to normalize a job record
   */
  normalizeJob(data) {
    return {
      recordType: 'job',
      title: data.jobTitle || data.title,
      organizationName: data.organizationName || data.organization || this.source.name,
      jobCategory: data.jobCategory || 'Government',
      qualification: data.qualification || 'As per notification',
      requiredExperience: data.requiredExperience || 'Freshers / Experienced',
      salary: data.salary || 'As per government norms',
      vacanciesCount: data.vacanciesCount || 1,
      jobLocation: data.jobLocation || 'Tamil Nadu (Villupuram)',
      district: data.district || this.source.district || 'Villupuram',
      applicationStartDate: data.applicationStartDate || new Date(),
      applicationLastDate: data.applicationLastDate || null,
      officialNotificationUrl: data.officialNotificationUrl || data.url || this.source.url,
      applicationUrl: data.applicationUrl || data.url || this.source.url,
      sourceWebsite: this.source.name,
      canonicalUrl: data.canonicalUrl || data.url || data.link,
      datePublished: data.datePublished || new Date(),
      jobDescription: data.jobDescription || data.summary || '',
      originalPdfUrl: data.originalPdfUrl || null,
      rawContent: data.rawContent || data.jobDescription || ''
    };
  }

  /**
   * Helper to normalize a recruitment notification
   */
  normalizeRecruitment(data) {
    return {
      recordType: 'recruitment',
      title: data.recruitmentName || data.title,
      recruitmentName: data.recruitmentName || data.title,
      organization: data.organization || this.source.name,
      notificationNumber: data.notificationNumber || 'Unavailable',
      totalVacancies: data.totalVacancies || 0,
      postNames: data.postNames || [data.title],
      eligibility: data.eligibility || 'Check official notification',
      ageLimit: data.ageLimit || 'Unavailable',
      applicationFee: data.applicationFee || 'Unavailable',
      selectionProcess: data.selectionProcess || 'Written Exam / Merit / Interview',
      importantDates: data.importantDates || {
        notificationDate: new Date(),
        applicationStartDate: new Date(),
        applicationLastDate: null,
        examDate: 'To be announced'
      },
      officialPdfUrl: data.officialPdfUrl || null,
      officialApplicationLink: data.officialApplicationLink || data.url || this.source.url,
      sourceUrl: data.sourceUrl || data.url || this.source.url,
      canonicalUrl: data.canonicalUrl || data.url || data.link,
      pdfExtractedText: data.pdfExtractedText || '',
      missingFields: data.missingFields || [],
      confidenceScore: data.confidenceScore || 85,
      rawContent: data.rawContent || ''
    };
  }

  /**
   * Helper to normalize a news article
   */
  normalizeNews(data) {
    return {
      recordType: 'news',
      title: data.headline || data.title,
      headline: data.headline || data.title,
      shortDescription: data.shortDescription || '',
      category: data.category || 'District News',
      sourceWebsite: this.source.name,
      originalArticleUrl: data.originalArticleUrl || data.url || data.link,
      canonicalUrl: data.canonicalUrl || data.originalArticleUrl || data.link,
      thumbnailUrl: data.thumbnailUrl || null,
      geographicRelevance: data.geographicRelevance || {
        scope: this.source.geographicScope || 'District',
        state: 'Tamil Nadu',
        district: this.source.district || 'Villupuram',
        mandal: this.source.mandal || 'Vanur',
        village: this.source.village || 'Nesal'
      },
      publishedDate: data.publishedDate || new Date(),
      rawContent: data.rawContent || data.shortDescription || ''
    };
  }
}
