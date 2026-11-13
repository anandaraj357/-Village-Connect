import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import { CategoryBadge, ConfidenceBadge } from '../components/Badge';
import { Search, Filter, Briefcase, Calendar, MapPin, Building, GraduationCap, DollarSign, Download, ExternalLink, Share2 } from 'lucide-react';

const CATEGORIES = ['All', 'Government', 'Private', 'IT', 'Non-IT', 'Internship', 'Work From Home', 'Local Job'];

export const JobsPortal = () => {
  const { language } = useNotifications();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const categoryParam = selectedCategory !== 'All' ? `&category=${selectedCategory}` : '';
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
      const locParam = locationQuery ? `&location=${encodeURIComponent(locationQuery)}` : '';

      const res = await axios.get(`/api/public/jobs?limit=50${categoryParam}${searchParam}${locParam}`);
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
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Verified Opportunities</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            {language === 'ta' ? 'வேலைவாய்ப்புகள் மற்றும் தொழில் வழிகாட்டி' : 'Job Vacancies & Career Portal'}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            {language === 'ta'
              ? 'தமிழ்நாடு வேலைவாய்ப்பு துறை, தேசிய வேலைவாய்ப்பு சேவை (NCS) மற்றும் விழுப்புரம் மாவட்ட சரிபார்க்கப்பட்ட வேலைகள்.'
              : 'Automatically collected from National Career Service (NCS - TN), Employment News, and authorized recruitment agencies for Villupuram & Tamil Nadu.'}
          </p>
        </div>

        {/* Search & Location Bar */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={language === 'ta' ? 'பணி பெயர், நிறுவனம் அல்லது தகுதி கொண்டு தேடுக...' : 'Search by job title, organization, or qualification...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          <div className="sm:col-span-4 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={language === 'ta' ? 'இடம் (எ.கா. விழுப்புரம், வானூர், சென்னை)' : 'Location (e.g. Villupuram, Vanur, Chennai)'}
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-sm"
            >
              {language === 'ta' ? 'தேடுக' : 'Search'}
            </button>
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          {language === 'ta' ? 'வேலைவாய்ப்புகள் ஏற்றப்படுகின்றன...' : 'Loading verified vacancies...'}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {language === 'ta' ? 'பொருத்தமான வேலைகள் எதுவும் கிடைக்கவில்லை' : 'No jobs found matching your criteria'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'ta' ? 'வடிகட்டியை மாற்றி மீண்டும் முயற்சிக்கவும்.' : 'Try adjusting your category filter or search keywords.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <CategoryBadge category={job.jobCategory} />
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    💰 {job.salary}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{job.jobTitle}</h3>
                  <div className="flex items-center text-xs font-semibold text-slate-600 mt-1">
                    <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <span>{job.organizationName}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {job.jobDescription}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-600">
                  <div className="flex items-center">
                    <GraduationCap className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                    <span className="truncate">{job.qualification}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                    <span className="truncate">{job.jobLocation}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                    <span className="truncate">{job.requiredExperience}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-slate-800">👥 {job.vacanciesCount} {language === 'ta' ? 'பணியிடங்கள்' : 'Posts'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {language === 'ta' ? 'கடைசி தேதி: ' : 'Deadline: '} {job.applicationLastDate ? new Date(job.applicationLastDate).toLocaleDateString() : 'See Official Link'}
                </span>

                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  {/* WhatsApp Quick Share for Mobile & Web */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `🌾 *OUR VILLAGE வேலைவாய்ப்பு*\n💼 *${job.jobTitle}*\n🏢 ${job.organizationName}\n📍 இடம்: ${job.jobLocation}\n🎓 தகுதி: ${job.qualification}\n🔗 விண்ணப்பிக்க: ${job.applicationUrl || job.officialNotificationUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                    title="Share job on WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </a>

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
                  <a
                    href={job.applicationUrl || job.officialNotificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-white bg-slate-900 hover:bg-emerald-600 px-3.5 sm:px-4 py-2 rounded-xl transition shadow-sm"
                  >
                    <span>{language === 'ta' ? 'விண்ணப்பிக்க' : 'Apply'}</span>
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
