/**
 * @file
 * Drupal API helper functions for managing user preferences.
 *
 * This module provides functions to save and retrieve user preferences
 * from the Drupal backend, with validation and error handling.
 */

import { DrupalUserApiResponse, UnitPreferences, UserStatus } from "@/types";
import { API_ENDPOINTS } from "./config";

// Types for API communication
export interface DrupalPreferencesResponse {
  success: boolean;
  data?: Partial<UnitPreferences["units"]>;
  message?: string;
  errors?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Retrieves CSRF token from Drupal
 */
const getCsrfToken = async (): Promise<string> => {
  try {
    const response = await fetch(API_ENDPOINTS.CSRF_TOKEN, {
      method: "GET",
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve CSRF token: ${response.status}`);
    }

    const token = await response.text();
    return token;
  } catch (error) {
    console.error("[GRAPH] ❌ Error retrieving CSRF token:", error);
    throw error;
  }
};

/**
 * Updates user preferences in Drupal
 * Uses the active preferences endpoint with proper session authentication and CSRF token
 */
export const updateUserPreferences = async (
  preferences: Partial<UnitPreferences["units"]>
): Promise<DrupalPreferencesResponse> => {
  try {
    // Get CSRF token from Drupal
    const csrfToken = await getCsrfToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRF-Token": csrfToken,
    };

    const response = await fetch(API_ENDPOINTS.PREFERENCES, {
      method: "POST",
      headers,
      credentials: "same-origin", // Use same-origin for session cookies and CSRF tokens
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      console.error(
        `[GRAPH] ❌ Failed to update user preferences: ${response.status} ${response.statusText}`
      );

      // Log the response body for debugging
      try {
        const errorText = await response.text();
        console.error("[GRAPH] ❌ Error response body:", errorText);
      } catch (e) {
        console.error("[GRAPH] ❌ Could not read error response body");
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("[GRAPH] ❌ Error updating user preferences:", error);
    throw error;
  }
};

/**
 * Retrieves user preferences from the user data (deprecated - use fetchUserDataFromDrupal instead)
 * This function is kept for backward compatibility but now uses the new API
 */
export const getUserPreferences = async (): Promise<
  UnitPreferences["units"]
> => {
  try {
    const userData = await fetchUserDataFromDrupal();

    if (!userData) {
      console.warn("[GRAPH] No user data available, returning defaults");
      return getDefaultPreferences();
    }

    return {
      surfHeight: userData.surf_height_preference,
      temperature: userData.temperature_preference,
      wind: userData.wind_preference,
      unitMeasurements: userData.unit_of_measurement,
    };
  } catch (error) {
    console.error("Failed to get user preferences:", error);
    // Return defaults if API fails
    return getDefaultPreferences();
  }
};

/**
 * Validates preference values
 */
export const validatePreferences = (
  preferences: Partial<UnitPreferences["units"]>
): ValidationResult => {
  const errors: string[] = [];

  // Validate surf height
  if (
    preferences.surfHeight &&
    !["ft", "m", "surfers_feet"].includes(preferences.surfHeight)
  ) {
    errors.push("Invalid surf height unit");
  }

  // Validate temperature
  if (
    preferences.temperature &&
    !["celsius", "fahrenheit"].includes(preferences.temperature)
  ) {
    errors.push("Invalid temperature unit");
  }

  // Validate wind
  if (preferences.wind && !["knots", "km", "mph"].includes(preferences.wind)) {
    errors.push("Invalid wind unit");
  }

  // Validate unit measurements
  if (
    preferences.unitMeasurements &&
    !["m", "ft"].includes(preferences.unitMeasurements)
  ) {
    errors.push("Invalid measurement unit");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Fetches user data from the new Drupal API endpoint
 */
export const fetchUserDataFromDrupal = async (): Promise<UserStatus | null> => {
  try {
    const response = await fetch(API_ENDPOINTS.USER_DATA, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin", // Include session cookies and CSRF tokens
    });

    if (!response.ok) {
      console.error(
        `[GRAPH] ❌ Failed to fetch user data: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const apiResponse: DrupalUserApiResponse = await response.json();

    // Transform the API response to match our UserStatus interface
    const userStatus: UserStatus = {
      isLoggedIn: apiResponse.user_status.isLoggedIn,
      username: apiResponse.user.username,
      userId: apiResponse.user.userId,
      isSubscriber: apiResponse.user.isSubscriber,
      isPastDue: apiResponse.user.isPastDue,
      userLocationCountry: apiResponse.user.userLocationCountry,
      userLocationRegion: apiResponse.user.userLocationRegion,
      surf_height_preference: apiResponse.user.surf_height_preference,
      wind_preference: apiResponse.user.wind_preference,
      temperature_preference: apiResponse.user.temperature_preference,
      unit_of_measurement: apiResponse.user.unit_of_measurement,
    };

    return userStatus;
  } catch (error) {
    console.error(
      "[GRAPH] ❌ Error fetching user data from Drupal API:",
      error
    );
    return null;
  }
};

/**
 * Gets default preferences
 */
export const getDefaultPreferences = (): UnitPreferences["units"] => {
  return {
    surfHeight: "ft",
    temperature: "celsius",
    wind: "knots",
    unitMeasurements: "m",
  };
};
