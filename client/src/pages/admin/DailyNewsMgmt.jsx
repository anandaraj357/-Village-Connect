import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CategoryBadge } from '../../components/Badge';
import { Newspaper, ExternalLink, Calendar, MapPin, Globe } from 'lucide-react';

export const DailyNewsMgmt = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/public/news?limit=100');
      if (res.data.success) {
        setNews(res.data.news);
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Screen 3</span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">Daily News Aggregation Manager</h2>
          <p className="text-xs text-slate-500">Live published news articles, summaries and bilingual Tamil/English translations.</p>
        </div>
        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
          Total Published: {news.length} Articles
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading news...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Headline</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Geographic Scope</th>
                  <th className="py-3.5 px-4">Tamil Translation (தமிழ்)</th>
                  <th className="py-3.5 px-4">English Summary</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Published Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {news.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">{item.headline}</td>
                    <td className="py-3 px-4">
                      <CategoryBadge category={item.category} />
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {item.geographicRelevance?.scope || 'District'} ({item.geographicRelevance?.district || 'Villupuram'})
                    </td>
                    <td className="py-3 px-4 tamil-text text-emerald-950 max-w-xs line-clamp-2">
                      {item.summaryTamil || item.summaryEnglish}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs line-clamp-2">{item.summaryEnglish}</td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{item.sourceWebsite}</td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(item.publishedDate).toLocaleDateString()}
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
