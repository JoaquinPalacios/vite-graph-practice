import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getChartWidth } from "./lib/charts";
import { ChartDataItem, DrupalApiData, MobileContext } from "./types/index.ts";

/**
 * This function initializes the graph by getting the container and
 * the Drupal settings. It then checks if the container and settings are valid
 * and if the API data is valid. If so, it transforms the raw forecast steps
 * into the structure the graph needs and renders the React component.
 */
function initGraph() {
  const container = document.getElementById("swell-graph-container");

  // 🚀 DRUPAL 11 UPDATE: Check modern drupalSettings first, then legacy format
  const getDrupalSettings = () => {
    // Try modern Drupal 11 format first
    const modernSettings = (window as any).drupalSettings?.swellnetGraph;
    if (modernSettings) {
      console.log("✅ Using Drupal 11 drupalSettings format");
      return modernSettings;
    }

    // Fallback to legacy Drupal 7 format
    const legacySettings = (window as any).Drupal?.settings?.swellnetGraph;
    if (legacySettings) {
      console.log("⚠️ Using legacy Drupal.settings format");
      return legacySettings;
    }

    return null;
  };

  const drupalSettings = getDrupalSettings();

  if (!container || !drupalSettings || !drupalSettings.apiData) {
    const errorMessage =
      'Swellnet Graph: Container "#swell-graph-container" or API data (drupalSettings.swellnetGraph.apiData) not found.';
    console.error(errorMessage);
    if (container) {
      container.innerHTML = `<p style="color: red; padding: 1rem;">Error: ${errorMessage}</p>`;
    }
    return;
  }

  const rawApiData: DrupalApiData = drupalSettings.apiData;
  const mobileContext: MobileContext = drupalSettings.mobileContext ?? {
    isWebView: false,
    appVersion: "0.0.0",
    featureFlags: {
      supportsStyleUpdates: false,
      supportsAdvancedChart: false,
    },
  };

  console.log("Swellnet Graph: Drupal Settings Raw API Data", { rawApiData });

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

  // Find the specific data point that contains the maximum height
  const findMaxHeightDetails = () => {
    let maxFeet = 0;
    let maxSurfersFeet = 0;
    let maxMeters = 0;
    let maxFeetDetails: {
      model: string;
      dateTime: string;
      height: number;
    } | null = null;
    let maxSurfersFeetDetails: {
      model: string;
      dateTime: string;
      height: number;
    } | null = null;
    let maxMetersDetails: {
      model: string;
      dateTime: string;
      height: number;
    } | null = null;

    // Check GFS data
    gfsData.forEach((d) => {
      const feetHeight =
        d?.primary == null
          ? 0
          : d.secondary?.fullSurfHeightFaceFeet ??
            d.primary.fullSurfHeightFaceFeet ??
            0;
      const surfersFeetHeight =
        d?.primary == null
          ? 0
          : d.secondary?.fullSurfHeightFaceFeet ??
            d.primary.fullSurfHeightFaceFeet ??
            0;
      const metersHeight =
        d?.primary == null
          ? 0
          : d.secondary?.fullSurfHeightMetres ??
            d.primary.fullSurfHeightMetres ??
            0;

      if (feetHeight > maxFeet) {
        maxFeet = feetHeight;
        maxFeetDetails = {
          model: "GFS",
          dateTime: d.localDateTimeISO,
          height: feetHeight,
        };
      }

      if (surfersFeetHeight > maxSurfersFeet) {
        maxSurfersFeet = surfersFeetHeight;
        maxSurfersFeetDetails = {
          model: "GFS",
          dateTime: d.localDateTimeISO,
          height: surfersFeetHeight,
        };
      }

      if (metersHeight > maxMeters) {
        maxMeters = metersHeight;
        maxMetersDetails = {
          model: "GFS",
          dateTime: d.localDateTimeISO,
          height: metersHeight,
        };
      }
    });

    // Check ECMWF data
    ecmwfData.forEach((d) => {
      const feetHeight =
        d?.primary == null
          ? 0
          : d.secondary?.fullSurfHeightFaceFeet ??
            d.primary.fullSurfHeightFaceFeet ??
            0;
      const surfersFeetHeight =
        d?.primary == null
          ? 0
          : d.secondary?.fullSurfHeightFaceFeet ??
            d.primary.fullSurfHeightFaceFeet ??
            0;
      const metersHeight =
        d?.primary == null
          ? 0
          : d.secondary?.fullSurfHeightMetres ??
            d.primary.fullSurfHeightMetres ??
            0;

      if (feetHeight > maxFeet) {
        maxFeet = feetHeight;
        maxFeetDetails = {
          model: "ECMWF",
          dateTime: d.localDateTimeISO,
          height: feetHeight,
        };
      }

      if (surfersFeetHeight > maxSurfersFeet) {
        maxSurfersFeet = surfersFeetHeight;
        maxSurfersFeetDetails = {
          model: "ECMWF",
          dateTime: d.localDateTimeISO,
          height: surfersFeetHeight,
        };
      }

      if (metersHeight > maxMeters) {
        maxMeters = metersHeight;
        maxMetersDetails = {
          model: "ECMWF",
          dateTime: d.localDateTimeISO,
          height: metersHeight,
        };
      }
    });

    return { maxFeetDetails, maxMetersDetails, maxSurfersFeetDetails };
  };

  const maxHeightDetails = findMaxHeightDetails();

  console.log({
    maxSurfHeight,
    maxHeightDetails: {
      feet: maxHeightDetails.maxFeetDetails,
      meters: maxHeightDetails.maxMetersDetails,
      surfersFeet: maxHeightDetails.maxSurfersFeetDetails,
    },
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
      "Swellnet Graph: No forecast data available from either GFS or ECMWF models"
    );
  } else if (!gfsData.length) {
    console.warn("Swellnet Graph: No GFS forecast data available");
  } else if (!ecmwfData.length) {
    console.warn("Swellnet Graph: No ECMWF forecast data available");
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
    mobileContext,
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

  // Render the React component
  const root = createRoot(container!);
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
