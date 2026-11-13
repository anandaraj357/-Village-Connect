import React, { useState, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Download, X, Smartphone, CheckCircle, Share } from 'lucide-react';

export const PwaInstallPrompt = () => {
  const { language } = useNotifications();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone/installed mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsStandalone(true);
      return;
    }

    // Check if user previously dismissed the prompt
    const dismissed = localStorage.getItem('our_village_pwa_dismissed');
    if (dismissed && Date.now() - Number(dismissed) < 86400000 * 3) {
      // dismissed within last 3 days
      return;
    }

    // Check for iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If on iOS and not standalone, show prompt after 3 seconds
    if (isIosDevice && !window.navigator.standalone) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('our_village_pwa_dismissed', Date.now().toString());
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-slide-up">
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-start justify-between gap-3 backdrop-blur-xl">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xl shadow-md flex-shrink-0">
            🌾
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {language === 'ta' ? 'மொபைல் செயலி' : 'Mobile App'}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.2 rounded-full border border-emerald-500/30">
                PWA
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">
              {language === 'ta' ? 'நமது கிராமம் செயலியை நிறுவுங்கள்' : 'Install Our Village App'}
            </h4>
            <p className="text-xs text-slate-300 leading-snug">
              {language === 'ta'
                ? 'உங்கள் மொபைலில் எளிதாக நிறுவவும். வேகமான சேவை & உடனடி விழிப்பூட்டல்கள்.'
                : 'Install on your home screen for quick access, offline reading, and push notifications.'}
            </p>

            {isIos ? (
              <div className="text-[11px] text-emerald-300 pt-1 flex items-center space-x-1">
                <span>Safari-ல்: கீழே உள்ள </span>
                <Share className="w-3.5 h-3.5 inline mx-0.5" />
                <span>பகிர்வை அழுத்தி 'Add to Home Screen' ஐத் தொடவும்.</span>
              </div>
            ) : (
              deferredPrompt && (
                <div className="pt-2">
                  <button
                    onClick={handleInstallClick}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs transition shadow-md flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'செயலியை நிறுவுக (Install)' : 'Install App Now'}</span>
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
