import React, { useState } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import {
  Briefcase,
  Building,
  MapPin,
  GraduationCap,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  User,
  ExternalLink,
  CheckCircle2,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Share2
} from 'lucide-react';

export const TN_DISTRICTS = [
  { id: 'All Tamil Nadu', en: 'All Tamil Nadu (State-wide)', ta: 'தமிழ்நாடு முழுவதும்' },
  { id: 'Ariyalur', en: 'Ariyalur', ta: 'அரியலூர்' },
  { id: 'Chengalpattu', en: 'Chengalpattu', ta: 'செங்கல்பட்டு' },
  { id: 'Chennai', en: 'Chennai', ta: 'சென்னை' },
  { id: 'Coimbatore', en: 'Coimbatore', ta: 'கோயம்புத்தூர்' },
  { id: 'Cuddalore', en: 'Cuddalore', ta: 'கடலூர்' },
  { id: 'Dharmapuri', en: 'Dharmapuri', ta: 'தருமபுரி' },
  { id: 'Dindigul', en: 'Dindigul', ta: 'திண்டுக்கல்' },
  { id: 'Erode', en: 'Erode', ta: 'ஈரோடு' },
  { id: 'Kallakurichi', en: 'Kallakurichi', ta: 'கள்ளக்குறிச்சி' },
  { id: 'Kanchipuram', en: 'Kanchipuram', ta: 'காஞ்சிபுரம்' },
  { id: 'Kanyakumari', en: 'Kanyakumari', ta: 'கன்னியாகுமரி' },
  { id: 'Karur', en: 'Karur', ta: 'கரூர்' },
  { id: 'Krishnagiri', en: 'Krishnagiri', ta: 'கிருஷ்ணகிரி' },
  { id: 'Madurai', en: 'Madurai', ta: 'மதுரை' },
  { id: 'Mayiladuthurai', en: 'Mayiladuthurai', ta: 'மயிலாடுதுறை' },
  { id: 'Nagapattinam', en: 'Nagapattinam', ta: 'நாகப்பட்டினம்' },
  { id: 'Namakkal', en: 'Namakkal', ta: 'நாமக்கல்' },
  { id: 'Nilgiris', en: 'Nilgiris', ta: 'நீலகிரி' },
  { id: 'Perambalur', en: 'Perambalur', ta: 'பெரம்பலூர்' },
  { id: 'Pudukkottai', en: 'Pudukkottai', ta: 'புதுக்கோட்டை' },
  { id: 'Ramanathapuram', en: 'Ramanathapuram', ta: 'இராமநாதபுரம்' },
  { id: 'Ranipet', en: 'Ranipet', ta: 'ராணிப்பேட்டை' },
  { id: 'Salem', en: 'Salem', ta: 'சேலம்' },
  { id: 'Sivaganga', en: 'Sivaganga', ta: 'சிவகங்கை' },
  { id: 'Tenkasi', en: 'Tenkasi', ta: 'தென்காசி' },
  { id: 'Thanjavur', en: 'Thanjavur', ta: 'தஞ்சாவூர்' },
  { id: 'Theni', en: 'Theni', ta: 'தேனி' },
  { id: 'Thoothukudi', en: 'Thoothukudi', ta: 'தூத்துக்குடி' },
  { id: 'Tiruchirappalli', en: 'Tiruchirappalli', ta: 'திருச்சிராப்பள்ளி' },
  { id: 'Tirunelveli', en: 'Tirunelveli', ta: 'திருநெல்வேலி' },
  { id: 'Tirupathur', en: 'Tirupathur', ta: 'திருப்பத்தூர்' },
  { id: 'Tiruppur', en: 'Tiruppur', ta: 'திருப்பூர்' },
  { id: 'Tiruvallur', en: 'Tiruvallur', ta: 'திருவள்ளூர்' },
  { id: 'Tiruvannamalai', en: 'Tiruvannamalai', ta: 'திருவண்ணாமலை' },
  { id: 'Tiruvarur', en: 'Tiruvarur', ta: 'திருவாரூர்' },
  { id: 'Vellore', en: 'Vellore', ta: 'வேலூர்' },
  { id: 'Villupuram', en: 'Villupuram (Nesal & Vanur)', ta: 'விழுப்புரம் (நெசல் & வானூர்)' },
  { id: 'Virudhunagar', en: 'Virudhunagar', ta: 'விருதுநகர்' }
];

