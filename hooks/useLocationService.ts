import { useState } from 'react';
import { LocationStatus, AddressDetails } from '../app/types/emergency';
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

  const formatDetailedAddress = (addressData: any) => {
    const addressParts = [
      // Building details
      addressData.address.building,
      addressData.address.house_number,
      
      // Street details
      addressData.address.road,
      addressData.address.street,
      
      // Local area
      addressData.address.suburb,
      addressData.address.neighbourhood,
      addressData.address.residential,
      
      // Larger area
      addressData.address.district,
      addressData.address.city_district,
      addressData.address.city,
      
      // Region
      addressData.address.county,
      addressData.address.state_district,
      addressData.address.state,
      
      // Postal code
      addressData.address.postcode
    ];

    // Remove any undefined or null values and join with commas
    return addressParts
      .filter(Boolean)
      .join(', ')
      .replace(/,\s*,/g, ',') // Remove double commas
      .replace(/\s+/g, ' ')   // Remove extra spaces
      .trim();
  };

  const getLocation = async (onAddressUpdate?: (address: string) => void) => {
    setLocationStatus({ loading: true, error: null, success: false });
  
    try {
      const coords = await getCurrentPosition();
      const addressData = await getAddressFromCoords(coords.latitude, coords.longitude);
  
      if (!addressData?.address) {
        throw new Error('Invalid address data');
      }
  
      const formattedAddress = formatDetailedAddress(addressData);
  
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