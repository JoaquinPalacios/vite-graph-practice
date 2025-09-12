"use client";

import { processTimeData } from "@/lib/time-utils";
import {
  DrupalApiData,
  TideDataFromDrupal,
  UnitPreferences,
  WeatherData,
} from "@/types";
import { ChartDataItem } from "@/types/index.ts";
import { cn } from "@/utils/utils";
import { Suspense, useMemo, useState } from "react";
import { AdvanceD3Chart } from "./AdvanceD3Chart";
import ChartsWrapper from "./ChartsWrapper";
import GraphSkeleton from "./GraphSkeleton";
import NoDataFallback from "./NoDataFallback";

import SwellTrainAnalysis from "./SweeltrainAnalysis";
import { SwellChart } from "./SwellChart";
import { SwellChartYAxis } from "./SwellChart/SwellChartYAxis";
import { TideChart } from "./TideChart";
import { UnitSelector } from "./UnitSelector";
import WeatherChart from "./WeatherChart";

type ChartDataItemWithTimestamp = ChartDataItem & { timestamp: number };

/**
 * ChartsContainer component
 * @description This component is used to display the charts in the graph.
 * It is used to display the charts in the graph.
 * @param defaultPreferences - The default preferences of the unit
 * @param chartData - The chart data
 * @param maxSurfHeight - The max surf height
 * @param maxSurfHeightAdvanced - The max surf height advanced
 * @param chartWidth - The width of the chart
 * @param weatherData - The weather data
 * @param tideData - The tide data
 * @param timezone - The timezone
 * @param isAustralia - Whether the location is in Australia
 * @param rawApiData - The raw API data
 * @param modelType - The model type
 * @param setModelType - The function to set the model type
 * @param mobileContext - The mobile context
 */
