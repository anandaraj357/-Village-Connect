import React from 'react';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const DevicePreviewToggle = ({ isMobileFrame, setIsMobileFrame }) => {
  const { language } = useNotifications();

  return (
    <div className="hidden lg:flex fixed top-20 right-6 z-40 bg-white/90 backdrop-blur-md border border-slate-300 rounded-full shadow-lg p-1 items-center space-x-1">
      <button
        onClick={() => setIsMobileFrame(false)}
        className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold transition ${
          !isMobileFrame
            ? 'bg-slate-900 text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title="View Desktop Web Layout"
      >
        <Monitor className="w-3.5 h-3.5" />
        <span>{language === 'ta' ? 'இணைய தளம்' : 'Web View'}</span>
      </button>

      <button
        onClick={() => setIsMobileFrame(true)}
        className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold transition ${
          isMobileFrame
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
        }`}
        title="Preview Mobile App Frame"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>{language === 'ta' ? 'மொபைல் செயலி' : 'Mobile App'}</span>
      </button>
    </div>
  );
};
