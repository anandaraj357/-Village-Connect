import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import { CategoryBadge, PostedByBadge } from '../components/Badge';
import { PostJobPortal, TN_DISTRICTS } from './PostJobPortal';
import {
  Search,
  Filter,
  Briefcase,
  Calendar,
  MapPin,
  Building,
  GraduationCap,
  DollarSign,
  Download,
  ExternalLink,
  Share2,
  PlusCircle,
  Phone,
  MessageCircle,
  CheckCircle,
  Clock,
  Sparkles,
  Users
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Government',
  'Private',
  'IT',
  'Manufacturing',
  'Healthcare',
  'Education',
  'Banking',
  'Retail',
  'Logistics',
  'Agriculture',
  'Skilled Trade',
  'Work From Home',
  'Local Job'
];

export const JobsPortal = () => {
  const { language } = useNotifications();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All Tamil Nadu');
  const [selectedQualification, setSelectedQualification] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('limit', '60');
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedDistrict !== 'All' && selectedDistrict !== 'All Tamil Nadu') {
        params.append('district', selectedDistrict);
      }
      if (selectedQualification !== 'All') params.append('qualification', selectedQualification);
      if (searchQuery) params.append('search', searchQuery);
      if (locationQuery) params.append('location', locationQuery);

      const res = await axios.get(`/api/public/jobs?${params.toString()}`);
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory, selectedDistrict, selectedQualification]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedDistrict('All Tamil Nadu');
    setSelectedQualification('All');
    setSearchQuery('');
    setLocationQuery('');
  };

  if (showPostModal) {
    return (
      <PostJobPortal
        onBack={() => setShowPostModal(false)}
        onComplete={() => {
          setShowPostModal(false);
          fetchJobs();
        }}
      />
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header with Post Job Button */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Tamil Nadu Employment Gateway
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                🌐 தமிழ்நாடு 38 மாவட்டங்கள்
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {language === 'ta'
                ? 'தமிழ்நாடு வேலைவாய்ப்புகள் & பணியிட அறிவிப்புகள்'
                : 'Tamil Nadu Jobs & Career Opportunities'}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm">
              {language === 'ta'
                ? 'அரசுப் பணிகள் (TNPSC, TNUSRB), தனியார் நிறுவனங்கள், தொழிற்சாலைகள், IT, மருத்துவம், மற்றும் நெசல் கிராம/வானூர் வட்டார வேலைகள்.'
                : 'State-wide openings across all 38 districts of Tamil Nadu including Government, MNCs, IT, Healthcare, Manufacturing, and Nesal village local trades.'}
            </p>
          </div>

          {/* Action Button: Post a Job */}
          <button
            onClick={() => setShowPostModal(true)}
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'ta' ? 'புதிய வேலைவாய்ப்பை பதிவிட' : '➕ Post a Job Vacancy'}</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4">
          {/* Search, District and Location Inputs */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Keyword Search */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={
                  language === 'ta'
                    ? 'வேலை தலைப்பு, நிறுவனம், தகுதி தேடுக...'
                    : 'Search job title, company, skills, qualification...'
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

            {/* Qualification Quick Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedQualification}
                onChange={(e) => setSelectedQualification(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                title="Filter by Qualification"
              >
                <option value="All">All Education</option>
                <option value="10th">10th / SSLC</option>
                <option value="12th">12th / HSC</option>
                <option value="ITI">ITI Trade</option>
                <option value="Diploma">Diploma</option>
                <option value="Degree">Any Degree</option>
                <option value="Engineering">Engineering (B.E)</option>
                <option value="Nursing">Nursing / Medical</option>
              </select>
            </div>

            {/* Search Submit Button */}
            <div className="sm:col-span-1">
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-sm"
              >
                {language === 'ta' ? 'தேடு' : 'Search'}
              </button>
            </div>
          </form>

          {/* Industry / Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 scrollbar-none border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Sector:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Filter Indicators */}
          {(selectedCategory !== 'All' || selectedDistrict !== 'All Tamil Nadu' || selectedQualification !== 'All' || searchQuery) && (
            <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200 px-4 py-2 rounded-xl text-xs text-emerald-900">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold">Active Filters:</span>
                {selectedDistrict !== 'All Tamil Nadu' && (
                  <span className="bg-white px-2 py-0.5 rounded-md border border-emerald-300 font-semibold">
                    📍 {selectedDistrict}
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="bg-white px-2 py-0.5 rounded-md border border-emerald-300 font-semibold">
                    🏷️ {selectedCategory}
                  </span>
                )}
                {selectedQualification !== 'All' && (
                  <span className="bg-white px-2 py-0.5 rounded-md border border-emerald-300 font-semibold">
                    🎓 {selectedQualification}
                  </span>
                )}
              </div>
              <button
                onClick={handleClearFilters}
                className="text-emerald-700 hover:text-emerald-900 font-bold underline text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{jobs.length}</strong> verified vacancies across Tamil Nadu
        </span>
        <span className="hidden sm:inline">
          Filtered by: {selectedDistrict} • {selectedCategory}
        </span>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm space-y-2">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>{language === 'ta' ? 'தமிழ்நாடு வேலைவாய்ப்புகள் ஏற்றப்படுகின்றன...' : 'Loading verified opportunities across Tamil Nadu...'}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">
            {language === 'ta' ? 'வேலைகள் எதுவும் கிடைக்கவில்லை' : 'No jobs found for selected criteria'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {language === 'ta'
              ? 'வேறு மாவட்டத்தை அல்லது துறையை தேர்வு செய்து பார்க்கவும், அல்லது உங்கள் நிறுவனத்துக்கான பணியிடத்தை நீங்களே பதிவிடவும்!'
              : 'Try switching to "All Tamil Nadu" or select another category. You can also post a vacancy directly!'}
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
              Post a Job Opening
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-3">
                {/* Badges Bar */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center space-x-1.5 flex-wrap">
                    <CategoryBadge category={job.jobCategory} />
                    <PostedByBadge postedBy={job.postedBy} />
                  </div>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
                    💰 {job.salary}
                  </span>
                </div>

                {/* Job Title & Organization */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-snug group-hover:text-emerald-700 transition">
                    {job.jobTitle}
                  </h3>
                  <div className="flex items-center text-xs font-bold text-slate-600 mt-1">
                    <Building className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                    <span>{job.organizationName}</span>
                  </div>
                </div>

                {/* Job Description snippet */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {job.jobDescription}
                </p>

                {/* Key metadata grid */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100 text-slate-600">
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                    <span className="truncate font-semibold">{job.jobLocation || job.district}</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                    <span className="truncate">{job.qualification}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                    <span className="truncate">{job.jobType || 'Full-Time'} • {job.requiredExperience}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-800">
                      {job.vacanciesCount} {language === 'ta' ? 'பணியிடங்கள்' : 'Posts'}
                    </span>
                  </div>
                </div>

                {/* Contact information preview if community posted */}
                {(job.contactPhone || job.contactPerson) && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                    <span>
                      👤 {job.contactPerson || 'Employer Contact'}: <strong className="text-slate-900">{job.contactPhone || 'Available'}</strong>
                    </span>
                    {job.howToApply && (
                      <span className="text-[11px] text-emerald-700 font-semibold">{job.howToApply}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons Bar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-slate-400" />
                  {language === 'ta' ? 'கடைசி தேதி: ' : 'Deadline: '}
                  {job.applicationLastDate ? new Date(job.applicationLastDate).toLocaleDateString() : 'Direct Walk-in'}
                </span>

                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  {/* Direct Phone Call Button */}
                  {job.contactPhone && (
                    <a
                      href={`tel:${job.contactPhone}`}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                      title="Call Employer Directly"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}

                  {/* WhatsApp Quick Share / Connect */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `🌾 *OUR VILLAGE TAMIL NADU வேலைவாய்ப்பு*\n💼 *${job.jobTitle}*\n🏢 ${job.organizationName}\n📍 இடம்: ${job.jobLocation || job.district}\n🎓 தகுதி: ${job.qualification}\n💰 சம்பளம்: ${job.salary}\n📞 தொடர்பு: ${job.contactPhone || job.applicationUrl || 'See Portal'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                    title="Share job on WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </a>

                  {/* Official PDF if available */}
                  {job.originalPdfUrl && (
                    <a
                      href={job.originalPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Download Official Notification PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}

                  {/* Apply / Details Button */}
                  <a
                    href={job.applicationUrl || job.officialNotificationUrl || (job.contactPhone ? `tel:${job.contactPhone}` : '#')}
                    target={job.applicationUrl?.startsWith('tel:') ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-white bg-slate-900 hover:bg-emerald-600 px-3.5 sm:px-4 py-2 rounded-xl transition shadow-sm"
                  >
                    <span>{job.contactPhone && !job.applicationUrl ? 'தொடர்புகொள்ள' : (language === 'ta' ? 'விண்ணப்பிக்க' : 'Apply')}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPortal;