const ChartsContainer = ({
  defaultPreferences,
  chartData,
  maxSurfHeight,
  maxSurfHeightAdvanced,
  chartWidth,
  weatherData,
  tideData,
  timezone,
  rawApiData,
  modelType,
  setModelType,
}: {
  defaultPreferences: UnitPreferences;
  chartData: ChartDataItem[];
  maxSurfHeight: {
    feet: number;
    meters: number;
    surfersFeet: number;
  };
  maxSurfHeightAdvanced: number; // Always in meters
  chartWidth: number;
  weatherData: WeatherData[];
  tideData: TideDataFromDrupal[];
  timezone: string;
  rawApiData: DrupalApiData;
  modelType: "gfs" | "ecmwf";
  setModelType: (type: "gfs" | "ecmwf") => void;
}) => {
  // Update the existing swell chart data processing to use the new utility
  const { processedData } = useMemo(
    () =>
      processTimeData(
        chartData.map((item) => ({
          ...item,
          dateTime: item.localDateTimeISO,
          timestamp: new Date(item.localDateTimeISO).getTime(),
        })),
        timezone
      ),
    [chartData, timezone]
  );

  const [unitPreferences, setUnitPreferences] =
    useState<UnitPreferences>(defaultPreferences);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Validate tide data before passing to TideChart
  const isValidTideData =
    tideData && Array.isArray(tideData) && tideData.length > 0;

  // Check if forecast data is available
  const hasGfsData = rawApiData.forecasts?.gfs?.forecastSteps?.length > 0;
  const hasEcmwfData = rawApiData.forecasts?.ecmwf?.forecastSteps?.length > 0;
  const hasForecastData = hasGfsData || hasEcmwfData;

  const showSubscriptionOverlay =
    !rawApiData.user.isLoggedIn || !rawApiData.user.isSubscriber;

  const referenceLineData = useMemo(() => {
    const dataWithTimestamp = processedData as ChartDataItemWithTimestamp[];
    let referenceTime: string | undefined;
    let exactTimestamp: number | undefined;
    let referenceTimestamp: number | undefined;

    if (dataWithTimestamp.length > 0) {
      const nowTimestamp = Date.now();
      exactTimestamp = nowTimestamp;

      const currentChartItem = dataWithTimestamp
        .slice()
        .reverse()
        .find((item) => item.timestamp <= nowTimestamp);

      if (currentChartItem) {
        const timeDifference = nowTimestamp - currentChartItem.timestamp;
        const sixHoursInMillis = 6 * 60 * 60 * 1000;

        if (timeDifference < sixHoursInMillis) {
          referenceTime = currentChartItem.localDateTimeISO;
          referenceTimestamp = currentChartItem.timestamp;
        }
      }
    }
    return { referenceTime, exactTimestamp, referenceTimestamp };
  }, [processedData]);

  return (
    <section className="display-flex tw:flex-col tw:gap-4 tw:w-full">
      <UnitSelector
        onChange={setUnitPreferences}
        defaultValues={unitPreferences}
        modelType={modelType}
        setModelType={setModelType}
        rawApiData={rawApiData}
        timezone={timezone}
        showAnalysis={showAnalysis}
        setShowAnalysis={setShowAnalysis}
      />

      <SwellTrainAnalysis
        chartData={chartData}
        defaultPreferences={defaultPreferences}
        timezone={timezone}
        showAnalysis={showAnalysis}
      />

      <div
        className={cn(
          "tw:w-full tw:relative tw:bg-gray-100 tw:max-w-full tw:h-auto tw:mr-auto tw:md:px-2 tw:py-0 tw:overflow-hidden tw:transition-opacity",
          // showSubscriptionOverlay && "tw:max-md:pt-80",
          !showAnalysis
            ? "tw:opacity-100"
            : "tw:opacity-0 tw:-z-10 tw:pointer-events-none tw:w-0 tw:h-0"
        )}
        {...(!showSubscriptionOverlay &&
          !showAnalysis && {
            style: { width: chartWidth },
          })}
      >
        <Suspense fallback={<GraphSkeleton />}>
          <ChartsWrapper
            isEmbedded={rawApiData.embedded}
            showSubscriptionOverlay={showSubscriptionOverlay}
            isPastDue={rawApiData.user.isPastDue}
          >
            <Suspense fallback={<GraphSkeleton showMain />}>
              {processedData.length > 0 && hasForecastData ? (
                <>
                  <SwellChart
                    unitPreferences={unitPreferences}
                    chartData={processedData}
                    maxSurfHeight={
                      unitPreferences.units.surfHeight === "ft"
                        ? maxSurfHeight.feet
                        : unitPreferences.units.surfHeight === "surfers_feet"
                        ? maxSurfHeight.surfersFeet
                        : maxSurfHeight.meters
                    }
                    currentLocationTime={referenceLineData.referenceTime}
                    exactTimestamp={referenceLineData.exactTimestamp}
                    referenceTimestamp={referenceLineData.referenceTimestamp}
                    {...(rawApiData.embedded && {
                      isEmbedded: true,
                      event: rawApiData.event,
                    })}
                  />
                  <SwellChartYAxis
                    unitPreferences={unitPreferences}
                    chartData={processedData}
                    maxSurfHeight={
                      unitPreferences.units.surfHeight === "ft"
                        ? maxSurfHeight.feet
                        : unitPreferences.units.surfHeight === "surfers_feet"
                        ? maxSurfHeight.surfersFeet
                        : maxSurfHeight.meters
                    }
                    {...(rawApiData.embedded && {
                      isEmbedded: true,
                    })}
                  />

                  <div
                    style={{
                      height: unitPreferences.showAdvancedChart ? 192 : 0,
                      minHeight: unitPreferences.showAdvancedChart ? 192 : 0,
                      opacity: unitPreferences.showAdvancedChart ? 1 : 0,
                      ...(!unitPreferences.showAdvancedChart && {
                        overflow: "hidden",
                      }),
                    }}
                    className="tw:transition-[height,min-height] tw:duration-300 tw:ease-out"
                  >
                    <AdvanceD3Chart
                      unitPreferences={unitPreferences}
                      chartData={processedData}
                      maxSurfHeight={maxSurfHeightAdvanced}
                      hasSubscription={
                        rawApiData.user.isLoggedIn ||
                        rawApiData.user.isSubscriber
                      }
                    />
                  </div>
                </>
              ) : !hasForecastData ? (
                <NoDataFallback showMain showWeather={false} showTide={false} />
              ) : (
                <div className="tw:h-0" />
              )}
            </Suspense>
            <Suspense fallback={<GraphSkeleton showWeather />}>
              {weatherData && weatherData.length > 0 ? (
                <>
                  <WeatherChart
                    weatherData={weatherData}
                    unitPreferences={unitPreferences}
                  />
                  <div
                    className={cn(
                      "tw:pointer-events-none tw:h-20 [&]:tw:w-12 [&]:tw:md:w-20",
                      "tw:absolute tw:left-0 tw:md:left-5 tw:bottom-24 tw:z-10"
                    )}
                  >
                    <svg
                      className="weather-rect"
                      width="100%"
                      height="100%"
                    ></svg>
                  </div>
                </>
              ) : (
                <NoDataFallback showWeather showTide={false} showMain={false} />
              )}
            </Suspense>
            <Suspense fallback={<GraphSkeleton showTide />}>
              {isValidTideData ? (
                <TideChart
                  tideData={tideData}
                  swellData={processedData}
                  timezone={timezone}
                  exactTimestamp={referenceLineData.exactTimestamp}
                  unitPreferences={unitPreferences}
                  hasSubscription={
                    rawApiData.user.isLoggedIn || rawApiData.user.isSubscriber
                  }
                />
              ) : (
                <NoDataFallback showTide showWeather={false} showMain={false} />
              )}
            </Suspense>
          </ChartsWrapper>
        </Suspense>
      </div>
    </section>
  );
};

export default ChartsContainer;
