// hooks/useLocationService.ts
import { useState } from 'react';
import { LocationStatus, AddressDetails } from '../app/types//emergency';
import { getCurrentPosition } from '../app/lib/location';

export function useLocationService() {
  const [locationStatus, setLocationStatus] = useState<LocationStatus>({
    loading: false,
    error: null,
    success: false
  });
  
  const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(null);

  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'Emergency-Assistance-App'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }
    
    return response.json();
  };

  const getLocation = async (onAddressUpdate?: (address: string) => void) => {
    setLocationStatus({ loading: true, error: null, success: false });
  
    try {
      const coords = await getCurrentPosition();
      const addressData = await getAddressFromCoords(coords.latitude, coords.longitude);
  
      if (!addressData?.address) {
        throw new Error('Invalid address data');
      }
  
      const formattedAddress = [
        addressData.address.house_number,
        addressData.address.road,
        addressData.address.suburb,
        addressData.address.city,
        addressData.address.state,
        addressData.address.postcode
      ].filter(Boolean).join(', ');
  
      const details: AddressDetails = {
        formatted: formattedAddress,
        coordinates: coords,
        raw: addressData
      };
  
      setAddressDetails(details);
      setLocationStatus({ loading: false, error: null, success: true });
      
      if (onAddressUpdate) {
        onAddressUpdate(formattedAddress);
      }
  
      return details;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Location error';
      setLocationStatus({ loading: false, error: message, success: false });
      throw error;
    }
  };

  return {
    getLocation,
    locationStatus,
    addressDetails
  };
}