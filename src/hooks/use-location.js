import { useState } from 'react';
import axios from 'axios';

/**
 * Custom hook for handling geolocation and reverse geocoding
 * Uses browser Geolocation API and Nominatim (OpenStreetMap) for reverse geocoding
 */
export const useLocation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationData, setLocationData] = useState(null);

  /**
   * Get current location coordinates
   */
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred while getting location.';
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  /**
   * Reverse geocode coordinates to get address
   * Uses Nominatim API (OpenStreetMap) - free, no API key needed
   */
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            format: 'json',
            lat: latitude,
            lon: longitude,
            zoom: 18,
            addressdetails: 1,
          },
          headers: {
            'User-Agent': 'SynapseSynchrony/1.0', // Required by Nominatim
          },
        }
      );

      if (response.data) {
        const addr = response.data.address;
        
        // Construct a more descriptive place name
        // Priority: Neighbourhood/Suburb > Village/Town > City District
        const area = addr.suburb || 
                    addr.neighbourhood || 
                    addr.residential || 
                    addr.quarter || 
                    addr.district || 
                    addr.city_district || 
                    addr.village || 
                    addr.town ||
                    addr.city ||
                    '';

        const city = addr.city || addr.town || addr.village || addr.county || '';
        
        // If we have both area and city, and they are different, combine them
        let placeName = area;
        if (area && city && area !== city) {
          placeName = `${area}, ${city}`;
        } else if (!placeName) {
          // Fallback to road if no area/city found
          placeName = addr.road || response.data.name || '';
        }

        return {
          address: response.data.display_name || '',
          placeName: placeName,
          city: city,
          country: addr.country || '',
        };
      }

      return {
        address: '',
        placeName: '',
        city: '',
        country: '',
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Return empty strings if geocoding fails
      return {
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        placeName: '',
        city: '',
        country: '',
      };
    }
  };

  /**
   * Get location with address
   * Combines getCurrentLocation and reverseGeocode
   */
  const getLocationWithAddress = async () => {
    setIsLoading(true);
    setError(null);
    setLocationData(null);

    try {
      // Get coordinates
      const coords = await getCurrentLocation();

      // Get address
      const addressInfo = await reverseGeocode(coords.latitude, coords.longitude);

      const data = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        address: addressInfo.address,
        placeName: addressInfo.placeName,
        city: addressInfo.city,
        country: addressInfo.country,
      };

      setLocationData(data);
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Reset state
   */
  const reset = () => {
    setIsLoading(false);
    setError(null);
    setLocationData(null);
  };

  return {
    isLoading,
    error,
    locationData,
    getLocationWithAddress,
    getCurrentLocation,
    reverseGeocode,
    reset,
  };
};
