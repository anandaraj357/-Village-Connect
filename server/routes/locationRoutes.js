import express from 'express';
import axios from 'axios';

const router = express.Router();

// Supported States and their Districts in India
export const STATES_AND_DISTRICTS = {
  'Tamil Nadu': [
    'Ariyalur',
    'Chengalpattu',
    'Chennai',
    'Coimbatore',
    'Cuddalore',
    'Dharmapuri',
    'Dindigul',
    'Erode',
    'Kallakurichi',
    'Kanchipuram',
    'Kanyakumari',
    'Karur',
    'Krishnagiri',
    'Madurai',
    'Mayiladuthurai',
    'Nagapattinam',
    'Namakkal',
    'Nilgiris',
    'Perambalur',
    'Pudukkottai',
    'Ramanathapuram',
    'Ranipet',
    'Salem',
    'Sivaganga',
    'Tenkasi',
    'Thanjavur',
    'Theni',
    'Thoothukudi',
    'Tiruchirappalli',
    'Tirunelveli',
    'Tirupathur',
    'Tiruppur',
    'Tiruvallur',
    'Tiruvannamalai',
    'Tiruvarur',
    'Vellore',
    'Villupuram',
    'Virudhunagar'
  ],
  'Puducherry': [
    'Puducherry',
    'Karaikal',
    'Mahe',
    'Yanam'
  ],
  'Andhra Pradesh': [
    'Alluri Sitharama Raju',
    'Anakapalli',
    'Ananthapur',
    'Annamayya',
    'Bapatla',
    'Chittoor',
    'East Godavari',
    'Eluru',
    'Guntur',
    'Kakinada',
    'Konaseema',
    'Krishna',
    'Kurnool',
    'Nandyal',
    'NTR',
    'Palnadu',
    'Parvathipuram Manyam',
    'Prakasam',
    'Sri Potti Sriramulu Nellore',
    'Sri Sathya Sai',
    'Srikakulam',
    'Tirupati',
    'Visakhapatnam',
    'Vizianagaram',
    'West Godavari',
    'YSR Kadapa'
  ],
  'Karnataka': [
    'Bagalkote',
    'Ballari',
    'Belagavi',
    'Bengaluru Rural',
    'Bengaluru Urban',
    'Bidar',
    'Chamarajanagar',
    'Chikkaballapura',
    'Chikkamagaluru',
    'Chitradurga',
    'Dakshina Kannada',
    'Davanagere',
    'Dharwad',
    'Gadag',
    'Hassan',
    'Haveri',
    'Kalaburagi',
    'Kodagu',
    'Kolar',
    'Koppal',
    'Mandya',
    'Mysuru',
    'Raichur',
    'Ramanagara',
    'Shivamogga',
    'Tumakuru',
    'Udupi',
    'Uttara Kannada',
    'Vijayapura',
    'Yadgir'
  ],
  'Kerala': [
    'Alappuzha',
    'Ernakulam',
    'Idukki',
    'Kannur',
    'Kasaragod',
    'Kollam',
    'Kottayam',
    'Kozhikode',
    'Malappuram',
    'Palakkad',
    'Pathanamthitta',
    'Thiruvananthapuram',
    'Thrissur',
    'Wayanad'
  ],
  'Telangana': [
    'Adilabad',
    'Bhadradri Kothagudem',
    'Hyderabad',
    'Jagtial',
    'Jangaon',
    'Jayashankar Bhupalpally',
    'Jogulamba Gadwal',
    'Kamareddy',
    'Karimnagar',
    'Khammam',
    'Kumuram Bheem Asifabad',
    'Mahabubabad',
    'Mahabubnagar',
    'Mancherial',
    'Medak',
    'Medchal-Malkajgiri',
    'Mulugu',
    'Nagarkurnool',
    'Nalgonda',
    'Narayanpet',
    'Nirmal',
    'Nizamabad',
    'Peddapalli',
    'Rajanna Sircilla',
    'Ranga Reddy',
    'Sangareddy',
    'Siddipet',
    'Suryapet',
    'Vikarabad',
    'Wanaparthy',
    'Warangal',
    'Hanamkonda',
    'Yadadri Bhuvanagiri'
  ],
  'Maharashtra': [
    'Ahmednagar',
    'Akola',
    'Amravati',
    'Aurangabad (Chhatrapati Sambhajinagar)',
    'Beed',
    'Bhandara',
    'Buldhana',
    'Chandrapur',
    'Dhule',
    'Gadchiroli',
    'Gondia',
    'Hingoli',
    'Jalgaon',
    'Jalna',
    'Kolhapur',
    'Latur',
    'Mumbai City',
    'Mumbai Suburban',
    'Nagpur',
    'Nanded',
    'Nandurbar',
    'Nashik',
    'Osmanabad (Dharashiv)',
    'Palghar',
    'Parbhani',
    'Pune',
    'Raigad',
    'Ratnagiri',
    'Sangli',
    'Satara',
    'Sindhudurg',
    'Solapur',
    'Thane',
    'Wardha',
    'Washim',
    'Yavatmal'
  ],
  'Delhi': [
    'Central Delhi',
    'East Delhi',
    'New Delhi',
    'North Delhi',
    'North East Delhi',
    'North West Delhi',
    'Shahdara',
    'South Delhi',
    'South East Delhi',
    'South West Delhi',
    'West Delhi'
  ]
};

