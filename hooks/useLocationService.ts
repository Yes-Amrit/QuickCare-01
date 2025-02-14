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
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
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
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'Emergency Assistance Form'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      
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
  
      if (!addressData || !addressData.address) {
        throw new Error('Invalid address data received');
      }
  
      const addressComponents = [
        addressData.address.road,
        addressData.address.house_number,
        addressData.address.suburb,
        addressData.address.city,
        addressData.address.state,
        addressData.address.postcode,
        addressData.address.country
      ].filter(Boolean);
  
      const formattedAddress = addressComponents.join(', ');
  
      const addressDetails: AddressDetails = {
        formatted: formattedAddress,
        coordinates: coords,
        raw: addressData
      };
  
      setAddressDetails(addressDetails);
      setLocationStatus({ loading: false, error: null, success: true });
  
      if (updateAddressField) {
        updateAddressField(formattedAddress);
      }
  
      return addressDetails;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setLocationStatus({
        loading: false,
        error: errorMessage,
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
