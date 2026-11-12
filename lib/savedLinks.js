// Links created in this browser are remembered in localStorage, so no login is needed.
// Each item looks like { shorturl, manageKey }.
const STORAGE_KEY = "shortlinks:mine";

export function getSavedLinks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveLink(item) {
  const list = getSavedLinks();
  list.unshift(item); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
}

export function removeSavedLink(shorturl) {
  const list = getSavedLinks().filter((item) => item.shorturl !== shorturl);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
