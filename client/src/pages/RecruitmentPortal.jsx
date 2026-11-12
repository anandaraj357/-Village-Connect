import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import { ConfidenceBadge } from '../components/Badge';
import { FileText, Search, Download, ExternalLink, Calendar, CheckCircle2, AlertTriangle, Layers, Clock } from 'lucide-react';

export const RecruitmentPortal = () => {
  const { language } = useNotifications();
  const [recruitments, setRecruitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRec, setSelectedRec] = useState(null);

  const fetchRecruitments = async () => {
    try {
      setLoading(true);
      const searchParam = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
      const res = await axios.get(`/api/public/recruitments${searchParam}`);
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
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecruitments();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Official Gazettes & Commissions</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            {language === 'te' ? 'ప్రభుత్వ నియామక నోటిఫికేషన్లు' : 'Government Recruitment Notifications'}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Official recruitment drives from APPSC, SSC, UPSC, IBPS, and Andhra Pradesh government departments with structured PDF extractions.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by recruitment name, organization, or notification number (e.g. APPSC/NOTIF/02/2026)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-sm"
          >
            Search
          </button>
        </form>
      </div>

      {/* Recruitment Cards */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Loading recruitment notifications...
        </div>
      ) : recruitments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No recruitment notifications found</h3>
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
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {rec.organization}
                    </span>
                    <ConfidenceBadge score={rec.confidenceScore} />
                    {rec.currentRevision > 1 && (
                      <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg flex items-center">
                        <Layers className="w-3.5 h-3.5 mr-1" />
                        Rev #{rec.currentRevision}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                    {rec.recruitmentName}
                  </h2>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  {rec.officialPdfUrl && (
                    <a
                      href={rec.officialPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  )}
                  <a
                    href={rec.officialApplicationLink || rec.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
                  >
                    <span>Apply Online</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Structured Extracted Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Total Posts</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {rec.totalVacancies > 0 ? rec.totalVacancies.toLocaleString() : 'See Notification'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Application Fee</span>
                  <span className="font-semibold text-slate-800 block truncate">{rec.applicationFee}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Age Limit</span>
                  <span className="font-semibold text-slate-800 block truncate">{rec.ageLimit}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Exam Schedule</span>
                  <span className="font-semibold text-slate-800 block truncate">
                    {rec.importantDates?.examDate || 'To be notified'}
                  </span>
                </div>
              </div>

              {/* Eligibility & Selection */}
              <div className="space-y-2 text-xs text-slate-700">
                <div>
                  <span className="font-bold text-slate-900">Eligibility & Qualifications: </span>
                  <span>{rec.eligibility}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Selection Process: </span>
                  <span>{rec.selectionProcess}</span>
                </div>
                {rec.postNames && rec.postNames.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1.5 items-center">
                    <span className="font-bold text-slate-900 mr-1">Posts:</span>
                    {rec.postNames.map((p, i) => (
                      <span key={i} className="bg-slate-200/70 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Dates & Source Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Last Date: <strong className="ml-1 text-slate-800">{rec.importantDates?.applicationLastDate ? new Date(rec.importantDates.applicationLastDate).toLocaleDateString() : 'See Notice'}</strong>
                  </span>
                  <span>Source: {rec.organization}</span>
                </div>

                {rec.missingFields && rec.missingFields.length > 0 && (
                  <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {rec.missingFields.length} field(s) pending official clarification
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
