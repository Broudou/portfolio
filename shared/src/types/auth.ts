import type { Role } from '../constants/enums.js';

/** Minimal identity claims carried in the JWT and exposed to the client. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  /**
   * Raw JWT. The browser never sees this directly — SvelteKit's login
   * action receives it over a server-to-server call and stores it in its
   * own httpOnly cookie (see client/src/routes/admin/login/+page.server.ts).
   */
  token: string;
}
