import { TokenPayload } from '../types/auth';

const TOKEN_KEY = 'uk_commission_token';
const REFRESH_TOKEN_KEY = 'uk_commission_refresh_token';

/**
 * Get authentication token from storage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

/**
 * Set authentication token in storage
 */
export const setToken = (token: string, remember: boolean = false): void => {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Remove authentication token from storage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Get refresh token from storage
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Set refresh token in storage
 */
export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Decode JWT token payload
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Check if token is valid (exists and not expired)
 */
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;

  return !isTokenExpired(token);
};

/**
 * Get user info from token
 */
export const getUserFromToken = (): Partial<TokenPayload> | null => {
  const token = getToken();
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload || isTokenExpired(token)) {
    removeToken();
    return null;
  }

  return payload;
};

/**
 * Format authorization header
 */
export const getAuthHeader = (): string | null => {
  const token = getToken();
  return token ? `Bearer ${token}` : null;
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (permission: string): boolean => {
  const user = getUserFromToken();
  return user?.permissions?.includes(permission as any) || false;
};

/**
 * Check if user has specific role
 */
export const hasRole = (role: string): boolean => {
  const user = getUserFromToken();
  return user?.role === role;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (roles: string[]): boolean => {
  const user = getUserFromToken();
  return user?.role ? roles.includes(user.role) : false;
};

/**
 * Get time until token expires (in seconds)
 */
export const getTokenTimeToExpiry = (): number => {
  const token = getToken();
  if (!token) return 0;

  const payload = decodeToken(token);
  if (!payload) return 0;

  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - currentTime);
};

/**
 * Check if token will expire soon (within specified minutes)
 */
export const isTokenExpiringSoon = (minutes: number = 5): boolean => {
  const timeToExpiry = getTokenTimeToExpiry();
  return timeToExpiry > 0 && timeToExpiry < (minutes * 60);
};
