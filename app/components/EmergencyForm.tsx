import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, MapPin, Loader2 } from 'lucide-react';
import { useLocationService } from '../../hooks/useLocationService';
import { useEmergency } from '../../hooks/useEmergency';
import { toast } from '@/components/ui/use-toast';

const EmergencyForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getLocation, locationStatus, addressDetails } = useLocationService();
  
  const {
    formData,
    isSubmitting,
    updateFormField,
    handleSubmit: submitEmergency
  } = useEmergency({
    onSubmitSuccess: () => {
      setIsOpen(false);
      toast({
        title: "Emergency Request Sent",
        description: "Our team has been notified and will contact you immediately.",
        variant: "default",
      });
    },
    onSubmitError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit emergency request. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Auto-update address field when location is retrieved
  useEffect(() => {
    if (addressDetails?.formatted) {
      updateFormField('address', addressDetails.formatted);
    }
  }, [addressDetails, updateFormField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitEmergency(e);
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-full flex items-center gap-2 mx-auto"
      >
        <AlertTriangle className="w-6 h-6" />
        Request Emergency Assistance
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle /> Emergency Request
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => updateFormField('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormField('phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <div className="space-y-2">
                <Textarea
                  required
                  value={formData.address}
                  onChange={(e) => updateFormField('address', e.target.value)}
                  placeholder="Enter your address"
                  rows={3}
                />
                
                <Button
                type="button"
                variant="outline"
                onClick={() => getLocation((address) => updateFormField('address', address))}
                className="w-full flex items-center justify-center gap-2"
                disabled={locationStatus.loading}
>
                {locationStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                <MapPin className="w-4 h-4" />
                )}
                {locationStatus.loading ? 'Getting Location...' : 'Get Current Location'}
                </Button>


                {locationStatus.error && (
                  <Alert variant="destructive">
                    <AlertDescription>{locationStatus.error}</AlertDescription>
                  </Alert>
                )}

                {locationStatus.success && addressDetails && (
                  <Alert className="bg-green-50 text-green-700 border-green-200">
                    <AlertDescription>
                      Location captured successfully!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Reason for Emergency</label>
              <Textarea
                required
                value={formData.reason}
                onChange={(e) => updateFormField('reason', e.target.value)}
                placeholder="Briefly describe the emergency situation"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Emergency Request'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmergencyForm;
