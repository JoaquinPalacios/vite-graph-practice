import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  DrupalApiData,
  TideDataAustraliaFromDrupal,
  TideDataWorldWideFromDrupal,
} from "./types/index.ts";
import { getChartWidth } from "./utils/chart-utils";
import { trimToCompleteDays } from "./lib/data-processing.ts";

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

  if (!container || !drupalSettings || !drupalSettings.apiData) {
    const errorMessage =
      'Swellnet Graph: Container "#swell-graph-container" or API data (Drupal.settings.swellnetGraph.apiData) not found.';
    console.error(errorMessage);
    if (container) {
      container.innerHTML = `<p style="color: red; padding: 1rem;">Error: ${errorMessage}</p>`;
    }
    return;
  }

  const rawApiData: DrupalApiData = drupalSettings.apiData;

  // Log missing forecast data
  if (
    !rawApiData.forecasts?.gfs?.forecastSteps?.length &&
    !rawApiData.forecasts?.ecmwf?.forecastSteps?.length
  ) {
    console.warn(
      "Swellnet Graph: No forecast data available from either GFS or ECMWF models"
    );
  } else if (!rawApiData.forecasts?.gfs?.forecastSteps?.length) {
    console.warn("Swellnet Graph: No GFS forecast data available");
  } else if (!rawApiData.forecasts?.ecmwf?.forecastSteps?.length) {
    console.warn("Swellnet Graph: No ECMWF forecast data available");
  }

  // Calculate max surf height from available models
  const maxSurfHeight = {
    feet: Math.max(
      ...(rawApiData.forecasts?.gfs?.forecastSteps?.map(
        (d) =>
          d.secondary?.fullSurfHeightFeet ?? d.primary.fullSurfHeightFeet ?? 0
      ) ?? [0]),
      ...(rawApiData.forecasts?.ecmwf?.forecastSteps?.map(
        (d) =>
          d.secondary?.fullSurfHeightFeet ?? d.primary.fullSurfHeightFeet ?? 0
      ) ?? [0])
    ),
    meters: Math.max(
      ...(rawApiData.forecasts?.gfs?.forecastSteps?.map(
        (d) =>
          d.secondary?.fullSurfHeightMetres ??
          d.primary.fullSurfHeightMetres ??
          0
      ) ?? [0]),
      ...(rawApiData.forecasts?.ecmwf?.forecastSteps?.map(
        (d) =>
          d.secondary?.fullSurfHeightMetres ??
          d.primary.fullSurfHeightMetres ??
          0
      ) ?? [0])
    ),
  };

  // Calculate chart width based on available data
  const gfsDataLength = rawApiData.forecasts?.gfs?.forecastSteps
    ? trimToCompleteDays(rawApiData.forecasts.gfs.forecastSteps).length
    : 0;
  const ecmwfDataLength = rawApiData.forecasts?.ecmwf?.forecastSteps
    ? trimToCompleteDays(rawApiData.forecasts.ecmwf.forecastSteps).length
    : 0;
  const maxDataLength = Math.max(gfsDataLength, ecmwfDataLength);
  const chartWidth = getChartWidth(maxDataLength || 128);

  // Store the raw API data globally for forecast type switching
  (window as unknown as { swellnetRawData: DrupalApiData }).swellnetRawData =
    rawApiData;

  console.log("Vite: Raw API data before init:", rawApiData);

  // Get the first available timestamp from any data source
  const firstTimestamp =
    rawApiData.forecasts?.gfs?.forecastSteps?.[0]?.localDateTimeISO ||
    rawApiData.forecasts?.ecmwf?.forecastSteps?.[0]?.localDateTimeISO ||
    rawApiData.weather?.hourly?.time?.[0] ||
    new Date().toISOString();

  // Prepare props for the App component
  const appProps = {
    rawApiData,
    locationName: rawApiData.location?.name || "Unknown Location",
    timezone: rawApiData.location?.timezone || "UTC",
    localDateTimeISO: firstTimestamp,
    isAustralia: rawApiData.location?.isAustralia || false,
    defaultPreferences: {
      units: {
        surfHeight: (rawApiData.preferences?.units?.surfHeight === "ft"
          ? "ft"
          : "m") as "ft" | "m",
        temperature: rawApiData.preferences?.units?.temperature || "c",
        wind: rawApiData.preferences?.units?.wind || "kmh",
      },
      showAdvancedChart: false,
    },
    maxSurfHeight: maxSurfHeight,
    chartWidth: chartWidth,
    currentWeatherData: rawApiData.weather?.current || null,
    sunriseSunsetData: rawApiData.weather?.daily || [],
    weatherData: rawApiData.weather?.hourly
      ? rawApiData.weather.hourly.time.map((time: string, index: number) => ({
          index: 1,
          localDateTimeISO: time,
          currentTemp: rawApiData.weather.hourly.temperature_2m[index],
          weatherId: rawApiData.weather.hourly.weather_code[index],
        }))
      : [],
    tideData: rawApiData.location?.isAustralia
      ? (rawApiData.tide as TideDataAustraliaFromDrupal[]) || []
      : (rawApiData.tide as TideDataWorldWideFromDrupal[]) || [],
    surfReport: rawApiData.surf_report || [],
  };

  // Render the React component
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App {...appProps} />
    </StrictMode>
  );
}

// --- Run Initialization ---
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGraph);
} else {
  initGraph();
}