// Known coordinate centroids for Tamil Nadu & Southern Indian districts for offline/spatial fallback
const DISTRICT_CENTROIDS = [
  { district: 'Villupuram', state: 'Tamil Nadu', lat: 11.9401, lng: 79.4861 },
  { district: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { district: 'Chengalpattu', state: 'Tamil Nadu', lat: 12.6841, lng: 79.9836 },
  { district: 'Kanchipuram', state: 'Tamil Nadu', lat: 12.8342, lng: 79.7036 },
  { district: 'Tiruvallur', state: 'Tamil Nadu', lat: 13.1432, lng: 79.9083 },
  { district: 'Ranipet', state: 'Tamil Nadu', lat: 12.9272, lng: 79.3330 },
  { district: 'Vellore', state: 'Tamil Nadu', lat: 12.9165, lng: 79.1325 },
  { district: 'Tirupathur', state: 'Tamil Nadu', lat: 12.4950, lng: 78.5678 },
  { district: 'Tiruvannamalai', state: 'Tamil Nadu', lat: 12.2253, lng: 79.0747 },
  { district: 'Kallakurichi', state: 'Tamil Nadu', lat: 11.7383, lng: 78.9639 },
  { district: 'Cuddalore', state: 'Tamil Nadu', lat: 11.7480, lng: 79.7714 },
  { district: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460 },
  { district: 'Namakkal', state: 'Tamil Nadu', lat: 11.2189, lng: 78.1674 },
  { district: 'Dharmapuri', state: 'Tamil Nadu', lat: 12.1211, lng: 78.1582 },
  { district: 'Krishnagiri', state: 'Tamil Nadu', lat: 12.5186, lng: 78.2137 },
  { district: 'Erode', state: 'Tamil Nadu', lat: 11.3410, lng: 77.7172 },
  { district: 'Tiruppur', state: 'Tamil Nadu', lat: 11.1085, lng: 77.3411 },
  { district: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { district: 'Nilgiris', state: 'Tamil Nadu', lat: 11.4102, lng: 76.6950 },
  { district: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047 },
  { district: 'Karur', state: 'Tamil Nadu', lat: 10.9601, lng: 78.0766 },
  { district: 'Perambalur', state: 'Tamil Nadu', lat: 11.2342, lng: 78.8821 },
  { district: 'Ariyalur', state: 'Tamil Nadu', lat: 11.1401, lng: 79.0786 },
  { district: 'Thanjavur', state: 'Tamil Nadu', lat: 10.7870, lng: 79.1378 },
  { district: 'Tiruvarur', state: 'Tamil Nadu', lat: 10.7717, lng: 79.6433 },
  { district: 'Nagapattinam', state: 'Tamil Nadu', lat: 10.7672, lng: 79.8449 },
  { district: 'Mayiladuthurai', state: 'Tamil Nadu', lat: 11.1075, lng: 79.6523 },
  { district: 'Pudukkottai', state: 'Tamil Nadu', lat: 10.3833, lng: 78.8001 },
  { district: 'Dindigul', state: 'Tamil Nadu', lat: 10.3673, lng: 77.9803 },
  { district: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  { district: 'Theni', state: 'Tamil Nadu', lat: 10.0104, lng: 77.4768 },
  { district: 'Virudhunagar', state: 'Tamil Nadu', lat: 9.5872, lng: 77.9624 },
  { district: 'Sivaganga', state: 'Tamil Nadu', lat: 9.8433, lng: 78.4809 },
  { district: 'Ramanathapuram', state: 'Tamil Nadu', lat: 9.3639, lng: 78.8395 },
  { district: 'Thoothukudi', state: 'Tamil Nadu', lat: 8.7642, lng: 78.1348 },
  { district: 'Tirunelveli', state: 'Tamil Nadu', lat: 8.7139, lng: 77.7567 },
  { district: 'Tenkasi', state: 'Tamil Nadu', lat: 8.9594, lng: 77.3150 },
  { district: 'Kanyakumari', state: 'Tamil Nadu', lat: 8.0883, lng: 77.5385 },
  { district: 'Puducherry', state: 'Puducherry', lat: 11.9416, lng: 79.8083 },
  { district: 'Chittoor', state: 'Andhra Pradesh', lat: 13.2172, lng: 79.1003 },
  { district: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192 },
  { district: 'Bengaluru Urban', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { district: 'Palakkad', state: 'Kerala', lat: 10.7867, lng: 76.6548 }
];

// Helper: normalize district name variants
function normalizeDistrictName(name) {
  if (!name) return 'Villupuram';
  const clean = name.trim();
  const lower = clean.toLowerCase();

  if (lower.includes('viluppuram') || lower.includes('villupuram')) return 'Villupuram';
  if (lower.includes('kancheepuram') || lower.includes('kanchipuram')) return 'Kanchipuram';
  if (lower.includes('tiruchirappalli') || lower.includes('trichy')) return 'Tiruchirappalli';
  if (lower.includes('tirunelveli') || lower.includes('nellai')) return 'Tirunelveli';
  if (lower.includes('thiruvallur') || lower.includes('tiruvallur')) return 'Tiruvallur';
  if (lower.includes('thiruvannamalai') || lower.includes('tiruvannamalai')) return 'Tiruvannamalai';
  if (lower.includes('thiruvarur') || lower.includes('tiruvarur')) return 'Tiruvarur';
  if (lower.includes('tuticorin') || lower.includes('thoothukudi')) return 'Thoothukudi';
  if (lower.includes('ooty') || lower.includes('nilgiris') || lower.includes('nilgiri')) return 'Nilgiris';
  if (lower.includes('chennai') || lower.includes('madras')) return 'Chennai';
  if (lower.includes('coimbatore') || lower.includes('kovai')) return 'Coimbatore';
  if (lower.includes('madurai')) return 'Madurai';
  if (lower.includes('salem')) return 'Salem';
  if (lower.includes('cuddalore')) return 'Cuddalore';
  if (lower.includes('kallakurichi')) return 'Kallakurichi';
  if (lower.includes('thanjavur') || lower.includes('tanjore')) return 'Thanjavur';

  // Capitalize words
  return clean.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Haversine formula to compute distance between coordinates in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearest known district
function findNearestDistrict(lat, lng) {
  let minDistance = Infinity;
  let nearest = DISTRICT_CENTROIDS[0];

  for (const item of DISTRICT_CENTROIDS) {
    const d = calculateDistance(lat, lng, item.lat, item.lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = item;
    }
  }

  return {
    ...nearest,
    distanceKm: Math.round(minDistance * 10) / 10
  };
}

/**
 * GET /api/location/states-and-districts
 * Returns all available states and districts
 */
router.get('/states-and-districts', (req, res) => {
  res.json({
    success: true,
    data: STATES_AND_DISTRICTS,
    defaultLocation: {
      state: 'Tamil Nadu',
      district: 'Villupuram',
      mandal: 'Vanur',
      village: 'Nesal'
    }
  });
});

/**
 * GET /api/location/reverse-geocode?lat=...&lng=...
 * Reverse geocodes GPS coordinates to State, District, Mandal/Taluk, Village
 */
router.get('/reverse-geocode', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: 'Valid latitude and longitude numbers are required.'
      });
    }

    let detectedState = 'Tamil Nadu';
    let detectedDistrict = 'Villupuram';
    let detectedMandal = 'Vanur';
    let detectedVillage = 'Nesal';
    let source = 'fallback';
    let rawAddress = null;

    // 1. Attempt OpenStreetMap Nominatim reverse geocoding
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;
      const response = await axios.get(nominatimUrl, {
        headers: {
          'User-Agent': 'OurVillageConnect/1.0 (village.connect.gov@gmail.com)'
        },
        timeout: 4000
      });

      if (response.data && response.data.address) {
        rawAddress = response.data.address;
        source = 'nominatim_gps';

        detectedState = rawAddress.state || rawAddress.province || 'Tamil Nadu';
        const rawDistrict =
          rawAddress.state_district ||
          rawAddress.district ||
          rawAddress.county ||
          rawAddress.city ||
          '';

        if (rawDistrict) {
          detectedDistrict = normalizeDistrictName(rawDistrict);
        }

        detectedMandal =
          rawAddress.taluk ||
          rawAddress.subdistrict ||
          rawAddress.town ||
          rawAddress.suburb ||
          rawAddress.municipality ||
          'General';

        detectedVillage =
          rawAddress.village ||
          rawAddress.hamlet ||
          rawAddress.neighbourhood ||
          rawAddress.residential ||
          'Local';
      }
    } catch (apiErr) {
      console.warn(`[Location] Nominatim reverse-geocode failed (${apiErr.message}). Using spatial coordinate mapping.`);
    }

    // 2. If Nominatim did not produce a clean district or failed, use spatial coordinate centroid matching
    if (!rawAddress || !detectedDistrict) {
      const nearest = findNearestDistrict(lat, lng);
      detectedDistrict = nearest.district;
      detectedState = nearest.state;
      detectedMandal = 'Central';
      detectedVillage = 'Local';
      source = 'spatial_centroid';
    }

    res.json({
      success: true,
      location: {
        state: detectedState,
        district: detectedDistrict,
        mandal: detectedMandal,
        village: detectedVillage,
        lat,
        lng,
        source
      },
      rawAddress
    });
  } catch (err) {
    console.error(`[Location] Reverse geocoding error: ${err.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to reverse geocode GPS location.',
      error: err.message
    });
  }
});

export default router;
