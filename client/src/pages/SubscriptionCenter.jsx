import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Check, Smartphone, Mail, Globe, Shield, Trash2 } from 'lucide-react';

const AVAILABLE_CATEGORIES = [
  'Government Jobs',
  'Private & IT Jobs',
  'Recruitment Alerts',
  'Village & Taluk News',
  'District Announcements',
  'Agriculture',
  'Education',
  'Government Schemes'
];

export const SubscriptionCenter = () => {
  const { language } = useNotifications();
  const [subscriptions, setSubscriptions] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCats, setSelectedCats] = useState(['Government Jobs', 'Agriculture']);
  const [inApp, setInApp] = useState(true);
  const [webPush, setWebPush] = useState(true);
  const [sms, setSms] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get('/api/subscriptions');
      if (res.data.success) {
        setSubscriptions(res.data.subscriptions);
      }
    } catch (err) {
      console.warn('Could not load subscriptions:', err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const toggleCategory = (cat) => {
    if (selectedCats.includes(cat)) {
      setSelectedCats(selectedCats.filter((c) => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        subscriberName: name || 'Nesal Resident',
        subscriberEmail: email,
        subscriberPhone: phone,
        categories: selectedCats.length > 0 ? selectedCats : ['All'],
        geographicFilter: {
          state: 'Tamil Nadu',
          district: 'Villupuram',
          mandal: 'Vanur',
          village: 'Nesal'
        },
        channels: { inApp, webPush, sms }
      };

      const res = await axios.post('/api/subscriptions', payload);
      if (res.data.success) {
        setSavedSuccess(true);
        fetchSubscriptions();
        setName('');
        setEmail('');
        setPhone('');
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      alert('Failed to register subscription: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/subscriptions/${id}`);
      fetchSubscriptions();
    } catch (err) {
      alert('Failed to delete subscription');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Category Alert Preferences</span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          {language === 'ta' ? 'நேசல் கிராம விழிப்பூட்டல் அமைப்புகள்' : 'Subscribe to Targeted Rural Alerts'}
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          {language === 'ta'
            ? 'நேசல் கிராமம், வானூர் வட்டம் மற்றும் விழுப்புரம் மாவட்டத்திற்கான வேலைவாய்ப்பு, வேளாண்மை மற்றும் அரசு நலத்திட்ட அறிவிப்புகளை உடனுக்குடன் பெற பதிவு செய்யுங்கள்.'
            : 'Select specific employment, agricultural or governance categories to receive instant notifications tailored for Nesal, Vanur, and Villupuram.'}
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center space-x-2 text-sm font-semibold">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>
            {language === 'ta'
              ? 'விழிப்பூட்டல் வெற்றிகரமாக பதிவு செய்யப்பட்டது! தேர்ந்தெடுக்கப்பட்ட பிரிவுகளுக்கான அறிவிப்புகள் அனுப்பப்படும்.'
              : 'Subscription saved successfully! You will receive verified alerts for your chosen categories.'}
          </span>
        </div>
      )}

      {/* Subscription Form */}
      <form onSubmit={handleSubscribe} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'ta' ? 'உங்கள் பெயர்' : 'Your Name'}</label>
            <input
              type="text"
              placeholder={language === 'ta' ? 'எ.கா. முத்துக்குமரன்' : 'e.g. Muthukumaran'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'ta' ? 'கைபேசி எண்' : 'Mobile Phone (for SMS/WhatsApp)'}</label>
            <input
              type="text"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'ta' ? 'மின்னஞ்சல் (விருப்பத்தேர்வு)' : 'Email Address (Optional)'}</label>
            <input
              type="email"
              placeholder="e.g. resident@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Categories selector */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800">
            {language === 'ta' ? 'அறிவிப்புகளைப் பெற விரும்பும் தலைப்புகளைத் தேர்ந்தெடுக்கவும்:' : 'Select Topics & Categories to Follow:'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {AVAILABLE_CATEGORIES.map((cat) => {
              const isChecked = selectedCats.includes(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition flex items-center justify-between ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat}</span>
                  {isChecked && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Channels */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800">
            {language === 'ta' ? 'அறிவிப்பு பெறும் முறைகள்:' : 'Preferred Delivery Channels:'}
          </label>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-700">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inApp}
                onChange={(e) => setInApp(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>In-App Notification Center</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={webPush}
                onChange={(e) => setWebPush(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Browser Web Push</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sms}
                onChange={(e) => setSms(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>SMS Alert / WhatsApp Message</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-md"
        >
          {language === 'ta' ? 'விழிப்பூட்டல் அமைப்புகளைச் சேமிக்க' : 'Save Notification Preferences'}
        </button>
      </form>

      {/* Current Subscriptions */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">{language === 'ta' ? 'செயலில் உள்ள சந்தாக்கள்' : 'Active Subscriptions on this Node'}</h3>
        {subscriptions.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            {language === 'ta' ? 'செயலில் உள்ள சந்தாக்கள் எதுவும் இல்லை.' : 'No active subscriptions yet. Fill out the form above to register.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subscriptions.map((sub) => (
              <div key={sub._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start">
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-900 text-sm">{sub.subscriberName}</div>
                  <div className="text-xs text-slate-500">{sub.subscriberPhone || sub.subscriberEmail || 'Web device subscriber'}</div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    {sub.geographicFilter?.village || 'Nesal'}, {sub.geographicFilter?.mandal || 'Vanur'}, {sub.geographicFilter?.district || 'Villupuram'}
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {sub.categories?.map((c, i) => (
                      <span key={i} className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(sub._id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Remove Subscription"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
