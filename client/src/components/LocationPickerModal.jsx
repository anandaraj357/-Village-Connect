import React, { useState, useEffect } from 'react';
import { useLocation } from '../context/LocationContext';
import { useNotifications } from '../context/NotificationContext';
import { MapPin, Navigation, Compass, Check, X, RefreshCw, Sparkles, Building2, Globe } from 'lucide-react';

const QUICK_DISTRICTS = [
  'Villupuram',
  'Chennai',
  'Coimbatore',
  'Salem',
  'Madurai',
  'Cuddalore',
  'Tiruchirappalli',
  'Thanjavur',
  'Tirunelveli',
  'Vellore'
];

export const LocationPickerModal = () => {
  const {
    location,
    isModalOpen,
    closeLocationModal,
    statesAndDistricts,
    requestGpsLocation,
    changeLocation,
    isLocating,
    isExtracting,
    extractionMessage
  } = useLocation();

  const { language } = useNotifications();

  const [selectedState, setSelectedState] = useState(location.state || 'Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState(location.district || 'Villupuram');
  const [selectedMandal, setSelectedMandal] = useState(location.mandal || 'Vanur');
  const [selectedVillage, setSelectedVillage] = useState(location.village || 'Nesal');

  useEffect(() => {
    setSelectedState(location.state || 'Tamil Nadu');
    setSelectedDistrict(location.district || 'Villupuram');
    setSelectedMandal(location.mandal || 'Vanur');
    setSelectedVillage(location.village || 'Nesal');
  }, [location]);

  if (!isModalOpen) return null;

  const availableDistricts = statesAndDistricts[selectedState] || [];

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const districtsForState = statesAndDistricts[newState] || [];
    if (districtsForState.length > 0) {
      setSelectedDistrict(districtsForState[0]);
    }
  };

  const handleApply = async () => {
    await changeLocation({
      state: selectedState,
      district: selectedDistrict,
      mandal: selectedMandal,
      village: selectedVillage
    });
    closeLocationModal();
  };

  const handleQuickSelect = async (dist) => {
    setSelectedDistrict(dist);
    setSelectedState('Tamil Nadu');
    await changeLocation({
      state: 'Tamil Nadu',
      district: dist,
      mandal: 'General',
      village: 'All'
    });
    closeLocationModal();
  };

  const handleGpsClick = () => {
    requestGpsLocation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex justify-between items-start">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 bg-white/20 text-emerald-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              <Compass className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'புவியியல் இருப்பிடம்' : 'Geographic Location'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              {language === 'ta' ? 'மாவட்டம் அல்லது மாநிலத்தை மாற்றவும்' : 'Change District or State'}
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm">
              {language === 'ta'
                ? 'தேர்வு செய்யும் இடத்திற்கேற்ப உடனடி செய்திகள் மற்றும் அறிவிப்புகள் தானாக சேகரிக்கப்படும்.'
                : 'Select or detect your location to extract verified local news & notifications.'}
            </p>
          </div>
          <button
            onClick={closeLocationModal}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Banner */}
        {extractionMessage && (
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-2.5 flex items-center space-x-2 text-xs font-semibold text-emerald-800">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>{extractionMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Option 1: GPS Auto-Detect */}
          <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/60 p-5 rounded-2xl border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'ta' ? 'தானியங்கி ஜி.பி.எஸ் கண்டறிதல்' : 'Browser GPS Geolocation'}</span>
              </span>
              {location.isGps && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  GPS Active
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ta'
                ? 'உங்கள் மொபைல் அல்லது கணினியின் துல்லியமான ஜிபிஎஸ் இருப்பிடத்தைப் பயன்படுத்தி மாவட்டத்தை தானாகக் கண்டறியவும்.'
                : 'Use device GPS coordinates to automatically reverse-geocode your State, District, and Taluk.'}
            </p>

            <button
              onClick={handleGpsClick}
              disabled={isLocating || isExtracting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm"
            >
              {isLocating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === 'ta' ? 'ஜிபிஎஸ் கண்டறிகிறது...' : 'Acquiring GPS Satellite Lock...'}</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>{language === 'ta' ? 'எனது ஜிபிஎஸ் இருப்பிடத்தைப் பயன்படுத்து' : 'Use My Live GPS Location'}</span>
                </>
              )}
            </button>

            {location.lat && location.lng && (
              <div className="text-[11px] text-slate-500 text-center font-mono">
                Lat: {location.lat.toFixed(4)}° N, Lng: {location.lng.toFixed(4)}° E
              </div>
            )}
          </div>

          {/* Quick Select Tamil Nadu Districts */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === 'ta' ? 'முக்கிய மாவட்டங்கள்' : 'Popular Districts'}
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_DISTRICTS.map((dist) => (
                <button
                  key={dist}
                  onClick={() => handleQuickSelect(dist)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition ${
                    location.district === dist
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>

          {/* Option 2: Manual Select State & District */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === 'ta' ? 'கைமுறையாக தேர்வு செய்தல்' : 'Manual Selection'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* State Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ta' ? 'மாநிலம் (State)' : 'State / UT'}
                </label>
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.keys(statesAndDistricts).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ta' ? 'மாவட்டம் (District)' : 'District'}
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Taluk / Mandal Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ta' ? 'வட்டம் / தாலுகா (Taluk / Mandal)' : 'Taluk / Block (Optional)'}
                </label>
                <input
                  type="text"
                  value={selectedMandal}
                  onChange={(e) => setSelectedMandal(e.target.value)}
                  placeholder="e.g. Vanur, Tindivanam"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Village Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ta' ? 'கிராமம் (Village)' : 'Village / Town (Optional)'}
                </label>
                <input
                  type="text"
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  placeholder="e.g. Nesal, Mailam"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-slate-800">
              {selectedDistrict}, {selectedState}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={closeLocationModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
            >
              {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
            </button>
            <button
              onClick={handleApply}
              disabled={isExtracting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white shadow-md transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'செய்திகளைத் திரட்டுக' : 'Apply & Extract News'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
