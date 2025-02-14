// hooks/useEmergency.ts
import { useState } from 'react';
import type { FormEvent } from 'react';
import { EmergencyFormData } from '../app/types/emergency';

interface UseEmergencyProps {
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: Error) => void;
}

export function useEmergency({ onSubmitSuccess, onSubmitError }: UseEmergencyProps = {}) {
  const [formData, setFormData] = useState<EmergencyFormData>({
    name: '',
    phone: '',
    address: '',
    reason: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormField = (field: keyof EmergencyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields before sending
      const missingFields = Object.entries(formData)
        .filter(([_, value]) => !value.trim())
        .map(([key]) => key);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Submission failed');
      }

      onSubmitSuccess?.();
    } catch (error) {
      console.error('Submission error:', error);
      onSubmitError?.(error instanceof Error ? error : new Error('Submission failed'));
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
}