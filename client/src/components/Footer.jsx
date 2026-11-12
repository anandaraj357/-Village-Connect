import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-lg">
              <span>🌾</span>
              <span>OUR VILLAGE • நமது கிராமம்</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated Web Crawling and AI-Powered Information Aggregation System connecting rural citizens of Nesal Village and Vanur Taluk with verified employment, government recruitment notifications, and district news.
            </p>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Authorized Sources</h5>
            <ul className="space-y-1.5 text-xs">
              <li>Tamil Nadu Public Service Commission (TNPSC)</li>
              <li>National Career Service (NCS - Tamil Nadu)</li>
              <li>Employment News / Rozgar Samachar</li>
              <li>SSC & Railway Recruitment (Southern Region Chennai)</li>
              <li>Villupuram District Collectorate & Administration</li>
              <li>TNAU Agritech & Vanur Agriculture Extension</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">System Features</h5>
            <ul className="space-y-1.5 text-xs">
              <li>Scheduled BullMQ & Redis Ingestion</li>
              <li>Anti-Hallucination AI Extraction</li>
              <li>Bilingual Tamil (தமிழ்) & English Summaries</li>
              <li>Strict SSRF & URL Whitelisting</li>
              <li>Duplicate & Revision Tracking</li>
              <li>Two-Tier Administrator Approval</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Village Administration Hub</h5>
            <p className="text-xs text-slate-400">
              நேசல் கிராம பஞ்சாயத்து (Nesal Gram Panchayat), வானூர் வட்டம் (Vanur Taluk), விழுப்புரம் மாவட்டம் (Villupuram District), தமிழ்நாடு - 604102.
            </p>
            <div className="mt-3 text-xs text-emerald-400 font-medium">
              Data strictly verified through administrator approvals before public display.
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Our Village Portal - Nesal, Vanur, Villupuram. All rights reserved.</div>
          <div className="mt-2 sm:mt-0 space-x-4">
            <span>Powered by Node.js, Playwright, Cheerio, BullMQ & Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
