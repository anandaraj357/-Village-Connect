import React, { useState } from 'react';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { JobsPortal } from './pages/JobsPortal';
import { RecruitmentPortal } from './pages/RecruitmentPortal';
import { NewsPortal } from './pages/NewsPortal';
import { DistrictAnnouncements } from './pages/DistrictAnnouncements';
import { SubscriptionCenter } from './pages/SubscriptionCenter';

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PendingApprovals } from './pages/admin/PendingApprovals';
import { CollectedJobsMgmt } from './pages/admin/CollectedJobsMgmt';
import { RecruitmentMgmt } from './pages/admin/RecruitmentMgmt';
import { DailyNewsMgmt } from './pages/admin/DailyNewsMgmt';
import { DistrictAnnouncementsMgmt } from './pages/admin/DistrictAnnouncementsMgmt';
import { CrawlerSourcesMgmt } from './pages/admin/CrawlerSourcesMgmt';
import { CrawlerExecutionLogs } from './pages/admin/CrawlerExecutionLogs';
import { SchedulerSettings } from './pages/admin/SchedulerSettings';

export function App() {
  const [currentView, setCurrentView] = useState('home');
  const [adminTab, setAdminTab] = useState('analytics');

  const renderContent = () => {
    if (currentView === 'jobs') return <JobsPortal />;
    if (currentView === 'recruitments') return <RecruitmentPortal />;
    if (currentView === 'news') return <NewsPortal />;
    if (currentView === 'announcements') return <DistrictAnnouncements />;
    if (currentView === 'subscriptions') return <SubscriptionCenter />;

    if (currentView === 'admin') {
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

  return (
    <NotificationProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </NotificationProvider>
  );
}

export default App;
