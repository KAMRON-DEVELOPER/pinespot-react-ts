export type UserRole = 'admin' | 'regular';
export type UserStatus = 'active' | 'disactive';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
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
  refresh_token: string | null;
}

export interface JwtPayload {
  sub: string;
  type: string;
  iat: number;
  exp: number;
}

export interface OAuthUser {
  id: string;
  exp: string;
  iat: string;
  iss: string;
  sub: string;
  at_hash?: string | null;
  email?: string | null;
  family_name?: string | null;
  given_name?: string | null;
  name?: string | null;
  picture?: string | null;
  phone_number?: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
}
