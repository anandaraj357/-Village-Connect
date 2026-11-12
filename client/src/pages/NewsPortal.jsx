import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import { CategoryBadge } from '../components/Badge';
import { Newspaper, ExternalLink, Calendar, MapPin, Globe } from 'lucide-react';

const NEWS_CATEGORIES = [
  'All',
  'Village News',
  'Mandal News',
  'District News',
  'Andhra Pradesh News',
  'National News',
  'Education',
  'Technology',
  'Agriculture',
  'Employment',
  'Sports',
  'Government Schemes',
  'Important Announcements'
];

export const NewsPortal = () => {
  const { language, toggleLanguage } = useNotifications();
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const catParam = selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : '';
      const res = await axios.get(`/api/public/news${catParam}`);
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
  }, [selectedCategory]);

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Rural Press & Schemes</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              {language === 'te' ? 'గ్రామ & జిల్లా వార్తా ముఖ్యాంశాలు' : 'Daily News & Community Highlights'}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              AI-summarized news preserving original sources. Switch seamlessly between English and Telugu translations.
            </p>
          </div>

          <button
            onClick={toggleLanguage}
            className="self-start sm:self-auto flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-4 py-2 rounded-xl text-xs transition"
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Currently showing: {language === 'te' ? 'తెలుగు (Telugu)' : 'English'}</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {NEWS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
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

      {/* News Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Loading news items...
        </div>
      ) : news.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No news articles found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              {item.thumbnailUrl && (
                <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
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

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {!item.thumbnailUrl && <CategoryBadge category={item.category} />}
                  <h2 className="font-extrabold text-slate-900 text-lg leading-snug">{item.headline}</h2>

                  {/* Summary based on language */}
                  {language === 'te' && item.summaryTelugu ? (
                    <div className="telugu-text bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 text-xs sm:text-sm text-emerald-950 leading-relaxed">
                      <span className="font-bold block text-emerald-800 mb-1">తెలుగు సారాంశం (AI అనువాదం):</span>
                      {item.summaryTelugu}
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.summaryEnglish || item.shortDescription}
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-xs text-slate-400 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {item.geographicRelevance?.scope}: {item.geographicRelevance?.mandal || 'Tenali'}, {item.geographicRelevance?.district || 'Guntur'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {new Date(item.publishedDate).toLocaleDateString()}
                  </span>

                  <a
                    href={item.originalArticleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center space-x-1"
                  >
                    <span>Read on {item.sourceWebsite}</span>
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