export const CATEGORIES_LIST = [
  { id: 'Government', en: 'Government / Public Sector', ta: 'அரசுப் பணி / பொதுத்துறை' },
  { id: 'Private', en: 'Private Sector / Corporate', ta: 'தனியார் துறை' },
  { id: 'IT', en: 'IT & Software Engineering', ta: 'தகவல் தொழில்நுட்பம்' },
  { id: 'Manufacturing', en: 'Manufacturing & Automobile', ta: 'தொழிற்சாலை / உற்பத்தி' },
  { id: 'Healthcare', en: 'Healthcare, Nursing & Hospital', ta: 'மருத்துவம் / செவிலியர்' },
  { id: 'Education', en: 'Teaching & School / College', ta: 'கல்வி / ஆசிரியர் பணி' },
  { id: 'Banking', en: 'Banking & Financial Services', ta: 'வங்கி / நிதிச்சேவை' },
  { id: 'Retail', en: 'Retail, Supermarket & Sales', ta: 'விற்பனை & அங்காடிகள்' },
  { id: 'Logistics', en: 'Driver, Delivery & Transport', ta: 'ஓட்டுநர் & போக்குவரத்து' },
  { id: 'Agriculture', en: 'Agriculture, Dairy & Poultry', ta: 'வேளாண்மை & கால்நடை' },
  { id: 'Skilled Trade', en: 'Technician, Electrician & ITI', ta: 'தொழில்நுட்ப வல்லுநர் / ITI' },
  { id: 'Work From Home', en: 'Work From Home / Remote', ta: 'வீட்டிலிருந்தே பணி' },
  { id: 'Local Job', en: 'Local Village & Panchayat', ta: 'உள்ளூர் கிராமப் பணிகள்' }
];

export const QUALIFICATIONS_LIST = [
  'Any Qualification / திறமை மட்டுமே',
  '8th Pass',
  '10th Pass (SSLC)',
  '12th Pass (HSC)',
  'ITI (Any Trade)',
  'Diploma (Polytechnic)',
  'Any Bachelor Degree / பட்டப்படிப்பு',
  'B.E / B.Tech (Engineering)',
  'Post Graduate (PG / M.Sc / MCA / MBA)',
  'Nursing (GNM / B.Sc) / Pharmacy',
  'Other / பிற தகுதி'
];

