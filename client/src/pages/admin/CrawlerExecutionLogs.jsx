import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ScrollText, RefreshCw, AlertCircle, Info, AlertTriangle, Bug } from 'lucide-react';

export const CrawlerExecutionLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLogs = async () => {
    try {
      const levelParam = levelFilter !== 'all' ? `?level=${levelFilter}` : '';
      const res = await axios.get(`/api/crawler/logs${levelParam}`);
      if (res.data.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    let timer;
    if (autoRefresh) {
      timer = setInterval(fetchLogs, 4000); // 4s live streaming refresh
    }
    return () => clearInterval(timer);
  }, [levelFilter, autoRefresh]);

  const getLevelBadge = (level) => {
    switch (level) {
      case 'error':
        return <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">ERROR</span>;
      case 'warn':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">WARN</span>;
      case 'debug':
        return <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">DEBUG</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">INFO</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Screen 6</span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">Crawler Execution Logs</h2>
          <p className="text-xs text-slate-500">Live operational auditing: scrapers, SSRF filters, PDF parsers and AI summarizers.</p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Auto Refresh (4s)</span>
          </label>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="info">INFO</option>
            <option value="warn">WARN</option>
            <option value="error">ERROR</option>
            <option value="debug">DEBUG</option>
          </select>

          <button
            onClick={fetchLogs}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            title="Refresh now"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log Console Window */}
      <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 border border-slate-800 shadow-2xl font-mono text-xs overflow-hidden">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-[11px] text-slate-500 font-sans">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Audit Terminal</span>
          </div>
          <span>Showing {logs.length} most recent log events</span>
        </div>

        <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-900 pt-3 space-y-2">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-slate-600 font-sans text-xs">
              No crawler logs found matching the filter.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log._id} className="pt-2 hover:bg-slate-900/40 p-2 rounded-lg transition flex items-start space-x-3">
                <span className="text-slate-500 shrink-0 text-[11px]">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <div className="shrink-0">{getLevelBadge(log.level)}</div>
                <span className="font-bold text-emerald-400 shrink-0">[{log.action}]</span>
                <span className="text-slate-400 shrink-0">({log.sourceName}):</span>
                <span className="text-slate-200 break-words flex-1">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
