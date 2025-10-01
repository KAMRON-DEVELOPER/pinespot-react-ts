// ------------------------------------------------
// --------------- USER-- -------------------------
// ------------------------------------------------
export type UserRole = 'admin' | 'regular';
export type UserStatus = 'active' | 'disactive';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string | null;
  password?: string | null;
  picture?: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface Tokens {
  access_token: string;
  refresh_token?: string;
}

export interface JwtPayload {
  sub: string;
  type: string;
  iat: number;
  exp: number;
}

export interface OAuthUser {
  id: string;
  provider: string;
  username?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  password?: string | null;
  picture?: string | null;
  created_at?: string | null;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token?: string;
  };
}

export interface RedirectResponse {
  redirect_to: string;
}

export interface ErrorResponse {
  error: string;
}

export type ContinueWithEmailResponse = AuthResponse | RedirectResponse | ErrorResponse;

// ------------------------------------------------
// ------------- LISTINGS -------------------------
// ------------------------------------------------
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

export interface ListingResponse {
  listings: Listing[];
  total: number;
}
