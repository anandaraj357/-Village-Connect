import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-lg">
              <span>🌾</span>
              <span>OUR VILLAGE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated Web Crawling and AI-Powered Information Aggregation System connecting rural communities with verified employment, recruitment alerts, and governance bulletins.
            </p>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Authorized Sources</h5>
            <ul className="space-y-1.5 text-xs">
              <li>National Career Service (NCS)</li>
              <li>Employment News / Rozgar Samachar</li>
              <li>AP Public Service Commission (APPSC)</li>
              <li>SSC / UPSC / Railway Recruitment</li>
              <li>Guntur District Administration</li>
              <li>Rythu Bharosa Kendram (RBK)</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">System Features</h5>
            <ul className="space-y-1.5 text-xs">
              <li>Scheduled BullMQ & Redis Ingestion</li>
              <li>Anti-Hallucination AI Summarizer</li>
              <li>Bilingual Telugu & English Translations</li>
              <li>Strict SSRF & URL Whitelisting</li>
              <li>Duplicate & Revision Tracking</li>
              <li>Two-Tier Administrator Approval</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Community Hub</h5>
            <p className="text-xs text-slate-400">
              Angalakuduru Gram Panchayat, Tenali Mandal, Guntur District, Andhra Pradesh - 522211.
            </p>
            <div className="mt-3 text-xs text-emerald-400 font-medium">
              Data strictly verified through administrator approvals before public display.
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Our Village Portal. All rights reserved.</div>
          <div className="mt-2 sm:mt-0 space-x-4">
            <span>Powered by Node.js, Playwright, Cheerio, BullMQ & Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
