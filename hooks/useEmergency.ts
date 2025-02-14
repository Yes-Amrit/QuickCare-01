import { useState } from 'react';
import { useLocationService } from './useLocationService';

interface EmergencyFormData {
  name: string;
  phone: string;
  address: string;
  reason: string;
  location?: {
    coordinates: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
    addressDetails: any;
  };
}

interface UseEmergencyProps {
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: Error) => void;
}

export const useEmergency = ({ onSubmitSuccess, onSubmitError }: UseEmergencyProps = {}) => {
  const [formData, setFormData] = useState<EmergencyFormData>({
    name: '',
    phone: '',
    address: '',
    reason: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getLocation, locationStatus } = useLocationService();

  const updateFormField = (field: keyof EmergencyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUseLiveLocation = async () => {
    try {
      const { formattedAddress, coords, addressData } = await getLocation((address) =>
        updateFormField('address', address)
      );

      setFormData(prev => ({
        ...prev,
        address: formattedAddress,
        location: {
          coordinates: coords,
          addressDetails: addressData
        }
      }));
    } catch (error) {
      console.error('Error fetching live location:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit emergency request');
      }

      onSubmitSuccess?.();
    } catch (error) {
      console.error('Emergency submission error:', error);
      onSubmitError?.(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    updateFormField,
    handleUseLiveLocation, // Call this when the user wants to autofill the location
    locationStatus,
    handleSubmit
  };
};
