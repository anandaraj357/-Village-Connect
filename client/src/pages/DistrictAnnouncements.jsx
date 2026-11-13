import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import { useLocation } from '../context/LocationContext';
import { CategoryBadge } from '../components/Badge';
import { Megaphone, Calendar, MapPin, ExternalLink, ShieldCheck, RefreshCw, Navigation } from 'lucide-react';

export const DistrictAnnouncements = () => {
  const { language } = useNotifications();
  const {
    location,
    openLocationModal,
    requestGpsLocation,
    isLocating,
    isExtracting,
    refreshTrigger
  } = useLocation();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/public/announcements?district=Villupuram&state=Tamil%20Nadu');
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
  }, [refreshTrigger]);

  return (
    <div className="space-y-8 pb-16">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Official Communiques</span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <MapPin className="w-3 h-3 mr-1 text-emerald-600" />
                நேசல் கிராமம், வானூர் வட்டம் (604102)
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mt-1">
              {language === 'ta'
                ? 'நேசல் கிராம ஊராட்சி & வானூர் வட்டார அறிவிப்புகள்'
                : 'Nesal Panchayat & Vanur Taluk Announcements'}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              {language === 'ta'
                ? 'நேசல் கிராம ஊராட்சி மன்றம், வானூர் வட்டாட்சியர் அலுவலகம் மற்றும் விழுப்புரம் மாவட்ட ஆட்சியரக சுற்றறிக்கைகள்.'
                : 'Official press releases, Grama Sabha notices, water schedule, and civic circulars for Nesal Village.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={requestGpsLocation}
              disabled={isLocating || isExtracting}
              className="bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 font-bold px-3 py-2 rounded-xl text-xs transition flex items-center space-x-1.5"
            >
              {isLocating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
              <span>நேசல் ஜிபிஎஸ்</span>
            </button>
            <button
              onClick={openLocationModal}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center space-x-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'ta' ? 'வார்டு தேர்வு' : 'Nesal Wards'}</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          அறிவிப்புகள் ஏற்றப்படுகின்றன...
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {language === 'ta' ? 'நேசல் கிராம அறிவிப்புகள் எதுவும் இல்லை' : 'No active announcements for Nesal'}
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
                    Verified Official Release
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
                    நேசல் கிராமம் • வானூர் வட்டம், விழுப்புரம் (604102)
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
                  <span>{language === 'ta' ? 'அதிகாரப்பூர்வ சுற்றறிக்கை' : 'Official Circular'}</span>
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
