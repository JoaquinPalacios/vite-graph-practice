import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BigPipeContainerTester } from "./lib/bigpipe-container-test";
import { BigPipeDebugger } from "./lib/bigpipe-debug";
import { BigPipeTester } from "./lib/bigpipe-test";
import { getChartWidth } from "./lib/charts";
import { ChartDataItem, DrupalApiData, MobileContext } from "./types/index.ts";

/**
 * BigPipe-optimized main entry point
 * Sets up the application shell and global data for other entries to use
 */
function initBigPipeApp() {
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

  if (!container) {
    console.error('BigPipe App: Container "#swell-graph-container" not found.');
    return;
  }

  // Handle case where initial data is not available (BigPipe will provide it later)
  if (!drupalSettings || !drupalSettings.apiData) {
    console.log(
      "BigPipe App: Initial data not available, waiting for BigPipe chunks..."
    );
    renderShellApp(container, null, null);
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

  console.log("BigPipe App: Initial data loaded", {
    hasGFS: !!rawApiData.forecasts?.gfs?.forecastSteps?.length,
    hasECMWF: !!rawApiData.forecasts?.ecmwf?.forecastSteps?.length,
    hasWeather: !!rawApiData.weather?.hourly,
    hasTides: !!rawApiData.tide?.length,
    userAccess: rawApiData.user?.hasFullAccess,
  });

  renderShellApp(container, rawApiData, mobileContext);
}

/**
 * Render the main application shell
 * This is a lightweight container that provides the basic structure
 */
function renderShellApp(
  container: HTMLElement,
  rawApiData: DrupalApiData | null,
  mobileContext: MobileContext | null
) {
  // Set up global data for BigPipe entries to use
  if (rawApiData) {
    setupGlobalData(rawApiData, mobileContext);
  }

  // Render lightweight app shell
  if (!rawApiData) {
    // Render loading state while waiting for BigPipe data
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <div className="tw:p-4 tw:text-center">
          <div className="tw:animate-pulse">Loading forecast data...</div>
        </div>
      </StrictMode>
    );
    return;
  }

  const appProps = buildAppProps(rawApiData, mobileContext);

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App {...appProps} />
    </StrictMode>
  );

  // Set up BigPipe event listeners for dynamic data loading
  setupBigPipeEventListeners();

  // Initialize BigPipe testing
  initializeBigPipeTesting();
}

/**
 * Set up global data that BigPipe entries can access
 */
function setupGlobalData(
  rawApiData: DrupalApiData,
  mobileContext: MobileContext | null
) {
  // Store processed data globally for other entries
  const processedData = processApiDataForBigPipe(rawApiData);

  (window as any).swellnetRawData = processedData;
  (window as any).swellnetMobileContext = mobileContext;

  console.log("BigPipe: Global data setup complete", {
    hasGFS: !!processedData.forecasts?.gfs?.forecastSteps?.length,
    hasECMWF: !!processedData.forecasts?.ecmwf?.forecastSteps?.length,
    hasWeather: !!processedData.weather?.hourly,
    hasTides: !!processedData.tide?.length,
    userAccess: processedData.user?.hasFullAccess,
  });
}

/**
 * Process API data for BigPipe usage
 */
