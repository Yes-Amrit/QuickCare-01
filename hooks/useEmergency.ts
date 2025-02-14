import { useState } from 'react';
import type { FormEvent } from 'react';

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

  const updateFormField = (field: keyof EmergencyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add validation here if needed
      if (!formData.name || !formData.phone || !formData.address || !formData.reason) {
        throw new Error('Please fill in all required fields');
      }

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
    handleSubmit
  };
};