import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import { useLocation } from '../context/LocationContext';
import { CategoryBadge } from '../components/Badge';
import { Newspaper, ExternalLink, Calendar, MapPin, Globe, RefreshCw, Navigation, Sparkles, Compass, Share2 } from 'lucide-react';

const NEWS_CATEGORIES = [
  'All',
  'Village News',
  'District News',
  'Agriculture',
  'Important Announcements',
  'Government Schemes',
  'Employment',
  'Education'
];

export const NewsPortal = () => {
  const { language, toggleLanguage } = useNotifications();
  const {
    location,
    openLocationModal,
    requestGpsLocation,
    extractNewsForLocation,
    isLocating,
    isExtracting,
    extractionMessage,
    refreshTrigger
  } = useLocation();

  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      params.append('district', 'Villupuram');
      params.append('state', 'Tamil Nadu');

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await axios.get(`/api/public/news${queryString}`);
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
  }, [selectedCategory, refreshTrigger]);

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Rural Press & Governance</span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <MapPin className="w-3 h-3 mr-1 text-emerald-600" />
                நெசல் கிராமம் • வானூர் வட்டம் (604102)
              </span>
            </div>

            <h1 className="text-3xl font-black text-slate-900 mt-1">
              {language === 'ta'
                ? 'நெசல் கிராமம் & வானூர் வட்டார செய்திகள்'
                : 'Nesal Village & Vanur Taluk News'}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              {language === 'ta'
                ? 'நெசல் கிராம ஊராட்சி, வானூர் வட்டார வளர்ச்சி மற்றும் விழுப்புரம் மாவட்ட நிர்வாகத்தின் உண்மை சரிபார்க்கப்பட்ட தமிழ் செய்திகள்.'
                : 'AI-verified, hyper-local factual updates for Nesal Village and Vanur Taluk, Villupuram District.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ta' ? 'English' : 'தமிழ் (Tamil)'}</span>
            </button>
          </div>
        </div>

        {/* Location Action Bar */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <span>{language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட பகுதி:' : 'Active Sector:'}</span>
                <span className="text-emerald-700 font-extrabold">
                  {location.wardName || 'நெசல் கிராமம் முழுமையும்'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                நெசல் கிராம எல்லை: 12.0125° N, 79.7214° E (வானூர் வட்டம், விழுப்புரம்)
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <button
              onClick={requestGpsLocation}
              disabled={isLocating || isExtracting}
              className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300 font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-sm"
              title="நெசல் கிராம ஜிபிஎஸ் சரிபார்க்கவும்"
            >
              {isLocating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>{language === 'ta' ? 'ஜிபிஎஸ்' : 'GPS Verify'}</span>
            </button>

            <button
              onClick={openLocationModal}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'ta' ? 'வார்டு தேர்வு' : 'Change Ward'}</span>
            </button>

            <button
              onClick={() => extractNewsForLocation(location)}
              disabled={isExtracting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-sm"
            >
              {isExtracting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{isExtracting ? 'செய்திகள் பெறுகின்றன...' : (language === 'ta' ? 'நெசல் செய்திகளைப் புதுப்பிக்க' : 'Extract Latest News')}</span>
            </button>
          </div>
        </div>

        {/* Extraction Message Banner */}
        {extractionMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-2 text-xs flex items-center space-x-2 font-medium animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600 flex-shrink-0" />
            <span>{extractionMessage}</span>
          </div>
        )}

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
          நெசல் கிராம செய்திகள் ஏற்றப்படுகின்றன...
        </div>
      ) : news.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {language === 'ta' ? 'செய்திகள் எதுவும் காணப்படவில்லை' : 'No news articles found for Nesal'}
          </h3>
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
                  {language === 'ta' && item.summaryTamil ? (
                    <div className="tamil-text bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 text-xs sm:text-sm text-emerald-950 leading-relaxed">
                      <span className="font-bold block text-emerald-800 mb-1">தமிழ் சுருக்கம்:</span>
                      {item.summaryTamil}
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.summaryEnglish || item.shortDescription}
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-xs text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      நெசல் கிராமம் • வானூர் வட்டம், விழுப்புரம்
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {new Date(item.publishedDate).toLocaleDateString()}
                  </span>

                  <div className="flex items-center space-x-2">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `🌾 *நமது நெசல் கிராமம் செய்தி*\n📰 *${item.headline}*\n📍 நெசல், வானூர், விழுப்புரம் (604102)\n\n${item.summaryTamil || item.summaryEnglish || item.shortDescription}\n\n🔗 ${item.originalArticleUrl}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                      title="Share news on WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={item.originalArticleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center space-x-1"
                    >
                      <span>{language === 'ta' ? 'முழு செய்தி' : `Read Source`}</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
