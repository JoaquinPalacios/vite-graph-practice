import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { DrupalApiData } from "./types/index.ts";
import { ChartDataItem } from "./types/index.ts";

interface ApiTrainData {
  train_delta?: string;
  trainDelta?: string;
  sig_height?: string;
  sigHeight?: string;
  peak_period?: string;
  peakPeriod?: string;
  direction: string;
}

interface ApiBulletin {
  trainData: ApiTrainData[];
}

interface ApiStep extends ChartDataItem {
  bulletin?: ApiBulletin;
}

/**
 * This function takes the raw API data steps and transforms them
 * into the array structure the graph expects.
 * @param apiData - The raw API data steps
 * @param forecastType - The forecast type to process
 * @returns The transformed chart data
 */
function processApiDataToChartData(
  apiData: DrupalApiData,
  forecastType: "gfs" | "ecmwf" = "gfs"
): ChartDataItem[] {
  console.log("Vite: Processing API data to chart data:", apiData);
  const forecastData = apiData.forecasts[forecastType];

  if (
    !forecastData ||
    !forecastData.forecastSteps ||
    forecastData.forecastSteps.length === 0
  ) {
    console.warn(
      `Vite: No forecast received from API data for ${forecastType}.`
    );
    return [];
  }

  const chartData: ChartDataItem[] = forecastData.forecastSteps.map(
    (apiStep: ApiStep, index) => {
      const chartItem: ChartDataItem = {
        localDateTimeISO: apiStep.localDateTimeISO || "",
        utcDateTimeISO: apiStep.utcDateTimeISO,

        wind: {
          direction: apiStep.wind?.direction ?? null,
          speedKmh: apiStep.wind?.speedKmh ?? null,
          speedKnots: apiStep.wind?.speedKnots ?? null,
        },

        primary: {
          fullSurfHeightFeet: apiStep.primary?.fullSurfHeightFeet ?? null,
          direction: apiStep.primary?.direction ?? null,
          fullSurfHeightFeetLabelBin:
            apiStep.primary?.fullSurfHeightFeetLabelBin || undefined,
          fullSurfHeightFeetLabelDescriptive:
            apiStep.primary?.fullSurfHeightFeetLabelDescriptive || undefined,
          fullSurfHeightMetres: apiStep.primary?.fullSurfHeightMetres ?? null,
          fullSurfHeightMetresLabelBin:
            apiStep.primary?.fullSurfHeightMetresLabelBin || undefined,
          totalSigHeight: apiStep.primary?.totalSigHeight ?? null,
        },

        secondary: apiStep.secondary
          ? {
              fullSurfHeightFeet: apiStep.secondary?.fullSurfHeightFeet ?? null,
              direction: apiStep.secondary?.direction ?? null,
              fullSurfHeightFeetLabelBin:
                apiStep.secondary?.fullSurfHeightFeetLabelBin || undefined,
              fullSurfHeightFeetLabelDescriptive:
                apiStep.secondary?.fullSurfHeightFeetLabelDescriptive ||
                undefined,
              fullSurfHeightMetres:
                apiStep.secondary?.fullSurfHeightMetres ?? null,
              fullSurfHeightMetresLabelBin:
                apiStep.secondary?.fullSurfHeightMetresLabelBin || undefined,
              totalSigHeight: apiStep.secondary?.totalSigHeight ?? null,
            }
          : undefined,

        trainData:
          apiStep.bulletin?.trainData?.map((train: ApiTrainData) => ({
            trainDelta: Number(train.trainDelta || train.train_delta || 0),
            sigHeight: Number(train.sigHeight || train.sig_height || 0),
            peakPeriod: Number(train.peakPeriod || train.peak_period || 0),
            direction: Number(train.direction || 0),
          })) || [],

        ...(index === 0 && forecastData.bulletinTimeUtc
          ? { bulletinDatetimeUtc: forecastData.bulletinTimeUtc }
          : {}),
      };

      return chartItem;
    }
  );

  console.log("Vite: Transformed chartData:", chartData);
  return chartData;
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

  if (
    container &&
    drupalSettings &&
    drupalSettings.apiData &&
    !drupalSettings.apiData.error
  ) {
    const rawApiData: DrupalApiData = drupalSettings.apiData;
    console.log("Vite: 1 - Raw API data received from Drupal:", rawApiData);

    // Transform the raw forecast steps into the structure the graph needs
    const ecmwfChartData: ChartDataItem[] = processApiDataToChartData(
      rawApiData,
      // "gfs"
      "ecmwf"
    );
    const gfsChartData: ChartDataItem[] = processApiDataToChartData(
      rawApiData,
      "gfs"
    );

    const allChartData = [...ecmwfChartData, ...gfsChartData];

    const maxSurfHeight =
      rawApiData.preferences.units.surfHeight === "ft"
        ? Math.max(
            ...allChartData.map(
              (d) =>
                d.secondary?.fullSurfHeightFeet ??
                d.primary.fullSurfHeightFeet ??
                0
            )
          )
        : Math.max(
            ...allChartData.map(
              (d) =>
                d.secondary?.fullSurfHeightMetres ??
                d.primary.fullSurfHeightMetres ??
                0
            )
          );

    // Store the raw API data globally for forecast type switching
    (window as unknown as { swellnetRawData: DrupalApiData }).swellnetRawData =
      rawApiData;

    console.log("Vite: Raw API data before init:", rawApiData);

    // Prepare props for the App component
    const appProps = {
      chartData: ecmwfChartData,
      locationName: rawApiData.location.name,
      timezone: rawApiData.location.timezone,
      localDateTimeISO: ecmwfChartData[0].localDateTimeISO,
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