function processApiDataForBigPipe(rawApiData: DrupalApiData): DrupalApiData {
  // Slice data for non-subscribers
  const sliceDataForSubscription = (data: ChartDataItem[] | undefined) => {
    if (!data) return [];
    if (!rawApiData.user?.hasFullAccess) {
      return data.slice(0, 25); // 3 days * 8 data points per day + midnight
    }
    return data;
  };

  // Process forecast data
  const gfsData = sliceDataForSubscription(
    rawApiData.forecasts?.gfs?.forecastSteps
  );
  const ecmwfData = sliceDataForSubscription(
    rawApiData.forecasts?.ecmwf?.forecastSteps
  );

  // Process weather data
  const weatherData = rawApiData.weather?.hourly
    ? (() => {
        const timeData = rawApiData.weather.hourly.time;
        const slicedTimeData = !rawApiData.user?.hasFullAccess
          ? timeData.slice(0, 25)
          : timeData;

        return slicedTimeData.map((time: string, index: number) => ({
          index: index + 1,
          localDateTimeISO: time,
          currentTemp: rawApiData.weather.hourly.temperature_2m[index],
          weatherId: rawApiData.weather.hourly.weather_code[index],
        }));
      })()
    : undefined;

  const processedData = {
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

  // Store processed weather data separately
  (processedData as any).processedWeatherData = weatherData;

  return processedData;
}

/**
 * Build app props from processed data
 */
function buildAppProps(
  rawApiData: DrupalApiData,
  mobileContext: MobileContext | null
) {
  const processedData = (window as any).swellnetRawData || rawApiData;

  // Calculate basic metrics
  const gfsData = processedData.forecasts?.gfs?.forecastSteps || [];
  const ecmwfData = processedData.forecasts?.ecmwf?.forecastSteps || [];
  const maxDataLength = !rawApiData.user?.hasFullAccess
    ? 25
    : Math.max(gfsData.length, ecmwfData.length);
  const chartWidth = getChartWidth(maxDataLength || 128);

  // Calculate max surf height (simplified for shell)
  const maxSurfHeight = calculateMaxSurfHeight(gfsData, ecmwfData);

  return {
    rawApiData: processedData,
    mobileContext: mobileContext || createDefaultMobileContext(),
    locationName: rawApiData.location?.name || "Unknown Location",
    timezone: rawApiData.location?.timezone || "UTC",
    localDateTimeISO: getFirstTimestamp(processedData),
    isAustralia: rawApiData.location?.isAustralia || false,
    defaultPreferences: buildDefaultPreferences(rawApiData),
    maxSurfHeight,
    chartWidth,
    currentWeatherData: rawApiData.weather?.current || null,
    weatherData: processedData.processedWeatherData || [],
    tideData: rawApiData.tide || [],
    surfReport: rawApiData.surf_report || [],
    surfcams: rawApiData.surfcams || [],
  };
}

/**
 * Set up BigPipe event listeners for coordinated loading
 */
function setupBigPipeEventListeners() {
  // Listen for initial data chunks
  document.addEventListener("bigpipe:initial-data", (event: Event) => {
    const customEvent = event as CustomEvent;
    const { data } = customEvent.detail;
    console.log("BigPipe: Initial data received", data);
    setupGlobalData(data, null);
  });

  // Listen for app updates
  document.addEventListener("bigpipe:app-update", (event: Event) => {
    const customEvent = event as CustomEvent;
    const { data } = customEvent.detail;
    console.log("BigPipe: App update received", data);
    // Update global data and trigger re-renders as needed
  });
}

/**
 * Initialize BigPipe testing functionality
 */
function initializeBigPipeTesting() {
  const tester = BigPipeTester.getInstance();
  const bigPipeDebugger = BigPipeDebugger.getInstance();

  // Start monitoring BigPipe events
  bigPipeDebugger.startMonitoring();

  // Run tests after a short delay to ensure everything is loaded
  setTimeout(() => {
    tester.runAllTests();
  }, 2000);

  // Make tester and debugger available globally for manual testing
  (window as any).runBigPipeTests = () => tester.runAllTests();
  (window as any).getBigPipeStatus = () => tester.getStatus();
  (window as any).simulateBigPipeEvent = (
    eventType: string,
    data: any,
    placeholderId?: string
  ) => tester.simulateBigPipeEvent(eventType, data, placeholderId);

  // Container testing
  (window as any).runContainerTests = () =>
    BigPipeContainerTester.runAllTests();
  (window as any).analyzeContainers = () =>
    BigPipeContainerTester.analyzeExpectedContainers();
  (window as any).findPotentialContainers = () =>
    BigPipeContainerTester.findPotentialContainers();

  // Debug panel controls
  (window as any).showBigPipeDebug = () => bigPipeDebugger.createDebugPanel();
  (window as any).hideBigPipeDebug = () => bigPipeDebugger.removeDebugPanel();
  (window as any).getBigPipeDebugStatus = () => bigPipeDebugger.getStatus();
}

// Helper functions
function createDefaultMobileContext(): MobileContext {
  return {
    isWebView: false,
    appVersion: "0.0.0",
    featureFlags: {
      supportsStyleUpdates: false,
      supportsAdvancedChart: false,
    },
  };
}

function calculateMaxSurfHeight(
  gfsData: ChartDataItem[],
  ecmwfData: ChartDataItem[]
) {
  const allData = [...gfsData, ...ecmwfData];

  return {
    feet: Math.max(
      0,
      ...allData.map(
        (d) =>
          d?.secondary?.fullSurfHeightFaceFeet ??
          d?.primary?.fullSurfHeightFaceFeet ??
          0
      )
    ),
    surfersFeet: Math.max(
      0,
      ...allData.map(
        (d) =>
          d?.secondary?.fullSurfHeightFeet ??
          d?.primary?.fullSurfHeightFeet ??
          0
      )
    ),
    meters: Math.max(
      0,
      ...allData.map(
        (d) =>
          d?.secondary?.fullSurfHeightMetres ??
          d?.primary?.fullSurfHeightMetres ??
          0
      )
    ),
  };
}

function getFirstTimestamp(data: DrupalApiData): string {
  return (
    data.forecasts?.gfs?.forecastSteps?.[0]?.localDateTimeISO ||
    data.forecasts?.ecmwf?.forecastSteps?.[0]?.localDateTimeISO ||
    data.weather?.hourly?.time?.[0] ||
    new Date().toISOString()
  );
}

function buildDefaultPreferences(rawApiData: DrupalApiData) {
  return {
    units: {
      surfHeight: (rawApiData.preferences?.units?.surfHeight === "ft"
        ? "ft"
        : rawApiData.preferences?.units?.surfHeight === "m"
        ? "m"
        : "surfers_feet") as "ft" | "m" | "surfers_feet",
      temperature: rawApiData.preferences?.units?.temperature || "celsius",
      wind: rawApiData.preferences?.units?.wind || "knots",
      unitMeasurements: rawApiData.preferences?.units?.unitMeasurements || "m",
    },
    showAdvancedChart: false,
  };
}

// --- Run BigPipe Initialization ---
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBigPipeApp);
} else {
  initBigPipeApp();
}
