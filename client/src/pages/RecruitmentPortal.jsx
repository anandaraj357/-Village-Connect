import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import { ConfidenceBadge, PostedByBadge } from '../components/Badge';
import { PostJobPortal, TN_DISTRICTS } from './PostJobPortal';
import {
  FileText,
  Search,
  Download,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Clock,
  PlusCircle,
  Share2,
  Building,
  MapPin,
  Sparkles,
  Users
} from 'lucide-react';

const RECRUITMENT_AGENCIES = [
  'All',
  'TNPSC',
  'TNUSRB',
  'MRB',
  'TRB',
  'TANGEDCO',
  'Madras High Court',
  'Southern Railway',
  'Cooperative Bank'
];

export const RecruitmentPortal = () => {
  const { language } = useNotifications();
  const [recruitments, setRecruitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All Tamil Nadu');
  const [showPostModal, setShowPostModal] = useState(false);

  const fetchRecruitments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('limit', '50');
      if (searchQuery) params.append('search', searchQuery);
      if (selectedAgency !== 'All') params.append('organization', selectedAgency);
      if (selectedDistrict !== 'All' && selectedDistrict !== 'All Tamil Nadu') {
        params.append('district', selectedDistrict);
      }

      const res = await axios.get(`/api/public/recruitments?${params.toString()}`);
      if (res.data.success) {
        setRecruitments(res.data.recruitments);
      }
    } catch (err) {
      console.error('Failed to fetch recruitments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruitments();
  }, [selectedAgency, selectedDistrict]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecruitments();
  };

  const handleClearFilters = () => {
    setSelectedAgency('All');
    setSelectedDistrict('All Tamil Nadu');
    setSearchQuery('');
  };

  if (showPostModal) {
    return (
      <PostJobPortal
        onBack={() => setShowPostModal(false)}
        onComplete={() => {
          setShowPostModal(false);
          fetchRecruitments();
        }}
      />
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Official Gazettes & Commissions
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                🏛️ தமிழ்நாடு அரசுப் பணிகள் & தேர்வுகள்
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {language === 'ta'
                ? 'அரசுப் பணியாளர் தேர்வு & போட்டித் தேர்வு அறிவிப்புகள்'
                : 'Government Recruitment & Civil Services Notifications'}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm">
              {language === 'ta'
                ? 'TNPSC (குரூப்-1, 2, 4, VAO), TNUSRB சீருடைப் பணியாளர் தேர்வு, MRB மருத்துவம், TRB ஆசிரியர் தேர்வு மற்றும் தமிழ்நாடு அரசுத்துறைகளின் அதிகாரப்பூர்வ சுற்றறிக்கைகள்.'
                : 'Direct notifications from TNPSC, TNUSRB (Police), MRB, TRB, TNEB, Madras High Court, and Southern Railway with syllabus, eligibility, and official PDF gazettes.'}
            </p>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'ta' ? 'தேர்வு அறிவிப்பை பதிவிட' : '➕ Post Recruitment Notice'}</span>
          </button>
        </div>

        {/* Search & Agency Filter */}
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={
                  language === 'ta'
                    ? 'தேர்வு பெயர், துறை அல்லது அறிவிப்பு எண் (எ.கா. TNPSC, TNUSRB, 04/2026)...'
                    : 'Search by recruitment name, organization, or notification number (e.g. TNPSC/NOTIF/04/2026)...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>

            {/* Tamil Nadu District Dropdown */}
            <div className="sm:col-span-4 relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              >
                {TN_DISTRICTS.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {dist.en} ({dist.ta})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1">
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-sm"
              >
                {language === 'ta' ? 'தேடு' : 'Search'}
              </button>
            </div>
          </form>

          {/* Agency Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 scrollbar-none border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Commission:
            </span>
            {RECRUITMENT_AGENCIES.map((agency) => (
              <button
                key={agency}
                onClick={() => setSelectedAgency(agency)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedAgency === agency
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {agency}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recruitment Cards */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm space-y-2">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>{language === 'ta' ? 'அரசுத் தேர்வு அறிவிப்புகள் ஏற்றப்படுகின்றன...' : 'Loading recruitment notifications across Tamil Nadu...'}</p>
        </div>
      ) : recruitments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">
            {language === 'ta' ? 'அறிவிப்புகள் எதுவும் கிடைக்கவில்லை' : 'No recruitment notifications found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {language === 'ta'
              ? 'வடிகட்டிகளை மாற்றி மீண்டும் முயற்சிக்கவும் அல்லது புதிய அறிவிப்பை நேரடியாக சேர்க்கவும்.'
              : 'Try clearing your filters or post a new notification directly.'}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowPostModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
            >
              Post Recruitment Circular
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {recruitments.map((rec) => (
            <div
              key={rec._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-900 text-emerald-400 px-3 py-1 rounded-lg">
                      {rec.notificationNumber}
                    </span>
                    <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200">
                      🏛️ {rec.organization}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      📍 {rec.district || 'All Tamil Nadu'}
                    </span>
                    <ConfidenceBadge score={rec.confidenceScore} />
                    {rec.postedBy && <PostedByBadge postedBy={rec.postedBy} />}
                    {rec.currentRevision > 1 && (
                      <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg flex items-center">
                        <Layers className="w-3.5 h-3.5 mr-1" />
                        Rev #{rec.currentRevision}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                    {rec.recruitmentName}
                  </h2>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  {/* WhatsApp Quick Share */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `🏛️ *தமிழ்நாடு அரசு தேர்வு அறிவிப்பு*\n📜 *${rec.recruitmentName}*\n🏢 ${rec.organization}\n👥 மொத்த பணியிடங்கள்: ${rec.totalVacancies}\n🎓 தகுதி: ${rec.eligibility}\n🔗 விண்ணப்பிக்க: ${rec.officialApplicationLink || rec.officialPdfUrl || rec.sourceUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition"
                    title="Share Notification on WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {rec.officialPdfUrl && (
                    <a
                      href={rec.officialPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>{language === 'ta' ? 'அதிகாரப்பூர்வ PDF' : 'Official PDF'}</span>
                    </a>
                  )}

                  <a
                    href={rec.officialApplicationLink || rec.officialPdfUrl || rec.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
                  >
                    <span>{language === 'ta' ? 'விண்ணப்பிக்க' : 'Apply Online'}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </div>

              {/* Recruitment Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Vacancies</span>
                  <span className="text-base font-black text-emerald-700">
                    {rec.totalVacancies > 0 ? `${rec.totalVacancies.toLocaleString()} Posts` : 'Multiple Posts'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Age Limit</span>
                  <span className="font-semibold text-slate-800">{rec.ageLimit}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Application Fee</span>
                  <span className="font-semibold text-slate-800">{rec.applicationFee}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Selection Mode</span>
                  <span className="font-semibold text-slate-800">{rec.selectionProcess}</span>
                </div>
              </div>

              {/* Eligibility & Posts */}
              <div className="space-y-3 text-xs">
                <div>
                  <strong className="text-slate-800 font-bold">🎓 கல்வித் தகுதி (Eligibility Criteria):</strong>
                  <p className="text-slate-600 mt-1 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 font-medium">
                    {rec.eligibility}
                  </p>
                </div>

                {rec.postNames && rec.postNames.length > 0 && (
                  <div>
                    <strong className="text-slate-800 font-bold">📋 பதவிகள் (Designated Posts):</strong>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {rec.postNames.map((p, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg">
                          • {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Important Timeline Dates */}
              <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <span>
                      {language === 'ta' ? 'விண்ணப்ப முடிவு: ' : 'Last Date: '}
                      <strong className="text-slate-800">
                        {rec.importantDates?.applicationLastDate
                          ? new Date(rec.importantDates.applicationLastDate).toLocaleDateString()
                          : 'See Notification'}
                      </strong>
                    </span>
                  </span>

                  {rec.importantDates?.examDate && (
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      <span>
                        {language === 'ta' ? 'தேர்வு தேதி: ' : 'Exam Date: '}
                        <strong className="text-emerald-700">{rec.importantDates.examDate}</strong>
                      </span>
                    </span>
                  )}
                </div>

                <span className="text-slate-400 text-[11px]">
                  மூலம்: {rec.sourceUrl || 'Official Gazettes'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruitmentPortal;
