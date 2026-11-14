import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import {
  Bus,
  Clock,
  MapPin,
  PhoneCall,
  Search,
  Filter,
  Share2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Train,
  Heart,
  Plus,
  X,
  AlertCircle
} from 'lucide-react';

export const BusTransportPortal = () => {
  const { language } = useNotifications();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [womenFreeOnly, setWomenFreeOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Current Device Time
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [current24Hour, setCurrent24Hour] = useState('');

  // Suggest Timing Modal State
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestSuccess, setSuggestSuccess] = useState(false);
  const [suggestError, setSuggestError] = useState('');

  // Form Fields
  const [formServiceName, setFormServiceName] = useState('');
  const [formRouteNumber, setFormRouteNumber] = useState('');
  const [formDestination, setFormDestination] = useState('');
  const [formViaStops, setFormViaStops] = useState('');
  const [formDepartureTimes, setFormDepartureTimes] = useState('');
  const [formServiceType, setFormServiceType] = useState('TownBus');
  const [formContactPhone, setFormContactPhone] = useState('');
  const [formFare, setFormFare] = useState('');
  const [formIsWomenFree, setFormIsWomenFree] = useState(false);

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrent24Hour(`${hours}:${minutes}`);

      let displayH = now.getHours();
      const ampm = displayH >= 12 ? 'PM' : 'AM';
      displayH = displayH % 12 || 12;
      setCurrentTimeStr(`${String(displayH).padStart(2, '0')}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Schedules
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedDestination && selectedDestination !== 'All') {
        params.append('destination', selectedDestination);
      }
      if (selectedType && selectedType !== 'All') {
        params.append('serviceType', selectedType);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const res = await axios.get(`/api/public/transport?${params.toString()}`);
      if (res.data.success) {
        setSchedules(res.data.schedules);
      }
    } catch (err) {
      console.error('Failed to load transport schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [selectedDestination, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSchedules();
  };

  // Helper to find the next departure
  const getNextDeparture = (departures) => {
    if (!departures || departures.length === 0) return null;
    if (!current24Hour) return departures[0];

    // Find the first departure after current time
    const upcoming = departures.find((d) => d.time24 >= current24Hour);
    if (upcoming) return upcoming;
    // Otherwise loop back to first morning departure
    return departures[0];
  };

  // WhatsApp Share helper
  const handleShare = (schedule, e) => {
    e.stopPropagation();
    const times = (schedule.departures || []).map((d) => `${d.time} (${d.notes || 'நடை'})`).join('\n• ');
    const text = `🚌 *நெசல் & வானூர் பேருந்து நேர அட்டவணை*\n` +
      `🚍 *${schedule.serviceName}* (தடம்: ${schedule.routeNumber || 'வழக்கமான'})\n` +
      `📍 வழித்தடம்: ${schedule.origin} ➔ ${schedule.destination}\n` +
      `${schedule.isWomenFree ? '🌸 *மகளிருக்கு கட்டணமில்லா விடியல் பயணப் பேருந்து*\n' : ''}` +
      `⏰ *புறப்படும் நேரங்கள்:*\n• ${times}\n\n` +
      `📞 உதவி எண்: ${schedule.contactPhone || 'வானூர் பணிமனை'}\n` +
      `🔗 ${window.location.origin}/?tab=transport`;

    if (navigator.share) {
      navigator.share({
        title: schedule.serviceName,
        text: text,
        url: window.location.href
      }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // Submit New Timing Suggestion
  const handleSuggestSubmit = async (e) => {
    e.preventDefault();
    setSuggestError('');

    if (!formServiceName.trim() || !formDestination.trim()) {
      setSuggestError(language === 'ta' ? 'பேருந்து பெயர் மற்றும் சேருமிடம் அவசியம்.' : 'Service name & destination required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedDepartures = formDepartureTimes
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((time) => ({
          time,
          time24: '12:00',
          notes: 'பயணிகள் நேரம்'
        }));

      const res = await axios.post('/api/public/transport/suggest', {
        serviceName: formServiceName.trim(),
        routeNumber: formRouteNumber.trim(),
        serviceType: formServiceType,
        destination: formDestination.trim(),
        viaStops: formViaStops.split(',').map((s) => s.trim()).filter(Boolean),
        departures: parsedDepartures,
        contactPhone: formContactPhone.trim(),
        fareEstimated: formFare.trim(),
        isWomenFree: formIsWomenFree
      });

      if (res.data.success) {
        setSuggestSuccess(true);
        setFormServiceName('');
        setFormRouteNumber('');
        setFormDestination('');
        setFormViaStops('');
        setFormDepartureTimes('');
        setFormContactPhone('');
        setFormFare('');
        fetchSchedules();
        setTimeout(() => {
          setShowSuggestModal(false);
          setSuggestSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setSuggestError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const destinations = [
    { id: 'All', label: language === 'ta' ? 'அனைத்து வழித்தடங்கள்' : 'All Routes' },
    { id: 'Puducherry', label: 'புதுச்சேரி (Puducherry)' },
    { id: 'Tindivanam', label: 'திண்டிவனம் (Tindivanam)' },
    { id: 'Vanur', label: 'வானூர் (Vanur)' },
    { id: 'Villupuram', label: 'விழுப்புரம் (Villupuram)' },
    { id: 'Marakkanam', label: 'மரக்காணம் (Marakkanam)' }
  ];

  const filteredList = schedules.filter((item) => {
    if (womenFreeOnly && !item.isWomenFree) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-blue-900/50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30">
              <Bus className="w-3.5 h-3.5 text-blue-300" />
              <span>நெசல் & வானூர் பேருந்து மற்றும் போக்குவரத்து வழிகாட்டி</span>
            </span>

            {currentTimeStr && (
              <span className="inline-flex items-center space-x-1.5 bg-emerald-950/80 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-800 animate-pulse">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>நேரலை நேரம்: {currentTimeStr}</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            பேருந்து & போக்குவரத்து நேரங்கள்
          </h1>

          <p className="text-blue-200/90 text-sm sm:text-base leading-relaxed">
            நெசல் கிராமம் மற்றும் வானூர் வழித்தட அரசு நகரப் பேருந்துகள், மகளிர் விடியல் பயணம், திண்டிவனம் & புதுச்சேரி விரைவுப் பேருந்துகள், உள்ளூர் 24x7 ஆட்டோ ஸ்டாண்ட் மற்றும் ரயில் நேரங்களின் துல்லியமான வழிகாட்டி.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowSuggestModal(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black px-6 py-3 rounded-2xl shadow-xl transition flex items-center space-x-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>புதிய பேருந்து / ஆட்டோ நேரம் சேர்க்க</span>
            </button>

            <button
              onClick={() => setWomenFreeOnly(!womenFreeOnly)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition flex items-center space-x-2 ${
                womenFreeOnly
                  ? 'bg-rose-500 text-white border-rose-400 shadow-lg'
                  : 'bg-slate-800/80 text-rose-300 border-rose-800/60 hover:bg-slate-800'
              }`}
            >
              <span>🌸</span>
              <span>{womenFreeOnly ? 'அனைத்து பேருந்துகள்' : 'மகளிர் இலவச பேருந்துகள் மட்டும்'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-4">
        {/* Destination Pills */}
        <div className="flex flex-wrap gap-2">
          {destinations.map((dest) => {
            const isActive = selectedDestination === dest.id;
            return (
              <button
                key={dest.id}
                onClick={() => setSelectedDestination(dest.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {dest.label}
              </button>
            );
          })}
        </div>

        {/* Type Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-2 border-t border-slate-100">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {[
              { id: 'All', label: 'அனைத்து வாகனங்கள்' },
              { id: 'TownBus', label: '🚌 நகரப் பேருந்து' },
              { id: 'Mofussil', label: '🚍 விரைவுப் பேருந்து' },
              { id: 'Auto', label: '🛺 ஆட்டோ ஸ்டாண்ட்' },
              { id: 'Train', label: '🚆 ரயில்கள் (திண்டிவனம்)' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedType === t.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="தடம் எண் அல்லது ஊர் தேட..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  fetchSchedules();
                }}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Schedules List */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 text-sm font-semibold">பேருந்து நேரங்கள் ஏற்றப்படுகின்றன...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Bus className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">பேருந்து நேரங்கள் கிடைக்கவில்லை</h3>
          <p className="text-slate-500 text-sm">தேர்ந்தெடுக்கப்பட்ட வழித்தடத்திற்கு விவரங்கள் இல்லை.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((item) => {
            const nextBus = getNextDeparture(item.departures);

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Women Free Travel Badge Strip */}
                {item.isWomenFree && (
                  <div className="bg-rose-50 border-b border-rose-100 -mx-5 -mt-5 px-5 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-rose-700 font-extrabold text-xs">
                      <span>🌸</span>
                      <span>மகளிருக்கு கட்டணமில்லா விடியல் பயணப் பேருந்து</span>
                    </div>
                    <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded-full">
                      இலவசம்
                    </span>
                  </div>
                )}

                <div>
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-900 text-white font-black text-xs px-3 py-1 rounded-lg tracking-wider">
                        {item.routeNumber || 'தடம்'}
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                        {item.serviceType === 'TownBus' && '🚌 நகரப் பேருந்து'}
                        {item.serviceType === 'Mofussil' && '🚍 புறநகர் விரைவு'}
                        {item.serviceType === 'PrivateBus' && '🚐 தனியார் பேருந்து'}
                        {item.serviceType === 'Auto' && '🛺 ஆட்டோ சேவை'}
                        {item.serviceType === 'Train' && '🚆 ரயில் சேவை'}
                      </span>
                    </div>

                    {item.fareEstimated && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        💰 {item.fareEstimated}
                      </span>
                    )}
                  </div>

                  {/* Route Title */}
                  <h3 className="text-lg font-black text-slate-900 leading-snug">
                    {item.serviceName}
                  </h3>

                  {/* Route Path Indicator */}
                  <div className="flex items-center space-x-2 my-2 text-xs font-bold text-blue-900 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
                    <MapPin className="w-4 h-4 text-blue-700 flex-shrink-0" />
                    <span>{item.origin}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-indigo-950 underline">{item.destination}</span>
                  </div>

                  {/* Via Stops */}
                  {item.viaStops && item.viaStops.length > 0 && (
                    <div className="text-xs text-slate-600 mt-2">
                      <span className="font-bold text-slate-700">வழித்தடம்: </span>
                      <span>{item.viaStops.join(' • ')}</span>
                    </div>
                  )}

                  {/* Next Bus Highlight Badge */}
                  {nextBus && item.serviceType !== 'Auto' && (
                    <div className="mt-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="text-[11px] font-bold text-emerald-900">
                            அடுத்த நடை (Next Departure):
                          </div>
                          <div className="text-xs text-emerald-700">
                            {nextBus.notes || 'வழக்கமான சேவை'}
                          </div>
                        </div>
                      </div>
                      <span className="bg-emerald-600 text-white font-black text-sm px-3 py-1 rounded-lg shadow-sm">
                        {nextBus.time}
                      </span>
                    </div>
                  )}

                  {/* All Departures Grid */}
                  {item.departures && item.departures.length > 1 && (
                    <div className="mt-3">
                      <div className="text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>அனைத்து புறப்படும் நேரங்கள்:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.departures.map((dep, dIdx) => (
                          <span
                            key={dIdx}
                            className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition ${
                              nextBus && nextBus.time === dep.time
                                ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300'
                                : 'bg-slate-50 text-slate-800 border-slate-200'
                            }`}
                            title={dep.notes || ''}
                          >
                            {dep.time}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.frequencyNote && (
                    <p className="text-[11px] text-slate-500 mt-2 italic">
                      ℹ️ {item.frequencyNote}
                    </p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500 truncate max-w-[200px]">
                    {item.driverOrStandName || 'வானூர் தாலுகா'}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleShare(item, e)}
                      className="p-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
                      title="WhatsApp-ல் பகிர்க"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {item.contactPhone && (
                      <a
                        href={`tel:${item.contactPhone}`}
                        className="inline-flex items-center space-x-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>அழைக்க</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUGGEST TIMING MODAL */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-blue-950 text-white px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-2">
                <Bus className="w-5 h-5 text-blue-300" />
                <h3 className="font-bold text-base sm:text-lg">
                  புதிய பேருந்து / ஆட்டோ நேரம் சேர்க்க
                </h3>
              </div>
              <button
                onClick={() => setShowSuggestModal(false)}
                className="p-1 rounded-full text-blue-200 hover:text-white hover:bg-blue-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSuggestSubmit} className="p-6 space-y-4">
              {suggestSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-emerald-900">வெற்றிகரமாக சேர்க்கப்பட்டது!</h4>
                  <p className="text-xs text-emerald-700">
                    நெசல் கிராம மக்களுக்கு உங்கள் போக்குவரத்து தகவல் பெரிதும் உதவும். மிக்க நன்றி!
                  </p>
                </div>
              ) : (
                <>
                  {suggestError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{suggestError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      பேருந்து அல்லது வாகனத்தின் பெயர் *
                    </label>
                    <input
                      type="text"
                      required
                      value={formServiceName}
                      onChange={(e) => setFormServiceName(e.target.value)}
                      placeholder="எ.கா: நெசல் - வானூர் அரசுப் பேருந்து"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        தடம் எண் (Route No)
                      </label>
                      <input
                        type="text"
                        value={formRouteNumber}
                        onChange={(e) => setFormRouteNumber(e.target.value)}
                        placeholder="எ.கா: 188 / 12A"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        வாகன வகை
                      </label>
                      <select
                        value={formServiceType}
                        onChange={(e) => setFormServiceType(e.target.value)}
                        className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="TownBus">🚌 நகரப் பேருந்து</option>
                        <option value="Mofussil">🚍 புறநகர் விரைவு</option>
                        <option value="PrivateBus">🚐 தனியார் பேருந்து</option>
                        <option value="Auto">🛺 ஆட்டோ ஸ்டாண்ட்</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      சேருமிடம் (Destination) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formDestination}
                      onChange={(e) => setFormDestination(e.target.value)}
                      placeholder="எ.கா: புதுச்சேரி / திண்டிவனம் / வானூர்"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      முக்கிய நிறுத்துமிடங்கள் (கமாவால் பிரிக்கவும்)
                    </label>
                    <input
                      type="text"
                      value={formViaStops}
                      onChange={(e) => setFormViaStops(e.target.value)}
                      placeholder="நெசல், வானூர், கிளியனூர், கோரிமேடு"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      புறப்படும் நேரங்கள் (கமாவால் பிரிக்கவும்)
                    </label>
                    <input
                      type="text"
                      value={formDepartureTimes}
                      onChange={(e) => setFormDepartureTimes(e.target.value)}
                      placeholder="06:30 AM, 08:15 AM, 11:30 AM, 05:30 PM"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        தொடர்பு தொலைபேசி எண்
                      </label>
                      <input
                        type="tel"
                        value={formContactPhone}
                        onChange={(e) => setFormContactPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        கட்டணம் (சுமார்)
                      </label>
                      <input
                        type="text"
                        value={formFare}
                        onChange={(e) => setFormFare(e.target.value)}
                        placeholder="₹15 - ₹25"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="womenFreeCheck"
                      checked={formIsWomenFree}
                      onChange={(e) => setFormIsWomenFree(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                    <label htmlFor="womenFreeCheck" className="text-xs font-bold text-slate-700">
                      🌸 இது மகளிருக்கு கட்டணமில்லா விடியல் பயணப் பேருந்து
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black py-3 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>சேர்க்கப்படுகிறது...</span>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>அட்டவணையில் சேர்க்கவும்</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default BusTransportPortal;
