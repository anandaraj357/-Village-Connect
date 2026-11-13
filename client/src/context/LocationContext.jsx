import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const LocationContext = createContext();

const DEFAULT_LOCATION = {
  state: 'Tamil Nadu',
  district: 'Villupuram',
  mandal: 'Vanur',
  village: 'Nesal',
  lat: 12.012,
  lng: 79.721,
  isGps: false
};

export const LocationProvider = ({ children }) => {
  const [location, setLocationState] = useState(() => {
    try {
      const saved = localStorage.getItem('village_user_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionMessage, setExtractionMessage] = useState(null);
  const [lastExtractedCount, setLastExtractedCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statesAndDistricts, setStatesAndDistricts] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load available states and districts once
  useEffect(() => {
    const fetchStatesAndDistricts = async () => {
      try {
        const res = await axios.get('/api/location/states-and-districts');
        if (res.data.success) {
          setStatesAndDistricts(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to load states and districts:', err.message);
      }
    };
    fetchStatesAndDistricts();
  }, []);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('village_user_location', JSON.stringify(location));
    } catch (e) {
      console.warn('Could not save location to localStorage:', e);
    }
  }, [location]);

  /**
   * Request GPS coordinates via browser Geolocation API and reverse-geocode
   */
  const requestGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setExtractionMessage('Acquiring high-accuracy GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setExtractionMessage(`GPS locked (${lat.toFixed(4)}, ${lng.toFixed(4)}). Resolving district...`);

        try {
          const res = await axios.get(`/api/location/reverse-geocode?lat=${lat}&lng=${lng}`);
          if (res.data.success && res.data.location) {
            const detected = res.data.location;
            const newLocation = {
              state: detected.state || 'Tamil Nadu',
              district: detected.district || 'Villupuram',
              mandal: detected.mandal || 'General',
              village: detected.village || 'Local',
              lat,
              lng,
              isGps: true
            };

            setLocationState(newLocation);
            setIsLocating(false);
            setExtractionMessage(`Detected: ${newLocation.district}, ${newLocation.state}. Extracting latest news...`);

            // Automatically extract news for this new GPS location
            await extractNewsForLocation(newLocation);
          } else {
            throw new Error('Reverse geocoding response invalid');
          }
        } catch (err) {
          console.error('Reverse geocode error:', err);
          // Fallback location near coordinates
          const fallback = {
            ...location,
            lat,
            lng,
            isGps: true
          };
          setLocationState(fallback);
          setIsLocating(false);
          await extractNewsForLocation(fallback);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setIsLocating(false);
        setExtractionMessage(null);
        alert(`Could not acquire GPS position (${error.message}). You can select your district manually from the list.`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  /**
   * Manually change location (State, District, Mandal, Village)
   */
  const changeLocation = async (newLocation) => {
    const updated = {
      ...location,
      ...newLocation,
      isGps: false
    };
    setLocationState(updated);
    await extractNewsForLocation(updated);
  };

  /**
   * On-demand extraction of news for current or specified location
   */
  const extractNewsForLocation = async (loc = location) => {
    try {
      setIsExtracting(true);
      setExtractionMessage(`Extracting & AI-summarizing live news for ${loc.district}, ${loc.state}...`);

      const res = await axios.post('/api/public/news/extract-by-location', {
        state: loc.state,
        district: loc.district,
        mandal: loc.mandal,
        village: loc.village,
        lat: loc.lat,
        lng: loc.lng
      });

      if (res.data.success) {
        setLastExtractedCount(res.data.newCount || 0);
        setExtractionMessage(
          `Extracted ${res.data.newCount} new articles for ${loc.district} (${res.data.totalCount} total available).`
        );
        // Trigger consumers to re-fetch
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      console.warn('Notice extracting news for location:', err);
      if (err.response?.status === 500 || err.code === 'ERR_NETWORK') {
        setExtractionMessage(
          `Showing local news for ${loc.district}. Ensure backend server is running on port 5000.`
        );
      } else {
        setExtractionMessage(`Location update: ${err.message}`);
      }
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
        isLocating,
        isExtracting,
        extractionMessage,
        lastExtractedCount,
        isModalOpen,
        openLocationModal: () => setIsModalOpen(true),
        closeLocationModal: () => setIsModalOpen(false),
        statesAndDistricts,
        requestGpsLocation,
        changeLocation,
        extractNewsForLocation,
        refreshTrigger
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
