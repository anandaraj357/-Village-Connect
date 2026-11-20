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
  ChevronDown,
  X,
  Navigation,
  RefreshCw,
  PlusCircle,
  Menu,
  PhoneCall,
  BookOpen,
  Archive,
  Bus,
  GraduationCap,
  Layers
} from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView, isMobileFrame }) => {
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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Core 5 primary links displayed directly in the desktop navbar
  const primaryNavLinks = [
    { id: 'home', label: language === 'ta' ? 'முகப்பு' : 'Home', icon: null },
    { id: 'jobs', label: language === 'ta' ? 'வேலைகள்' : 'All-TN Jobs', icon: Briefcase },
    { id: 'recruitments', label: language === 'ta' ? 'அரசுப் பணி' : 'Govt Recruit', icon: FileText },
    { id: 'education-health', label: language === 'ta' ? 'கல்வி & மருத்துவம்' : 'Edu & Health', icon: GraduationCap },
    { id: 'news', label: language === 'ta' ? 'செய்திகள்' : 'News', icon: Newspaper }
  ];

  // Secondary/service links nested cleanly inside "More Services" dropdown
  const moreNavLinks = [
    {
      id: 'transport',
      label: language === 'ta' ? 'பேருந்து நேரங்கள்' : 'Bus Timings',
      icon: Bus,
      desc: language === 'ta' ? 'நெசல் - புதுச்சேரி, வானூர், திண்டிவனம்' : 'Local bus & transport schedules'
    },
    {
      id: 'heritage',
      label: language === 'ta' ? 'வரலாற்றுப் பெட்டகம்' : 'Heritage Archive',
      icon: Archive,
      desc: language === 'ta' ? 'நெசல் கிராம பழைய ஆவணங்கள் & படங்கள்' : 'Village photo & document archive'
    },
    {
      id: 'announcements',
      label: language === 'ta' ? 'ஊராட்சி அறிவிப்புகள்' : 'Panchayat Notices',
      icon: Megaphone,
      desc: language === 'ta' ? 'கிராம சபை & நிர்வாக சுற்றறிக்கை' : 'Panchayat alerts & civic notices'
    },
    {
      id: 'about',
      label: language === 'ta' ? 'நெசல் வரலாறு' : 'About Nesal',
      icon: BookOpen,
      desc: language === 'ta' ? 'நம் மண் | நம் மக்கள் | நம் பாரம்பரியம்' : 'History & spiritual heritage of Nesal'
    },
    {
      id: 'post-job',
      label: language === 'ta' ? '➕ வேலை பதிவிட' : '➕ Post a Job',
      icon: PlusCircle,
      desc: language === 'ta' ? 'இலவசமாக புதிய வேலைவாய்ப்பு சேர்க்க' : 'Publish local job opening or recruitment'
    }
  ];

  // Combined for the full slide-out drawer
  const allNavLinks = [...primaryNavLinks, ...moreNavLinks];

  const isMoreActive = moreNavLinks.some((l) => l.id === currentView);
  const activeMoreItem = moreNavLinks.find((l) => l.id === currentView);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner with location & live indicators */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-3 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-2">
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
            <span className="font-bold text-white truncate max-w-[170px] sm:max-w-none">
              நெசல் கிராமம் (Nesal) • வானூர்
            </span>
            <span className="text-emerald-400 text-[11px] underline ml-0.5">
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

        <div className="flex items-center space-x-2 sm:space-x-3">
          {extractionMessage && (
            <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-emerald-300 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span className="truncate max-w-xs">{extractionMessage}</span>
            </div>
          )}

          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 font-semibold text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded transition text-xs"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ta' ? 'English' : 'தமிழ்'}</span>
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold transition bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-700 hover:border-emerald-500 shadow-sm text-xs"
            title="Switch to Administrator Control Center"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ta' ? 'நிர்வாகம்' : 'Admin'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-2">
          {/* Logo */}
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-lg sm:text-xl shadow-md group-hover:scale-105 transition">
              🌾
            </div>
            <div>
              <div className="font-black text-slate-900 text-sm sm:text-base tracking-tight flex items-center space-x-1.5 whitespace-nowrap">
                <span>OUR VILLAGE</span>
                <span className="text-[10px] sm:text-[11px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-full">
                  நெசல்
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium whitespace-nowrap truncate max-w-[180px] sm:max-w-none">
                வானூர் வட்டம் • விழுப்புரம் மாவட்டம்
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links (Aligned to resolution with clean More dropdown) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {primaryNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id)}
                  className={`flex items-center space-x-1.5 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />}
                  <span>{link.label}</span>
                </button>
              );
            })}

            {/* "More Services" Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center space-x-1 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition whitespace-nowrap ${
                  isMoreActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>
                  {isMoreActive && activeMoreItem
                    ? activeMoreItem.label
                    : language === 'ta'
                    ? 'கூடுதல் சேவைகள்'
                    : 'More Services'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    moreDropdownOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {moreDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMoreDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      {language === 'ta' ? 'நெசல் கிராம கூடுதல் சேவைகள்' : 'Additional Village Services'}
                    </div>
                    {moreNavLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = currentView === link.id;
                      return (
                        <button
                          key={link.id}
                          onClick={() => {
                            setCurrentView(link.id);
                            setMoreDropdownOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left transition ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {Icon && <Icon className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs">{link.label}</div>
                            {link.desc && (
                              <div className="text-[10px] text-slate-400 font-normal truncate">
                                {link.desc}
                              </div>
                            )}
                          </div>
                          {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  if (unreadCount > 0) markAllRead();
                }}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition"
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
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-center px-4 py-2 border-b border-slate-100">
                    <h4 className="font-bold text-slate-800 text-sm">
                      {language === 'ta' ? 'நெசல் கிராம விழிப்பூட்டல்கள்' : 'Nesal Notifications & Alerts'}
                    </h4>
                    <button
                      onClick={() => setShowNotifDropdown(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
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

            {/* Hamburger Menu Toggle (Shows on Mobile and Tablet where navbar wraps) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              title="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Full Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between z-50 overflow-y-auto">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-base">
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
                {allNavLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = currentView === link.id;

                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        setCurrentView(link.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
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
            <div className="pt-4 border-t border-slate-100 space-y-2">
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
