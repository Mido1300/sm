// Utility functions for localStorage persistence
export function saveToLocalStorage<T>(key: string, value: T) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getFromLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);
  }
  return fallback;
}

export function removeFromLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}
