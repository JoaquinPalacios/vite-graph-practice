import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { fetchUserDataFromDrupal } from "./api/drupal-api.ts";
import App from "./App.tsx";
import GraphSkeleton from "./components/GraphSkeleton.tsx";
import "./index.css";
import { getChartWidth } from "./lib/charts";
import { ChartDataItem, DrupalApiData, UserStatus } from "./types/index.ts";

/**
 * Initializes the graph by reading Drupal 11 settings from `window.drupalSettings`
 * and fetching user data from the new API endpoint.
 * Transforms the API data into the structure the graph needs and renders the React app.
 */
async function initGraph(): Promise<void> {
  const container = document.getElementById("swell-graph-container");

  // Read Drupal 11 settings only
  const drupalSettings = (window as any).drupalSettings?.swellnetGraph || null;

  if (!container || !drupalSettings || !drupalSettings.apiData) {
    const errorMessage =
      '[GRAPH] Swellnet Graph: Container "#swell-graph-container" or API data (drupalSettings.swellnetGraph.apiData) not found.';
    console.error(errorMessage);
    if (container) {
      container.innerHTML = `<p style="color: red; padding: 1rem;">Error: ${errorMessage}</p>`;
    }
    return;
  }

  // Show initial skeleton while loading all data
  const root = createRoot(container!);
  root.render(
    <StrictMode>
      <GraphSkeleton showMain showWeather showTide />
    </StrictMode>
  );

  // Fetch user data from the new API endpoint
  const userData: UserStatus | null = await fetchUserDataFromDrupal();

  // Merge user data with existing API data structure
  const rawApiData: DrupalApiData = {
    ...drupalSettings.apiData,
    user: {
      hasFullAccess: userData?.hasFullAccess ?? false,
      isPastDue: userData?.isPastDue ?? false,
    },
    preferences: {
      units: {
        surfHeight: userData?.surf_height_preference ?? "ft",
        temperature: userData?.temperature_preference ?? "celsius",
        wind: userData?.wind_preference ?? "knots",
        unitMeasurements: userData?.unit_of_measurement ?? "m",
      },
    },
  };

  console.log("[GRAPH] Swellnet Graph: Drupal Settings Raw API Data", {
    rawApiData,
  });

  // Slice the data for non-subscribers before any calculations
  const sliceDataForSubscription = (data: ChartDataItem[] | undefined) => {
    if (!data) return [];
    if (!rawApiData.user.hasFullAccess) {
      return data.slice(0, 25); // 3 days * 8 data points per day + midnight
    }
    return data;
  };

  // Get sliced data for both models
  const gfsData = sliceDataForSubscription(
    rawApiData.forecasts?.gfs?.forecastSteps
  );
  const ecmwfData = sliceDataForSubscription(
    rawApiData.forecasts?.ecmwf?.forecastSteps
  );

  // Slice weather data for non-subscribers
  const weatherData = rawApiData.weather?.hourly
    ? (() => {
        const timeData = rawApiData.weather.hourly.time;
        const slicedTimeData = !rawApiData.user.hasFullAccess
          ? timeData.slice(0, 25) // 3 days * 8 data points per day + midnight
          : timeData;

        return slicedTimeData.map((time: string, index: number) => ({
          index: 1,
          localDateTimeISO: time,
          currentTemp: rawApiData.weather.hourly.temperature_2m[index],
          weatherId: rawApiData.weather.hourly.weather_code[index],
        }));
      })()
    : [];

  const maxSurfHeight = {
    feet: Math.max(
      ...gfsData.map((d) =>
        d?.primary == null
          ? 0
          : d.secondary?.fullSurfHeightFaceFeet ??
            d.primary.fullSurfHeightFaceFeet ??
            0
      ),
      ...ecmwfData.map((d) =>
        d?.primary == null
          ? 0
          : d.secondary?.fullSurfHeightFaceFeet ??
            d.primary.fullSurfHeightFaceFeet ??
            0
      )
    ),
    surfersFeet: Math.max(
      ...gfsData.map((d) =>
        d?.primary == null
          ? 0
          : d.secondary?.fullSurfHeightFeet ?? d.primary.fullSurfHeightFeet ?? 0
      ),
      ...ecmwfData.map((d) =>
        d?.primary == null
          ? 0
          : d.secondary?.fullSurfHeightFeet ?? d.primary.fullSurfHeightFeet ?? 0
      )
    ),
    meters: Math.max(
      ...gfsData.map((d) =>
        d?.primary == null
          ? 0
          : d.secondary?.fullSurfHeightMetres ??
            d.primary.fullSurfHeightMetres ??
            0
      ),
      ...ecmwfData.map((d) =>
        d?.primary == null
          ? 0
          : d.secondary?.fullSurfHeightMetres ??
            d.primary.fullSurfHeightMetres ??
            0
      )
    ),
  };

  console.log("[GRAPH] Swellnet Graph: Max Surf Height", {
    maxSurfHeight,
  });

  // Calculate chart width based on available data
  const gfsDataLength = gfsData.length;
  const ecmwfDataLength = ecmwfData.length;

  // For non-subscribers, limit to 25 data points (3 days + midnight)
  const maxDataLength = !rawApiData.user.hasFullAccess
    ? 25 // 3 days * 8 data points per day
    : Math.max(gfsDataLength, ecmwfDataLength);

  const chartWidth = getChartWidth(maxDataLength || 128);

  // Store the raw API data globally for forecast type switching
  (window as unknown as { swellnetRawData: DrupalApiData }).swellnetRawData = {
    ...rawApiData,
    forecasts: {
      gfs: {
        ...rawApiData.forecasts?.gfs,
        forecastSteps: gfsData,
      },
      ecmwf: {
        ...rawApiData.forecasts?.ecmwf,
        forecastSteps: ecmwfData,
      },
    },
  };

  // Log missing forecast data
  if (!gfsData.length && !ecmwfData.length) {
    console.warn(
      "[GRAPH] Swellnet Graph: No forecast data available from either GFS or ECMWF models"
    );
  } else if (!gfsData.length) {
    console.warn("[GRAPH] Swellnet Graph: No GFS forecast data available");
  } else if (!ecmwfData.length) {
    console.warn("[GRAPH] Swellnet Graph: No ECMWF forecast data available");
  }

  // Get the first available timestamp from any data source
  const firstTimestamp =
    gfsData[0]?.localDateTimeISO ||
    ecmwfData[0]?.localDateTimeISO ||
    rawApiData.weather?.hourly?.time?.[0] ||
    new Date().toISOString();

  // Prepare props for the App component
  const appProps = {
    rawApiData,
    // mobileContext,
    locationName: rawApiData.location?.name || "Unknown Location",
    timezone: rawApiData.location?.timezone || "UTC",
    localDateTimeISO: firstTimestamp,
    isAustralia: rawApiData.location?.isAustralia || false,
    defaultPreferences: {
      units: {
        surfHeight: (rawApiData.preferences?.units?.surfHeight === "ft"
          ? "ft"
          : rawApiData.preferences?.units?.surfHeight === "m"
          ? "m"
          : "surfers_feet") as "ft" | "m" | "surfers_feet",
        temperature: rawApiData.preferences?.units?.temperature || "celsius",
        wind: rawApiData.preferences?.units?.wind || "knots",
        unitMeasurements:
          rawApiData.preferences?.units?.unitMeasurements || "m",
      },
      showAdvancedChart: false,
    },
    maxSurfHeight,
    chartWidth,
    currentWeatherData: rawApiData.weather?.current || null,
    weatherData,
    tideData: rawApiData.tide ? rawApiData.tide : [],
    surfReport: rawApiData.surf_report || [],
    surfcams: rawApiData.surfcams ? rawApiData.surfcams : [],
  };

  // Re-render with the complete data (this replaces the skeleton)
  root.render(
    <StrictMode>
      <App {...appProps} />
    </StrictMode>
  );
}

// --- Run Initialization ---
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initGraph().catch((error) => {
      console.error("[GRAPH] Failed to initialize graph:", error);
    });
  });
} else {
  initGraph().catch((error) => {
    console.error("[GRAPH] Failed to initialize graph:", error);
  });
}
