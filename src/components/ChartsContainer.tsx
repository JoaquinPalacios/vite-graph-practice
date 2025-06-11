"use client";

import {
  TideDataFromDrupal,
  UnitPreferences,
  WeatherData,
  DrupalApiData,
  SunriseSunsetData,
} from "@/types";
import ChartsWrapper from "./ChartsWrapper";
import { SwellChart } from "./SwellChart";
import { SwellChartYAxis } from "./SwellChart/SwellChartYAxis";
import { cn } from "@/utils/utils";
import { ChartDataItem } from "@/types/index.ts";
import { processTimeData } from "@/lib/time-utils";
import { UnitSelector } from "./UnitSelector";
import { Suspense, useState } from "react";
import { AdvancedSwellChart } from "./AdvancedSwellChart";
import { AdvancedSwellChartYAxis } from "./AdvancedSwellChart/AdvancedSwellChartYAxis";
import WeatherChart from "./WeatherChart";
import { TideChart } from "./TideChart";
import GraphSkeleton from "./GraphSkeleton";
import { SubscriptionOverlay } from "./SubscriptionOverlay";
import SwellTrainAnalysis from "./SweeltrainAnalysis";

/**
 * ChartsContainer component
 * @description This component is used to display the charts in the graph.
 * It is used to display the charts in the graph.
 * @param defaultPreferences - The default preferences of the unit
 * @param chartData - The chart data
 * @param maxSurfHeight - The max surf height
 * @param chartWidth - The width of the chart
 * @param weatherData - The weather data
 * @param tideData - The tide data
 * @param timezone - The timezone
 * @param isAustralia - Whether the location is in Australia
 * @param rawApiData - The raw API data
 */
const ChartsContainer = ({
  defaultPreferences,
  chartData,
  maxSurfHeight,
  chartWidth,
  weatherData,
  tideData,
  timezone,
  rawApiData,
  sunriseSunsetData,
  modelType,
  setModelType,
}: {
  defaultPreferences: UnitPreferences;
  chartData: ChartDataItem[];
  maxSurfHeight: {
    feet: number;
    meters: number;
  };
  chartWidth: number;
  weatherData: WeatherData[];
  tideData: TideDataFromDrupal[];
  timezone: string;
  rawApiData: DrupalApiData;
  sunriseSunsetData: SunriseSunsetData;
  modelType: "gfs" | "ecmwf";
  setModelType: (type: "gfs" | "ecmwf") => void;
}) => {
  // Update the existing swell chart data processing to use the new utility
  const { processedData } = processTimeData(
    chartData.map((item) => ({
      ...item,
      dateTime: item.localDateTimeISO,
      timestamp: new Date(item.localDateTimeISO).getTime(),
    })),
    timezone
  );

  const [unitPreferences, setUnitPreferences] =
    useState<UnitPreferences>(defaultPreferences);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Validate tide data before passing to TideChart
  const isValidTideData =
    tideData && Array.isArray(tideData) && tideData.length > 0;

  const showSubscriptionOverlay = !rawApiData.user.hasFullAccess;

  return (
    <section className="display-flex tw:flex-col tw:gap-4 tw:w-full">
      {processedData.length > 0 && (
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
      )}

      <SwellTrainAnalysis
        chartData={chartData}
        defaultPreferences={defaultPreferences}
        timezone={timezone}
        showAnalysis={showAnalysis}
      />

      <div
        className={cn(
          "tw:w-full tw:relative tw:bg-slate-100 tw:max-w-full tw:h-auto tw:mr-auto tw:pr-2 tw:md:px-4 tw:py-0 tw:overflow-hidden tw:transition-opacity",
          showSubscriptionOverlay && "tw:max-md:pt-72",
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
          <ChartsWrapper hasSubscription={rawApiData.user.hasFullAccess}>
            <Suspense fallback={<GraphSkeleton showMain />}>
              {processedData.length > 0 ? (
                <>
                  <SwellChart
                    unitPreferences={unitPreferences}
                    chartData={processedData}
                    maxSurfHeight={
                      unitPreferences.units.surfHeight === "ft"
                        ? maxSurfHeight.feet
                        : maxSurfHeight.meters
                    }
                  />
                  <SwellChartYAxis
                    unitPreferences={unitPreferences}
                    chartData={processedData}
                    maxSurfHeight={
                      unitPreferences.units.surfHeight === "ft"
                        ? maxSurfHeight.feet
                        : maxSurfHeight.meters
                    }
                    hasSubscription={rawApiData.user.hasFullAccess}
                  />
                  <AdvancedSwellChart
                    unitPreferences={unitPreferences}
                    chartData={processedData}
                    maxSurfHeight={maxSurfHeight.meters}
                  />
                  <AdvancedSwellChartYAxis
                    chartData={processedData}
                    maxSurfHeight={maxSurfHeight.meters}
                    unitPreferences={unitPreferences}
                    hasSubscription={rawApiData.user.hasFullAccess}
                  />
                </>
              ) : (
                <div className="tw:h-0" />
              )}
            </Suspense>
            <Suspense fallback={<GraphSkeleton showWeather />}>
              {weatherData && weatherData.length > 0 ? (
                <>
                  <WeatherChart
                    weatherData={weatherData}
                    sunriseSunsetData={sunriseSunsetData}
                  />
                  <div
                    className={cn(
                      "tw:pointer-events-none tw:h-20 [&]:tw:w-12 [&]:tw:md:w-16",
                      "tw:absolute tw:left-0 tw:md:left-3 tw:bottom-24 tw:z-10"
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
                <div className="tw:h-0" />
              )}
            </Suspense>
            <Suspense fallback={<GraphSkeleton showTide />}>
              {isValidTideData ? (
                <TideChart
                  tideData={tideData}
                  swellData={processedData}
                  timezone={timezone}
                />
              ) : (
                <div className="tw:h-36 tw:min-h-36 tw:flex tw:items-center tw:justify-center tw:text-slate-500">
                  No tide data available
                </div>
              )}
            </Suspense>
          </ChartsWrapper>
          {showSubscriptionOverlay && (
            <SubscriptionOverlay
              subscriptionStatus={rawApiData.user.subscriptionStatus}
            />
          )}
        </Suspense>
      </div>
    </section>
  );
};

export default ChartsContainer;
