/**
 * @file
 * API module exports
 *
 * This file exports all API-related functions and types
 * for cleaner imports throughout the application.
 */

export {
  getDefaultPreferences,
  getUserPreferences,
  updateUserPreferences,
  validatePreferences,
  type DrupalPreferencesResponse,
  type ValidationResult,
} from "./drupal-api";
