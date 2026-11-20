import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import {
  GraduationCap,
  HeartPulse,
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  PhoneCall,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  UserPlus,
  Droplets,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Stethoscope,
  Building2,
  Share2,
  X
} from 'lucide-react';

export const EducationHealthPortal = () => {
  const { language } = useNotifications();
  const [activeMainTab, setActiveMainTab] = useState('education'); // 'education' | 'healthcare' | 'blood'

  // ==========================================
  // EDUCATION STATES
  // ==========================================
  const [quizzes, setQuizzes] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loadingEdu, setLoadingEdu] = useState(true);
  const [eduSubTab, setEduSubTab] = useState('quiz'); // 'quiz' | 'scholarships'

  // Quiz interactive state
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [quizId]: optionIndex }
  const [revealedAnswers, setRevealedAnswers] = useState({}); // { [quizId]: true }
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Scholarship filter & search
  const [selectedScholarshipCategory, setSelectedScholarshipCategory] = useState('All');
  const [scholarshipSearch, setScholarshipSearch] = useState('');

  // ==========================================
  // HEALTHCARE STATES
  // ==========================================
  const [camps, setCamps] = useState([]);
  const [phcSchedule, setPhcSchedule] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [selectedCampType, setSelectedCampType] = useState('All');

  // ==========================================
  // BLOOD DONOR STATES
  // ==========================================
  const [donors, setDonors] = useState([]);
  const [loadingDonors, setLoadingDonors] = useState(true);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [donorForm, setDonorForm] = useState({
    fullName: '',
    bloodGroup: 'O+',
    ward: 'Ward 1 - நெசல் கிராம நத்தம்',
    phone: '',
    altPhone: '',
    age: 24,
    gender: 'Male',
    willingToTravelTo: 'வானூர், ஜிப்மர் புதுச்சேரி, திண்டிவனம்'
  });
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isSubmittingDonor, setIsSubmittingDonor] = useState(false);

  // Fetch Education Data
  useEffect(() => {
    const fetchEduData = async () => {
      try {
        setLoadingEdu(true);
        const [quizRes, scholRes] = await Promise.all([
          axios.get(`/api/public/education/quizzes?subject=${selectedSubject}`),
          axios.get(`/api/public/education/scholarships?category=${selectedScholarshipCategory}&search=${scholarshipSearch}`)
        ]);
        if (quizRes.data.success) setQuizzes(quizRes.data.quizzes || []);
        if (scholRes.data.success) setScholarships(scholRes.data.scholarships || []);
      } catch (err) {
        console.error('Error fetching education data:', err);
      } finally {
        setLoadingEdu(false);
      }
    };
    fetchEduData();
  }, [selectedSubject, selectedScholarshipCategory, scholarshipSearch]);

  // Fetch Healthcare Data
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoadingHealth(true);
        const [campRes, phcRes] = await Promise.all([
          axios.get(`/api/public/health/camps?campType=${selectedCampType}`),
          axios.get('/api/public/health/phc-schedule')
        ]);
        if (campRes.data.success) setCamps(campRes.data.camps || []);
        if (phcRes.data.success) setPhcSchedule(phcRes.data);
      } catch (err) {
        console.error('Error fetching health data:', err);
      } finally {
        setLoadingHealth(false);
      }
    };
    fetchHealthData();
  }, [selectedCampType]);

  // Fetch Blood Donors Data
  const fetchDonors = async () => {
    try {
      setLoadingDonors(true);
      const res = await axios.get(`/api/public/health/blood-donors?bloodGroup=${selectedBloodGroup}`);
      if (res.data.success) setDonors(res.data.donors || []);
    } catch (err) {
      console.error('Error fetching blood donors:', err);
    } finally {
      setLoadingDonors(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedBloodGroup]);

  // Handle Quiz Option Selection
  const handleSelectOption = (quizId, optionIndex) => {
    if (revealedAnswers[quizId]) return; // already locked
    setSelectedAnswers(prev => ({ ...prev, [quizId]: optionIndex }));
    setRevealedAnswers(prev => ({ ...prev, [quizId]: true }));
  };

  // Calculate Quiz Score
  const score = Object.keys(revealedAnswers).reduce((acc, qId) => {
    const quiz = quizzes.find(q => q._id === qId);
    if (quiz && quiz.options[selectedAnswers[qId]]?.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  // Handle Blood Donor Form Submit
  const handleDonorRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (!donorForm.fullName.trim() || !donorForm.phone.trim()) {
      setRegisterError(language === 'ta' ? 'பெயர் மற்றும் தொலைபேசி எண் கட்டாயம்' : 'Name and phone number are required');
      return;
    }

    try {
      setIsSubmittingDonor(true);
      const res = await axios.post('/api/public/health/blood-donors/register', donorForm);
      if (res.data.success) {
        setRegisterSuccess(res.data.message);
        setDonorForm({
          fullName: '',
          bloodGroup: 'O+',
          ward: 'Ward 1 - நெசல் கிராம நத்தம்',
          phone: '',
          altPhone: '',
          age: 24,
          gender: 'Male',
          willingToTravelTo: 'வானூர், ஜிப்மர் புதுச்சேரி, திண்டிவனம்'
        });
        fetchDonors();
        setTimeout(() => {
          setShowRegisterModal(false);
          setRegisterSuccess('');
        }, 2500);
      }
    } catch (err) {
      setRegisterError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmittingDonor(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-emerald-700/50">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>{language === 'ta' ? 'நெசல் கிராம நல்வாழ்வு & இளைஞர் சேவை' : 'Nesal Youth & Health Initiative'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {language === 'ta' ? 'கல்வி, தேர்வுப் பயிற்சி & கிராம நல்வாழ்வு மையம்' : 'Education, Youth Careers & Rural Healthcare'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {language === 'ta'
              ? 'நெசல் கிராம இளைஞர்களுக்கான டிஎன்பிஎஸ்சி மாதிரித் தேர்வு, அரசு உதவித்தொகைகள், வானூர் அரசு மருத்துவமனை அட்டவணை மற்றும் நெசல் அவசர இரத்ததான தன்னார்வலர் பதிவேடு.'
              : 'TNPSC exam question bank, Tamil Nadu government scholarships, Vanur Taluk Hospital doctor schedule, and village emergency blood donor directory.'}
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
            <span className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>{quizzes.length} {language === 'ta' ? 'வினாடி வினாக்கள்' : 'Practice Questions'}</span>
            </span>
            <span className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Award className="w-4 h-4 text-emerald-300" />
              <span>{scholarships.length} {language === 'ta' ? 'முக்கிய உதவித்தொகைகள்' : 'Govt Scholarships'}</span>
            </span>
            <span className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Droplets className="w-4 h-4 text-rose-400" />
              <span>{donors.length} {language === 'ta' ? 'இரத்ததான தன்னார்வலர்கள்' : 'Registered Donors'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm">
        <button
          onClick={() => setActiveMainTab('education')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition ${
            activeMainTab === 'education'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          <span>{language === 'ta' ? 'கல்வி & இளைஞர் வழிகாட்டி' : 'Education & Youth'}</span>
        </button>

        <button
          onClick={() => setActiveMainTab('healthcare')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition ${
            activeMainTab === 'healthcare'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HeartPulse className="w-5 h-5" />
          <span>{language === 'ta' ? 'மருத்துவம் & முகாம்கள்' : 'Healthcare & Camps'}</span>
        </button>

        <button
          onClick={() => setActiveMainTab('blood')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition ${
            activeMainTab === 'blood'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Droplets className="w-5 h-5" />
          <span>{language === 'ta' ? 'இரத்ததான வங்கி' : 'Blood Donors'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EDUCATION & YOUTH CAREERS */}
      {/* ========================================================================= */}
      {activeMainTab === 'education' && (
        <div className="space-y-6">
          {/* Sub Navigation */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex space-x-2">
              <button
                onClick={() => setEduSubTab('quiz')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 ${
                  eduSubTab === 'quiz'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ta' ? 'தினசரி தேர்வு மாதிரி (TNPSC Quiz)' : 'Daily Practice Quiz'}</span>
              </button>
              <button
                onClick={() => setEduSubTab('scholarships')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 ${
                  eduSubTab === 'scholarships'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Award className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ta' ? 'அரசு உதவித்தொகை & 7.5% ஒதுக்கீடு' : 'Scholarships & 7.5% Quota'}</span>
              </button>
            </div>

            {eduSubTab === 'quiz' && Object.keys(revealedAnswers).length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1">
                <span>{language === 'ta' ? 'மதிப்பெண்:' : 'Score:'}</span>
                <span className="text-emerald-700 font-black text-sm">{score} / {quizzes.length}</span>
              </div>
            )}
          </div>

          {/* QUIZ SUB-VIEW */}
          {eduSubTab === 'quiz' && (
            <div className="space-y-6">
              {/* Subject Filter */}
              <div className="flex flex-wrap gap-2 items-center text-xs">
                <span className="font-bold text-slate-600">{language === 'ta' ? 'பாடம்:' : 'Subject:'}</span>
                {['All', 'General Studies', 'General Tamil', 'Aptitude & Mental Ability', 'Current Affairs'].map(sub => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-3 py-1 rounded-full font-semibold transition ${
                      selectedSubject === sub
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sub === 'All' ? (language === 'ta' ? 'அனைத்துப் பாடங்கள்' : 'All Subjects') : sub}
                  </button>
                ))}
              </div>

              {loadingEdu ? (
                <div className="flex justify-center items-center py-12">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>
              ) : quizzes.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
                  {language === 'ta' ? 'வினாடி வினா வினாக்கள் எதுவும் இல்லை.' : 'No practice questions found.'}
                </div>
              ) : (
                <div className="space-y-5">
                  {quizzes.map((quiz, qIndex) => {
                    const isRevealed = Boolean(revealedAnswers[quiz._id]);
                    const userSelectedIdx = selectedAnswers[quiz._id];

                    return (
                      <div
                        key={quiz._id}
                        className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 hover:border-emerald-300 transition"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-md border border-emerald-100">
                            வினா #{qIndex + 1} • {quiz.examCategory}
                          </span>
                          <span className="text-slate-400 font-medium">{quiz.subject}</span>
                        </div>

                        {/* Question Text */}
                        <div className="text-base sm:text-lg font-bold text-slate-900">
                          {quiz.questionTamil}
                          {quiz.questionEnglish && (
                            <div className="text-xs sm:text-sm font-normal text-slate-500 mt-1">
                              {quiz.questionEnglish}
                            </div>
                          )}
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {quiz.options.map((opt, optIdx) => {
                            let btnStyle = 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-slate-800';

                            if (isRevealed) {
                              if (opt.isCorrect) {
                                btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                              } else if (userSelectedIdx === optIdx && !opt.isCorrect) {
                                btnStyle = 'bg-rose-500 text-white border-rose-600 font-bold';
                              } else {
                                btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectOption(quiz._id, optIdx)}
                                disabled={isRevealed}
                                className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt.textTamil}</span>
                                {isRevealed && opt.isCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-2" />
                                )}
                                {isRevealed && userSelectedIdx === optIdx && !opt.isCorrect && (
                                  <XCircle className="w-4 h-4 text-white shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Tamil Explanation Reveal */}
                        {isRevealed && quiz.explanationTamil && (
                          <div className="mt-3 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                            <div className="font-bold flex items-center space-x-1.5 text-emerald-800">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{language === 'ta' ? 'விளக்கம் (Explanation):' : 'Explanation:'}</span>
                            </div>
                            <p className="leading-relaxed">{quiz.explanationTamil}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SCHOLARSHIPS SUB-VIEW */}
          {eduSubTab === 'scholarships' && (
            <div className="space-y-6">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder={language === 'ta' ? 'உதவித்தொகை பெயர் அல்லது தகுதி தேடுக...' : 'Search scholarships...'}
                    value={scholarshipSearch}
                    onChange={(e) => setScholarshipSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
                  />
                </div>
                <div className="flex gap-2 items-center overflow-x-auto pb-1 text-xs">
                  {['All', 'College / Higher Education', 'Special Quota', 'Welfare Assistance'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedScholarshipCategory(cat)}
                      className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition ${
                        selectedScholarshipCategory === cat
                          ? 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat === 'All' ? (language === 'ta' ? 'அனைத்து திட்டங்கள்' : 'All Schemes') : cat}
                    </button>
                  ))}
                </div>
              </div>

              {loadingEdu ? (
                <div className="flex justify-center items-center py-12">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>
              ) : scholarships.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
                  {language === 'ta' ? 'உதவித்தொகை விபரங்கள் எதுவும் கிடைக்கவில்லை.' : 'No scholarship schemes found.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {scholarships.map(scheme => (
                    <div
                      key={scheme._id}
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 hover:border-emerald-400 transition flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full text-xs">
                            {scheme.category}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {scheme.deadlineOrSchedule}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                          {scheme.titleTamil}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{scheme.titleEnglish}</p>

                        {/* Financial benefit badge */}
                        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs font-bold flex items-center space-x-2">
                          <Award className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{scheme.financialAssistance}</span>
                        </div>

                        {/* Eligibility */}
                        <div className="space-y-1 text-xs">
                          <div className="font-bold text-slate-700">{language === 'ta' ? 'யாரெல்லாம் விண்ணப்பிக்கலாம்?' : 'Eligibility:'}</div>
                          <p className="text-slate-600 leading-relaxed">{scheme.eligibilityTamil}</p>
                        </div>

                        {/* Documents Checklist */}
                        {scheme.documentsRequired && scheme.documentsRequired.length > 0 && (
                          <div className="space-y-1.5 text-xs pt-1">
                            <div className="font-bold text-slate-700">{language === 'ta' ? 'தேவையான ஆவணங்கள்:' : 'Documents Required:'}</div>
                            <ul className="space-y-1 text-slate-600">
                              {scheme.documentsRequired.map((doc, i) => (
                                <li key={i} className="flex items-start space-x-1.5">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{doc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-500 truncate">{scheme.contactDepartment}</span>
                        {scheme.officialPortalUrl && (
                          <a
                            href={scheme.officialPortalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-sm transition shrink-0"
                          >
                            <span>{language === 'ta' ? 'அதிகாரப்பூர்வ தளம்' : 'Apply Portal'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HEALTHCARE & MEDICAL CAMPS */}
      {/* ========================================================================= */}
      {activeMainTab === 'healthcare' && (
        <div className="space-y-6">
          {/* Emergency 24x7 Quick Call Banner */}
          <div className="bg-gradient-to-r from-rose-900 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-rose-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>24x7 அவசர மருத்துவ உதவி எண்கள் (Emergency Helpline)</span>
              </div>
              <h2 className="text-lg font-black">வானூர் & நெசல் கிராம அவசர உதவி எண்கள்</h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <a
                href="tel:108"
                className="bg-rose-600 hover:bg-rose-500 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>108 ஆம்புலன்ஸ்</span>
              </a>
              <a
                href="tel:102"
                className="bg-slate-800 hover:bg-slate-700 text-rose-200 border border-rose-700/60 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition"
              >
                <span>102 தாய்-சேய் வாகனம்</span>
              </a>
              <a
                href="tel:04132677222"
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition"
              >
                <span>வானூர் அரசு மருத்துவமனை (0413-2677222)</span>
              </a>
            </div>
          </div>

          {/* Vanur Block Primary Health Center Schedule */}
          {phcSchedule && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-teal-700">Taluk Hospital Timetable</div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-teal-600" />
                    <span>{phcSchedule.hospitalNameTamil}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{phcSchedule.location}</p>
                </div>
                <div className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200 self-start sm:self-auto">
                  📞 {phcSchedule.phone}
                </div>
              </div>

              {/* Weekly Schedule Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {phcSchedule.weeklySchedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-teal-300 transition"
                  >
                    <div className="text-xs font-bold text-teal-900 flex items-center justify-between">
                      <span>{item.day}</span>
                      <span className="text-[10px] text-teal-700 font-semibold bg-teal-100/60 px-2 py-0.5 rounded-full">
                        {item.doctorRole}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-800 leading-snug">{item.serviceTamil}</div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.timing}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Village Health Nurse (VHN) Banner */}
              {phcSchedule.villageHealthNurse && (
                <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center space-x-1.5">
                      <Stethoscope className="w-4 h-4 text-emerald-600" />
                      <span>{phcSchedule.villageHealthNurse.ward}</span>
                    </div>
                    <p className="text-slate-700">{phcSchedule.villageHealthNurse.nurseName} • {phcSchedule.villageHealthNurse.duties}</p>
                  </div>
                  <a
                    href={`tel:${phcSchedule.villageHealthNurse.contactPhone.replace(/\s+/g, '')}`}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm transition whitespace-nowrap"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{phcSchedule.villageHealthNurse.contactPhone}</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Upcoming Medical & Veterinary Camps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>{language === 'ta' ? 'வரவிருக்கும் இலவச சிறப்பு மருத்துவ முகாம்கள்' : 'Upcoming Free Medical Camps'}</span>
              </h3>
              <div className="flex gap-1.5 text-xs">
                {['All', 'Eye Camp', 'Vaccination / Polio', 'Veterinary / Livestock'].map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedCampType(type)}
                    className={`px-3 py-1 rounded-full font-medium transition ${
                      selectedCampType === type
                        ? 'bg-teal-700 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type === 'All' ? (language === 'ta' ? 'அனைத்து முகாம்கள்' : 'All') : type}
                  </button>
                ))}
              </div>
            </div>

            {loadingHealth ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
              </div>
            ) : camps.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
                {language === 'ta' ? 'தற்போது புதிய மருத்துவ முகாம்கள் எதுவும் இல்லை.' : 'No upcoming camps scheduled.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {camps.map(camp => (
                  <div
                    key={camp._id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3.5 hover:border-teal-400 transition flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="bg-teal-100 text-teal-900 font-bold px-2.5 py-0.5 rounded-full">
                          {camp.campType}
                        </span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {camp.fee}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-slate-900 leading-snug">
                        {camp.titleTamil}
                      </h4>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-start space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span className="font-medium text-slate-800">{camp.locationVenue}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{camp.timing}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-bold text-teal-800">
                            {new Date(camp.campDate).toLocaleDateString('ta-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Services bullet list */}
                      {camp.servicesOffered && camp.servicesOffered.length > 0 && (
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                          <div className="font-bold text-slate-700">{language === 'ta' ? 'வழங்கப்படும் சேவைகள்:' : 'Services:'}</div>
                          <ul className="space-y-1 text-slate-600 text-[11px]">
                            {camp.servicesOffered.map((srv, idx) => (
                              <li key={idx} className="flex items-start space-x-1">
                                <span className="text-teal-600 font-black">•</span>
                                <span>{srv}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium truncate max-w-[160px]">{camp.organizer}</span>
                      <a
                        href={`tel:${camp.contactPhone}`}
                        className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 transition shadow-sm"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{language === 'ta' ? 'தொடர்புக்கு' : 'Call'}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: EMERGENCY BLOOD DONORS DIRECTORY */}
      {/* ========================================================================= */}
      {activeMainTab === 'blood' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center space-x-1.5 text-rose-800 font-bold text-xs uppercase tracking-wider">
                <Droplets className="w-4 h-4 text-rose-600" />
                <span>நெசல் அவசர இரத்ததான தன்னார்வலர் பதிவேடு</span>
              </div>
              <h3 className="text-xl font-black text-rose-950">
                {language === 'ta' ? 'அவசர கால உயிர்காக்கும் இரத்ததான உதவி' : 'Emergency Blood Donor Lifeline'}
              </h3>
              <p className="text-xs text-rose-900/80 max-w-xl">
                நெசல், வானூர் மற்றும் அருகிலுள்ள அரசு மருத்துவமனைகள் (ஜிப்மர் புதுச்சேரி, விழுப்புரம் GH) அவசரத் தேவைக்கு உடனடியாக அழைக்கவும்.
              </p>
            </div>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="bg-rose-600 hover:bg-rose-500 text-white font-black px-5 py-3 rounded-2xl shadow-lg transition flex items-center space-x-2 text-xs sm:text-sm whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>{language === 'ta' ? '➕ தன்னார்வலராக இணைய' : '➕ Register as Donor'}</span>
            </button>
          </div>

          {/* Blood Group Filter Pill Bar */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-600">{language === 'ta' ? 'இரத்த வகை வாரியாக தேர்வு செய்க:' : 'Filter by Blood Group:'}</div>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              {['All', 'A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(grp => (
                <button
                  key={grp}
                  onClick={() => setSelectedBloodGroup(grp)}
                  className={`px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                    selectedBloodGroup === grp
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-300'
                  }`}
                >
                  <Droplets className={`w-3.5 h-3.5 ${selectedBloodGroup === grp ? 'text-white' : 'text-rose-600'}`} />
                  <span>{grp === 'All' ? (language === 'ta' ? 'அனைத்து வகைகள்' : 'All Groups') : grp}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Donors List */}
          {loadingDonors ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="w-8 h-8 text-rose-600 animate-spin" />
            </div>
          ) : donors.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
              {language === 'ta' ? 'இந்த இரத்த வகையில் தற்போது தன்னார்வலர்கள் பதிவு செய்யப்படவில்லை.' : 'No donors registered for this blood group.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {donors.map(donor => (
                <div
                  key={donor._id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 hover:border-rose-300 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-rose-600 text-white font-black text-sm px-3 py-1 rounded-xl shadow-sm">
                        {donor.bloodGroup}
                      </span>
                      <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{language === 'ta' ? 'தயார் நிலை' : 'Available'}</span>
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900">{donor.fullName}</h4>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-start space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{donor.ward}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {language === 'ta' ? 'பயணிக்க விரும்பும் இடங்கள்:' : 'Willing to travel:'} {donor.willingToTravelTo}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-700">{donor.phone}</span>
                    <a
                      href={`tel:${donor.phone}`}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'அழைக்க' : 'Call'}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VOLUNTEER DONOR REGISTRATION MODAL */}
      {/* ========================================================================= */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-rose-600">
                <Droplets className="w-5 h-5" />
                <h3 className="font-black text-lg text-slate-900">
                  {language === 'ta' ? 'இரத்ததான தன்னார்வலராக பதிவு' : 'Register as Blood Donor'}
                </h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {registerSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{registerSuccess}</span>
              </div>
            )}

            {registerError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{registerError}</span>
              </div>
            )}

            <form onSubmit={handleDonorRegister} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'முழு பெயர் *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'ta' ? 'எ.கா: வி. செந்தில்குமார்' : 'e.g. Senthilkumar V'}
                  value={donorForm.fullName}
                  onChange={(e) => setDonorForm({ ...donorForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'இரத்த வகை *' : 'Blood Group *'}
                  </label>
                  <select
                    value={donorForm.bloodGroup}
                    onChange={(e) => setDonorForm({ ...donorForm, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold text-rose-700"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'வயது' : 'Age'}
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    value={donorForm.age}
                    onChange={(e) => setDonorForm({ ...donorForm, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'நெசல் வார்டு / பகுதி' : 'Ward / Street in Nesal'}
                </label>
                <select
                  value={donorForm.ward}
                  onChange={(e) => setDonorForm({ ...donorForm, ward: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Ward 1 - நெசல் கிராம நத்தம் & பிள்ளையார் கோவில் தெரு">Ward 1 - நெசல் கிராம நத்தம்</option>
                  <option value="Ward 2 - நெசல் காலனி & மேட்டுத் தெரு">Ward 2 - நெசல் காலனி</option>
                  <option value="Ward 3 - நெசல் ஏரிக்கரை">Ward 3 - நெசல் ஏரிக்கரை</option>
                  <option value="Ward 4 - நெசல் - வானூர் பிரதான சாலை">Ward 4 - நெசல் - வானூர் மெயின் ரோடு</option>
                  <option value="Ward 5 - வானூர் வட்டார மையம்">Ward 5 - வானூர் மையம்</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'கைபேசி எண் (WhatsApp) *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="98425XXXXX"
                    value={donorForm.phone}
                    onChange={(e) => setDonorForm({ ...donorForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'மாற்று எண்' : 'Alt Phone'}
                  </label>
                  <input
                    type="tel"
                    placeholder="Optional"
                    value={donorForm.altPhone}
                    onChange={(e) => setDonorForm({ ...donorForm, altPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'அவசரத்திற்கு பயணிக்கக்கூடிய இடங்கள்' : 'Willing to travel to'}
                </label>
                <input
                  type="text"
                  value={donorForm.willingToTravelTo}
                  onChange={(e) => setDonorForm({ ...donorForm, willingToTravelTo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDonor}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md transition flex items-center space-x-1.5"
                >
                  {isSubmittingDonor ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <HeartPulse className="w-4 h-4" />
                  )}
                  <span>{language === 'ta' ? 'பதிவு செய்க' : 'Save Details'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
