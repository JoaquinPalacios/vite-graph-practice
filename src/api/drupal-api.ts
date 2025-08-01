/**
 * @file
 * Drupal API helper functions for managing user preferences.
 *
 * This module provides functions to save and retrieve user preferences
 * from the Drupal backend, with validation and error handling.
 */

import { UnitPreferences } from "@/types";

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
 * Updates user preferences in Drupal
 */
export const updateUserPreferences = async (
  preferences: Partial<UnitPreferences["units"]>
): Promise<DrupalPreferencesResponse> => {
  try {
    const response = await fetch("/api/forecast/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update user preferences:", error);
    throw error;
  }
};

/**
 * Retrieves user preferences from Drupal
 */
export const getUserPreferences = async (): Promise<
  UnitPreferences["units"]
> => {
  try {
    const response = await fetch("/api/forecast/preferences", {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.preferences || getDefaultPreferences();
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
