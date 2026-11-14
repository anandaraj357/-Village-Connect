import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ConfidenceBadge, PostedByBadge } from '../../components/Badge';
import { FileText, Download, ExternalLink, Calendar, Layers, MapPin } from 'lucide-react';

export const RecruitmentMgmt = () => {
  const [recruitments, setRecruitments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecruitments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/public/recruitments?limit=100');
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

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Screen 2</span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">Recruitment Notifications Manager</h2>
          <p className="text-xs text-slate-500">Government gazettes, notification numbers, and revision history across Tamil Nadu.</p>
        </div>
        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
          Total Published: {recruitments.length} Notifications
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading notifications...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Notification #</th>
                  <th className="py-3.5 px-4">Recruitment Name</th>
                  <th className="py-3.5 px-4">Organization</th>
                  <th className="py-3.5 px-4">District / Area</th>
                  <th className="py-3.5 px-4">Posts</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Revision</th>
                  <th className="py-3.5 px-4">PDF / Apply</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recruitments.map((rec) => (
                  <tr key={rec._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {rec.notificationNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">{rec.recruitmentName}</td>
                    <td className="py-3 px-4 text-slate-600">{rec.organization}</td>
                    <td className="py-3 px-4 text-slate-700 font-semibold">{rec.district || 'All Tamil Nadu'}</td>
                    <td className="py-3 px-4 font-bold">{rec.totalVacancies > 0 ? rec.totalVacancies.toLocaleString() : 'Gazetted'}</td>
                    <td className="py-3 px-4">
                      <PostedByBadge postedBy={rec.postedBy} />
                    </td>
                    <td className="py-3 px-4">
                      <ConfidenceBadge score={rec.confidenceScore} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        v{rec.currentRevision || 1}.0
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap space-x-2">
                      {rec.officialPdfUrl && (
                        <a
                          href={rec.officialPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-bold hover:underline"
                        >
                          PDF
                        </a>
                      )}
                      <a
                        href={rec.officialApplicationLink || rec.officialPdfUrl || rec.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-800 font-bold hover:underline"
                      >
                        Apply
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
