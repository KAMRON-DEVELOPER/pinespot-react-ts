// ------------------------------------------------
// --------------- USER-- -------------------------
// ------------------------------------------------
export type UserRole = 'admin' | 'regular';
export type UserStatus = 'active' | 'disactive';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  password?: string | null;
  picture?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
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
  username?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  picture?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken?: string;
  };
}

export interface RedirectResponse {
  redirectTo: string;
}

export interface ErrorResponse {
  error: string;
}

export type GetOAuthUserResponse = OAuthUser | ErrorResponse | RedirectResponse;
export type ContinueWithEmailResponse = AuthResponse | ErrorResponse | RedirectResponse;
export type CompleteProfileResponse = AuthResponse | ErrorResponse;

// ------------------------------------------------
// ------------- LISTINGS -------------------------
// ------------------------------------------------
export type ApartmentCondition = 'new' | 'repaired' | 'old';
export type SaleType = 'buy' | 'rent';

export interface Listing {
  id: string;
  apartmentId: string;
  ownerId: string;
  price: number;
  availableFrom?: string | null;
  availableTo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Apartment {
  id: string;
  title: string;
  description?: string | null;
  rooms?: number | null;
  area?: number | null;
  floor?: number | null;
  hasElevator?: boolean | null;
  condition?: ApartmentCondition | null;
  saleType: SaleType;
  requirements?: string | null;
  hasGarden?: boolean | null;
  distanceToKindergarten?: number | null;
  distanceToSchool?: number | null;
  distanceToHospital?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  apartmentId: string;
  streetAddress: string;
  city: string;
  stateOrRegion: string;
  countyOrDistrict?: string | null;
  postalCode: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListingResponse {
  listings: Listing[];
  total: number;
}

export type GetListingsResponse = ListingResponse | ErrorResponse | RedirectResponse;
