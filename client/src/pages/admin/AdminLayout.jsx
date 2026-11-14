import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, CheckSquare, Briefcase, FileText, Newspaper, Megaphone, Globe, ScrollText, Clock, ArrowLeft, LogOut, UserCheck } from 'lucide-react';

export const AdminLayout = ({ adminTab, setAdminTab, setCurrentView, children }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentView('home');
  };
  const tabs = [
    { id: 'analytics', label: 'Analytics & Overview', icon: LayoutDashboard },
    { id: 'pending', label: 'Pending Approvals', icon: CheckSquare, badge: 'Pending' },
    { id: 'jobs', label: '1. Collected Jobs', icon: Briefcase },
    { id: 'recruitments', label: '2. Recruitment Notifications', icon: FileText },
    { id: 'news', label: '3. Daily News', icon: Newspaper },
    { id: 'announcements', label: '4. District Announcements', icon: Megaphone },
    { id: 'sources', label: '5. Crawler Sources', icon: Globe },
    { id: 'logs', label: '6. Execution Logs', icon: ScrollText },
    { id: 'scheduler', label: '7. Scheduler Settings', icon: Clock }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Admin Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Administrator Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Our Village Crawler & Approval System
          </h1>
          <p className="text-xs text-slate-400">
            Control automated scrapers, verify AI-summarized extractions, and publish vetted bulletins to the public portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Admin User Profile Pill */}
          <div className="hidden sm:flex items-center space-x-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <div className="font-bold text-white text-[11px] leading-tight">{user?.name || 'Authorized Admin'}</div>
              <div className="text-[10px] text-slate-400 leading-tight">{user?.email || 'admin@ourvillage.tn.gov.in'}</div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md"
            title="Switch back to Citizen / Public Portal view"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>🌐 Switch to Citizen / Public View</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 font-semibold px-3 py-2 rounded-xl text-xs transition"
            title="Log out of Administrator Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Subnav Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1.5 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>{children}</div>
    </div>
  );
};
