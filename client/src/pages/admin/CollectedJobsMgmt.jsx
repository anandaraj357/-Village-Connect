import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CategoryBadge } from '../../components/Badge';
import { Briefcase, ExternalLink, Calendar, MapPin, Building, GraduationCap } from 'lucide-react';

export const CollectedJobsMgmt = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/public/jobs?limit=100');
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Screen 1</span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">Collected Jobs Database</h2>
          <p className="text-xs text-slate-500">Live published jobs currently served to the public portal.</p>
        </div>
        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
          Total Published: {jobs.length} Jobs
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading jobs...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Job Title</th>
                  <th className="py-3.5 px-4">Organization</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Salary</th>
                  <th className="py-3.5 px-4">Vacancies</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">{job.jobTitle}</td>
                    <td className="py-3 px-4 text-slate-600">{job.organizationName}</td>
                    <td className="py-3 px-4">
                      <CategoryBadge category={job.jobCategory} />
                    </td>
                    <td className="py-3 px-4 text-slate-600">{job.jobLocation}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">{job.salary}</td>
                    <td className="py-3 px-4 font-bold">{job.vacanciesCount}</td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {job.applicationLastDate ? new Date(job.applicationLastDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={job.applicationUrl || job.officialNotificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-bold hover:underline inline-flex items-center space-x-1"
                      >
                        <span>Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
