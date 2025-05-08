import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { DrupalApiData } from "./types/index.ts";
import { getChartWidth } from "./utils/chart-utils";

/**
 * Ensures we only use complete days of data (8 data points per day)
 * @param data - Array of data points
 * @returns Array trimmed to complete days
 */
function trimToCompleteDays<T>(data: T[]): T[] {
  const completeDays = Math.floor(data.length / 8);
  return data.slice(0, completeDays * 8);
}

/**
 * This function initializes the graph by getting the container and
 * the Drupal settings. It then checks if the container and settings are valid
 * and if the API data is valid. If so, it transforms the raw forecast steps
 * into the structure the graph needs and renders the React component.
 */
function initGraph() {
  const container = document.getElementById("swell-graph-container");
  const drupalSettings = (
    window as unknown as {
      Drupal?: { settings?: { swellnetGraph?: { apiData?: DrupalApiData } } };
    }
  ).Drupal?.settings?.swellnetGraph;

  console.log("Vite: Drupal settings:", drupalSettings);

  if (
    container &&
    drupalSettings &&
    drupalSettings.apiData &&
    !drupalSettings.apiData.error
  ) {
    const rawApiData: DrupalApiData = drupalSettings.apiData;

    // Calculate max surf height from both models
    const maxSurfHeight =
      rawApiData.preferences.units.surfHeight === "ft"
        ? Math.max(
            ...rawApiData.forecasts.gfs.forecastSteps.map(
              (d) =>
                d.secondary?.fullSurfHeightFeet ??
                d.primary.fullSurfHeightFeet ??
                0
            ),
            ...rawApiData.forecasts.ecmwf.forecastSteps.map(
              (d) =>
                d.secondary?.fullSurfHeightFeet ??
                d.primary.fullSurfHeightFeet ??
                0
            )
          )
        : Math.max(
            ...rawApiData.forecasts.gfs.forecastSteps.map(
              (d) =>
                d.secondary?.fullSurfHeightMetres ??
                d.primary.fullSurfHeightMetres ??
                0
            ),
            ...rawApiData.forecasts.ecmwf.forecastSteps.map(
              (d) =>
                d.secondary?.fullSurfHeightMetres ??
                d.primary.fullSurfHeightMetres ??
                0
            )
          );

    // Calculate chart width based on the model with the most complete days
    const gfsDataLength = trimToCompleteDays(
      rawApiData.forecasts.gfs.forecastSteps
    ).length;
    const ecmwfDataLength = trimToCompleteDays(
      rawApiData.forecasts.ecmwf.forecastSteps
    ).length;
    const maxDataLength = Math.max(gfsDataLength, ecmwfDataLength);
    const chartWidth = getChartWidth(maxDataLength);

    // Store the raw API data globally for forecast type switching
    (window as unknown as { swellnetRawData: DrupalApiData }).swellnetRawData =
      rawApiData;

    console.log("Vite: Raw API data before init:", rawApiData);

    // Prepare props for the App component
    const appProps = {
      rawApiData,
      locationName: rawApiData.location.name,
      timezone: rawApiData.location.timezone,
      localDateTimeISO:
        rawApiData.forecasts.gfs.forecastSteps[0].localDateTimeISO,
      bulletinDateTimeUtc: rawApiData.forecasts.gfs.bulletinDateTimeUtc
        ? rawApiData.forecasts.gfs.bulletinDateTimeUtc
        : "unknown",
      defaultPreferences: {
        units: {
          surfHeight: (rawApiData.preferences.units.surfHeight === "ft"
            ? "ft"
            : "m") as "ft" | "m",
          temperature: rawApiData.preferences.units.temperature,
          wind: rawApiData.preferences.units.wind,
        },
        showAdvancedChart: false,
      },
      maxSurfHeight: maxSurfHeight,
      chartWidth: chartWidth,
      weatherData: rawApiData.weather.hourly
        ? (() => {
            const isEcmwf = rawApiData.forecasts.ecmwf.forecastSteps.length > 0;
            const maxHours = isEcmwf
              ? 240
              : rawApiData.weather.hourly.time.length;
            return rawApiData.weather.hourly.time
              .slice(0, maxHours)
              .map((time: string, index: number) => ({
                index: 1,
                localDateTimeISO: time,
                currentTemp: rawApiData.weather.hourly.temperature_2m[index],
                weatherId: rawApiData.weather.hourly.weather_code[index],
              }));
          })()
        : [],
    };

    // Render the React component
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <App {...appProps} />
      </StrictMode>
    );
  } else {
    const errorMessage =
      drupalSettings?.apiData?.error ||
      'Swellnet Graph: Container "#swell-graph-container" or valid API data (Drupal.settings.swellnetGraph.apiData) not found.';
    console.error(errorMessage);
    if (container) {
      container.innerHTML = `<p style="color: red; padding: 1rem;">Error: ${errorMessage}</p>`;
    }
  }
}

// --- Run Initialization ---
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGraph);
} else {
  initGraph();
}
