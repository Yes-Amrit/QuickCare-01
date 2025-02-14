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
      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
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
