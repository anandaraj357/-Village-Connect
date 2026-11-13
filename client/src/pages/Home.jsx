import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import { useLocation } from '../context/LocationContext';
import { CategoryBadge, ConfidenceBadge } from '../components/Badge';
import { Briefcase, FileText, Newspaper, Megaphone, Calendar, ArrowRight, ExternalLink, Download, CheckCircle, Search, MapPin, Navigation, Sparkles } from 'lucide-react';

export const Home = ({ setCurrentView }) => {
  const { language } = useNotifications();
  const { location, openLocationModal, requestGpsLocation, isLocating, refreshTrigger } = useLocation();
  const [jobs, setJobs] = useState([]);
  const [recruitments, setRecruitments] = useState([]);
  const [news, setNews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const distParam = location.district ? `&district=${encodeURIComponent(location.district)}` : '';
        const stateParam = location.state ? `&state=${encodeURIComponent(location.state)}` : '';

        const [jobsRes, recRes, newsRes, annRes] = await Promise.all([
          axios.get(`/api/public/jobs?limit=4${distParam}`),
          axios.get('/api/public/recruitments?limit=3'),
          axios.get(`/api/public/news?limit=4${distParam}${stateParam}`),
          axios.get(`/api/public/announcements?${distParam.replace('&', '')}${stateParam}`)
        ]);

        if (jobsRes.data.success) setJobs(jobsRes.data.jobs);
        if (recRes.data.success) setRecruitments(recRes.data.recruitments);
        if (newsRes.data.success) setNews(newsRes.data.news);
        if (annRes.data.success) setAnnouncements(annRes.data.announcements.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.district, location.state, refreshTrigger]);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl border border-emerald-900/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
              <span>✨ AI-Verified Information Network</span>
              <span>•</span>
              <span className="tamil-text">
                {location.village} • {location.mandal} • {location.district} • {location.state}
              </span>
            </div>

            <button
              onClick={openLocationModal}
              className="inline-flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-emerald-300 border border-slate-700 text-xs font-semibold px-3 py-1 rounded-full transition cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{language === 'ta' ? 'இடத்தை மாற்றுக' : 'Change Location / GPS'}</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {language === 'ta'
              ? `நமது கிராமம் - ${location.district}: வேலைவாய்ப்புகள், அரசுத் தேர்வுகள் & மாவட்ட செய்திகள்`
              : `Our Village - ${location.district}: Verified Jobs, Government Recruitments & District Updates`}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {language === 'ta'
              ? `${location.district} மற்றும் ${location.state} வட்டாரப் பகுதிகளுக்கான அதிகாரப்பூர்வ வேலைகள், தேர்வுகள் மற்றும் மாவட்ட செய்திகள் தானியங்கி கிராலர் மற்றும் AI சரிபார்ப்பு மூலம் வழங்கப்படுகின்றன.`
              : `Direct from authorized portals: State & Central Employment Services, TNPSC/SSC, and ${location.district} District Collectorate — crawled, cleaned, and verified for citizens.`}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentView('jobs')}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg flex items-center space-x-2 text-sm"
            >
              <Briefcase className="w-4 h-4" />
              <span>{language === 'ta' ? 'வேலைவாய்ப்புகளைக் காண்க' : 'Browse Job Openings'}</span>
            </button>
            <button
              onClick={() => setCurrentView('recruitments')}
              className="bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 font-semibold px-5 py-2.5 rounded-xl transition text-sm flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>{language === 'ta' ? 'அரசு தேர்வு அறிவிப்புகள்' : 'Recruitment Notifications'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
            <div className="text-2xl font-black text-emerald-400">100%</div>
            <div className="text-xs text-slate-400 font-medium">{language === 'ta' ? 'உறுதிப்படுத்தப்பட்ட மூலங்கள்' : 'Verified Sources'}</div>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
            <div className="text-2xl font-black text-emerald-400">2 Hours</div>
            <div className="text-xs text-slate-400 font-medium">{language === 'ta' ? 'தானியங்கி கிராலர்' : 'Crawl Frequency'}</div>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
            <div className="text-2xl font-black text-emerald-400">தமிழ் / EN</div>
            <div className="text-xs text-slate-400 font-medium">{language === 'ta' ? 'இருமொழி சுருக்கம்' : 'Bilingual Summaries'}</div>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
            <div className="text-2xl font-black text-emerald-400">Zero Hallucination</div>
            <div className="text-xs text-slate-400 font-medium">{language === 'ta' ? 'உண்மை சரிபார்ப்பு' : 'Anti-Hallucination'}</div>
          </div>
        </div>
      </section>

      {/* SECTION 1: Active Government Recruitment Notifications */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Official Gazettes & Commissions</div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-emerald-600" />
              <span>{language === 'ta' ? 'அரசு தேர்வு மற்றும் பணி நியமன அறிவிப்புகள் (TNPSC / SSC)' : 'Government Recruitment Notifications'}</span>
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('recruitments')}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{language === 'ta' ? 'அனைத்தும்' : 'View all'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recruitments.map((rec) => (
            <div
              key={rec._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                    {rec.notificationNumber}
                  </span>
                  <ConfidenceBadge score={rec.confidenceScore} />
                </div>

                <h3 className="font-bold text-slate-900 text-base line-clamp-2">{rec.recruitmentName}</h3>
                <div className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                  {rec.organization}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500 block">{language === 'ta' ? 'பணியிடங்கள்:' : 'Total Posts:'}</span>
                    <span className="font-bold text-slate-900">{rec.totalVacancies > 0 ? rec.totalVacancies : 'Refer Gazetted PDF'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{language === 'ta' ? 'வயது வரம்பு:' : 'Age Limit:'}</span>
                    <span className="font-semibold text-slate-800 truncate block">{rec.ageLimit}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 line-clamp-2">
                  <span className="font-medium text-slate-700">{language === 'ta' ? 'கல்வித்தகுதி: ' : 'Eligibility: '}</span>
                  {rec.eligibility}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span>
                    {language === 'ta' ? 'கடைசி தேதி: ' : 'Last Date: '}
                    {rec.importantDates?.applicationLastDate ? new Date(rec.importantDates.applicationLastDate).toLocaleDateString() : 'See Notice'}
                  </span>
                </div>

                <div className="flex space-x-2">
                  {rec.officialPdfUrl && (
                    <a
                      href={rec.officialPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                      title="Download Official Notification PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href={rec.officialApplicationLink || rec.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition"
                  >
                    <span>{language === 'ta' ? 'விண்ணப்பிக்க' : 'Apply'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Verified Job Vacancies */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Employment Board</div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Briefcase className="w-6 h-6 text-emerald-600" />
              <span>{language === 'ta' ? 'சரிபார்க்கப்பட்ட வேலைவாய்ப்புகள்' : 'Verified Job Openings'}</span>
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('jobs')}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{language === 'ta' ? 'அனைத்து வேலைகள்' : 'View all jobs'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <CategoryBadge category={job.jobCategory} />
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {job.salary}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{job.jobTitle}</h3>
                <div className="text-xs text-slate-600 font-medium">{job.organizationName}</div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.jobDescription}
                </p>

                <div className="flex flex-wrap gap-2 text-xs pt-2 text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">🎓 {job.qualification}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">📍 {job.jobLocation}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">👥 {job.vacanciesCount} {language === 'ta' ? 'இடங்கள்' : 'Vacancies'}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {language === 'ta' ? 'மூலம்: ' : 'Source: '} {job.sourceWebsite}
                </span>

                <a
                  href={job.applicationUrl || job.officialNotificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-lg transition"
                >
                  <span>{language === 'ta' ? 'விண்ணப்பிக்க' : 'Apply Now'}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Daily News & Agriculture Highlights */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Rural News & Governance</div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Newspaper className="w-6 h-6 text-emerald-600" />
              <span>{language === 'ta' ? 'நேசல் கிராம & விழுப்புரம் மாவட்ட செய்திகள்' : 'Daily News & District Highlights'}</span>
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('news')}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{language === 'ta' ? 'அனைத்து செய்திகள்' : 'Read all news'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              {item.thumbnailUrl && (
                <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.headline}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <CategoryBadge category={item.category} />
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  {!item.thumbnailUrl && <CategoryBadge category={item.category} />}
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{item.headline}</h3>

                  {language === 'ta' && item.summaryTamil ? (
                    <div className="tamil-text bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-950 leading-relaxed">
                      <span className="font-bold block text-emerald-800 mb-1">தமிழ் சுருக்கம்:</span>
                      {item.summaryTamil}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 leading-relaxed">{item.summaryEnglish || item.shortDescription}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{language === 'ta' ? 'மூலம்: ' : 'Source: '} {item.sourceWebsite}</span>
                  <a
                    href={item.originalArticleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-emerald-700 hover:underline flex items-center space-x-1"
                  >
                    <span>{language === 'ta' ? 'மூல இணைப்பு' : 'Original Source'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Banner */}
      <section className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-emerald-950">
            {language === 'ta'
              ? 'நேசல் கிராம அறிவிப்புகள் மற்றும் அரசு வேலைவாய்ப்புகளை உடனடியாகப் பெறுங்கள்'
              : 'Never Miss a Village Alert or Government Job Opening in Vanur & Villupuram'}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-800">
            {language === 'ta'
              ? 'விழுப்புரம் மாவட்டம் மற்றும் வானூர் வட்டாரத்திற்கு ஏற்றவாறு நிகழ்நேர எஸ்எம்எஸ் மற்றும் புஷ் அறிவிப்புகளைப் பெறுங்கள்.'
              : 'Subscribe to real-time SMS, Web Push, and in-app alerts tailored for Nesal, Vanur Taluk and Villupuram District.'}
          </p>
        </div>
        <button
          onClick={() => setCurrentView('subscriptions')}
          className="whitespace-nowrap bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl transition shadow text-sm"
        >
          {language === 'ta' ? 'விழிப்பூட்டலுக்கு பதிவு செய்க' : 'Subscribe to Category Alerts'}
        </button>
      </section>
    </div>
  );
};