export const PostJobPortal = ({ onBack, onComplete }) => {
  const { language } = useNotifications();

  const [postingType, setPostingType] = useState('job'); // 'job' or 'recruitment'
  const [formData, setFormData] = useState({
    title: '',
    organizationName: '',
    jobCategory: 'Private',
    jobType: 'Full-Time',
    district: 'Villupuram',
    jobLocation: '',
    qualification: 'Any Qualification / திறமை மட்டுமே',
    requiredExperience: 'Freshers / Experienced',
    salary: '₹18,000 - ₹25,000 / month',
    vacanciesCount: 1,
    applicationLastDate: '',
    jobDescription: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    howToApply: '',
    applicationUrl: '',
    officialNotificationUrl: '',
    notificationNumber: '',
    eligibility: '',
    ageLimit: '18 - 35 Years',
    examDate: ''
  });

  const [loading, setLoading] = useState(false);
  const [submittedItem, setSubmittedItem] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg(language === 'ta' ? 'தயவுசெய்து பணியின் பெயரை உள்ளிடவும்.' : 'Please enter the Job / Role title.');
      return;
    }
    if (!formData.organizationName.trim()) {
      setErrorMsg(language === 'ta' ? 'நிறுவனம் அல்லது அலுவலக பெயரை உள்ளிடவும்.' : 'Please enter the Organization name.');
      return;
    }
    if (!formData.contactPhone.trim() && !formData.applicationUrl.trim()) {
      setErrorMsg(
        language === 'ta'
          ? 'விண்ணப்பதாரர்கள் தொடர்பு கொள்ள தொலைபேசி எண் அல்லது இணையதள இணைப்பை உள்ளிடவும்.'
          : 'Please enter a contact phone number or application URL so applicants can reach you.'
      );
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        postingType,
        vacanciesCount: Number(formData.vacanciesCount) || 1
      };

      const res = await axios.post('/api/public/jobs/post', payload);
      if (res.data.success) {
        setSubmittedItem(res.data.job || res.data.record);
      } else {
        setErrorMsg(res.data.message || 'Submission failed');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Error publishing vacancy');
    } finally {
      setLoading(false);
    }
  };

  if (submittedItem) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {postingType === 'recruitment' ? 'Recruitment Published' : 'Job Vacancy Published'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {language === 'ta' ? 'வெற்றிகரமாக பதிவு செய்யப்பட்டது!' : 'Opportunity Published Successfully!'}
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              {language === 'ta'
                ? 'உங்கள் வேலைவாய்ப்பு விவரங்கள் நமது தமிழ்நாடு வேலைவாய்ப்பு தளத்தில் உடனடியாக நேரலையாக சேர்க்கப்பட்டுள்ளது.'
                : 'Your job opening is now live across Tamil Nadu on Our Village Portal. Candidates can now view and apply.'}
            </p>
          </div>

          {/* Card Preview */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                {formData.jobCategory}
              </span>
              <span className="text-xs font-bold text-slate-700">
                📍 {formData.district}
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">{formData.title}</h3>
            <p className="text-xs font-semibold text-slate-600">{formData.organizationName}</p>
            <div className="text-xs text-slate-500 flex flex-wrap gap-4 pt-1">
              <span>💰 {formData.salary}</span>
              <span>👥 {formData.vacanciesCount} Vacancies</span>
              <span>🎓 {formData.qualification}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => {
                setSubmittedItem(null);
                setFormData({
                  title: '',
                  organizationName: '',
                  jobCategory: 'Private',
                  jobType: 'Full-Time',
                  district: 'Villupuram',
                  jobLocation: '',
                  qualification: 'Any Qualification / திறமை மட்டுமே',
                  requiredExperience: 'Freshers / Experienced',
                  salary: '₹18,000 - ₹25,000 / month',
                  vacanciesCount: 1,
                  applicationLastDate: '',
                  jobDescription: '',
                  contactPerson: '',
                  contactPhone: '',
                  contactEmail: '',
                  howToApply: '',
                  applicationUrl: '',
                  officialNotificationUrl: '',
                  notificationNumber: '',
                  eligibility: '',
                  ageLimit: '18 - 35 Years',
                  examDate: ''
                });
              }}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition"
            >
              {language === 'ta' ? 'மற்றொரு அறிவிப்பை பதிவிட' : 'Post Another Opportunity'}
            </button>
            <button
              onClick={onComplete || onBack}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center space-x-2"
            >
              <span>{language === 'ta' ? 'அனைத்து வேலைகளையும் காண்க' : 'Browse All Jobs Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs text-emerald-200 hover:text-white bg-white/10 px-3 py-1.5 rounded-xl transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'பின்செல்ல' : 'Back to Listings'}</span>
          </button>
        )}

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'பொதுமக்கள் & முதலாளிகள் நேரடி தளம்' : 'Citizen & Employer Community Portal'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {language === 'ta'
              ? 'வேலைவாய்ப்பு & தேர்வு அறிவிப்பை பதிவிடுக'
              : 'Post a Job Vacancy or Recruitment Notice'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'நிறுவனங்கள், வணிகர்கள், அரசுத்துறை அல்லது கிராம சபை உறுப்பினர்கள் தங்கள் பகுதியில் உள்ள அல்லது தமிழ்நாடு அளவிலான காலிப்பணியிடங்களை நேரடியாக இங்கு வெளியிடலாம்.'
              : 'Open to local business owners, schools, hospitals, IT firms, and panchayat representatives to post opportunities across all 38 districts of Tamil Nadu.'}
          </p>
        </div>

        {/* Posting Type Switcher */}
        <div className="pt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setPostingType('job');
              setFormData((p) => ({ ...p, jobCategory: 'Private' }));
            }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
              postingType === 'job'
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-white/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{language === 'ta' ? '1. தனியார் / நிறுவன வேலைவாய்ப்பு' : '1. Private / Employer Job Opening'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPostingType('recruitment');
              setFormData((p) => ({ ...p, jobCategory: 'Government' }));
            }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
              postingType === 'recruitment'
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-white/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'ta' ? '2. அரசு / பொதுத்துறை தேர்வு அறிவிப்பு' : '2. Government Recruitment Circular'}</span>
          </button>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">1</span>
            <span>{language === 'ta' ? 'அடிப்படை பணி விவரங்கள்' : 'Primary Opportunity Information'}</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Job Title */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {postingType === 'recruitment'
                ? (language === 'ta' ? 'தேர்வு / அறிவிப்பு பெயர் *' : 'Recruitment Drive / Post Title *')
                : (language === 'ta' ? 'பணியின் பெயர் / பதவி *' : 'Job Title / Role *')}
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="title"
                required
                placeholder={
                  postingType === 'recruitment'
                    ? 'e.g. Village Assistant Recruitment 2026 / TNUSRB Constable'
                    : 'e.g. CNC Operator, Staff Nurse, Software Developer, Office Assistant'
                }
                value={formData.title}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Organization Name */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'நிறுவனம் / அரசுத்துறை / முதலாளி பெயர் *' : 'Company / Organization / Department Name *'}
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="organizationName"
                required
                placeholder="e.g. Apollo Pharmacy, Tata Electronics, Vanur Taluk Office, Nesal Dairy Farm"
                value={formData.organizationName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Job Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'பணி வகை / துறை' : 'Job Category / Industry'}
            </label>
            <select
              name="jobCategory"
              value={formData.jobCategory}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              {CATEGORIES_LIST.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.en} ({cat.ta})
                </option>
              ))}
            </select>
          </div>

          {/* Job Type (Full-Time, Part-Time, etc.) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'வேலை முறை' : 'Employment Type'}
            </label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="Full-Time">Full-Time (முழு நேரம்)</option>
              <option value="Part-Time">Part-Time (பகுதி நேரம்)</option>
              <option value="Contract">Contract / தற்காலிகப் பணி</option>
              <option value="Walk-in Interview">Walk-in Interview (நேர்முகத் தேர்வு)</option>
              <option value="Apprenticeship">Apprenticeship / பயிற்சி</option>
              <option value="Work From Home">Work From Home / வீட்டிலிருந்து</option>
            </select>
          </div>

          {/* Tamil Nadu District Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'தமிழ்நாடு மாவட்டம் *' : 'Tamil Nadu District *'}
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              {TN_DISTRICTS.map((dist) => (
                <option key={dist.id} value={dist.id}>
                  {dist.en} - {dist.ta}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Area / Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'குறிப்பிட்ட இடம் / பகுதி' : 'Specific Town / Taluk / Street'}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="jobLocation"
                placeholder="e.g. Vanur Taluk, Tindivanam, Guindy Chennai, TIDEL Park Coimbatore"
                value={formData.jobLocation}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-slate-100 pt-4 pb-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">2</span>
            <span>{language === 'ta' ? 'தகுதி, சம்பளம் & காலக்கெடு' : 'Eligibility, Compensation & Deadlines'}</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Qualification */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'கல்வித் தகுதி' : 'Required Qualification'}
            </label>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              {QUALIFICATIONS_LIST.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* Salary / Pay */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'சம்பளம் / மாத ஊதியம்' : 'Salary / Monthly Pay'}
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="salary"
                placeholder="e.g. ₹20,000 - ₹30,000 / month or As per Govt Norms"
                value={formData.salary}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Number of Vacancies */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'காலிப்பணியிடங்கள் எண்ணிக்கை' : 'Number of Vacancies'}
            </label>
            <input
              type="number"
              min="1"
              name="vacanciesCount"
              value={formData.vacanciesCount}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Last Date to Apply */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'விண்ணப்பிக்க கடைசி தேதி' : 'Application Deadline'}
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="date"
                name="applicationLastDate"
                value={formData.applicationLastDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'அனுபவம்' : 'Experience Required'}
            </label>
            <input
              type="text"
              name="requiredExperience"
              placeholder="e.g. Freshers Welcome / 1 - 2 Years"
              value={formData.requiredExperience}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Age Limit (if recruitment) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'வயது வரம்பு' : 'Age Limit'}
            </label>
            <input
              type="text"
              name="ageLimit"
              placeholder="e.g. 18 to 35 Years"
              value={formData.ageLimit}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            {language === 'ta' ? 'பணி விளக்கம் & முக்கிய தேவைகள்' : 'Job Description & Role Details'}
          </label>
          <textarea
            name="jobDescription"
            rows="3"
            placeholder={
              language === 'ta'
                ? 'வேலை நேரம், செய்ய வேண்டிய பணிகள், தேவையான திறன்கள் அல்லது கூடுதல் சலுகைகள் (உணவு, தங்குமிடம் போன்றவை)...'
                : 'Job responsibilities, shift timings, interview instructions, accommodation or transport facilities...'
            }
            value={formData.jobDescription}
            onChange={handleChange}
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <div className="border-b border-slate-100 pt-4 pb-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">3</span>
            <span>{language === 'ta' ? 'தொடர்பு & விண்ணப்பிக்கும் வழிமுறைகள்' : 'Contact & How to Apply'}</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Contact Person */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'தொடர்பு கொள்ள வேண்டியவர் பெயர்' : 'Contact Person Name'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="contactPerson"
                placeholder="e.g. R. Murugan, HR Manager"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Contact Phone / WhatsApp */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'தொலைபேசி / வாட்ஸ்அப் எண் *' : 'Phone / WhatsApp Number *'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                name="contactPhone"
                placeholder="e.g. 9842109876"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Contact Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="contactEmail"
                placeholder="e.g. hr@company.com"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Application URL / Notification Link */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'விண்ணப்ப இணையதள இணைப்பு / PDF சுற்றறிக்கை' : 'Application Website Link or Circular PDF URL'}
            </label>
            <div className="relative">
              <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="url"
                name="applicationUrl"
                placeholder="https://..."
                value={formData.applicationUrl}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* How to apply */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {language === 'ta' ? 'விண்ணப்பிக்கும் முறை' : 'How to Apply Note'}
            </label>
            <input
              type="text"
              name="howToApply"
              placeholder="e.g. Call directly / Walk-in / WhatsApp resume"
              value={formData.howToApply}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            {language === 'ta'
              ? 'பதிவிடப்படும் வேலைவாய்ப்புகள் உடனடியாக நேரலையாகி, நிர்வாக சரிபார்ப்புக்கு உட்படுத்தப்படும்.'
              : 'Postings are published immediately with Community verification and verified by administrators.'}
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>{language === 'ta' ? 'பதிவேற்றப்படுகிறது...' : 'Publishing...'}</span>
            ) : (
              <>
                <span>{language === 'ta' ? 'வேலைவாய்ப்பை வெளியிடுக' : 'Publish Opportunity Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobPortal;
