// components/EmergencySection.tsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import EmergencyForm from './EmergencyForm';

const EmergencySection = () => {
  return (
    <div className="relative py-16 bg-gradient-to-r from-red-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-800">Emergency Services</h2>
          </div>
          <p className="text-lg text-gray-600 mb-8">
            Need immediate medical attention? Our emergency response team is available 24/7.
          </p>
          <EmergencyForm />
        </div>
      </div>
    </div>
  );
};

export default EmergencySection;