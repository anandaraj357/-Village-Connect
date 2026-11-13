import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useLocation } from '../context/LocationContext';
import { LocationPickerModal } from './LocationPickerModal';
import { Bell, Globe, Shield, MapPin, Briefcase, FileText, Newspaper, Megaphone, CheckCircle2, ChevronRight, X, Navigation, Compass, RefreshCw } from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView }) => {
  const { notifications, unreadCount, markAllRead, language, toggleLanguage } = useNotifications();
  const { location, openLocationModal, requestGpsLocation, isLocating, isExtracting, extractionMessage } = useLocation();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const navLinks = [
    { id: 'home', label: language === 'ta' ? 'முகப்பு' : 'Home', icon: null },
    { id: 'jobs', label: language === 'ta' ? 'வேலைவாய்ப்புகள்' : 'Job Vacancies', icon: Briefcase },
    { id: 'recruitments', label: language === 'ta' ? 'அரசு அறிவிப்புகள்' : 'Recruitment Alerts', icon: FileText },
    { id: 'news', label: language === 'ta' ? 'கிராம செய்திகள்' : 'Daily News', icon: Newspaper },
    { id: 'announcements', label: language === 'ta' ? 'மாவட்ட அறிவிப்புகள்' : 'Announcements', icon: Megaphone },
    { id: 'subscriptions', label: language === 'ta' ? 'விழிப்பூட்டல்கள்' : 'Alert Preferences', icon: null }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner with location & live indicators */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-medium text-emerald-400 hidden sm:inline">Live Crawlers</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          
          {/* Clickable Location Pill */}
          <button
            onClick={openLocationModal}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-0.5 rounded-full border border-slate-700 hover:border-emerald-500 transition text-xs group"
            title="Click to change District or State"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
            <span className="font-bold text-white">
              {location.district}, {location.state}
            </span>
            {location.mandal && location.mandal !== 'General' && (
              <span className="text-slate-400 text-[11px] hidden md:inline">({location.mandal})</span>
            )}
            {location.isGps && (
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                GPS
              </span>
            )}
            <span className="text-emerald-400 text-[11px] underline ml-1">
              {language === 'ta' ? 'மாற்றுக' : 'Change'}
            </span>
          </button>

          {/* Direct 1-Click GPS Button */}
          <button
            onClick={requestGpsLocation}
            disabled={isLocating || isExtracting}
            className="flex items-center space-x-1 text-[11px] text-emerald-300 hover:text-emerald-200 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/60 px-2 py-0.5 rounded transition"
            title="Auto-detect current GPS location"
          >
            {isLocating ? (
              <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
            ) : (
              <Navigation className="w-3 h-3 text-emerald-400" />
            )}
            <span className="hidden sm:inline">
              {isLocating ? 'Locating...' : 'GPS Auto-Detect'}
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {extractionMessage && (
            <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-emerald-300 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span className="truncate max-w-xs">{extractionMessage}</span>
            </div>
          )}

          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 font-semibold text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded transition"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ta' ? 'English' : 'தமிழ் (Tamil)'}</span>
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`flex items-center space-x-1 px-2.5 py-0.5 rounded font-medium transition ${
              currentView.startsWith('admin')
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition">
              🌾
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-lg tracking-tight flex items-center space-x-1.5">
                <span>OUR VILLAGE</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  AI Aggregator
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {language === 'ta'
                  ? `${location.district} & ${location.state} டிஜிட்டல் தளம்`
                  : `${location.district} & ${location.state} Digital Portal`}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                if (unreadCount > 0) markAllRead();
              }}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="flex justify-between items-center px-4 py-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800 text-sm">
                    {language === 'ta' ? 'விழிப்பூட்டல்கள் & அறிவிப்புகள்' : 'Notifications & Alerts'}
                  </h4>
                  <button
                    onClick={() => setShowNotifDropdown(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      {language === 'ta' ? 'தற்போது புதிய அறிவிப்புகள் இல்லை.' : 'No notifications at the moment.'}
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif._id} className="p-3 hover:bg-slate-50 transition">
                        <div className="flex items-start justify-between">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {notif.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 mt-1">{notif.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{notif.body}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setShowNotifDropdown(false);
                      setCurrentView('subscriptions');
                    }}
                    className="text-xs font-medium text-emerald-700 hover:underline"
                  >
                    {language === 'ta' ? 'வகை விழிப்பூட்டல்களை நிர்வகிக்கவும் →' : 'Manage category alert subscriptions →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <LocationPickerModal />
    </header>
  );
};
