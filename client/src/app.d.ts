import type { AuthUser } from '@portfolio/shared';

// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
  namespace App {
    interface Locals {
      user: AuthUser | null;
      /** Raw JWT for the current request, forwarded server-to-server to the API as a Bearer token. */
      token: string | null;
    }
    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
