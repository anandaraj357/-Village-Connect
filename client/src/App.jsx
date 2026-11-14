import React, { useState } from 'react';
import { NotificationProvider } from './context/NotificationContext';
import { LocationProvider } from './context/LocationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { DevicePreviewToggle } from './components/DevicePreviewToggle';
import { Wifi, Battery, Signal, Sparkles } from 'lucide-react';

import { Home } from './pages/Home';
import { JobsPortal } from './pages/JobsPortal';
import { RecruitmentPortal } from './pages/RecruitmentPortal';
import { PostJobPortal } from './pages/PostJobPortal';
import { NewsPortal } from './pages/NewsPortal';
import { DistrictAnnouncements } from './pages/DistrictAnnouncements';
import { AboutUs } from './pages/AboutUs';
import { HeritageArchivePortal } from './pages/HeritageArchivePortal';
import { SubscriptionCenter } from './pages/SubscriptionCenter';

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PendingApprovals } from './pages/admin/PendingApprovals';
import { CollectedJobsMgmt } from './pages/admin/CollectedJobsMgmt';
import { RecruitmentMgmt } from './pages/admin/RecruitmentMgmt';
import { DailyNewsMgmt } from './pages/admin/DailyNewsMgmt';
import { DistrictAnnouncementsMgmt } from './pages/admin/DistrictAnnouncementsMgmt';
import { CrawlerSourcesMgmt } from './pages/admin/CrawlerSourcesMgmt';
import { CrawlerExecutionLogs } from './pages/admin/CrawlerExecutionLogs';
import { SchedulerSettings } from './pages/admin/SchedulerSettings';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [adminTab, setAdminTab] = useState('analytics');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const { isAuthenticated } = useAuth();

  const renderContent = () => {
    if (currentView === 'jobs') return <JobsPortal />;
    if (currentView === 'recruitments') return <RecruitmentPortal />;
    if (currentView === 'post-job') {
      return (
        <PostJobPortal
          onBack={() => setCurrentView('jobs')}
          onComplete={() => setCurrentView('jobs')}
        />
      );
    }
    if (currentView === 'news') return <NewsPortal />;
    if (currentView === 'announcements') return <DistrictAnnouncements />;
    if (currentView === 'about') return <AboutUs setCurrentView={setCurrentView} />;
    if (currentView === 'heritage') return <HeritageArchivePortal />;
    if (currentView === 'subscriptions') return <SubscriptionCenter />;

    if (currentView === 'admin') {
      // Require Authentication for Admin Portal
      if (!isAuthenticated) {
        return (
          <AdminLogin
            onLoginSuccess={() => setCurrentView('admin')}
            onCancel={() => setCurrentView('home')}
          />
        );
      }

      return (
        <AdminLayout
          adminTab={adminTab}
          setAdminTab={setAdminTab}
          setCurrentView={setCurrentView}
        >
          {adminTab === 'analytics' && <AdminDashboard setAdminTab={setAdminTab} />}
          {adminTab === 'pending' && <PendingApprovals />}
          {adminTab === 'jobs' && <CollectedJobsMgmt />}
          {adminTab === 'recruitments' && <RecruitmentMgmt />}
          {adminTab === 'news' && <DailyNewsMgmt />}
          {adminTab === 'announcements' && <DistrictAnnouncementsMgmt />}
          {adminTab === 'sources' && <CrawlerSourcesMgmt />}
          {adminTab === 'logs' && <CrawlerExecutionLogs />}
          {adminTab === 'scheduler' && <SchedulerSettings />}
        </AdminLayout>
      );
    }

    return <Home setCurrentView={setCurrentView} />;
  };

  const appCore = currentView === 'admin' ? (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </main>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-24 md:pb-12">
        {renderContent()}
      </main>
      <Footer />
      {/* Mobile Bottom Navigation Bar (Active on Mobile / Touch screens) */}
      <MobileBottomNav currentView={currentView} setCurrentView={setCurrentView} />
      {/* PWA Add to Home Screen Banner */}
      <PwaInstallPrompt />
    </div>
  );

  return (
    <>
      {/* Toggle to switch between Desktop Web View and Live Mobile Device Shell Frame */}
      <DevicePreviewToggle isMobileFrame={isMobileFrame} setIsMobileFrame={setIsMobileFrame} />

      {isMobileFrame ? (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 py-8">
          <div className="text-center text-white mb-4">
            <div className="inline-flex items-center space-x-2 text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Interactive Mobile App Simulator</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Touch-first UI, bottom navigation bar, and responsive layout for Android & iOS.
            </p>
          </div>

          {/* Mobile Device Mockup Frame */}
          <div className="w-[395px] h-[835px] bg-slate-950 rounded-[52px] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.8)] border-[6px] border-slate-800 relative flex flex-col">
            {/* Dynamic Island / Speaker Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800 mr-2" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            </div>

            {/* Status Bar */}
            <div className="h-9 px-7 flex items-center justify-between text-white text-[11px] font-bold z-40 bg-slate-900 rounded-t-[40px] pt-1">
              <span>9:41</span>
              <div className="flex items-center space-x-1.5 text-slate-200">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Screen Area (Scrollable Native View) */}
            <div className="flex-1 overflow-y-auto bg-slate-50 rounded-b-[40px] relative scrollbar-none">
              {appCore}
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />
          </div>
        </div>
      ) : (
        appCore
      )}
    </>
  );
}

export function App() {
  return (
    <NotificationProvider>
      <LocationProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LocationProvider>
    </NotificationProvider>
  );
}

export default App;
