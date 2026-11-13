import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const LocationContext = createContext();

// Permanent Dedicated Profile: Nesal Village, Vanur Taluk, Villupuram District, Tamil Nadu
export const NESAL_COORDINATES = {
  lat: 12.0125,
  lng: 79.7214
};

export const NESAL_WARDS = [
  {
    id: 'all',
    wardNumber: 0,
    name: 'நெசல் கிராமம் முழுமையும்',
    nameEn: 'All Nesal Wards & Ayacut',
    desc: 'அனைத்து வார்டுகள், குடியிருப்புப் பகுதிகள் மற்றும் பாசன நிலங்கள்',
    color: 'emerald'
  },
  {
    id: 'ward-1',
    wardNumber: 1,
    name: 'நெசல் கிராம நத்தம் & பிள்ளையார் கோவில் தெரு',
    nameEn: 'Nesal Grama Natham & Pillayar Kovil St',
    desc: 'பஞ்சாயத்து மன்ற அலுவலகம், பிள்ளையார் கோவில், கிராம நூலகம் & பிரதான தெரு',
    color: 'emerald'
  },
  {
    id: 'ward-2',
    wardNumber: 2,
    name: 'நெசல் காலனி & மேட்டுத் தெரு',
    nameEn: 'Nesal Colony & Mettu St',
    desc: 'மேல்நிலை நீர்த்தேக்கத் தொட்டி (OHT), சமுதாயக் கூடம், விளையாட்டு திடல்',
    color: 'teal'
  },
  {
    id: 'ward-3',
    wardNumber: 3,
    name: 'நெசல் ஏரிக்கரை, அணைக்கட்டு & நன்செய் பாசனம்',
    nameEn: 'Nesal Erikarai & Ayacut Agriculture',
    desc: 'நெசல் பெரிய ஏரி, பாசனக் கால்வாய் மதகுகள், நெல்-உளுந்து விளைநிலங்கள்',
    color: 'cyan'
  },
  {
    id: 'ward-4',
    wardNumber: 4,
    name: 'நெசல் - வானூர் பிரதான சாலை & பள்ளி வளாகம்',
    nameEn: 'Nesal - Vanur Main Road & School',
    desc: 'அரசு தொடக்கப் பள்ளி, அங்கன்வாடி, நியாயவிலைக் கடை (PDS Ration) & பேருந்து நிறுத்தம்',
    color: 'sky'
  },
  {
    id: 'ward-5',
    wardNumber: 5,
    name: 'வானூர் வட்டார மையம் & வட்டாட்சியர் அலுவலகம்',
    nameEn: 'Vanur Taluk Admin Hub',
    desc: 'வானூர் வட்டாட்சியர் அலுவலகம், ஒன்றிய அலுவலகம் (BDO), அரசு மருத்துவமனை & காவல் நிலையம்',
    color: 'indigo'
  }
];

export const NESAL_EMERGENCY_CONTACTS = [
  { name: 'வானூர் காவல் நிலையம் (Police)', phone: '0413-2677333', shortCode: '100', category: 'Police', timing: '24 மணி நேரமும்' },
  { name: 'வானூர் தீயணைப்பு & மீட்புப்பணி (Fire)', phone: '0413-2677101', shortCode: '101', category: 'Fire', timing: '24 மணி நேரமும்' },
  { name: 'வானூர் அரசு மருத்துவமனை & ஆம்புலன்ஸ்', phone: '0413-2677222', shortCode: '108', category: 'Hospital', timing: '24 மணி நேர அவசர சிகிச்சை' },
  { name: 'விழுப்புரம் ஆட்சியரகம் குறைதீர்ப்பு மையம்', phone: '04146-222135', shortCode: '1077', category: 'Collectorate', timing: 'திங்கள்-வெள்ளி 10:00 - 17:45' },
  { name: 'நெசல் VAO (கிராம நிர்வாக அலுவலர்)', phone: '04146-240102', shortCode: '1100', category: 'VAO', timing: 'திங்கள்-வெள்ளி (வருவாய்த்துறை)' },
  { name: 'வானூர் மின்சார வாரியம் (TNEB EB)', phone: '94987 94987', shortCode: '1912', category: 'Electricity', timing: 'மின் தடை & பழுது நீக்கம்' },
  { name: 'வானூர் ஊராட்சி ஒன்றிய அலுவலகம் (BDO)', phone: '0413-2677255', shortCode: null, category: 'BDO', timing: 'வட்டார வளர்ச்சி திட்டங்கள்' },
  { name: 'பெண்கள் அவசர உதவி மையம் (Women Helpline)', phone: '181', shortCode: '181', category: 'Women', timing: '24 மணி நேர இலவச உதவி' }
];

const DEFAULT_LOCATION = {
  state: 'Tamil Nadu',
  district: 'Villupuram',
  mandal: 'Vanur',
  village: 'Nesal',
  pincode: '604102',
  lat: NESAL_COORDINATES.lat,
  lng: NESAL_COORDINATES.lng,
  wardId: 'all',
  wardName: 'நெசல் கிராமம் முழுமையும்',
  distanceToNesalKm: 0,
  isGps: false
};

// Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const LocationProvider = ({ children }) => {
  const [location, setLocationState] = useState(() => {
    try {
      const saved = localStorage.getItem('nesal_user_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [selectedWard, setSelectedWard] = useState(location.wardId || 'all');
  const [isLocating, setIsLocating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionMessage, setExtractionMessage] = useState(null);
  const [lastExtractedCount, setLastExtractedCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Keep location locked to Nesal
  useEffect(() => {
    try {
      localStorage.setItem('nesal_user_location', JSON.stringify(location));
    } catch (e) {
      console.warn('Could not save location:', e);
    }
  }, [location]);

  /**
   * Request GPS coordinates and verify distance to Nesal Village
   */
  const requestGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setExtractionMessage('உயர்தர ஜி.பி.எஸ் செயற்கைக்கோள் இருப்பிடம் பெறப்படுகிறது...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const distKm = calculateDistance(lat, lng, NESAL_COORDINATES.lat, NESAL_COORDINATES.lng);

        const newLoc = {
          ...DEFAULT_LOCATION,
          lat,
          lng,
          distanceToNesalKm: distKm,
          isGps: true,
          wardId: selectedWard,
          wardName: NESAL_WARDS.find((w) => w.id === selectedWard)?.name || 'நெசல் கிராமம் முழுமையும்'
        };

        setLocationState(newLoc);
        setIsLocating(false);

        if (distKm <= 5) {
          setExtractionMessage(`ஜி.பி.எஸ் உறுதிசெய்யப்பட்டது: நீங்கள் நெசல் கிராம எல்லையில் உள்ளீர்கள் (${distKm} கி.மீ). செய்திகள் புதுப்பிக்கப்படுகின்றன...`);
        } else {
          setExtractionMessage(`ஜி.பி.எஸ் பதிவாகியுள்ளது. நெசல் கிராம மையத்திலிருந்து தூரம்: ${distKm} கி.மீ. நெசல் செய்திகள் புதுப்பிக்கப்படுகின்றன...`);
        }

        await extractNewsForLocation(newLoc);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setIsLocating(false);
        setExtractionMessage(`நெசல் கிராம மையம்: 12.0125° N, 79.7214° E நிலைநிறுத்தப்பட்டுள்ளது.`);
        setTimeout(() => setExtractionMessage(null), 4000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  /**
   * Select a specific Ward/Habitation within Nesal Village
   */
  const selectWard = async (wardId) => {
    const wardObj = NESAL_WARDS.find((w) => w.id === wardId) || NESAL_WARDS[0];
    setSelectedWard(wardId);

    const updated = {
      ...location,
      state: 'Tamil Nadu',
      district: 'Villupuram',
      mandal: 'Vanur',
      village: 'Nesal',
      pincode: '604102',
      wardId: wardObj.id,
      wardName: wardObj.name
    };

    setLocationState(updated);
    setExtractionMessage(`${wardObj.name} தேர்ந்தெடுக்கப்பட்டது. உள்ளூர் தகவல்கள் புதுப்பிக்கப்படுகின்றன...`);
    await extractNewsForLocation(updated);
  };

  /**
   * On-demand extraction of news specifically for Nesal Village & Vanur Taluk
   */
  const extractNewsForLocation = async (loc = location) => {
    try {
      setIsExtracting(true);
      setExtractionMessage(`நெசல் கிராமம், வானூர் & விழுப்புரம் செய்திகள் AI மூலம் திரட்டப்படுகின்றன...`);

      const res = await axios.post('/api/public/news/extract-by-location', {
        state: 'Tamil Nadu',
        district: 'Villupuram',
        mandal: 'Vanur',
        village: 'Nesal',
        lat: loc.lat,
        lng: loc.lng
      });

      if (res.data.success) {
        setLastExtractedCount(res.data.newCount || 0);
        setExtractionMessage(
          `நெசல் கிராமம் & வானூர் பகுதிக்கான ${res.data.totalCount || 0} செய்திகள் சரிபார்க்கப்பட்டு தயார்.`
        );
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      console.warn('Notice extracting news for Nesal:', err);
      setExtractionMessage('நெசல் கிராமம் & வானூர் வட்டார தகவல்கள் நேரலையில் இணைக்கப்பட்டுள்ளன.');
      setRefreshTrigger((prev) => prev + 1);
    } finally {
      setIsExtracting(false);
      setTimeout(() => {
        setExtractionMessage(null);
      }, 5000);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        selectedWard,
        selectWard,
        wards: NESAL_WARDS,
        emergencyContacts: NESAL_EMERGENCY_CONTACTS,
        coordinates: NESAL_COORDINATES,
        isLocating,
        isExtracting,
        extractionMessage,
        lastExtractedCount,
        isModalOpen,
        openLocationModal: () => setIsModalOpen(true),
        closeLocationModal: () => setIsModalOpen(false),
        requestGpsLocation,
        extractNewsForLocation,
        refreshTrigger
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
