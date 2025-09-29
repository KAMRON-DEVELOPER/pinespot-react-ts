export type ApartmentCondition = 'new' | 'repaired' | 'old';
export type SaleType = 'buy' | 'rent';

export interface Listing {
  id: string;
  apartment_id: string;
  owner_id: string;
  price: number;
  available_from?: string | null;
  available_to?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Apartment {
  id: string;
  title: string;
  description?: string | null;
  rooms?: number | null;
  area?: number | null;
  floor?: number | null;
  has_elevator?: boolean | null;
  condition?: ApartmentCondition | null;
  sale_type: SaleType;
  requirements?: string | null;
  has_garden?: boolean | null;
  distance_to_kindergarten?: number | null;
  distance_to_school?: number | null;
  distance_to_hospital?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  apartment_id: string;
  street_address: string;
  city: string;
  state_or_region: string;
  county_or_district?: string | null;
  postal_code: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  updated_at: string;
}
