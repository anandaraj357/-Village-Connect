import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CategoryBadge } from '../../components/Badge';
import { Megaphone, ExternalLink, Calendar, MapPin, CheckCircle } from 'lucide-react';

export const DistrictAnnouncementsMgmt = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/public/announcements');
      if (res.data.success) {
        setAnnouncements(res.data.announcements);
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Screen 4</span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">District Announcements Manager</h2>
          <p className="text-xs text-slate-500">Government circulars, collectorate press releases, and tenders.</p>
        </div>
        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
          Active Communiques: {announcements.length}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading announcements...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Communique Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Jurisdiction</th>
                  <th className="py-3.5 px-4">Summary</th>
                  <th className="py-3.5 px-4">Official Origin</th>
                  <th className="py-3.5 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {announcements.map((ann) => (
                  <tr key={ann._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-sm">{ann.headline}</td>
                    <td className="py-3 px-4">
                      <CategoryBadge category={ann.category} />
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {ann.geographicRelevance?.mandal}, {ann.geographicRelevance?.district}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs line-clamp-2">{ann.summaryEnglish}</td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{ann.sourceWebsite}</td>
                    <td className="py-3 px-4">
                      <a
                        href={ann.originalArticleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-bold hover:underline inline-flex items-center space-x-1"
                      >
                        <span>Official Link</span>
                        <ExternalLink className="w-3 h-3" />
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
