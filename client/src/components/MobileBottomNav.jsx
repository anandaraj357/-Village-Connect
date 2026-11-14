import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useLocation } from '../context/LocationContext';
import { Home, Briefcase, FileText, Newspaper, MapPin, Navigation, PlusCircle, Megaphone, BookOpen, Archive } from 'lucide-react';

export const MobileBottomNav = ({ currentView, setCurrentView }) => {
  const { language } = useNotifications();
  const { location, openLocationModal, isLocating } = useLocation();

  const tabs = [
    {
      id: 'home',
      label: language === 'ta' ? 'முகப்பு' : 'Home',
      icon: Home
    },
    {
      id: 'about',
      label: language === 'ta' ? 'வரலாறு' : 'About',
      icon: BookOpen
    },
    {
      id: 'heritage',
      label: language === 'ta' ? 'பெட்டகம்' : 'Archive',
      icon: Archive
    },
    {
      id: 'jobs',
      label: language === 'ta' ? 'வேலை' : 'Jobs',
      icon: Briefcase
    },
    {
      id: 'recruitments',
      label: language === 'ta' ? 'அரசுப் பணி' : 'Recruit',
      icon: FileText
    },
    {
      id: 'post-job',
      label: language === 'ta' ? 'பதிவிட' : 'Post',
      icon: PlusCircle
    },
    {
      id: 'news',
      label: language === 'ta' ? 'செய்தி' : 'News',
      icon: Newspaper
    },
    {
      id: 'announcements',
      label: language === 'ta' ? 'அறிவிப்பு' : 'Notices',
      icon: Megaphone
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1 pb-safe transition-all duration-300">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentView(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition duration-200 relative ${
                isActive
                  ? 'text-emerald-700 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 bg-emerald-600 rounded-full animate-fade-in" />
              )}
              <div className={`p-1 rounded-lg transition ${isActive ? 'bg-emerald-50 text-emerald-600' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* 5th Tab: Location Picker / GPS */}
        <button
          onClick={openLocationModal}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-600 hover:text-emerald-700 font-medium transition duration-200 relative group"
        >
          <div className="p-1 rounded-lg bg-emerald-50 text-emerald-700 relative">
            {isLocating ? (
              <Navigation className="w-5 h-5 animate-spin text-emerald-600" />
            ) : (
              <MapPin className="w-5 h-5 text-emerald-600" />
            )}
            {location.isGps && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-none truncate max-w-[58px] text-emerald-800 font-bold">
            {location.district}
          </span>
        </button>
      </div>
    </nav>
  );
};
