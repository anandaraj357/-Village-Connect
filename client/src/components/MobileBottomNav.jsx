import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useLocation } from '../context/LocationContext';
import {
  Home,
  Briefcase,
  GraduationCap,
  Newspaper,
  LayoutGrid,
  Bus,
  Archive,
  FileText,
  Megaphone,
  PlusCircle,
  BookOpen,
  MapPin,
  Navigation,
  X,
  ChevronRight,
  Shield,
  Globe,
  Sparkles
} from 'lucide-react';

export const MobileBottomNav = ({ currentView, setCurrentView, isMobileFrame }) => {
  const { language, toggleLanguage } = useNotifications();
  const { location, openLocationModal, requestGpsLocation, isLocating } = useLocation();
  const [showMoreSheet, setShowMoreSheet] = useState(false);

  // 4 Primary Thumb Tabs (each receives exactly 20% width)
  const primaryTabs = [
    {
      id: 'home',
      label: language === 'ta' ? 'முகப்பு' : 'Home',
      icon: Home
    },
    {
      id: 'jobs',
      label: language === 'ta' ? 'வேலைகள்' : 'Jobs',
      icon: Briefcase
    },
    {
      id: 'education-health',
      label: language === 'ta' ? 'கல்வி/நலம்' : 'Edu/Health',
      icon: GraduationCap
    },
    {
      id: 'news',
      label: language === 'ta' ? 'செய்தி' : 'News',
      icon: Newspaper
    }
  ];

  // Secondary services available in the "More (கூடுதல்)" bottom sheet
  const moreServices = [
    {
      id: 'transport',
      label: language === 'ta' ? 'பேருந்து நேரங்கள்' : 'Bus Timings',
      desc: language === 'ta' ? 'விடியல் பயணம் & நேரங்கள்' : 'Bus & auto timings',
      icon: Bus,
      badge: '188/12B'
    },
    {
      id: 'heritage',
      label: language === 'ta' ? 'வரலாற்றுப் பெட்டகம்' : 'Heritage Archive',
      desc: language === 'ta' ? 'பழைய புகைப்படங்கள்' : 'Village photo archive',
      icon: Archive,
      badge: 'நெசல்'
    },
    {
      id: 'recruitments',
      label: language === 'ta' ? 'அரசுப் பணி' : 'Govt Recruitments',
      desc: language === 'ta' ? 'TNPSC Group 4 / VAO' : 'Official exams',
      icon: FileText,
      badge: 'TNPSC'
    },
    {
      id: 'announcements',
      label: language === 'ta' ? 'ஊராட்சி அறிவிப்பு' : 'Panchayat Notices',
      desc: language === 'ta' ? 'நிர்வாக சுற்றறிக்கைகள்' : 'Civic circulars',
      icon: Megaphone,
      badge: 'Notice'
    },
    {
      id: 'post-job',
      label: language === 'ta' ? 'வேலை பதிவிட' : 'Post a Job',
      desc: language === 'ta' ? 'இலவசமாக பதிவு செய்க' : 'Free job submission',
      icon: PlusCircle,
      badge: 'Free'
    },
    {
      id: 'about',
      label: language === 'ta' ? 'நெசல் வரலாறு' : 'About Nesal',
      desc: language === 'ta' ? 'கிராமத்தின் வரலாறு' : 'Village culture',
      icon: BookOpen,
      badge: 'About'
    }
  ];

  const isMoreActive = moreServices.some((s) => s.id === currentView);
  const activeService = moreServices.find((s) => s.id === currentView);

  return (
    <>
      {/* Fixed/Absolute 5-Button Bottom Navigation Bar */}
      <nav
        className={`${
          isMobileFrame
            ? 'absolute bottom-0 left-0 right-0'
            : 'fixed bottom-0 left-0 right-0 lg:hidden'
        } z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-1 sm:px-3 py-1 pb-safe transition-all duration-300`}
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Primary 4 Tabs */}
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentView(tab.id);
                  setShowMoreSheet(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition duration-200 relative group ${
                  isActive
                    ? 'text-emerald-700 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 w-7 h-1 bg-emerald-600 rounded-full animate-fade-in" />
                )}
                <div
                  className={`p-1.5 rounded-xl transition ${
                    isActive ? 'bg-emerald-100/70 text-emerald-700 scale-105' : 'group-hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight leading-none mt-1 truncate max-w-full text-center">
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* 5th Tab: "More / கூடுதல்" Button with Active Reflection */}
          <button
            onClick={() => setShowMoreSheet(!showMoreSheet)}
            className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition duration-200 relative group ${
              isMoreActive || showMoreSheet
                ? 'text-teal-700 font-extrabold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            {(isMoreActive || showMoreSheet) && (
              <span className="absolute -top-1 w-7 h-1 bg-teal-600 rounded-full animate-fade-in" />
            )}
            <div
              className={`p-1.5 rounded-xl transition ${
                isMoreActive || showMoreSheet
                  ? 'bg-teal-100/80 text-teal-800 scale-105'
                  : 'group-hover:bg-slate-100'
              }`}
            >
              {isMoreActive && activeService ? (
                <activeService.icon className="w-5 h-5" />
              ) : (
                <LayoutGrid className="w-5 h-5" />
              )}
            </div>
            <span className="text-[10px] tracking-tight leading-none mt-1 truncate max-w-full text-center">
              {isMoreActive && activeService
                ? activeService.label.split(' ')[0]
                : language === 'ta'
                ? 'கூடுதல்'
                : 'More'}
            </span>
          </button>
        </div>
      </nav>

      {/* Touch-Friendly Bottom Sheet Drawer for Additional Village Services */}
      {showMoreSheet && (
        <div
          className={`${
            isMobileFrame ? 'absolute' : 'fixed'
          } inset-0 z-50 flex flex-col justify-end animate-in fade-in duration-200`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setShowMoreSheet(false)}
          />

          {/* Sheet Container */}
          <div
            className="relative bg-white rounded-t-3xl shadow-2xl p-4 sm:p-6 border-t border-slate-200 max-h-[82vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-250"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center space-x-1.5">
                  <span>🌾</span>
                  <span>{language === 'ta' ? 'நெசல் கிராம கூடுதல் சேவைகள்' : 'Nesal Village Services'}</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'ta' ? 'வானூர் வட்டம், விழுப்புரம் மாவட்டம்' : 'Vanur Taluk, Villupuram District'}
                </p>
              </div>
              <button
                onClick={() => setShowMoreSheet(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Ward / Location Indicator Pill */}
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-emerald-950">
                    {location.wardName || 'நெசல் கிராம நத்தம்'}
                  </div>
                  <div className="text-[10px] text-emerald-700">வானூர், விழுப்புரம் (605014)</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowMoreSheet(false);
                  openLocationModal();
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-xs transition shrink-0"
              >
                {language === 'ta' ? 'வார்டு மாற்று' : 'Wards'}
              </button>
            </div>

            {/* 2-Column Grid of Action Cards with Aligned Touch Targets */}
            <div className="grid grid-cols-2 gap-2.5">
              {moreServices.map((service) => {
                const Icon = service.icon;
                const isActive = currentView === service.id;

                return (
                  <button
                    key={service.id}
                    onClick={() => {
                      setCurrentView(service.id);
                      setShowMoreSheet(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
                        : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isActive ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 shadow-xs'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/80 text-slate-500 border border-slate-200">
                        {service.badge}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-xs leading-tight mb-0.5">{service.label}</div>
                      <div className="text-[10px] text-slate-400 truncate">{service.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Utility Row */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  toggleLanguage();
                  setShowMoreSheet(false);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'ta' ? 'English' : 'தமிழ் மொழி'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('admin');
                  setShowMoreSheet(false);
                }}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'ta' ? 'நிர்வாக தளம்' : 'Admin'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
