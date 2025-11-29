/**
 * Utility functions for localStorage operations
 * Centralized storage management for MoyoClub
 */

const STORAGE_KEYS = {
  CURRENT_USER: "moyoclub_current_user",
  CURRENT_CORPORATE: "moyoclub_current_corporate",
  CURRENT_SITE_ADMIN: "moyoclub_current_site_admin",
  CURRENT_WAREHOUSE_MANAGER: "moyoclub_current_warehouse_manager",
  ORDERS: "moyoclub_orders",
  SEEN_WELCOME: "moyoclub_seen_welcome",
} as const;

/**
 * Get an item from localStorage and parse it
 */
export const getStorageItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    localStorage.removeItem(key);
    return null;
  }
};

/**
 * Set an item in localStorage
 */
export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

/**
 * Remove an item from localStorage
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

/**
 * Check if a storage key has been set
 */
export const hasStorageItem = (key: string): boolean => {
  return localStorage.getItem(key) !== null;
};

export { STORAGE_KEYS };
