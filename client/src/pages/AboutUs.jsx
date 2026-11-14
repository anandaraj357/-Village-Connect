import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import {
  Wheat,
  Landmark,
  Users,
  Compass,
  Sparkles,
  Share2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Store,
  Scroll,
  Heart
} from 'lucide-react';

export const AboutUs = ({ setCurrentView }) => {
  const { language } = useNotifications();

  const handleShareHistory = () => {
    const text = `🌾 *நெசல் கிராமத்தின் வரலாறு (NESAL VILLAGE HISTORY)*\n` +
      `நம் மண் | நம் மக்கள் | நம் பாரம்பரியம்\n` +
      `📍 வானூர் வட்டம், விழுப்புரம் மாவட்டம் - 605014\n\n` +
      `நெசல் கிராமத்தின் பாரம்பரியம், விவசாயம், கோவில் வரலாறு மற்றும் எதிர்கால தொலைநோக்கு பற்றிய முழுமையான வரலாற்றுப் பதிவு.\n\n` +
      `🔗 ${window.location.origin}/?tab=about`;

    if (navigator.share) {
      navigator.share({
        title: 'நெசல் கிராமத்தின் வரலாறு',
        text: text,
        url: window.location.href
      }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-700/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center space-x-2 bg-emerald-700/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>வானூர் வட்டம் • விழுப்புரம் மாவட்டம் • அஞ்சல் குறியீடு: 605014</span>
            </div>

            <button
              onClick={handleShareHistory}
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-sm"
              title="வாட்ஸ்அப்பில் பகிருங்கள்"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'வரலாற்றைப் பகிர்க' : 'Share History'}</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            நெசல் கிராமத்தின் வரலாறு
          </h1>
          <p className="text-lg sm:text-xl font-medium text-emerald-200 tracking-wide mb-6">
            நம் மண் | நம் மக்கள் | நம் பாரம்பரியம்
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-700/60 text-xs sm:text-sm text-emerald-100/90 font-medium">
            <span className="bg-emerald-800/80 px-2.5 py-1 rounded-md">1. அறிமுகம்</span>
            <span>•</span>
            <span className="bg-emerald-800/80 px-2.5 py-1 rounded-md">2. பெயரின் பின்னணி</span>
            <span>•</span>
            <span className="bg-emerald-800/80 px-2.5 py-1 rounded-md">3. விவசாயம்</span>
            <span>•</span>
            <span className="bg-emerald-800/80 px-2.5 py-1 rounded-md">4. கோவில் மரபு</span>
            <span>•</span>
            <span className="bg-emerald-800/80 px-2.5 py-1 rounded-md">5. சமூக ஒற்றுமை</span>
            <span>•</span>
            <span className="bg-emerald-800/80 px-2.5 py-1 rounded-md">6. எதிர்கால வளர்ச்சி</span>
            <span>•</span>
            <span className="bg-emerald-800/80 px-2.5 py-1 rounded-md">7. நிறைவுரை</span>
          </div>
        </div>
      </div>

      {/* Section 1: அறிமுகம் */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
            1
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              அறிமுகம்
            </h2>
            <p className="text-xs text-slate-500 font-medium">Introduction & Essence of Nesal</p>
          </div>
        </div>

        <div className="space-y-4 text-slate-700 leading-relaxed text-base sm:text-lg">
          <p>
            தமிழ்நாட்டின் விழுப்புரம் மாவட்டத்தில், வானூர் வட்டத்தில் அமைந்துள்ள அழகிய கிராமம் <span className="font-bold text-emerald-800">நெசல்</span>. இயற்கை வளம், விவசாயம், பாரம்பரிய வாழ்க்கை முறை மற்றும் கிராமிய கலாச்சாரம் ஆகியவற்றுடன் தொடர்புடைய இக்கிராமம், அதன் மக்களின் உழைப்பாலும் ஒற்றுமையாலும் தனித்துவம் பெற்றுள்ளது.
          </p>
          <div className="bg-emerald-50/70 border-l-4 border-emerald-600 p-4 rounded-r-xl">
            <p className="font-semibold text-emerald-950 italic">
              "நெசல் என்பது வெறும் நிலப்பரப்பின் பெயர் மட்டுமல்ல; பல தலைமுறைகளாக வாழ்ந்து வந்த மக்களின் வாழ்க்கை, உழைப்பு, உறவுகள் மற்றும் நினைவுகளின் அடையாளமாகும்."
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: கிராமத்தின் பெயரின் பின்னணி */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-lg">
            2
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              கிராமத்தின் பெயரின் பின்னணி
            </h2>
            <p className="text-xs text-slate-500 font-medium">Origin and Background of the Name 'Nesal'</p>
          </div>
        </div>

        <div className="space-y-4 text-slate-700 leading-relaxed text-base sm:text-lg">
          <p>
            நெசல் என்ற பெயர் எவ்வாறு உருவானது என்பது குறித்த உறுதியான வரலாற்றுத் தகவல்கள் இதுவரை கிடைக்கவில்லை. இந்தப் பெயரின் தோற்றம் குறித்து உள்ளூர் பெரியவர்கள், முன்னோர்கள் மற்றும் பழைய ஆவணங்கள் மூலம் தகவல்களைச் சேகரிப்பது அவசியமாகும்.
          </p>
          <p>
            கிராமத்தின் பெயருக்குப் பின்னால் ஏதேனும் வரலாற்றுச் சம்பவம், பாரம்பரியத் தொடர்பு அல்லது பழமையான பெயர் மாற்றம் இருக்கிறதா என்பதை எதிர்காலத்தில் ஆராயலாம்.
          </p>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3 text-amber-900 text-sm">
            <Scroll className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">வரலாற்று ஆவணப்படுத்துதல் அழைப்பு:</span> நெசல் கிராமத்தின் பழமையான ஆவணங்கள், செப்பேடுகள் அல்லது முன்னோர்களின் வாய்மொழித் தகவல்கள் உள்ள பெரியவர்கள் கிராம பஞ்சாயத்து நிர்வாகத்தை தொடர்பு கொண்டு பதிவு செய்யலாம்.
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: விவசாயம் – கிராமத்தின் பாரம்பரிய அடையாளம் */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg">
            3
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span>விவசாயம் – கிராமத்தின் பாரம்பரிய அடையாளம்</span>
              <Wheat className="w-6 h-6 text-amber-600 hidden sm:inline" />
            </h2>
            <p className="text-xs text-slate-500 font-medium">Agriculture - The Heritage Backbone of Nesal</p>
          </div>
        </div>

        <div className="space-y-4 text-slate-700 leading-relaxed text-base sm:text-lg">
          <p>
            விவசாயம் நெசல் கிராமத்தின் முக்கியமான பாரம்பரியத் தொழிலாகும். விவசாயத்தை அடிப்படையாகக் கொண்டு பல குடும்பங்கள் தங்களது வாழ்வாதாரத்தை அமைத்துக் கொண்டுள்ளன.
          </p>
          <p>
            மண்ணை நம்பி உழைக்கும் விவசாயிகளின் அர்ப்பணிப்பும், இயற்கையுடன் இணைந்த வாழ்க்கை முறையும் நம் கிராமத்தின் அடையாளங்களாக விளங்குகின்றன.
          </p>
          <div className="bg-amber-50/70 border-l-4 border-amber-500 p-4 rounded-r-xl">
            <p className="font-semibold text-amber-950">
              "விவசாயம் என்பது ஒரு தொழில் மட்டுமல்ல; அது நம் முன்னோர்கள் நமக்கு விட்டுச் சென்ற பாரம்பரியமும் வாழ்வியல் பண்பாடும் ஆகும்."
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: கோவில் பாரம்பரியம் மற்றும் ஆன்மீகப் பண்பாடு */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black text-lg">
            4
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span>கோவில் பாரம்பரியம் மற்றும் ஆன்மீகப் பண்பாடு</span>
              <Landmark className="w-5 h-5 text-rose-600" />
            </h2>
            <p className="text-xs text-slate-500 font-medium">Temple Heritage and Spiritual Culture</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* மாரியம்மன் கோவில் தெரு */}
          <div className="bg-gradient-to-b from-rose-50/60 to-white p-5 rounded-2xl border border-rose-100">
            <div className="flex items-center space-x-2 text-rose-800 font-bold text-lg mb-2">
              <span>🛕</span>
              <h3>மாரியம்மன் கோவில் தெரு</h3>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              மாரியம்மன் வழிபாடு தமிழக கிராமிய ஆன்மீக மரபில் முக்கியமான இடத்தைப் பெற்றுள்ளது. நெசல் கிராமத்தின் மாரியம்மன் கோவில் தெருவும் கிராமத்தின் ஆன்மீக அடையாளங்களில் ஒன்றாகும்.
            </p>
          </div>

          {/* திரௌபதி அம்மன் கோவில் */}
          <div className="bg-gradient-to-b from-purple-50/60 to-white p-5 rounded-2xl border border-purple-100">
            <div className="flex items-center space-x-2 text-purple-900 font-bold text-lg mb-2">
              <span>🛕</span>
              <h3>திரௌபதி அம்மன் கோவில்</h3>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              திரௌபதி அம்மன் வழிபாடு தமிழகத்தின் பல கிராமங்களில் பாரம்பரியமாகப் பின்பற்றப்படுகிறது. மகாபாரத மரபுடன் தொடர்புடைய இவ்வழிபாடு, கிராமியக் கலாச்சாரத்தின் ஒரு பகுதியாக விளங்குகிறது.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700 text-sm leading-relaxed">
          <p>
            இந்தக் கோவில்களின் கட்டப்பட்ட காலம், திருவிழாக்கள் மற்றும் அவற்றுடன் தொடர்புடைய பழக்கவழக்கங்கள் குறித்த கூடுதல் தகவல்கள் கிடைத்தால் நெசல் கிராமத்தின் ஆன்மீக வரலாற்றை மேலும் விரிவுபடுத்த முடியும்.
          </p>
        </div>
      </section>

      {/* Section 5: கிராமிய வாழ்க்கையும் சமூக ஒற்றுமையும் */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-lg">
            5
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span>கிராமிய வாழ்க்கையும் சமூக ஒற்றுமையும்</span>
              <Users className="w-5 h-5 text-blue-600" />
            </h2>
            <p className="text-xs text-slate-500 font-medium">Village Life and Social Harmony</p>
          </div>
        </div>

        <div className="space-y-4 text-slate-700 leading-relaxed text-base sm:text-lg">
          <p>
            நெசல் கிராமத்தின் சமூக வாழ்க்கை அதன் மக்களின் உறவுகள், பரஸ்பர உதவி மற்றும் பாரம்பரிய வாழ்க்கை முறையை அடிப்படையாகக் கொண்டது.
          </p>
          <p>
            கிராமத்தில் பிறந்து வளர்ந்தவர்கள் கல்வி, வேலைவாய்ப்பு மற்றும் தொழில் நிமித்தமாக பல்வேறு இடங்களுக்குச் சென்றிருந்தாலும், தங்கள் சொந்த ஊரின் மீதான பாசத்தையும் பற்றையும் தொடர்ந்து கொண்டுள்ளனர்.
          </p>
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/70 flex items-center space-x-3 text-blue-900 font-medium text-sm">
            <Heart className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <span>எங்கு வாழ்ந்தாலும் நெசல் கிராமத்து உறவுகளும் நினைவுகளும் நம்மை இணைத்து வைக்கின்றன.</span>
          </div>
        </div>
      </section>

      {/* Section 6: நெசல் கிராமத்தின் எதிர்கால வளர்ச்சி */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
            6
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span>நெசல் கிராமத்தின் எதிர்கால வளர்ச்சி</span>
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </h2>
            <p className="text-xs text-slate-500 font-medium">Future Vision and Sustainable Progress</p>
          </div>
        </div>

        <p className="text-slate-700 leading-relaxed text-base sm:text-lg mb-6">
          நம் கிராமத்தின் பாரம்பரியத்தைக் காப்பதோடு, நவீன தொழில்நுட்பத்தின் உதவியுடன் கிராமத்தை முன்னேற்றுவது அவசியமாகும்.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition">
            <Wheat className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">விவசாய வளர்ச்சி</h4>
              <p className="text-slate-600 text-xs sm:text-sm">விவசாய வளர்ச்சி மற்றும் விவசாயிகளுக்கான நவீன வழிகாட்டுதல் & தகவல்கள்.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition">
            <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">கல்வி & வேலைவாய்ப்பு</h4>
              <p className="text-slate-600 text-xs sm:text-sm">மாணவர்களுக்கான கல்வி மற்றும் தமிழ்நாடு அளவிலான வேலைவாய்ப்பு வழிகாட்டுதல்.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">அரசு நலத்திட்டங்கள்</h4>
              <p className="text-slate-600 text-xs sm:text-sm">அரசு நலத்திட்டங்கள் மற்றும் மானியங்கள் குறித்த நேரடி விழிப்புணர்வு.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition">
            <Store className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">உள்ளூர் வணிகம்</h4>
              <p className="text-slate-600 text-xs sm:text-sm">உள்ளூர் வணிகங்கள் மற்றும் கிராமப்புற தொழில் முனைவோருக்கு முழு ஆதரவு.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition">
            <Landmark className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">பாரம்பரிய ஆவணப்படுத்துதல்</h4>
              <p className="text-slate-600 text-xs sm:text-sm">கிராமத்தின் கோவில்கள் மற்றும் வரலாற்று இடங்களை ஆவணப்படுத்துதல்.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition">
            <Users className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">இளைஞர் ஒற்றுமை</h4>
              <p className="text-slate-600 text-xs sm:text-sm">கிராம மக்களின் ஒற்றுமை மற்றும் இளைஞர்களின் ஆக்கப்பூர்வ பங்களிப்பை அதிகரித்தல்.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: நிறைவுரை */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-8 sm:p-10 shadow-lg border border-emerald-600 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/80 px-3 py-1 rounded-full text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <span>7. நிறைவுரை</span>
          </div>

          <p className="text-base sm:text-lg text-emerald-100 leading-relaxed">
            நெசல் கிராமத்தின் வரலாறு என்பது அதன் மண்ணில் வாழ்ந்த முன்னோர்களின் உழைப்பையும், விவசாயத்தின் முக்கியத்துவத்தையும், கோவில் பாரம்பரியத்தையும், மக்களின் வாழ்க்கை முறையையும் உள்ளடக்கியதாகும்.
          </p>

          <p className="text-sm sm:text-base text-emerald-200 leading-relaxed font-medium">
            நம் முன்னோர்கள் நமக்குத் தந்த அடையாளத்தையும் பாரம்பரியத்தையும் பாதுகாத்து, அடுத்த தலைமுறைக்கு எடுத்துச் செல்வது நம் அனைவரின் பொறுப்பாகும்.
          </p>

          <div className="pt-4 border-t border-emerald-600/60">
            <h3 className="text-2xl sm:text-4xl font-black text-amber-300 tracking-tight drop-shadow-sm">
              நெசல் – நம் ஊர்! நம் பெருமை! நம் அடையாளம்!
            </h3>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                if (setCurrentView) setCurrentView('jobs');
              }}
              className="inline-flex items-center space-x-2 bg-white text-emerald-900 hover:bg-emerald-50 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition"
            >
              <span>வேலைவாய்ப்புகளைக் காண்க</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleShareHistory}
              className="inline-flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold border border-emerald-500/50 shadow-md transition"
            >
              <Share2 className="w-4 h-4" />
              <span>வாட்ஸ்அப்பில் பகிருங்கள்</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default AboutUs;
