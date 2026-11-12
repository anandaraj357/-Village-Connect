import { NCSJobAdapter } from './ncsJobAdapter.js';
import { EmploymentNewsAdapter } from './employmentNewsAdapter.js';
import { APPSCRecruitmentAdapter } from './appscRecruitmentAdapter.js';
import { SSCUPSCAdapter } from './sscUpscAdapter.js';
import { DistrictNewsAdapter } from './districtNewsAdapter.js';
import { VillageNewsAdapter } from './villageNewsAdapter.js';
import { GeneralRssAdapter } from './generalRssAdapter.js';

const ADAPTER_MAP = {
  ncs_jobs: NCSJobAdapter,
  employment_news: EmploymentNewsAdapter,
  tnpsc_recruitment: APPSCRecruitmentAdapter,
  appsc_recruitment: APPSCRecruitmentAdapter,
  ssc_upsc: SSCUPSCAdapter,
  district_news: DistrictNewsAdapter,
  village_news: VillageNewsAdapter,
  generic_rss: GeneralRssAdapter
};

export function getAdapterForSource(source) {
  const AdapterClass = ADAPTER_MAP[source.adapterKey] || GeneralRssAdapter;
  return new AdapterClass(source);
}

export function listAvailableAdapters() {
  return [
    { key: 'ncs_jobs', name: 'National Career Service & Tamil Nadu Job Boards', category: 'job' },
    { key: 'employment_news', name: 'Employment News / Govt Weekly Gazette', category: 'job' },
    { key: 'tnpsc_recruitment', name: 'TNPSC & Tamil Nadu State Department Recruitments', category: 'recruitment' },
    { key: 'ssc_upsc', name: 'SSC / UPSC / RRB Central Notifications (Southern Region)', category: 'recruitment' },
    { key: 'district_news', name: 'Villupuram District Collectorate & Press Releases', category: 'news' },
    { key: 'village_news', name: 'Nesal Village, Vanur Taluk & Agriculture Bulletin', category: 'news' },
    { key: 'generic_rss', name: 'Configurable RSS Feed Ingestor', category: 'all' }
  ];
}
