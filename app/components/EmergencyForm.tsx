'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, MapPin, Loader2 } from 'lucide-react';
import { useLocationService } from '../../hooks/useLocationService';
import { useEmergency } from '../../hooks/useEmergency';
import { toast } from '@/components/ui/use-toast';

export default function EmergencyForm() {
  const [open, setOpen] = React.useState(false);
  const { getLocation, locationStatus, addressDetails } = useLocationService();
  
  const {
    formData,
    isSubmitting,
    updateFormField,
    handleSubmit
  } = useEmergency({
    onSubmitSuccess: () => {
      setOpen(false);
      toast({
        title: "Request Sent",
        description: "Emergency team notified",
      });
    },
    onSubmitError: () => {
      toast({
        title: "Error",
        description: "Please try again",
        variant: "destructive",
      });
    }
  });

  React.useEffect(() => {
    if (addressDetails?.formatted) {
      updateFormField('address', addressDetails.formatted);
    }
  }, [addressDetails]);

  const handleLocationRequest = async () => {
    try {
      await getLocation((address) => updateFormField('address', address));
    } catch (error) {
      toast({
        title: "Location Error",
        description: error instanceof Error ? error.message : "Location error",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-full flex items-center gap-2 mx-auto"
      >
        <AlertTriangle className="w-6 h-6" />
        Emergency Assistance
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Emergency Request</DialogTitle>
            <DialogDescription>
              Please provide your details for immediate assistance
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormField('name', e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm font-medium">Phone</label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormField('phone', e.target.value)}
                placeholder="Your phone number"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="text-sm font-medium">Location</label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateFormField('address', e.target.value)}
                placeholder="Your current address"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleLocationRequest}
                disabled={locationStatus.loading}
                className="mt-2 w-full"
              >
                {locationStatus.loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Use Current Location
                  </>
                )}
              </Button>
            </div>

            <div>
              <label htmlFor="reason" className="text-sm font-medium">Emergency Details</label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => updateFormField('reason', e.target.value)}
                placeholder="Describe your emergency"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}