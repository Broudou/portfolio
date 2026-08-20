let navTransparent = $state(false);
let navHeight = $state(72);

/**
 * Coordinates the fixed top bar with a page-level hero banner (Home,
 * Biography). The header is `position: fixed` and out of document flow, so
 * `navHeight` lets other layout pieces pad content below it. `navTransparent`
 * is toggled by the active hero banner while scroll position is within its
 * own height — both fields are mutated only from client-only `$effect`s
 * (never during SSR), so they're safe as shared module state despite never
 * being reset between navigations.
 *
 * Whether the *current* page has an active hero banner at all is NOT tracked
 * here — that has to be known synchronously during SSR (to avoid a
 * padding-top layout shift on first paint), so it's computed from each
 * page's own load data instead (see `hasHeroBackground` in the Home/
 * Biography `+page.server.ts` files) and read directly from `page.data`.
 */
export const pageChrome = {
  get navTransparent() {
    return navTransparent;
  },
  get navHeight() {
    return navHeight;
  },
  setNavTransparent(value: boolean) {
    navTransparent = value;
  },
  setNavHeight(value: number) {
    navHeight = value;
  },
};
