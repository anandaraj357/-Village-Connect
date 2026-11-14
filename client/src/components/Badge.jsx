import React from 'react';

export const ConfidenceBadge = ({ score }) => {
  const num = Number(score) || 0;
  let bg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (num < 80) bg = 'bg-amber-100 text-amber-800 border-amber-300';
  if (num < 60) bg = 'bg-rose-100 text-rose-800 border-rose-300';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${bg}`}>
      ⚡ {num}% Confidence
    </span>
  );
};

export const CategoryBadge = ({ category }) => {
  const colorMap = {
    Government: 'bg-blue-100 text-blue-800 border-blue-200',
    'Local Job': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    IT: 'bg-purple-100 text-purple-800 border-purple-200',
    Manufacturing: 'bg-amber-100 text-amber-900 border-amber-300',
    Healthcare: 'bg-rose-100 text-rose-800 border-rose-200',
    Education: 'bg-teal-100 text-teal-800 border-teal-200',
    Banking: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    Retail: 'bg-orange-100 text-orange-800 border-orange-200',
    Logistics: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    'Skilled Trade': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Work From Home': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Internship: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    Agriculture: 'bg-lime-100 text-lime-900 border-lime-300',
    Private: 'bg-slate-100 text-slate-800 border-slate-300',
    'Government Schemes': 'bg-amber-100 text-amber-900 border-amber-300',
    'District News': 'bg-sky-100 text-sky-800 border-sky-200',
    'Village News': 'bg-teal-100 text-teal-800 border-teal-200',
    'Important Announcements': 'bg-red-100 text-red-800 border-red-200'
  };

  const cls = colorMap[category] || 'bg-slate-100 text-slate-800 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${cls}`}>
      {category}
    </span>
  );
};

export const PostedByBadge = ({ postedBy }) => {
  if (postedBy?.userType === 'user' || postedBy?.userType === 'employer') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300" title={`Posted by: ${postedBy.name || 'Community Member'}`}>
        👥 User Submitted
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300" title="Verified by Portal Scrapers & Admin">
      ✓ Official Verified
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    pending: 'bg-amber-100 text-amber-800 border-amber-300',
    approved: 'bg-blue-100 text-blue-800 border-blue-300',
    published: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    rejected: 'bg-rose-100 text-rose-800 border-rose-300',
    edited: 'bg-purple-100 text-purple-800 border-purple-300',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    failed: 'bg-rose-100 text-rose-800 border-rose-300',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize border ${map[status] || 'bg-slate-100 text-slate-700'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
};
