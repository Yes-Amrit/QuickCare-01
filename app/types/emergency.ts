export interface LocationCoordinates {
    latitude: number;
    longitude: number;
    accuracy: number;
  }
  
  export interface LocationStatus {
    loading: boolean;
    error: string | null;
    success: boolean;
  }
  
  export interface AddressDetails {
    formatted: string;
    coordinates: LocationCoordinates;
    raw: any;
  }
  
  export interface EmergencyFormData {
    name: string;
    phone: string;
    address: string;
    reason: string;
    location?: {
      coordinates: LocationCoordinates;
      addressDetails: any;
    };
  }