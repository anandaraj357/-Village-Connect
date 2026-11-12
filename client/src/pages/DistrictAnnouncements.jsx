import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import { CategoryBadge } from '../components/Badge';
import { Megaphone, Calendar, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export const DistrictAnnouncements = () => {
  const { language } = useNotifications();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/public/announcements');
        if (res.data.success) {
          setAnnouncements(res.data.announcements);
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Official Communiques</span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          {language === 'ta' ? 'விழுப்புரம் மாவட்ட & வானூர் வட்டார அறிவிப்புகள்' : 'District & Taluk Announcements'}
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          {language === 'ta'
            ? 'விழுப்புரம் மாவட்ட ஆட்சியரகம், வானூர் வட்டாட்சியர் அலுவலகம் மற்றும் நேசல் கிராம பஞ்சாயத்து அதிகாரப்பூர்வ சுற்றறிக்கைகள்.'
            : 'Press releases, public grievances schedules, welfare notices, and civic circulars from Villupuram District Administration and Vanur Taluk.'}
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Loading announcements...
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {language === 'ta' ? 'அறிவிப்புகள் எதுவும் இல்லை' : 'No active announcements'}
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row justify-between gap-4 items-start"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center space-x-2">
                  <CategoryBadge category={ann.category} />
                  <span className="text-xs font-semibold text-emerald-700 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Verified Official Notice
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{ann.headline}</h3>

                {language === 'ta' && ann.summaryTamil ? (
                  <p className="tamil-text text-xs sm:text-sm text-emerald-950 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                    {ann.summaryTamil}
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {ann.summaryEnglish || ann.shortDescription}
                  </p>
                )}

                <div className="flex items-center space-x-4 text-xs text-slate-500 pt-2">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {ann.geographicRelevance?.district || 'Villupuram'} District ({ann.geographicRelevance?.mandal || 'Vanur'})
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {new Date(ann.publishedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                <a
                  href={ann.originalArticleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-sm"
                >
                  <span>{language === 'ta' ? 'அதிகாரப்பூர்வ சுற்றறிக்கை' : 'Official Release'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
