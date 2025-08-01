import { ChartDataItem, DrupalApiData } from "../types";

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
 * Ensures we only use complete days of data (8 data points per day)
 * @param data - Array of data points
 * @returns Array trimmed to complete days
 */
export function trimToCompleteDays<T>(data: T[]): T[] {
  const completeDays = Math.floor(data.length / 8);
  return data.slice(0, completeDays * 8);
}

/**
 * This function takes the raw API data steps and transforms them
 * into the array structure the graph expects.
 * @param apiData - The raw API data steps
 * @param forecastType - The forecast type to process
 * @returns The transformed chart data
 */
export function processApiDataToChartData(
  apiData: DrupalApiData,
  forecastType: "gfs" | "ecmwf" = "gfs"
): ChartDataItem[] {
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

  // Trim the data to complete days
  let completeData = trimToCompleteDays(forecastData.forecastSteps);

  // Limit data for non-subscribers
  if (!apiData.user.hasFullAccess) {
    const daysAllowed = 3;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAllowed);

    completeData = completeData.filter((step) => {
      const stepDate = new Date(step.localDateTimeISO);
      return stepDate <= cutoffDate;
    });
  }

  const chartData: ChartDataItem[] = completeData.map(
    (apiStep: ApiStep, index) => {
      const chartItem: ChartDataItem = {
        localDateTimeISO: apiStep.localDateTimeISO || "",
        utcDateTimeISO: apiStep.utcDateTimeISO,

        wind: {
          direction: apiStep.wind?.direction ?? null,
          speedKmh: apiStep.wind?.speedKmh ?? null,
          speedKnots: apiStep.wind?.speedKnots ?? null,
          speedMph: apiStep.wind?.speedMph ?? null,
        },

        primary: {
          fullSurfHeightFaceFeet:
            apiStep.primary?.fullSurfHeightFaceFeet ?? null,
          fullSurfHeightFeet: apiStep.primary?.fullSurfHeightFeet ?? null,
          direction: apiStep.primary?.direction ?? null,
          fullSurfHeightFeetLabelBin:
            apiStep.primary?.fullSurfHeightFeetLabelBin || undefined,
          fullSurfHeightFaceFeetLabelBin:
            apiStep.primary?.fullSurfHeightFaceFeetLabelBin || undefined,
          fullSurfHeightFeetLabelDescriptive:
            apiStep.primary?.fullSurfHeightFeetLabelDescriptive || undefined,
          fullSurfHeightMetres: apiStep.primary?.fullSurfHeightMetres ?? null,
          fullSurfHeightMetresLabelBin:
            apiStep.primary?.fullSurfHeightMetresLabelBin || undefined,
          totalSigHeight: apiStep.primary?.totalSigHeight ?? null,
        },

        secondary: apiStep.secondary
          ? {
              fullSurfHeightFaceFeet:
                apiStep.secondary?.fullSurfHeightFaceFeet ?? null,
              fullSurfHeightFeet: apiStep.secondary?.fullSurfHeightFeet ?? null,
              direction: apiStep.secondary?.direction ?? null,
              fullSurfHeightFeetLabelBin:
                apiStep.secondary?.fullSurfHeightFeetLabelBin || undefined,
              fullSurfHeightFaceFeetLabelBin:
                apiStep.secondary?.fullSurfHeightFaceFeetLabelBin || undefined,
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

        ...(apiStep._isMissingData === true ? { _isMissingData: true } : {}),

        ...(index === 0 && forecastData.bulletinDateTimeUtc
          ? { bulletinDateTimeUtc: forecastData.bulletinDateTimeUtc }
          : {}),
      };

      return chartItem;
    }
  );

  return chartData;
}
