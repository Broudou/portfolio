let navHeight = $state(72);

/**
 * The fixed top bar's live measured height (see Nav.svelte), so other public
 * layout pieces can pad content below it now that the header is `position:
 * fixed` and out of document flow. Mutated only from a client-only `$effect`,
 * so it's safe as shared module state despite never resetting between
 * navigations.
 */
export const pageChrome = {
  get navHeight() {
    return navHeight;
  },
  setNavHeight(value: number) {
    navHeight = value;
  },
};
