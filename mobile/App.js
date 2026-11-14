import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Linking,
  Alert,
  TextInput
} from 'react-native';
import * as Location from 'expo-location';
import { apiClient } from './src/services/api';

const NESAL_COORDINATES = {
  lat: 12.0125,
  lng: 79.7214
};

const EMERGENCY_CONTACTS = [
  { name: 'காவல் (Police)', phone: '0413-2677333', shortCode: '100' },
  { name: 'தீயணைப்பு (Fire)', phone: '0413-2677101', shortCode: '101' },
  { name: 'மருத்துவமனை (GH)', phone: '0413-2677222', shortCode: '108' },
  { name: 'நெசல் VAO', phone: '04146-240102', shortCode: '1100' },
  { name: 'மின்சாரம் (TNEB)', phone: '9498794987', shortCode: '1912' },
  { name: 'ஆட்சியரகம்', phone: '04146-222135', shortCode: '1077' }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [language, setLanguage] = useState('ta'); // 'ta' for Tamil, 'en' for English
  const [isLocating, setIsLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [recruitments, setRecruitments] = useState([]);
  const [news, setNews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Mobile Job Posting State
  const [postTitle, setPostTitle] = useState('');
  const [postOrg, setPostOrg] = useState('');
  const [postCategory, setPostCategory] = useState('Private');
  const [postDistrict, setPostDistrict] = useState('Villupuram');
  const [postPhone, setPostPhone] = useState('');
  const [postSalary, setPostSalary] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Handle direct job posting from mobile
  const handleMobileJobPost = async () => {
    if (!postTitle.trim() || !postOrg.trim() || !postPhone.trim()) {
      Alert.alert(language === 'ta' ? 'கட்டாய விவரம்' : 'Required Fields', language === 'ta' ? 'பணி பெயர், நிறுவனம் மற்றும் தொலைபேசி எண் தேவை.' : 'Please enter Job Title, Organization and Phone Number.');
      return;
    }
    try {
      setIsPosting(true);
      const res = await apiClient.post('/public/jobs/post', {
        title: postTitle,
        organizationName: postOrg,
        jobCategory: postCategory,
        district: postDistrict,
        contactPhone: postPhone,
        salary: postSalary || 'Competitive',
        vacanciesCount: 1
      });
      if (res.data.success) {
        Alert.alert(language === 'ta' ? 'வெற்றி' : 'Success', language === 'ta' ? 'வேலைவாய்ப்பு வெற்றிகரமாக பதிவேற்றப்பட்டது!' : 'Job vacancy posted successfully across Tamil Nadu!');
        setPostTitle('');
        setPostOrg('');
        setPostPhone('');
        setPostSalary('');
        fetchTabData();
        setCurrentTab('jobs');
      }
    } catch (err) {
      Alert.alert('Notice', err.message);
    } finally {
      setIsPosting(false);
    }
  };

  // Fetch data on tab change
  useEffect(() => {
    fetchTabData();
  }, [currentTab]);

  const fetchTabData = async () => {
    try {
      setLoading(true);
      if (currentTab === 'jobs' || currentTab === 'home') {
        const res = await apiClient.get('/public/jobs?limit=50');
        if (res.data.success) setJobs(res.data.jobs);
      }
      if (currentTab === 'recruitments' || currentTab === 'home') {
        const res = await apiClient.get('/public/recruitments?limit=50');
        if (res.data.success) setRecruitments(res.data.recruitments);
      }
      if (currentTab === 'news' || currentTab === 'home') {
        const res = await apiClient.get('/public/news?limit=30');
        if (res.data.success) setNews(res.data.news);
      }
      if (currentTab === 'announcements' || currentTab === 'home') {
        const res = await apiClient.get('/public/announcements');
        if (res.data.success) setAnnouncements(res.data.announcements);
      }
    } catch (err) {
      console.warn('API fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Acquire Live GPS coordinates and compute distance to Nesal Village
  const handleGpsLocate = async () => {
    try {
      setIsLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('அனுமதி தேவை', 'நெசல் கிராம ஜிபிஎஸ் சரிபார்க்க அனுமதி தேவை.');
        setIsLocating(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = position.coords;

      // Reverse geocode via backend API
      const res = await apiClient.get(`/location/reverse-geocode?lat=${latitude}&lng=${longitude}`);
      if (res.data.success) {
        const loc = res.data.location;
        const dist = loc.distanceToNesalKm || 0;
        setGpsStatus(`${dist <= 4 ? 'நெசல் எல்லைக்குள்' : `நேசலிலிருந்து ${dist} கி.மீ`}`);
        Alert.alert(
          '📍 நெசல் ஜி.பி.எஸ் சரிபார்க்கப்பட்டது',
          `நெசல் கிராம மையம்: 12.0125° N, 79.7214° E\nஉங்கள் தூரம்: ${dist} கி.மீ\nவானூர் வட்டம், விழுப்புரம் மாவட்டம் (605014)`
        );
        fetchTabData();
      }
    } catch (err) {
      Alert.alert('GPS Notice', err.message);
    } finally {
      setIsLocating(false);
    }
  };

  // WhatsApp Share helper
  const shareOnWhatsApp = (text, url) => {
    const message = `🌾 *நமது நெசல் கிராமம் (NESAL VILLAGE)*\n📍 வானூர் வட்டம், விழுப்புரம் (605014)\n\n${text}\n\n🔗 ${url}`;
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`).catch(() => {
      Alert.alert('Notice', 'WhatsApp is not installed on this device.');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#064e3b" />

      {/* Top Mobile App Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <Text style={styles.logoIcon}>🌾</Text>
            <View>
              <Text style={styles.logoTitle}>நமது நெசல் கிராமம்</Text>
              <Text style={styles.logoSubtitle}>வானூர் வட்டம் • விழுப்புரம் - 605014</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
              style={styles.langBtn}
            >
              <Text style={styles.langBtnText}>{language === 'ta' ? 'English' : 'தமிழ்'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGpsLocate}
              disabled={isLocating}
              style={styles.gpsBtn}
            >
              <Text style={styles.gpsBtnText}>{isLocating ? '🛰️...' : '📍 GPS'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {gpsStatus && (
          <View style={styles.gpsBanner}>
            <Text style={styles.gpsBannerText}>🛰️ {gpsStatus}</Text>
          </View>
        )}
      </View>

      {/* Emergency Quick Helpline Scroll */}
      <View style={styles.helplineBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.helplineScroll}>
          <Text style={styles.helplineTitle}>🚨 அவசரம்:</Text>
          {EMERGENCY_CONTACTS.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => Linking.openURL(`tel:${item.phone}`)}
              style={styles.helplineChip}
            >
              <Text style={styles.helplineChipText}>{item.name}: {item.phone}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>
              {language === 'ta' ? 'நெசல் தகவல்கள் ஏற்றப்படுகின்றன...' : 'Loading Nesal Village updates...'}
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Home Tab */}
            {currentTab === 'home' && (
              <View>
                {/* Hero Card */}
                <View style={styles.heroCard}>
                  <Text style={styles.heroBadge}>🌾 நெசல் கிராம டிஜிட்டல் தளம் (605014)</Text>
                  <Text style={styles.heroTitle}>
                    {language === 'ta'
                      ? 'நமது நெசல் கிராமம்'
                      : 'Our Nesal Village'}
                  </Text>
                  <Text style={styles.heroDesc}>
                    {language === 'ta'
                      ? 'வானூர் வட்டம், விழுப்புரம் மாவட்டம். கிராம சபை அறிவிப்புகள், குடிநீர் நேரம், நியாயவிலைக் கடை மற்றும் TNPSC வேலைவாய்ப்புகள்.'
                      : 'Hyper-localized portal for Nesal Village (Vanur Taluk, Villupuram District, Pincode 605014).'}
                  </Text>
                </View>

                {/* Civic Amenities Box */}
                <View style={styles.civicBox}>
                  <Text style={styles.civicBoxTitle}>💧 குடிநீர் & நியாயவிலைக் கடை நேரம்</Text>
                  <View style={styles.civicRow}>
                    <Text style={styles.civicLabel}>• மேல்நிலை குடிநீர் தொட்டி:</Text>
                    <Text style={styles.civicValue}>காலை 6:30 & மாலை 5:30</Text>
                  </View>
                  <View style={styles.civicRow}>
                    <Text style={styles.civicLabel}>• நெசல் ரேஷன் கடை:</Text>
                    <Text style={styles.civicValue}>காலை 9:00 - 1:00 & மாலை 3:00 - 6:00</Text>
                  </View>
                  <View style={styles.civicRow}>
                    <Text style={styles.civicLabel}>• 100 நாள் வேலைத் திட்டம்:</Text>
                    <Text style={styles.civicValue}>நெசல் ஊராட்சி மன்ற அலுவலகம்</Text>
                  </View>
                </View>

                {/* Section Header: News */}
                <Text style={styles.sectionTitle}>
                  {language === 'ta' ? '📰 நெசல் கிராம & வானூர் செய்திகள்' : '📰 Nesal & Vanur News'}
                </Text>
                {news.slice(0, 3).map((item) => (
                  <View key={item._id} style={styles.card}>
                    <Text style={styles.cardTag}>{item.category}</Text>
                    <Text style={styles.cardTitle}>{item.headline}</Text>
                    <Text style={styles.cardSummary}>
                      {language === 'ta' ? (item.summaryTamil || item.summaryEnglish) : item.summaryEnglish}
                    </Text>
                    <View style={styles.cardFooter}>
                      <TouchableOpacity
                        onPress={() => shareOnWhatsApp(item.headline, item.originalArticleUrl)}
                        style={styles.shareBtn}
                      >
                        <Text style={styles.shareBtnText}>💬 WhatsApp</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(item.originalArticleUrl)}
                        style={styles.applyBtn}
                      >
                        <Text style={styles.applyBtnText}>{language === 'ta' ? 'முழு விவரம்' : 'Read'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {/* Jobs Section */}
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                  {language === 'ta' ? '💼 வேலைவாய்ப்புகள் & TNPSC அறிவிப்புகள்' : '💼 Jobs & TNPSC Alerts'}
                </Text>
                {jobs.slice(0, 2).map((job) => (
                  <View key={job._id} style={styles.card}>
                    <Text style={styles.cardTag}>{job.jobCategory}</Text>
                    <Text style={styles.cardTitle}>{job.jobTitle}</Text>
                    <Text style={styles.cardOrg}>🏢 {job.organizationName}</Text>
                    <Text style={styles.cardLoc}>📍 {job.jobLocation}</Text>
                    <View style={styles.cardFooter}>
                      <TouchableOpacity
                        onPress={() => shareOnWhatsApp(job.jobTitle, job.applicationUrl || job.officialNotificationUrl)}
                        style={styles.shareBtn}
                      >
                        <Text style={styles.shareBtnText}>💬 WhatsApp</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(job.applicationUrl || job.officialNotificationUrl)}
                        style={styles.applyBtn}
                      >
                        <Text style={styles.applyBtnText}>{language === 'ta' ? 'விண்ணப்பிக்க' : 'Apply'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* News Tab */}
            {currentTab === 'news' && (
              <View>
                <Text style={styles.sectionTitle}>
                  {language === 'ta' ? 'நெசல் கிராம செய்திகள்' : 'Nesal Village News'}
                </Text>
                {news.map((item) => (
                  <View key={item._id} style={styles.card}>
                    <Text style={styles.cardTag}>{item.category}</Text>
                    <Text style={styles.cardTitle}>{item.headline}</Text>
                    <Text style={styles.cardSummary}>
                      {language === 'ta' ? (item.summaryTamil || item.summaryEnglish) : item.summaryEnglish}
                    </Text>
                    <View style={styles.cardFooter}>
                      <TouchableOpacity
                        onPress={() => shareOnWhatsApp(item.headline, item.originalArticleUrl)}
                        style={styles.shareBtn}
                      >
                        <Text style={styles.shareBtnText}>💬 WhatsApp</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(item.originalArticleUrl)}
                        style={styles.applyBtn}
                      >
                        <Text style={styles.applyBtnText}>{language === 'ta' ? 'முழு விவரம்' : 'Read'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Announcements Tab */}
            {currentTab === 'announcements' && (
              <View>
                <Text style={styles.sectionTitle}>
                  {language === 'ta' ? 'நெசல் ஊராட்சி சுற்றறிக்கைகள்' : 'Panchayat Announcements'}
                </Text>
                {announcements.map((ann) => (
                  <View key={ann._id} style={styles.card}>
                    <Text style={styles.cardTag}>{ann.category}</Text>
                    <Text style={styles.cardTitle}>{ann.headline}</Text>
                    <Text style={styles.cardSummary}>
                      {language === 'ta' ? (ann.summaryTamil || ann.summaryEnglish) : ann.summaryEnglish}
                    </Text>
                    <View style={styles.cardFooter}>
                      <TouchableOpacity
                        onPress={() => shareOnWhatsApp(ann.headline, ann.originalArticleUrl)}
                        style={styles.shareBtn}
                      >
                        <Text style={styles.shareBtnText}>💬 WhatsApp</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(ann.originalArticleUrl)}
                        style={styles.applyBtn}
                      >
                        <Text style={styles.applyBtnText}>{language === 'ta' ? 'சுற்றறிக்கை' : 'Circular'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Jobs Tab */}
            {currentTab === 'jobs' && (
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={styles.sectionTitle}>
                    {language === 'ta' ? 'தமிழ்நாடு & உள்ளூர் வேலைவாய்ப்புகள்' : 'All Tamil Nadu & Local Jobs'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setCurrentTab('post-job')}
                    style={styles.inlinePostBtn}
                  >
                    <Text style={styles.inlinePostBtnText}>➕ {language === 'ta' ? 'பதிவிட' : 'Post Job'}</Text>
                  </TouchableOpacity>
                </View>
                {jobs.map((job) => (
                  <View key={job._id} style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.cardTag}>{job.jobCategory}</Text>
                      {job.salary && <Text style={styles.cardSalaryBadge}>💰 {job.salary}</Text>}
                    </View>
                    <Text style={styles.cardTitle}>{job.jobTitle}</Text>
                    <Text style={styles.cardOrg}>🏢 {job.organizationName}</Text>
                    <Text style={styles.cardLoc}>📍 {job.district || job.jobLocation || 'Tamil Nadu'}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>{job.jobDescription}</Text>
                    <View style={styles.cardFooter}>
                      <TouchableOpacity
                        onPress={() => shareOnWhatsApp(job.jobTitle, job.applicationUrl || job.officialNotificationUrl || '')}
                        style={styles.shareBtn}
                      >
                        <Text style={styles.shareBtnText}>💬 WhatsApp</Text>
                      </TouchableOpacity>
                      {job.contactPhone ? (
                        <TouchableOpacity
                          onPress={() => Linking.openURL(`tel:${job.contactPhone}`)}
                          style={[styles.applyBtn, { backgroundColor: '#059669', marginRight: 6 }]}
                        >
                          <Text style={styles.applyBtnText}>📞 {job.contactPhone}</Text>
                        </TouchableOpacity>
                      ) : null}
                      <TouchableOpacity
                        onPress={() => Linking.openURL(job.applicationUrl || job.officialNotificationUrl || '#')}
                        style={styles.applyBtn}
                      >
                        <Text style={styles.applyBtnText}>{language === 'ta' ? 'விண்ணப்பிக்க' : 'Apply'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Recruitments Tab */}
            {currentTab === 'recruitments' && (
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={styles.sectionTitle}>
                    {language === 'ta' ? 'தமிழ்நாடு அரசுப் பணிகள் & தேர்வுகள்' : 'TN Govt & Public Recruitments'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setCurrentTab('post-job')}
                    style={styles.inlinePostBtn}
                  >
                    <Text style={styles.inlinePostBtnText}>➕ {language === 'ta' ? 'பதிவிட' : 'Post Notice'}</Text>
                  </TouchableOpacity>
                </View>
                {recruitments.map((rec) => (
                  <View key={rec._id} style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={[styles.cardTag, { backgroundColor: '#eff6ff', color: '#1d4ed8' }]}>
                        {rec.departmentType || 'Govt Circular'}
                      </Text>
                      <Text style={styles.cardSalaryBadge}>👥 {rec.vacanciesCount || 1} காலியிடம்</Text>
                    </View>
                    <Text style={styles.cardTitle}>{rec.notificationTitle}</Text>
                    <Text style={styles.cardOrg}>🏛️ {rec.organizationName}</Text>
                    <Text style={styles.cardLoc}>📍 {rec.district || 'All Tamil Nadu'}</Text>
                    {rec.eligibilityCriteria ? (
                      <Text style={styles.cardSummary}>🎓 {rec.eligibilityCriteria}</Text>
                    ) : null}
                    <View style={styles.cardFooter}>
                      <TouchableOpacity
                        onPress={() => shareOnWhatsApp(rec.notificationTitle, rec.officialWebsiteUrl || rec.pdfUrl || '')}
                        style={styles.shareBtn}
                      >
                        <Text style={styles.shareBtnText}>💬 WhatsApp</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(rec.officialWebsiteUrl || rec.pdfUrl || '#')}
                        style={[styles.applyBtn, { backgroundColor: '#1d4ed8' }]}
                      >
                        <Text style={styles.applyBtnText}>{language === 'ta' ? 'விவரம் / விண்ணப்பம்' : 'Details & Apply'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Post Job / Vacancy Tab */}
            {currentTab === 'post-job' && (
              <View style={styles.postFormCard}>
                <Text style={styles.sectionTitle}>
                  {language === 'ta' ? '📢 வேலைவாய்ப்பு அல்லது அறிவிப்பு பதிவிட' : '📢 Post Job or Recruitment'}
                </Text>
                <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 14 }}>
                  {language === 'ta'
                    ? 'தமிழ்நாடு முழுவதும் மற்றும் நமது கிராமத்திற்கு இலவசமாக வேலைவாய்ப்புகளைப் பதிவிடலாம்.'
                    : 'Post your job openings or recruitment circulars across Tamil Nadu & Nesal village.'}
                </Text>

                <Text style={styles.inputLabel}>{language === 'ta' ? 'பணி பெயர் (Job Title) *' : 'Job Title *'}</Text>
                <TextInput
                  style={styles.textInput}
                  value={postTitle}
                  onChangeText={setPostTitle}
                  placeholder={language === 'ta' ? 'எ.கா: டிரைவர், கணக்காளர், ஆசிரியர்...' : 'e.g. Driver, Accountant, Teacher...'}
                />

                <Text style={styles.inputLabel}>{language === 'ta' ? 'நிறுவனம் / கடை / துறை *' : 'Organization / Employer *'}</Text>
                <TextInput
                  style={styles.textInput}
                  value={postOrg}
                  onChangeText={setPostOrg}
                  placeholder={language === 'ta' ? 'நிறுவனம் அல்லது கடை பெயர்' : 'Company or Business Name'}
                />

                <Text style={styles.inputLabel}>{language === 'ta' ? 'மாவட்டம் (District) *' : 'District *'}</Text>
                <TextInput
                  style={styles.textInput}
                  value={postDistrict}
                  onChangeText={setPostDistrict}
                  placeholder="Villupuram / All Tamil Nadu"
                />

                <Text style={styles.inputLabel}>{language === 'ta' ? 'தொடர்பு தொலைபேசி / WhatsApp *' : 'Contact Phone / WhatsApp *'}</Text>
                <TextInput
                  style={styles.textInput}
                  value={postPhone}
                  onChangeText={setPostPhone}
                  keyboardType="phone-pad"
                  placeholder="9876543210"
                />

                <Text style={styles.inputLabel}>{language === 'ta' ? 'சம்பளம் / ஊதியம் (விருப்பத்தேர்வு)' : 'Salary (Optional)'}</Text>
                <TextInput
                  style={styles.textInput}
                  value={postSalary}
                  onChangeText={setPostSalary}
                  placeholder="₹15,000 - ₹25,000 /pm"
                />

                <TouchableOpacity
                  onPress={handleMobileJobPost}
                  disabled={isPosting}
                  style={[styles.submitJobBtn, isPosting && { opacity: 0.7 }]}
                >
                  {isPosting ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.submitJobBtnText}>
                      🚀 {language === 'ta' ? 'இலவசமாக பதிவிடுங்கள்' : 'Submit & Publish'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Mobile Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {[
          { id: 'home', label: language === 'ta' ? 'முகப்பு' : 'Home', icon: '🌾' },
          { id: 'jobs', label: language === 'ta' ? 'வேலை' : 'Jobs', icon: '💼' },
          { id: 'recruitments', label: language === 'ta' ? 'அரசுப் பணி' : 'Recruit', icon: '📜' },
          { id: 'post-job', label: language === 'ta' ? 'பதிவிட' : 'Post', icon: '➕' },
          { id: 'news', label: language === 'ta' ? 'செய்தி' : 'News', icon: '📰' },
          { id: 'announcements', label: language === 'ta' ? 'அறிவிப்பு' : 'Notices', icon: '📢' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setCurrentTab(tab.id)}
            style={[styles.tabButton, currentTab === tab.id && styles.activeTabButton]}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, currentTab === tab.id && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#064e3b'
  },
  header: {
    backgroundColor: '#064e3b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoIcon: {
    fontSize: 26,
    marginRight: 8
  },
  logoTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ffffff'
  },
  logoSubtitle: {
    fontSize: 10,
    color: '#a7f3d0',
    fontWeight: '600'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  langBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 6
  },
  langBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold'
  },
  gpsBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8
  },
  gpsBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold'
  },
  gpsBanner: {
    marginTop: 6,
    backgroundColor: 'rgba(5, 150, 105, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  gpsBannerText: {
    color: '#a7f3d0',
    fontSize: 10,
    fontWeight: 'bold'
  },
  helplineBar: {
    backgroundColor: '#022c22',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)'
  },
  helplineScroll: {
    paddingHorizontal: 12,
    alignItems: 'center'
  },
  helplineTitle: {
    color: '#f87171',
    fontSize: 11,
    fontWeight: 'bold',
    marginRight: 6
  },
  helplineChip: {
    backgroundColor: '#064e3b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#059669'
  },
  helplineChipText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748b'
  },
  heroCard: {
    backgroundColor: '#022c22',
    padding: 16,
    borderRadius: 18,
    marginBottom: 14
  },
  heroBadge: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4
  },
  heroDesc: {
    fontSize: 11,
    color: '#cbd5e1',
    lineHeight: 16
  },
  civicBox: {
    backgroundColor: '#ecfdf5',
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#a7f3d0'
  },
  civicBoxTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065f46',
    marginBottom: 6
  },
  civicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2
  },
  civicLabel: {
    fontSize: 10,
    color: '#047857',
    fontWeight: '600'
  },
  civicValue: {
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 10
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2
  },
  cardTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#ecfdf5',
    color: '#047857',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4
  },
  cardOrg: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 2
  },
  cardLoc: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 6
  },
  cardDesc: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 15,
    marginBottom: 8
  },
  cardSummary: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
    marginBottom: 8,
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: 8
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9'
  },
  shareBtn: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0'
  },
  shareBtnText: {
    color: '#15803d',
    fontSize: 10,
    fontWeight: 'bold'
  },
  applyBtn: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  applyBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'space-around'
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10
  },
  activeTabButton: {
    backgroundColor: '#ecfdf5'
  },
  tabIcon: {
    fontSize: 16
  },
  tabLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2
  },
  activeTabLabel: {
    color: '#047857',
    fontWeight: '800'
  },
  inlinePostBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  inlinePostBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold'
  },
  cardSalaryBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  postFormCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
    marginTop: 6
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    marginBottom: 6
  },
  submitJobBtn: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14
  },
  submitJobBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold'
  }
});
