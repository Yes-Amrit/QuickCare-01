// hooks/useLocationService.ts
import { useState } from 'react';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface LocationStatus {
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface AddressDetails {
  formatted: string;
  coordinates: LocationCoordinates;
  raw: any;
}

export const useLocationService = () => {
  const [locationStatus, setLocationStatus] = useState<LocationStatus>({
    loading: false,
    error: null,
    success: false
  });
  
  const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(null);

  const getCurrentPosition = (): Promise<LocationCoordinates> => {
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
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to fetch address details');
    }
  };

  const getLocation = async (updateAddressField?: (address: string) => void) => {
    setLocationStatus({ loading: true, error: null, success: false });
  
    try {
      const coords = await getCurrentPosition();
      const addressData = await getAddressFromCoords(coords.latitude, coords.longitude);
  
      const formattedAddress = [
        addressData.address.road,
        addressData.address.suburb,
        addressData.address.city,
        addressData.address.state,
        addressData.address.postcode,
        addressData.address.country
      ]
        .filter(Boolean)
        .join(', ');
  
      setAddressDetails({
        formatted: formattedAddress,
        coordinates: coords,
        raw: addressData
      });
  
      setLocationStatus({ loading: false, error: null, success: true });
  
      // Update address field in the form
      if (updateAddressField) {
        updateAddressField(formattedAddress);
      }
  
      return { formattedAddress, coords, addressData };
    } catch (error) {
      setLocationStatus({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to get location',
        success: false
      });
      throw error;
    }
  };
  

  return {
    getLocation,
    locationStatus,
    addressDetails
  };
};