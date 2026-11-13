import React from 'react';
import { useLocation } from '../context/LocationContext';
import { useNotifications } from '../context/NotificationContext';
import {
  MapPin,
  Navigation,
  Check,
  X,
  RefreshCw,
  Sparkles,
  Building2,
  School,
  ShoppingBag,
  Droplets,
  Trees,
  PhoneCall,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const LocationPickerModal = () => {
  const {
    location,
    isModalOpen,
    closeLocationModal,
    wards,
    selectedWard,
    selectWard,
    requestGpsLocation,
    coordinates,
    isLocating,
    isExtracting,
    extractionMessage
  } = useLocation();

  const { language } = useNotifications();

  if (!isModalOpen) return null;

  const handleWardClick = async (wardId) => {
    await selectWard(wardId);
    closeLocationModal();
  };

  const getWardIcon = (wardId) => {
    switch (wardId) {
      case 'ward-1':
        return <Building2 className="w-5 h-5 text-emerald-600" />;
      case 'ward-2':
        return <Droplets className="w-5 h-5 text-teal-600" />;
      case 'ward-3':
        return <Trees className="w-5 h-5 text-cyan-600" />;
      case 'ward-4':
        return <School className="w-5 h-5 text-sky-600" />;
      case 'ward-5':
        return <Building2 className="w-5 h-5 text-indigo-600" />;
      default:
        return <Compass className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-t-[32px] sm:rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] pb-safe">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white">
          {/* Mobile Pull Bar */}
          <div className="w-12 h-1 bg-white/40 rounded-full mx-auto mb-3 sm:hidden" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 bg-white/20 text-emerald-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                <MapPin className="w-3.5 h-3.5" />
                <span>நேசல் கிராமம் • வானூர் வட்டம் (604102)</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black">
                {language === 'ta' ? 'நேசல் கிராம வார்டுகள் & பகுதிகள்' : 'Nesal Village Wards & Sectors'}
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm">
                {language === 'ta'
                  ? 'நேசல் கிராம நத்தம், காலனி, ஏரிக்கரை மற்றும் வானூர் சாலை வார்டுகளுக்கான பிரத்யேகத் தகவல்கள்.'
                  : 'Hyper-localized wards, streets, and amenities dedicated exclusively to Nesal Village.'}
              </p>
            </div>
            <button
              onClick={closeLocationModal}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Live Status Banner */}
        {extractionMessage && (
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-2.5 flex items-center space-x-2 text-xs font-semibold text-emerald-800">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>{extractionMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* GPS Verification Section */}
          <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/70 p-4 sm:p-5 rounded-2xl border border-emerald-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'ta' ? 'நேசல் ஜி.பி.எஸ் செயற்கைக்கோள் சரிபார்ப்பு' : 'Nesal GPS Geolocation Lock'}</span>
              </span>
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                12.0125° N, 79.7214° E
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ta'
                ? 'உங்கள் மொபைல் ஜிபிஎஸ் மூலம் நீங்கள் நேசல் கிராம எல்லைக்குள் உள்ள தூரத்தை உடனடியாகச் சரிபார்க்கவும்.'
                : 'Locks coordinates to Nesal Village Center (Lat 12.0125° N, Lng 79.7214° E) and measures proximity.'}
            </p>

            <button
              onClick={requestGpsLocation}
              disabled={isLocating || isExtracting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs sm:text-sm"
            >
              {isLocating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === 'ta' ? 'ஜிபிஎஸ் சரிபார்க்கப்படுகிறது...' : 'Acquiring GPS Signal...'}</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>{language === 'ta' ? 'நேசல் ஜி.பி.எஸ்-ஐ உறுதிசெய்' : 'Verify Device GPS with Nesal Village'}</span>
                </>
              )}
            </button>

            {location.isGps && (
              <div className="text-[11px] text-emerald-800 font-semibold text-center bg-white/70 py-1.5 px-3 rounded-lg border border-emerald-100 flex items-center justify-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {location.distanceToNesalKm <= 3
                    ? 'நீங்கள் நேசல் கிராம எல்லைக்குள் உள்ளீர்கள் (நேரடி ஜிபிஎஸ்).'
                    : `நேசல் கிராம மையத்திலிருந்து உங்கள் தூரம்: ${location.distanceToNesalKm} கி.மீ.`}
                </span>
              </div>
            )}
          </div>

          {/* Ward Selector Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {language === 'ta' ? 'நேசல் கிராம வார்டுகள் (தேர்வு செய்க)' : 'Select Nesal Village Ward'}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                அஞ்சல் குறியீடு: 604102
              </span>
            </div>

            <div className="space-y-2">
              {wards.map((ward) => {
                const isSelected = selectedWard === ward.id;
                return (
                  <button
                    key={ward.id}
                    onClick={() => handleWardClick(ward.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    <div className="mt-0.5 p-2 rounded-xl bg-white shadow-xs border border-slate-100">
                      {getWardIcon(ward.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {ward.name}
                        </h4>
                        {isSelected && (
                          <span className="bg-emerald-600 text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                        {ward.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Civic Facilities at a Glance */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === 'ta' ? 'நேசல் கிராம முக்கிய வசதிகள்' : 'Nesal Civic Amenities'}
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2">
                <School className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-semibold text-slate-700">அரசு தொடக்கப்பள்ளி</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-semibold text-slate-700">ரேஷன் கடை (PDS)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-semibold text-slate-700">மேல்நிலை நீர்த்தேக்கம்</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-semibold text-slate-700">கிராம ஊராட்சி மன்றம்</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-slate-800">
              {location.wardName || 'நேசல் கிராமம் முழுமையும்'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={closeLocationModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
            >
              {language === 'ta' ? 'மூடுக' : 'Close'}
            </button>
            <button
              onClick={closeLocationModal}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'தகவல்களைக் காண்க' : 'View Nesal Updates'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
