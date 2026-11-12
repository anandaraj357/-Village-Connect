import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, RefreshCw, CheckCircle2, AlertTriangle, Layers, Play, Check } from 'lucide-react';

export const SchedulerSettings = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/crawler/scheduler-status');
      if (res.data.success) {
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      console.error('Failed to load scheduler metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleSyncScheduler = async () => {
    try {
      setSyncing(true);
      const res = await axios.post('/api/crawler/scheduler/sync');
      if (res.data.success) {
        setMessage('BullMQ repeat schedules synchronized across all enabled sources!');
        setMetrics(res.data.metrics);
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (err) {
      alert('Error syncing scheduler: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Screen 7</span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">BullMQ & Redis Scheduler Settings</h2>
          <p className="text-xs text-slate-500">
            Independent background workers executing 2-hour job/recruitment crawls and 45-minute news runs.
          </p>
        </div>

        <button
          onClick={handleSyncScheduler}
          disabled={syncing}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow flex items-center space-x-1.5"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing...' : 'Re-sync BullMQ Schedules'}</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Scheduler Queue Status Cards */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold">Queue State</div>
            <div className="text-xl font-black text-emerald-600 capitalize mt-1">{metrics.status}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Redis Port 6379</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold">Active Jobs</div>
            <div className="text-xl font-black text-blue-600 mt-1">{metrics.active}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Currently processing</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold">Completed Queue</div>
            <div className="text-xl font-black text-slate-900 mt-1">{metrics.completed}</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Passed checks</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold">Failed Retries</div>
            <div className="text-xl font-black text-rose-600 mt-1">{metrics.failed}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Exponential backoff</div>
          </div>
        </div>
      )}

      {/* Master Intervals Specification Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Configured Master Ingestion Intervals</h3>
          <p className="text-xs text-slate-500">Preset schedules adhering strictly to the system architecture specification.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Crawler Pipeline</th>
                <th className="py-3 px-4">Standard Interval</th>
                <th className="py-3 px-4">Concurrency Lock</th>
                <th className="py-3 px-4">Retry Policy</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Job Vacancy Crawler</td>
                <td className="py-3 px-4 font-semibold text-emerald-700">Every 2 Hours (120 min)</td>
                <td className="py-3 px-4 text-slate-600">Active (Mutex per sourceId)</td>
                <td className="py-3 px-4 text-slate-600">3 Attempts, Exponential Backoff (5s)</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Enabled</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Recruitment Notification Crawler</td>
                <td className="py-3 px-4 font-semibold text-emerald-700">Every 2 Hours (120 min)</td>
                <td className="py-3 px-4 text-slate-600">Active (Mutex per sourceId)</td>
                <td className="py-3 px-4 text-slate-600">3 Attempts, Exponential Backoff (5s)</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Enabled</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">District Announcements Crawler</td>
                <td className="py-3 px-4 font-semibold text-emerald-700">Every 2 Hours (120 min)</td>
                <td className="py-3 px-4 text-slate-600">Active (Mutex per sourceId)</td>
                <td className="py-3 px-4 text-slate-600">3 Attempts, Exponential Backoff (5s)</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Enabled</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Daily News & Highlights Crawler</td>
                <td className="py-3 px-4 font-semibold text-emerald-700">Every 45 Minutes (30-60 min)</td>
                <td className="py-3 px-4 text-slate-600">Active (Mutex per sourceId)</td>
                <td className="py-3 px-4 text-slate-600">3 Attempts, Exponential Backoff (5s)</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Enabled</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Repeatable Jobs Registered in BullMQ */}
      {metrics && metrics.repeatableJobs && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Active BullMQ Repeatable Jobs</h3>
            <p className="text-xs text-slate-500">Persistent Redis cron keys scheduled for automated worker ticks.</p>
          </div>

          <div className="space-y-2">
            {metrics.repeatableJobs.map((r, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900">{r.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{r.key}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-700">{r.every}</div>
                  <div className="text-[11px] text-slate-400">
                    Next: {r.next ? new Date(r.next).toLocaleTimeString() : 'Pending tick'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
