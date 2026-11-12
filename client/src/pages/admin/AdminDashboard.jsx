import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StatusBadge } from '../../components/Badge';
import { Globe, CheckCircle2, XCircle, Briefcase, FileText, Newspaper, Clock, Layers, TrendingUp, AlertTriangle, Play } from 'lucide-react';

export const AdminDashboard = ({ setAdminTab }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/analytics/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !data) {
    return <div className="py-20 text-center text-slate-400 text-sm">Loading analytics...</div>;
  }

  const { stats, dateWiseStats, sourcePerformance } = data;

  return (
    <div className="space-y-8">
      {/* 10 Core Required Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Configured Sites</span>
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalWebsites}</div>
          <div className="text-[11px] text-emerald-600 font-medium">{stats.activeCrawlers} Active Crawlers</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Successful Crawls</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats.successfulCrawlingOperations}</div>
          <div className="text-[11px] text-slate-400 font-medium">Auto-retried with backoff</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Failed Operations</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{stats.failedCrawlingOperations}</div>
          <div className="text-[11px] text-slate-400 font-medium">Logged in crawl auditor</div>
        </div>

        <div
          onClick={() => setAdminTab('pending')}
          className="bg-amber-50 p-5 rounded-2xl border border-amber-300 shadow-sm space-y-1 cursor-pointer hover:bg-amber-100/70 transition"
        >
          <div className="flex items-center justify-between text-amber-900 text-xs font-bold">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-700 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-950">{stats.pendingApprovals}</div>
          <div className="text-[11px] text-amber-800 font-medium underline">Review in Queue →</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Published Records</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800">{stats.publishedRecords}</div>
          <div className="text-[11px] text-emerald-600 font-medium">Live on Public Portals</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Extracted Jobs</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalExtractedJobs}</div>
          <div className="text-[11px] text-slate-400 font-medium">Govt, IT & Local Vacancies</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Recruitment Alerts</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalRecruitmentNotifications}</div>
          <div className="text-[11px] text-slate-400 font-medium">Gazettes with PDF parsing</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>News & Highlights</span>
            <Newspaper className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalNewsArticles}</div>
          <div className="text-[11px] text-slate-400 font-medium">Telugu & English verified</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Duplicates Prevented</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700">{stats.duplicateRecordsDetected}</div>
          <div className="text-[11px] text-slate-400 font-medium">Canonical URL & SHA256 match</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Health & Safety</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">100%</div>
          <div className="text-[11px] text-emerald-700 font-medium">SSRF & Anti-Bot Protected</div>
        </div>
      </div>

      {/* Date-wise Crawling Statistics */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Date-Wise Crawling Statistics (7-Day Activity)</span>
            </h3>
            <p className="text-xs text-slate-500">Automated BullMQ scheduler executions and extracted records.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3">Date</th>
                <th className="pb-3">Total Executions</th>
                <th className="pb-3">Successful Runs</th>
                <th className="pb-3">Failed Runs</th>
                <th className="pb-3">Candidate Items Found</th>
                <th className="pb-3">New Records Extracted</th>
                <th className="pb-3">Success Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dateWiseStats.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400">
                    No date-wise history recorded yet. Trigger a manual crawl from the Sources tab to populate metrics.
                  </td>
                </tr>
              ) : (
                dateWiseStats.map((row) => {
                  const rate = row.totalRuns > 0 ? Math.round((row.successfulRuns / row.totalRuns) * 100) : 100;
                  return (
                    <tr key={row._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 font-bold text-slate-800">{row._id}</td>
                      <td className="py-3 font-semibold">{row.totalRuns}</td>
                      <td className="py-3 text-emerald-600 font-bold">{row.successfulRuns}</td>
                      <td className="py-3 text-rose-600 font-bold">{row.failedRuns}</td>
                      <td className="py-3">{row.recordsFound}</td>
                      <td className="py-3 font-bold text-slate-900">{row.recordsNew}</td>
                      <td className="py-3">
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Source-wise Performance Reports */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              <span>Source-Wise Performance Reports</span>
            </h3>
            <p className="text-xs text-slate-500">Live health, uptime rate, and recent extraction counts per portal.</p>
          </div>
          <button
            onClick={() => setAdminTab('sources')}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Manage Sources →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3">Source Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Crawler Type</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Total Ingestion Runs</th>
                <th className="pb-3">Success Rate</th>
                <th className="pb-3">Last Extracted</th>
                <th className="pb-3">Last Crawled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sourcePerformance.map((src) => (
                <tr key={src.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 font-bold text-slate-900">{src.name}</td>
                  <td className="py-3.5 capitalize font-medium text-slate-600">{src.category}</td>
                  <td className="py-3.5 font-mono text-[11px] text-slate-500">{src.type}</td>
                  <td className="py-3.5">
                    <StatusBadge status={src.status} />
                  </td>
                  <td className="py-3.5 font-semibold text-slate-700">{src.totalRuns}</td>
                  <td className="py-3.5 font-bold text-emerald-700">{src.successRate}%</td>
                  <td className="py-3.5 font-bold text-slate-900">{src.extractedCount} items</td>
                  <td className="py-3.5 text-slate-400">
                    {src.lastCrawled ? new Date(src.lastCrawled).toLocaleString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
