import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ConfidenceBadge, CategoryBadge, StatusBadge } from '../../components/Badge';
import { Check, X, Edit3, Trash2, Eye, Star, ExternalLink, AlertCircle, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export const PendingApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [previewItem, setPreviewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/approval/pending?recordType=${filterType}&status=${filterStatus}`);
      if (res.data.success) {
        setApprovals(res.data.approvals);
      }
    } catch (err) {
      console.error('Error fetching approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [filterType, filterStatus]);

  const showNotification = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handlePublish = async (id) => {
    try {
      const res = await axios.post(`/api/approval/publish/${id}`);
      if (res.data.success) {
        showNotification('Record approved & published to public application!');
        fetchApprovals();
        setPreviewItem(null);
      }
    } catch (err) {
      alert('Publishing error: ' + err.message);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please enter rejection reason:');
    if (reason === null) return;
    try {
      const res = await axios.post(`/api/approval/reject/${id}`, { reason });
      if (res.data.success) {
        showNotification('Record rejected');
        fetchApprovals();
        setPreviewItem(null);
      }
    } catch (err) {
      alert('Reject error: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this crawled record permanently?')) return;
    try {
      const res = await axios.delete(`/api/approval/${id}`);
      if (res.data.success) {
        showNotification('Record deleted');
        fetchApprovals();
        setPreviewItem(null);
      }
    } catch (err) {
      alert('Delete error: ' + err.message);
    }
  };

  const handleToggleImportant = async (id) => {
    try {
      const res = await axios.post(`/api/approval/mark-important/${id}`);
      if (res.data.success) {
        showNotification(res.data.isImportant ? 'Marked as Important' : 'Unmarked Important');
        fetchApprovals();
      }
    } catch (err) {
      alert('Error updating importance: ' + err.message);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/approval/edit/${editItem._id}`, {
        title: editItem.title,
        category: editItem.category,
        summary: editItem.summary,
        summaryTamil: editItem.summaryTamil,
        isImportant: editItem.isImportant
      });
      if (res.data.success) {
        showNotification('Record updated successfully');
        setEditItem(null);
        fetchApprovals();
      }
    } catch (err) {
      alert('Edit save error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Two-Tier Gatekeeper</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Crawled Data – Pending Approval
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict governance: Extracted records only appear publicly after administrator approval and verification for Nesal, Vanur & Villupuram.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Content Types</option>
              <option value="job">Jobs</option>
              <option value="recruitment">Recruitment Notifications</option>
              <option value="news">Daily News</option>
              <option value="announcement">District Announcements</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="pending">Pending Review</option>
              <option value="edited">Edited / In Review</option>
              <option value="published">Already Published</option>
              <option value="rejected">Rejected Records</option>
            </select>
          </div>
        </div>

        {actionMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
        )}
      </div>

      {/* Approvals Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading pending approval queue...</div>
      ) : approvals.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Approval Queue is Clear</h3>
          <p className="text-xs text-slate-500">
            All crawled records have been reviewed. Trigger a manual crawl from Crawler Sources to ingest new records.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Importance</th>
                  <th className="py-3.5 px-4">Extracted Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Pub Date</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvals.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleImportant(app._id)}
                        className={`p-1.5 rounded-lg transition ${
                          app.isImportant ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 hover:text-slate-400'
                        }`}
                        title="Toggle Mark as Important"
                      >
                        <Star className={`w-4 h-4 ${app.isImportant ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    <td className="py-3 px-4 max-w-xs sm:max-w-md">
                      <div className="font-extrabold text-slate-900 leading-snug">{app.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {app.summaryTamil || app.summary}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <CategoryBadge category={app.category} />
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                      <div>{app.sourceName}</div>
                      <a
                        href={app.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-emerald-600 hover:underline flex items-center space-x-0.5 mt-0.5"
                      >
                        <span>Original link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>

                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(app.publicationDate).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4">
                      <ConfidenceBadge score={app.confidenceScore} />
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setPreviewItem(app)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Preview Full Record"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setEditItem(app)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
                          title="Edit Extracted Fields"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handlePublish(app._id)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition flex items-center space-x-1 shadow-sm"
                          title="Approve & Publish to Public"
                        >
                          <Send className="w-3 h-3" />
                          <span>Publish</span>
                        </button>

                        <button
                          onClick={() => handleReject(app._id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                          title="Reject Record"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(app._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-700 rounded-lg transition"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Detailed Review</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{previewItem.title}</h3>
                <div className="text-xs text-slate-500 mt-0.5">Source: {previewItem.sourceName}</div>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex flex-wrap gap-2">
                <CategoryBadge category={previewItem.category} />
                <ConfidenceBadge score={previewItem.confidenceScore} />
                <StatusBadge status={previewItem.status} />
              </div>

              {previewItem.summaryTamil && (
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-2">
                  <span className="font-bold text-emerald-900 block">Tamil Regional Translation (தமிழ்):</span>
                  <p className="tamil-text text-emerald-950 leading-relaxed">
                    {previewItem.summaryTamil}
                  </p>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <span className="font-bold text-slate-800 block">English AI Summary:</span>
                <p className="text-slate-700 leading-relaxed">{previewItem.summary}</p>
              </div>

              {previewItem.recordId?.extractedData && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">Extracted Structured Fields:</span>
                  <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-[11px] overflow-x-auto max-h-48 font-mono">
                    {JSON.stringify(previewItem.recordId.extractedData, null, 2)}
                  </pre>
                </div>
              )}

              <div className="text-slate-500">
                <span>Original URL: </span>
                <a
                  href={previewItem.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  {previewItem.sourceUrl}
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close Preview
              </button>
              <button
                onClick={() => handlePublish(previewItem._id)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Approve & Publish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit Extracted Information</h3>
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={editItem.title}
                onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={editItem.category}
                onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Summary (Tamil - தமிழ்)</label>
              <textarea
                rows="3"
                value={editItem.summaryTamil || ''}
                onChange={(e) => setEditItem({ ...editItem, summaryTamil: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none tamil-text"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Summary (English)</label>
              <textarea
                rows="3"
                value={editItem.summary}
                onChange={(e) => setEditItem({ ...editItem, summary: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="editImportant"
                checked={editItem.isImportant || false}
                onChange={(e) => setEditItem({ ...editItem, isImportant: e.target.checked })}
                className="rounded text-emerald-600"
              />
              <label htmlFor="editImportant" className="text-xs font-bold text-slate-700">
                Mark as Important announcement / alert
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
