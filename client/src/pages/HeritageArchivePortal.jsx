import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import {
  Archive,
  Image,
  FileText,
  Upload,
  Search,
  Filter,
  Heart,
  Share2,
  Calendar,
  User,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Maximize2,
  Download,
  Landmark,
  Wheat,
  Users,
  Scroll,
  Plus
} from 'lucide-react';

export const HeritageArchivePortal = () => {
  const { language } = useNotifications();

  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Lightbox View State
  const [activeItem, setActiveItem] = useState(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formTitleEnglish, setFormTitleEnglish] = useState('');
  const [formCategory, setFormCategory] = useState('Photo');
  const [formYearOrEra, setFormYearOrEra] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formContributorName, setFormContributorName] = useState('');
  const [formContributorPhone, setFormContributorPhone] = useState('');
  const [formContributorWard, setFormContributorWard] = useState('நெசல் கிராமம்');
  const [formFileUrl, setFormFileUrl] = useState('');
  const [formFileType, setFormFileType] = useState('image');
  const [filePreview, setFilePreview] = useState('');

  // Fetch Archives
  const fetchArchives = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      params.append('limit', '50');

      const res = await axios.get(`/api/public/heritage?${params.toString()}`);
      if (res.data.success) {
        setItems(res.data.items);
        setTotalCount(res.data.total);
      }
    } catch (err) {
      console.error('Failed to load heritage items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchArchives();
  };

  // Handle Local File Selection (Converts to Base64 data URL)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert(language === 'ta' ? 'கோப்பின் அளவு 8MB-க்கு குறைவாக இருக்க வேண்டும்.' : 'File size must be under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormFileUrl(reader.result);
      setFilePreview(reader.result);
      setFormFileType(file.type.startsWith('image') ? 'image' : 'document');
    };
    reader.readAsDataURL(file);
  };

  // Submit Upload Form
  const handleSubmitUpload = async (e) => {
    e.preventDefault();
    setUploadError('');

    if (!formTitle.trim()) {
      setUploadError(language === 'ta' ? 'தலைப்பு அவசியம்.' : 'Title is required.');
      return;
    }
    if (!formContributorName.trim()) {
      setUploadError(language === 'ta' ? 'உங்கள் பெயர் அவசியம்.' : 'Contributor name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: formTitle.trim(),
        titleEnglish: formTitleEnglish.trim(),
        category: formCategory,
        yearOrEra: formYearOrEra.trim() || 'பாரம்பரியம்',
        description: formDescription.trim(),
        contributorName: formContributorName.trim(),
        contributorPhone: formContributorPhone.trim(),
        contributorWard: formContributorWard.trim() || 'நெசல் கிராமம்',
        fileUrl: formFileUrl.trim(),
        fileType: formFileType
      };

      const res = await axios.post('/api/public/heritage/upload', payload);
      if (res.data.success) {
        setUploadSuccess(true);
        // Reset form
        setFormTitle('');
        setFormTitleEnglish('');
        setFormYearOrEra('');
        setFormDescription('');
        setFormFileUrl('');
        setFilePreview('');
        fetchArchives();
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like an archive post
  const handleLike = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`/api/public/heritage/${id}/like`);
      if (res.data.success) {
        setItems((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, likesCount: res.data.likesCount } : item
          )
        );
      }
    } catch (err) {
      console.warn('Like failed:', err.message);
    }
  };

  // WhatsApp Share helper
  const handleShare = (item, e) => {
    e.stopPropagation();
    const text = `🌾 *நெசல் வரலாற்றுப் பெட்டகம் (NESAL HERITAGE ARCHIVE)*\n` +
      `📜 *${item.title}*\n` +
      `🗓️ காலம்: ${item.yearOrEra}\n` +
      `👤 சமர்ப்பித்தவர்: ${item.contributorName} (${item.contributorWard || 'நெசல்'})\n\n` +
      `விளக்கம்: ${item.description ? item.description.slice(0, 160) + '...' : ''}\n\n` +
      `🔗 ${window.location.origin}/?tab=heritage`;

    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: text,
        url: window.location.href
      }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const categories = [
    { id: 'All', label: language === 'ta' ? 'அனைத்தும்' : 'All Archives', icon: Archive },
    { id: 'Photo', label: language === 'ta' ? 'புகைப்படங்கள்' : 'Photos', icon: Image },
    { id: 'Document', label: language === 'ta' ? 'வரலாற்று ஆவணங்கள்' : 'Documents', icon: FileText },
    { id: 'Temple', label: language === 'ta' ? 'கோவில் மரபு' : 'Temples', icon: Landmark },
    { id: 'Agriculture', label: language === 'ta' ? 'விவசாயம் & ஏரி' : 'Agriculture', icon: Wheat },
    { id: 'FamilyHistory', label: language === 'ta' ? 'முன்னோர் நினைவுகள்' : 'Family History', icon: Users }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white p-6 sm:p-10 shadow-2xl border border-amber-800/50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-yellow-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
              <Scroll className="w-3.5 h-3.5 text-amber-400" />
              <span>நெசல் வரலாற்றுப் பெட்டகம் • Nesal Heritage Archive</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 bg-stone-800/80 text-stone-300 text-xs font-semibold px-3 py-1 rounded-full border border-stone-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>வானூர் வட்டம், விழுப்புரம் மாவட்டம் - 605014</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-amber-100">
            நெசல் வரலாற்றுப் பெட்டகம்
          </h1>

          <p className="text-amber-200/90 text-sm sm:text-base leading-relaxed">
            கிராம மக்கள் தங்களிடம் உள்ள பழமையான புகைப்படங்கள், நிலப்பட்டா ஆவணங்கள், கோவில் வரலாற்றுச் சான்றுகள், முன்னோர்களின் நினைவுகள் மற்றும் கிராமிய பாரம்பரிய ஆவணங்களைப் பாதுகாத்து எதிர்கால தலைமுறைக்கு ஆவணப்படுத்தும் டிஜிட்டல் களஞ்சியம்.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black px-6 py-3 rounded-2xl shadow-xl transition flex items-center space-x-2 text-sm"
            >
              <Upload className="w-4 h-4 text-stone-950" />
              <span>➕ புகைப்படங்கள் & ஆவணங்கள் பதிவேற்றுக</span>
            </button>

            <div className="inline-flex items-center space-x-2 bg-stone-900/80 border border-stone-700 px-4 py-2 rounded-2xl text-xs font-semibold text-stone-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>மொத்த ஆவணப் பதிவுகள்: <strong className="text-white text-sm">{totalCount}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                    isActive
                      ? 'bg-amber-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-200' : 'text-slate-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ஆவணம் / புகைப்படம் தேட..."
              className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  fetchArchives();
                }}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Archives Grid */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 text-sm font-semibold">நெசல் வரலாற்றுப் பதிவுகள் ஏற்றப்படுகின்றன...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <Scroll className="w-12 h-12 text-amber-600 mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-slate-900">இன்னும் பதிவுகள் இல்லை</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            நெசல் கிராமத்தின் உங்கள் குடும்பத்தில் உள்ள பழைய புகைப்படங்கள் அல்லது வரலாற்று ஆவணங்களை முதலில் பதிவேற்றி ஆவணப்படுத்துங்கள்.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
          >
            ➕ முதல் ஆவணத்தைப் பதிவேற்றுக
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            return (
              <div
                key={item._id}
                onClick={() => setActiveItem(item)}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col group"
              >
                {/* Media Image / Preview */}
                <div className="relative h-48 bg-stone-100 overflow-hidden">
                  {item.fileUrl ? (
                    <img
                      src={item.fileUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 text-amber-800 p-4 text-center">
                      <Scroll className="w-12 h-12 text-amber-700/60 mb-2" />
                      <span className="text-xs font-bold">{item.category} ஆவணம்</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-amber-900/90 backdrop-blur-md text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                      {item.category === 'Photo' && '📷 புகைப்படம்'}
                      {item.category === 'Document' && '📜 ஆவணம்'}
                      {item.category === 'Temple' && '🛕 கோவில்'}
                      {item.category === 'Agriculture' && '🌾 விவசாயம்'}
                      {item.category === 'FamilyHistory' && '👨‍👩‍👧‍👦 நினைவுகள்'}
                    </span>
                    {item.yearOrEra && (
                      <span className="bg-stone-900/80 backdrop-blur-md text-stone-200 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                        🗓️ {item.yearOrEra}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveItem(item);
                      }}
                      className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-sm transition"
                      title="பெரிதாக்கிக் காண்க"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-amber-800 transition">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {/* Contributor badge */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-amber-700" />
                        <span className="font-semibold text-slate-700 truncate max-w-[130px]">
                          {item.contributorName}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {item.contributorWard || 'நெசல்'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={(e) => handleLike(item._id, e)}
                        className="inline-flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                        <span>{item.likesCount || 0}</span>
                      </button>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => handleShare(item, e)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition"
                          title="WhatsApp-ல் பகிர்க"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveItem(item)}
                          className="text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition"
                        >
                          முழு விவரம்
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-amber-900 text-white px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base sm:text-lg">
                  நெசல் வரலாற்றுப் பதிவு பதிவேற்றம்
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-full text-amber-200 hover:text-white hover:bg-amber-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitUpload} className="p-6 space-y-4">
              {uploadSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-emerald-900">வெற்றிகரமாக பதிவேற்றப்பட்டது!</h4>
                  <p className="text-xs text-emerald-700">
                    நெசல் வரலாற்றுப் பெட்டகத்தில் உங்கள் ஆவணம் சேர்க்கப்பட்டுள்ளது. மிக்க நன்றி!
                  </p>
                </div>
              ) : (
                <>
                  {uploadError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-500">
                    கிராம மக்கள் தங்களிடம் உள்ள பழைய புகைப்படங்கள், பட்டா ஆவணங்கள், கோவில் வரலாற்றுக் குறிப்புகள் மற்றும் முன்னோர்களின் படங்களைப் பாதுகாப்பாகப் பதிவேற்றலாம்.
                  </p>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ஆவணம் அல்லது புகைப்படத்தின் தலைப்பு *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="எ.கா: 1975 மாரியம்மன் கோவில் திருவிழா / பழைய நிலப்பட்டா"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Category & Era */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ஆவண வகை *
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="Photo">📷 பழைய புகைப்படம் (Photo)</option>
                        <option value="Document">📜 வரலாற்று ஆவணம் / பட்டா (Document)</option>
                        <option value="Temple">🛕 கோவில் வரலாறு / திருவிழா (Temple)</option>
                        <option value="Agriculture">🌾 விவசாயம் & ஏரிப்பாசனம் (Agriculture)</option>
                        <option value="FamilyHistory">👨‍👩‍👧‍👦 முன்னோர்கள் வாழ்வியல் (Family History)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ஆண்டு / காலம் (Era / Year)
                      </label>
                      <input
                        type="text"
                        value={formYearOrEra}
                        onChange={(e) => setFormYearOrEra(e.target.value)}
                        placeholder="எ.கா: 1970 - 1980 / 1964"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Contributor Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        சமர்ப்பித்தவர் பெயர் *
                      </label>
                      <input
                        type="text"
                        required
                        value={formContributorName}
                        onChange={(e) => setFormContributorName(e.target.value)}
                        placeholder="உங்கள் பெயர்"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        தொடர்பு தொலைபேசி / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formContributorPhone}
                        onChange={(e) => setFormContributorPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      நெசல் கிராமத் தெரு / பகுதி
                    </label>
                    <input
                      type="text"
                      value={formContributorWard}
                      onChange={(e) => setFormContributorWard(e.target.value)}
                      placeholder="எ.கா: மாரியம்மன் கோவில் தெரு / மேலத் தெரு"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* File Upload or Image URL */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      புகைப்படம் / ஆவணம் தேர்வு செய்க (அல்லது இணைய முகவரி)
                    </label>

                    <div className="border-2 border-dashed border-amber-300 bg-amber-50/50 hover:bg-amber-50 rounded-2xl p-4 text-center cursor-pointer transition">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-600 file:text-white hover:file:bg-amber-500 cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        JPEG, PNG அல்லது PDF வடிவம் (அதிகபட்சம் 8MB)
                      </p>
                    </div>

                    {filePreview && (
                      <div className="relative mt-2 rounded-xl overflow-hidden max-h-40 border border-slate-200">
                        <img
                          src={filePreview}
                          alt="Upload Preview"
                          className="w-full h-40 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormFileUrl('');
                            setFilePreview('');
                          }}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full text-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      வரலாற்று விளக்கம் (Historical Description)
                    </label>
                    <textarea
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="இந்த ஆவணம் அல்லது புகைப்படத்தின் வரலாற்றுப் பின்னணி, நிகழ்வுகள் அல்லது தொடர்புடைய நபர்கள் குறித்த தகவல்கள்..."
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black py-3 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>பதிவேற்றப்படுகிறது...</span>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>வரலாற்றுப் பெட்டகத்தில் சமர்ப்பிக்கவும்</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative bg-slate-900 text-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-amber-800/60 shadow-2xl">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {activeItem.fileUrl && (
              <div className="w-full max-h-96 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={activeItem.fileUrl}
                  alt={activeItem.title}
                  className="max-h-96 w-auto object-contain mx-auto"
                />
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-600 text-stone-950 font-black text-xs px-3 py-1 rounded-full">
                  {activeItem.category}
                </span>
                {activeItem.yearOrEra && (
                  <span className="bg-stone-800 text-amber-300 font-bold text-xs px-3 py-1 rounded-full border border-stone-700">
                    🗓️ {activeItem.yearOrEra}
                  </span>
                )}
                <span className="text-xs text-stone-400">
                  வானூர் வட்டம் • நெசல் கிராமம் (605014)
                </span>
              </div>

              <h2 className="text-2xl font-black text-white">
                {activeItem.title}
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {activeItem.description || 'வரலாற்று விளக்கம் விவரங்கள் ஆவணப்படுத்தப்பட்டுள்ளன.'}
              </p>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div className="space-y-1">
                  <div>சமர்ப்பித்தவர்: <strong className="text-white">{activeItem.contributorName}</strong></div>
                  <div>பகுதி: <span className="text-amber-300">{activeItem.contributorWard || 'நெசல் கிராமம்'}</span></div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleLike(activeItem._id, e)}
                    className="flex items-center space-x-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 px-3 py-1.5 rounded-xl font-bold transition"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                    <span>{activeItem.likesCount || 0} விருப்பங்கள்</span>
                  </button>

                  <button
                    onClick={(e) => handleShare(activeItem, e)}
                    className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl font-bold transition shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>பகிர்க (WhatsApp)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default HeritageArchivePortal;
