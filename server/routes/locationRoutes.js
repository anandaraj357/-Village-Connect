import express from 'express';
import axios from 'axios';

const router = express.Router();

// Dedicated Village Profile: Nesal Village, Vanur Taluk, Villupuram District, Tamil Nadu
export const NESAL_VILLAGE_INFO = {
  village: 'Nesal',
  villageTamil: 'நெசல் கிராமம்',
  taluk: 'Vanur',
  talukTamil: 'வானூர் வட்டம்',
  district: 'Villupuram',
  districtTamil: 'விழுப்புரம் மாவட்டம்',
  state: 'Tamil Nadu',
  stateTamil: 'தமிழ்நாடு',
  pincode: '604102',
  centerCoordinates: {
    lat: 12.0125,
    lng: 79.7214
  },
  wards: [
    {
      id: 'ward-1',
      wardNumber: 1,
      name: 'நெசல் கிராம நத்தம் & பிள்ளையார் கோவில் தெரு',
      nameEn: 'Nesal Grama Natham & Pillayar Kovil Street',
      landmarks: 'பஞ்சாயத்து அலுவலகம், பிள்ளையார் கோவில், கிராம நூலகம், பிரதான குடியிருப்பு தெருக்கள்',
      populationApprox: 580,
      utilities: ['தெருவிளக்கு பராமரிப்பு', 'தினசரி குடிநீர் குழாய்', 'சாக்கடை தூய்மை']
    },
    {
      id: 'ward-2',
      wardNumber: 2,
      name: 'நெசல் காலனி & மேட்டுத் தெரு',
      nameEn: 'Nesal Colony & Mettu Street',
      landmarks: 'மேல்நிலை நீர்த்தேக்கத் தொட்டி (OHT), ஆதிதிராவிடர் நல சமுதாயக் கூடம், விளையாட்டு திடல்',
      populationApprox: 460,
      utilities: ['குடிநீர் தொட்டி பராமரிப்பு', 'தெருவிளக்குகள்', 'கழிவுநீர் வாய்க்கால்']
    },
    {
      id: 'ward-3',
      wardNumber: 3,
      name: 'நெசல் ஏரிக்கரை, அணைக்கட்டு & நன்செய் பாசன நிலங்கள்',
      nameEn: 'Nesal Erikarai & Ayacut Agricultural Fields',
      landmarks: 'நெசல் பெரிய ஏரி, பாசனக் கால்வாய் மதகுகள், உழவர் கூட்டுப்பண்ணை, களம்',
      populationApprox: 340,
      utilities: ['பாசன நீர் விநியோகம்', 'வேளாண் மும்முனை மின்சாரம்', 'கால்வாய் தூர்வாருதல்']
    },
    {
      id: 'ward-4',
      wardNumber: 4,
      name: 'நெசல் - வானூர் பிரதான சாலை & பள்ளி வளாகம்',
      nameEn: 'Nesal - Vanur Main Road & School Area',
      landmarks: 'அரசு தொடக்கப் பள்ளி, அங்கன்வாடி மையம், நியாயவிலைக் கடை (PDS), பேருந்து நிறுத்தம்',
      populationApprox: 410,
      utilities: ['சத்துணவு கூடம்', 'ரேஷன் கடை விநியோகம்', 'பேருந்து சேவை']
    },
    {
      id: 'ward-5',
      wardNumber: 5,
      name: 'வானூர் வட்டார மையம் & நிர்வாக அலுவலகங்கள்',
      nameEn: 'Vanur Taluk Administration Hub',
      landmarks: 'வானூர் வட்டாட்சியர் அலுவலகம், வட்டார வளர்ச்சி அலுவலகம் (BDO), அரசு மருத்துவமனை, காவல் நிலையம்',
      populationApprox: 820,
      utilities: ['இ-சேவை மையம்', 'வருவாய்த்துறை சான்றிதழ்கள்', 'அவசர சிகிச்சை']
    }
  ],
  emergencyContacts: [
    { name: 'வானூர் காவல் நிலையம் (Police)', phone: '0413-2677333', shortCode: '100', category: 'Police' },
    { name: 'வானூர் தீயணைப்பு நிலையம் (Fire & Rescue)', phone: '0413-2677101', shortCode: '101', category: 'Fire' },
    { name: 'வானூர் அரசு மருத்துவமனை & ஆம்புலன்ஸ் (108)', phone: '0413-2677222', shortCode: '108', category: 'Hospital' },
    { name: 'விழுப்புரம் மாவட்ட ஆட்சியரகம் குறைதீர்ப்பு', phone: '04146-222135', shortCode: '1077', category: 'Collectorate' },
    { name: 'நெசல் VAO (கிராம நிர்வாக அலுவலர்)', phone: '04146-240102', shortCode: '1100', category: 'VAO' },
    { name: 'வானூர் மின்சார வாரியம் (TNEB EB)', phone: '94987 94987', shortCode: '1912', category: 'Electricity' },
    { name: 'வானூர் வட்டார வளர்ச்சி அலுவலகம் (BDO)', phone: '0413-2677255', shortCode: null, category: 'BDO' },
    { name: 'பெண்கள் அவசர உதவி மையம் (Women Helpline)', phone: '181', shortCode: '181', category: 'Women' }
  ]
};

// Haversine formula to compute distance in km
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

/**
 * GET /api/location/states-and-districts
 * Returns dedicated profile for Nesal village, Vanur Taluk, Villupuram District
 */
router.get('/states-and-districts', (req, res) => {
  res.json({
    success: true,
    nesalInfo: NESAL_VILLAGE_INFO,
    defaultLocation: {
      state: 'Tamil Nadu',
      district: 'Villupuram',
      mandal: 'Vanur',
      village: 'Nesal',
      pincode: '604102',
      lat: 12.0125,
      lng: 79.7214
    }
  });
});

/**
 * GET /api/location/reverse-geocode?lat=...&lng=...
 * Computes live GPS coordinates and verifies location relative to Nesal Village
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

    const distanceToNesal = calculateDistance(
      lat,
      lng,
      NESAL_VILLAGE_INFO.centerCoordinates.lat,
      NESAL_VILLAGE_INFO.centerCoordinates.lng
    );

    const isInsideNesal = distanceToNesal <= 3.5;
    const isInsideVanur = distanceToNesal <= 18.0;

    res.json({
      success: true,
      location: {
        state: 'Tamil Nadu',
        district: 'Villupuram',
        mandal: 'Vanur',
        village: 'Nesal',
        pincode: '604102',
        lat,
        lng,
        distanceToNesalKm: Math.round(distanceToNesal * 10) / 10,
        isInsideNesal,
        isInsideVanur,
        source: 'nesal_village_gps'
      },
      villageInfo: NESAL_VILLAGE_INFO
    });
  } catch (err) {
    console.error(`[Location] Reverse geocoding error: ${err.message}`);
    res.json({
      success: true,
      location: {
        state: 'Tamil Nadu',
        district: 'Villupuram',
        mandal: 'Vanur',
        village: 'Nesal',
        pincode: '604102',
        lat: 12.0125,
        lng: 79.7214,
        distanceToNesalKm: 0,
        isInsideNesal: true,
        source: 'nesal_default'
      },
      villageInfo: NESAL_VILLAGE_INFO
    });
  }
});

export default router;
