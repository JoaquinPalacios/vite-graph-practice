/**
 * API configuration for Drupal endpoints
 *
 * API endpoints - using relative URLs so they work across all environments
 */

export const API_ENDPOINTS = {
  USER_DATA: "/api/navigation/user/get", // Used for fetching user data and preferences
  PREFERENCES: "/api/forecast/preferences", // Used for updating user preferences
  // Required for CSRF security
  CSRF_TOKEN: "/session/token",
} as const;

export type ApiEndpoint = keyof typeof API_ENDPOINTS;
