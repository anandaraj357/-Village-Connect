import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import { useLocation } from '../context/LocationContext';
import { CategoryBadge, ConfidenceBadge } from '../components/Badge';
import {
  Briefcase,
  FileText,
  Newspaper,
  Megaphone,
  Calendar,
  ArrowRight,
  ExternalLink,
  Download,
  CheckCircle,
  MapPin,
  Navigation,
  Sparkles,
  PhoneCall,
  Clock,
  Droplets,
  ShoppingBag,
  Users,
  ShieldAlert,
  Building2,
  Wheat,
  Share2
} from 'lucide-react';

export const Home = ({ setCurrentView }) => {
  const { language } = useNotifications();
  const {
    location,
    openLocationModal,
    requestGpsLocation,
    isLocating,
    emergencyContacts,
    refreshTrigger
  } = useLocation();

  const [jobs, setJobs] = useState([]);
  const [recruitments, setRecruitments] = useState([]);
  const [news, setNews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, recRes, newsRes, annRes] = await Promise.all([
          axios.get('/api/public/jobs?limit=4&district=Villupuram'),
          axios.get('/api/public/recruitments?limit=3'),
          axios.get('/api/public/news?limit=4&district=Villupuram&state=Tamil%20Nadu'),
          axios.get('/api/public/announcements?district=Villupuram&state=Tamil%20Nadu')
        ]);

        if (jobsRes.data.success) setJobs(jobsRes.data.jobs);
        if (recRes.data.success) setRecruitments(recRes.data.recruitments);
        if (newsRes.data.success) setNews(newsRes.data.news);
        if (annRes.data.success) setAnnouncements(annRes.data.announcements.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner - Exclusively Nesal Village */}
      <section className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl border border-emerald-900/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
              <span>🌾 நெசல் கிராம டிஜிட்டல் தளம்</span>
              <span>•</span>
              <span className="font-mono">அஞ்சல்: 605014</span>
            </div>

            <button
              onClick={openLocationModal}
              className="inline-flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-emerald-300 border border-slate-700 text-xs font-semibold px-3 py-1 rounded-full transition cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{location.wardName || 'நெசல் வார்டுகள்'}</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {language === 'ta'
              ? 'நமது நெசல் கிராமம்: ஊராட்சி அறிவிப்புகள், வேளாண்மை & வேலைவாய்ப்புகள்'
              : 'Our Nesal Village: Panchayat Notices, Agriculture & Government Opportunities'}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {language === 'ta'
              ? 'தமிழ்நாடு, விழுப்புரம் மாவட்டம், வானூர் வட்டம், நெசல் கிராமத்திற்கான அதிகாரப்பூர்வ கிராம சபை அறிவிப்புகள், நியாயவிலைக் கடை, குடிநீர் நேரம், TNPSC அரசுத் தேர்வுகள் மற்றும் வேளாண் மானியத் தகவல்கள்.'
              : 'Dedicated hyper-local digital portal for Nesal Village (Vanur Taluk, Villupuram District, Pincode 605014) — verified civic notices, ration schedules, drinking water times, and TNPSC jobs.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentView('news')}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg flex items-center space-x-2 text-sm"
            >
              <Newspaper className="w-4 h-4" />
              <span>{language === 'ta' ? 'நெசல் செய்திகள்' : 'Nesal News'}</span>
            </button>
            <button
              onClick={() => setCurrentView('announcements')}
              className="bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 font-semibold px-5 py-2.5 rounded-xl transition text-sm flex items-center space-x-2"
            >
              <Megaphone className="w-4 h-4" />
              <span>{language === 'ta' ? 'ஊராட்சி அறிவிப்புகள்' : 'Panchayat Notices'}</span>
            </button>
            <button
              onClick={() => setCurrentView('jobs')}
              className="bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-700/60 font-semibold px-4 py-2.5 rounded-xl transition text-sm flex items-center space-x-1.5"
            >
              <Briefcase className="w-4 h-4" />
              <span>{language === 'ta' ? 'தமிழ்நாடு வேலைகள்' : 'All-TN Jobs'}</span>
            </button>
            <button
              onClick={() => setCurrentView('post-job')}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-xl transition shadow-md text-sm flex items-center space-x-1.5"
            >
              <span>{language === 'ta' ? '➕ வேலை பதிவிட' : '➕ Post a Job'}</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="mt-8 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
            <div className="text-xl font-black text-emerald-400">வானூர் வட்டம்</div>
            <div className="text-xs text-slate-400 font-medium">நிர்வாக வட்டார எல்லை</div>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
            <div className="text-xl font-black text-emerald-400">605014</div>
            <div className="text-xs text-slate-400 font-medium">நெசல் அஞ்சல் குறியீடு</div>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
            <div className="text-xl font-black text-emerald-400">12.0125° N</div>
            <div className="text-xs text-slate-400 font-medium">நெசல் ஜி.பி.எஸ் அட்சரேகை</div>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
            <div className="text-xl font-black text-emerald-400">100% நெசல்</div>
            <div className="text-xs text-slate-400 font-medium">பிரத்யேக கிராமத் தளம்</div>
          </div>
        </div>
      </section>

      {/* NESAL CIVIC NOTICE BOARD WIDGET */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Daily Civic Updates</div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
              <Building2 className="w-6 h-6 text-emerald-600" />
              <span>{language === 'ta' ? 'நெசல் கிராம ஊராட்சி தகவல் பலகை' : 'Nesal Village Civic Notice Board'}</span>
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full self-start sm:self-auto">
            📍 நெசல் கிராமம், வானூர் வட்டம்
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Drinking Water */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-800">
              <Droplets className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-sm">குடிநீர் விநியோகம்</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              மேல்நிலை நீர்த்தேக்கத் தொட்டி (OHT) மூலம் தினமும் 2 வேளை குடிநீர் விநியோகம்.
            </p>
            <div className="text-[11px] font-bold text-emerald-800 bg-white/80 p-2 rounded-lg border border-emerald-100 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>காலை: 6:30 - 8:30 | மாலை: 5:30 - 7:00</span>
            </div>
          </div>

          {/* Card 2: PDS Ration */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2">
            <div className="flex items-center space-x-2 text-teal-800">
              <ShoppingBag className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-sm">ரேஷன் கடை (PDS)</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              நெசல் நியாயவிலைக் கடையில் பயோமெட்ரிக் மூலம் விலையில்லா அரிசி, பருப்பு விநியோகம்.
            </p>
            <div className="text-[11px] font-bold text-teal-800 bg-white/80 p-2 rounded-lg border border-teal-100 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>நேரம்: காலை 9:00 - 1:00 | மாலை 3:00 - 6:00</span>
            </div>
          </div>

          {/* Card 3: 100-Day Work */}
          <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-900">
              <Users className="w-5 h-5 text-cyan-600" />
              <h3 className="font-bold text-sm">100 நாள் வேலைத் திட்டம்</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              மகாத்மா காந்தி தேசிய ஊரக வேலை உறுதித் திட்டம் (MGNREGS) நெசல் ஏரிக்கரை தூர்வாரும் பணி.
            </p>
            <div className="text-[11px] font-bold text-cyan-900 bg-white/80 p-2 rounded-lg border border-cyan-100 flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-600" />
              <span>நெசல் ஊராட்சி மன்றத்தில் அட்டை பெறலாம்</span>
            </div>
          </div>

          {/* Card 4: Vanur Agriculture */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center space-x-2 text-amber-900">
              <Wheat className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm">உழவர் மானியத் திட்டம்</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              வானூர் வட்டார வேளாண் விரிவாக்க மையம் மூலம் 50% மானியத்தில் நெல் & உளுந்து சான்று விதைகள்.
            </p>
            <div className="text-[11px] font-bold text-amber-900 bg-white/80 p-2 rounded-lg border border-amber-100 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>வானூர் வேளாண் அலுவலகம்: 50% மானியம்</span>
            </div>
          </div>
        </div>
      </section>

      {/* NESAL & VANUR EMERGENCY DIRECTORY WIDGET */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>24/7 Citizen Helplines</span>
            </div>
            <h2 className="text-2xl font-black">
              {language === 'ta'
                ? 'நெசல் & வானூர் அவசர உதவி தொலைபேசி எண்கள்'
                : 'Nesal Village & Vanur Taluk Emergency Helplines'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              அவசர உதவிக்கு கீழே உள்ள தொலைபேசி எண்ணை நேரடியாகத் தொடர்பு கொள்ளவும்.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            வானூர் காவல், தீயணைப்பு & மருத்துவமனை
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700/80 transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {contact.category}
                  </span>
                  {contact.shortCode && (
                    <span className="text-xs font-black text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full font-mono">
                      {contact.shortCode}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-white mt-2 leading-snug">
                  {contact.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  {contact.timing}
                </p>
              </div>

              <a
                href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl transition flex items-center justify-center space-x-2 text-xs shadow-md"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="font-mono">{contact.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 1: Nesal & Vanur Daily News Highlights */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Rural News & Governance</div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Newspaper className="w-6 h-6 text-emerald-600" />
              <span>{language === 'ta' ? 'நெசல் கிராமம் & வானூர் வட்டார செய்திகள்' : 'Nesal Village & Vanur Updates'}</span>
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('news')}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{language === 'ta' ? 'அனைத்து செய்திகள்' : 'Read all news'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              {item.thumbnailUrl && (
                <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.headline}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <CategoryBadge category={item.category} />
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  {!item.thumbnailUrl && <CategoryBadge category={item.category} />}
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{item.headline}</h3>

                  {language === 'ta' && item.summaryTamil ? (
                    <div className="tamil-text bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-950 leading-relaxed">
                      <span className="font-bold block text-emerald-800 mb-1">தமிழ் சுருக்கம்:</span>
                      {item.summaryTamil}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 leading-relaxed">{item.summaryEnglish || item.shortDescription}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{language === 'ta' ? 'மூலம்: ' : 'Source: '} {item.sourceWebsite}</span>
                  <div className="flex items-center space-x-2">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `🌾 *நமது நெசல் கிராமம் செய்தி*\n📰 *${item.headline}*\n📍 நெசல், வானூர், விழுப்புரம்\n\n${item.summaryTamil || item.summaryEnglish || item.shortDescription}\n\n🔗 ${item.originalArticleUrl}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                      title="WhatsApp-ல் பகிர்க"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={item.originalArticleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-emerald-700 hover:underline flex items-center space-x-1"
                    >
                      <span>{language === 'ta' ? 'முழு விவரம்' : 'Full Story'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Active TNPSC Government Recruitment Notifications */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Official Gazettes & Commissions</div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-emerald-600" />
              <span>{language === 'ta' ? 'அரசு தேர்வு மற்றும் பணி நியமன அறிவிப்புகள் (TNPSC / SSC)' : 'Government Recruitment Notifications'}</span>
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('recruitments')}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{language === 'ta' ? 'அனைத்தும்' : 'View all'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recruitments.map((rec) => (
            <div
              key={rec._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                    {rec.notificationNumber}
                  </span>
                  <ConfidenceBadge score={rec.confidenceScore} />
                </div>

                <h3 className="font-bold text-slate-900 text-base line-clamp-2">{rec.recruitmentName}</h3>
                <div className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                  {rec.organization}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500 block">{language === 'ta' ? 'பணியிடங்கள்:' : 'Total Posts:'}</span>
                    <span className="font-bold text-slate-900">{rec.totalVacancies > 0 ? rec.totalVacancies : 'Refer Gazetted PDF'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{language === 'ta' ? 'வயது வரம்பு:' : 'Age Limit:'}</span>
                    <span className="font-semibold text-slate-800 truncate block">{rec.ageLimit}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 line-clamp-2">
                  <span className="font-medium text-slate-700">{language === 'ta' ? 'கல்வித்தகுதி: ' : 'Eligibility: '}</span>
                  {rec.eligibility}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span>
                    {language === 'ta' ? 'கடைசி தேதி: ' : 'Last Date: '}
                    {rec.importantDates?.applicationLastDate ? new Date(rec.importantDates.applicationLastDate).toLocaleDateString() : 'See Notice'}
                  </span>
                </div>

                <div className="flex space-x-2">
                  {rec.officialPdfUrl && (
                    <a
                      href={rec.officialPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                      title="Download Notification PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href={rec.officialApplicationLink || rec.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition"
                  >
                    <span>{language === 'ta' ? 'விண்ணப்பிக்க' : 'Apply'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Verified Job Vacancies (Vanur / Villupuram / Tamil Nadu) */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Employment Board</div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Briefcase className="w-6 h-6 text-emerald-600" />
              <span>{language === 'ta' ? 'வானூர் & விழுப்புரம் வேலைவாய்ப்புகள்' : 'Vanur & Villupuram Job Openings'}</span>
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('jobs')}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{language === 'ta' ? 'அனைத்து வேலைகள்' : 'View all jobs'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <CategoryBadge category={job.jobCategory} />
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {job.salary}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{job.jobTitle}</h3>
                <div className="text-xs text-slate-600 font-medium">{job.organizationName}</div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.jobDescription}
                </p>

                <div className="flex flex-wrap gap-2 text-xs pt-2 text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">🎓 {job.qualification}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">📍 {job.jobLocation}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">👥 {job.vacanciesCount} {language === 'ta' ? 'இடங்கள்' : 'Vacancies'}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {language === 'ta' ? 'மூலம்: ' : 'Source: '} {job.sourceWebsite}
                </span>

                <a
                  href={job.applicationUrl || job.officialNotificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-lg transition"
                >
                  <span>{language === 'ta' ? 'விண்ணப்பிக்க' : 'Apply Now'}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Banner */}
      <section className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-emerald-950">
            {language === 'ta'
              ? 'நெசல் கிராம அறிவிப்புகள் மற்றும் அரசு வேலைவாய்ப்புகளை உடனடியாகப் பெறுங்கள்'
              : 'Never Miss a Village Alert or Government Job Opening in Nesal & Vanur'}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-800">
            {language === 'ta'
              ? 'நெசல் கிராமம், வானூர் வட்டம் மற்றும் விழுப்புரம் மாவட்டத்திற்கு ஏற்றவாறு நிகழ்நேர விழிப்பூட்டல்களைப் பெறுங்கள்.'
              : 'Subscribe to category alerts tailored specifically for Nesal Village, Vanur Taluk and Villupuram District.'}
          </p>
        </div>
        <button
          onClick={() => setCurrentView('subscriptions')}
          className="whitespace-nowrap bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl transition shadow text-sm"
        >
          {language === 'ta' ? 'விழிப்பூட்டலுக்கு பதிவு செய்க' : 'Subscribe to Alerts'}
        </button>
      </section>
    </div>
  );
};
