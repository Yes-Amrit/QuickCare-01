export interface EmergencyFormData {
  name: string;
  phone: string;
  address: string;
  reason: string;
}

export interface LocationStatus {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface AddressDetails {
  formatted: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  raw?: any;
}
