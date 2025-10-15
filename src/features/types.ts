// ------------------------------------------------
// --------------- USER-- -------------------------
// ------------------------------------------------
export type UserRole = 'admin' | 'regular';
export type UserStatus = 'active' | 'inactive';

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

export type ApiResponseWithRedirect<T> = T | ErrorResponse | RedirectResponse;
export type ApiResponse<T> = T | ErrorResponse;

export type GetUserResponse = ApiResponseWithRedirect<User>;
export type UpdateUserResponse = User | ErrorResponse;
export type DeleteUserResponse = User | ErrorResponse;
export type GetOAuthUserResponse = OAuthUser | ErrorResponse | RedirectResponse;
export type ContinueWithEmailResponse = AuthResponse | ErrorResponse | RedirectResponse;
export type CompleteProfileResponse = AuthResponse | ErrorResponse;
export type RefreshTokenResponse = Tokens | ErrorResponse;

// ------------------------------------------------
// ------------- LISTINGS -------------------------
// ------------------------------------------------
export type ApartmentCondition = 'new' | 'repaired' | 'old';
export type SaleType = 'buy' | 'rent';

export interface Listing {
  id: string;
  apartment: Apartment;
  owner: User;
  price: number;
  currency: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Apartment {
  id: string;
  title: string;
  rating?: number;
  address: Address;
  description?: string | null;
  rooms: number;
  beds: number;
  baths: number;
  images: string[];
  amenities: string[];
  area: number;
  floor: number;
  hasElevator: boolean;
  condition: ApartmentCondition;
  saleType: SaleType;
  requirements?: string | null;
  hasGarden: boolean;
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

export type Country = {
  name: string;
  code: string;
};

export type GetListingsResponse = ApiResponseWithRedirect<ListingResponse>;
