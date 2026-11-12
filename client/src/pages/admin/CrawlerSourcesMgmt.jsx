import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StatusBadge } from '../../components/Badge';
import { Globe, Plus, Play, Trash2, Edit3, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';

export const CrawlerSourcesMgmt = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [triggeringId, setTriggeringId] = useState(null);
  const [message, setMessage] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('job');
  const [crawlerType, setCrawlerType] = useState('static_html');
  const [adapterKey, setAdapterKey] = useState('ncs_jobs');
  const [rssFeedUrl, setRssFeedUrl] = useState('');
  const [intervalMinutes, setIntervalMinutes] = useState(120);

  const fetchSources = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/crawler/sources');
      if (res.data.success) {
        setSources(res.data.sources);
      }
    } catch (err) {
      console.error('Failed to load sources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleTriggerNow = async (id, srcName) => {
    try {
      setTriggeringId(id);
      setMessage(`Triggering crawl for ${srcName}...`);
      const res = await axios.post(`/api/crawler/trigger/${id}`);
      if (res.data.success) {
        setMessage(`Crawl initiated successfully for ${srcName}! Check "Pending Approvals" for newly extracted items.`);
        fetchSources();
      }
    } catch (err) {
      setMessage(`Trigger error: ${err.response?.data?.message || err.message}`);
    } finally {
      setTriggeringId(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleToggleEnable = async (source) => {
    try {
      const res = await axios.put(`/api/crawler/sources/${source._id}`, {
        enabled: !source.enabled
      });
      if (res.data.success) {
        fetchSources();
      }
    } catch (err) {
      alert('Error updating source: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this crawler source?')) return;
    try {
      const res = await axios.delete(`/api/crawler/sources/${id}`);
      if (res.data.success) {
        fetchSources();
      }
    } catch (err) {
      alert('Delete error: ' + err.message);
    }
  };

  const handleCreateSource = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        url,
        category,
        crawlerType,
        adapterKey,
        rssFeedUrl: rssFeedUrl || undefined,
        scheduleIntervalMinutes: Number(intervalMinutes)
      };

      const res = await axios.post('/api/crawler/sources', payload);
      if (res.data.success) {
        setShowAddModal(false);
        fetchSources();
        setName('');
        setUrl('');
        setRssFeedUrl('');
        setMessage('New crawler source registered successfully with SSRF security verification!');
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (err) {
      alert('Failed to register source: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Screen 5</span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">Configured Crawler Sources</h2>
          <p className="text-xs text-slate-500">
            Authorized recruitment boards, gazette portals, district collectorates and news feeds.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Source</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading crawler sources...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Source Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Engine / Adapter</th>
                  <th className="py-3.5 px-4">Schedule Interval</th>
                  <th className="py-3.5 px-4">Last Status</th>
                  <th className="py-3.5 px-4">Last Crawled</th>
                  <th className="py-3.5 px-4">Enabled</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sources.map((src) => (
                  <tr key={src._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{src.name}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{src.url}</div>
                    </td>
                    <td className="py-3 px-4 capitalize font-semibold text-slate-700">{src.category}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      <div>{src.crawlerType}</div>
                      <div className="text-[10px] text-emerald-600">{src.adapterKey}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      Every {src.scheduleIntervalMinutes} min
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={src.lastStatus} />
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {src.lastCrawledAt ? new Date(src.lastCrawledAt).toLocaleTimeString() : 'Never'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleEnable(src)}
                        className={`w-9 h-5 rounded-full transition relative ${
                          src.enabled ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                        title="Toggle Enabled"
                      >
                        <span
                          className={`block w-4 h-4 bg-white rounded-full shadow transition transform ${
                            src.enabled ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => handleTriggerNow(src._id, src.name)}
                        disabled={triggeringId === src._id}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs transition border border-emerald-200 inline-flex items-center space-x-1"
                        title="Trigger Instant Manual Crawl"
                      >
                        <Play className={`w-3 h-3 ${triggeringId === src._id ? 'animate-spin' : ''}`} />
                        <span>{triggeringId === src._id ? 'Crawling...' : 'Trigger Now'}</span>
                      </button>

                      <button
                        onClick={() => handleDelete(src._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                        title="Delete Source"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSource}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add New Crawler Source</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Source Name</label>
              <input
                type="text"
                required
                placeholder="e.g. AP District Collectorate Notices"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Website URL</label>
              <input
                type="url"
                required
                placeholder="https://example.gov.in/notifications"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Automatically verified against SSRF, loopback and private networks.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                >
                  <option value="job">Job Vacancies</option>
                  <option value="recruitment">Recruitment Notifications</option>
                  <option value="news">Daily News</option>
                  <option value="announcement">District Announcements</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Crawler Type</label>
                <select
                  value={crawlerType}
                  onChange={(e) => setCrawlerType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                >
                  <option value="static_html">Static HTML (Cheerio + Axios)</option>
                  <option value="playwright_js">JavaScript-Rendered (Playwright)</option>
                  <option value="rss">RSS / Atom Feed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adapter Key</label>
                <select
                  value={adapterKey}
                  onChange={(e) => setAdapterKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                >
                  <option value="ncs_jobs">ncs_jobs (National Career Service)</option>
                  <option value="employment_news">employment_news (Employment Gazette)</option>
                  <option value="appsc_recruitment">appsc_recruitment (APPSC Portal)</option>
                  <option value="ssc_upsc">ssc_upsc (SSC & Railway Boards)</option>
                  <option value="district_news">district_news (District Collectorate)</option>
                  <option value="village_news">village_news (Village RBK & Panchayat)</option>
                  <option value="generic_rss">generic_rss (Configurable RSS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Schedule Interval (Minutes)</label>
                <input
                  type="number"
                  min="10"
                  max="1440"
                  value={intervalMinutes}
                  onChange={(e) => setIntervalMinutes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            {crawlerType === 'rss' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">RSS / XML Feed URL</label>
                <input
                  type="url"
                  placeholder="https://example.gov.in/feed.xml"
                  value={rssFeedUrl}
                  onChange={(e) => setRssFeedUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow"
              >
                Save & Register Source
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
