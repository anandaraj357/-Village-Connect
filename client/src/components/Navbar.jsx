import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useLocation } from '../context/LocationContext';
import { LocationPickerModal } from './LocationPickerModal';
import {
  Bell,
  Globe,
  Shield,
  MapPin,
  Briefcase,
  FileText,
  Newspaper,
  Megaphone,
  CheckCircle2,
  ChevronRight,
  X,
  Navigation,
  RefreshCw,
  PlusCircle,
  Menu,
  PhoneCall,
  BookOpen,
  Archive,
  Bus,
  GraduationCap
} from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView }) => {
  const { notifications, unreadCount, markAllRead, language, toggleLanguage } = useNotifications();
  const {
    location,
    openLocationModal,
    requestGpsLocation,
    isLocating,
    isExtracting,
    extractionMessage
  } = useLocation();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: language === 'ta' ? 'முகப்பு' : 'Home', icon: null },
    { id: 'about', label: language === 'ta' ? 'நெசல் வரலாறு' : 'About Us', icon: BookOpen },
    { id: 'heritage', label: language === 'ta' ? 'வரலாற்றுப் பெட்டகம்' : 'Heritage Archive', icon: Archive },
    { id: 'transport', label: language === 'ta' ? 'பேருந்து நேரங்கள்' : 'Bus Timings', icon: Bus },
    { id: 'education-health', label: language === 'ta' ? 'கல்வி & மருத்துவம்' : 'Edu & Health', icon: GraduationCap },
    { id: 'jobs', label: language === 'ta' ? 'வேலைவாய்ப்புகள்' : 'All-TN Jobs', icon: Briefcase },
    { id: 'recruitments', label: language === 'ta' ? 'அரசுப் பணி (TNPSC)' : 'Govt Recruitments', icon: FileText },
    { id: 'post-job', label: language === 'ta' ? '➕ வேலை பதிவிட' : '➕ Post a Job', icon: PlusCircle },
    { id: 'news', label: language === 'ta' ? 'செய்திகள்' : 'News', icon: Newspaper },
    { id: 'announcements', label: language === 'ta' ? 'ஊராட்சி அறிவிப்பு' : 'Panchayat Notices', icon: Megaphone }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner with location & live indicators */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold text-emerald-400 hidden sm:inline">நெசல் நேரலை</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          
          {/* Clickable Location Pill */}
          <button
            onClick={openLocationModal}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-0.5 rounded-full border border-slate-700 hover:border-emerald-500 transition text-xs group"
            title="நெசல் கிராம வார்டுகள் & பகுதிகள்"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
            <span className="font-bold text-white">
              நெசல் கிராமம் (Nesal) • வானூர், விழுப்புரம்
            </span>
            <span className="text-emerald-400 text-[11px] underline ml-1">
              {language === 'ta' ? 'வார்டுகள்' : 'Wards'}
            </span>
          </button>

          {/* Direct 1-Click GPS Button */}
          <button
            onClick={requestGpsLocation}
            disabled={isLocating || isExtracting}
            className="flex items-center space-x-1 text-[11px] text-emerald-300 hover:text-emerald-200 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/60 px-2 py-0.5 rounded transition"
            title="நெசல் கிராம மையத்துடன் ஜிபிஎஸ் தூரத்தை சரிபார்க்கவும்"
          >
            {isLocating ? (
              <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
            ) : (
              <Navigation className="w-3 h-3 text-emerald-400" />
            )}
            <span className="hidden sm:inline">
              {isLocating ? 'சரிபார்க்கிறது...' : 'நெசல் ஜி.பி.எஸ்'}
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
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
            className="flex items-center space-x-1 px-3 py-1 rounded-full font-bold transition bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-700 hover:border-emerald-500 shadow-sm"
            title="Switch to Administrator Control Center"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ta' ? 'நிர்வாக தளம் (Admin View)' : 'Admin Portal'}</span>
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
                <span>OUR VILLAGE - NESAL</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  நெசல் கிராமம்
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                வானூர் வட்டம் • விழுப்புரம் மாவட்டம் (அஞ்சல்: 605014)
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

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
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
                      {language === 'ta' ? 'நெசல் கிராம விழிப்பூட்டல்கள்' : 'Nesal Notifications & Alerts'}
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
                      {language === 'ta' ? 'வகை விழிப்பூட்டல்களை நிர்வகிக்கவும் →' : 'Manage alert subscriptions →'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              title="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between z-50 overflow-y-auto">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-base">
                    🌾
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">நமது நெசல் கிராமம்</h3>
                    <p className="text-[10px] text-emerald-700 font-semibold">வானூர், விழுப்புரம் (605014)</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nesal Ward Card */}
              <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-950 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>நெசல் கிராமம்</span>
                  </span>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    605014
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {location.wardName || 'அனைத்து வார்டுகள்'} • வானூர் வட்டம், விழுப்புரம்
                </p>
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => {
                      requestGpsLocation();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>ஜிபிஎஸ் சரிபார்</span>
                  </button>
                  <button
                    onClick={() => {
                      openLocationModal();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-bold py-1.5 px-2 rounded-lg text-center"
                  >
                    வார்டுகள்
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = currentView === link.id;

                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        setCurrentView(link.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-6 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs transition"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாறவும்'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-xl text-xs transition"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>நிர்வாகி தளம் (Admin Portal)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <LocationPickerModal />
    </header>
  );
};
