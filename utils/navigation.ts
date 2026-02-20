/**
 * Navigate to a route using HTML5 History API (clean URLs)
 * @param path - Route path (e.g., "about", "activities", "activity/123")
 */
export const navigateTo = (path: string) => {
  const url = !path || path === "home" ? "/" : `/${path}`;
  globalThis.history.pushState(null, "", url);
  globalThis.dispatchEvent(new PopStateEvent("popstate"));
};

/**
 * Replace current route without adding to history
 * @param path - Route path
 */
export const replaceTo = (path: string) => {
  const url = !path || path === "home" ? "/" : `/${path}`;
  globalThis.history.replaceState(null, "", url);
  globalThis.dispatchEvent(new PopStateEvent("popstate"));
};
