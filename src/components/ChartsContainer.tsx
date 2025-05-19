"use client";

import { TideDataFromDrupal, UnitPreferences, WeatherData } from "@/types";
import ChartsWrapper from "./ChartsWrapper";
import { SwellChart } from "./SwellChart";
import { SwellChartYAxis } from "./SwellChart/SwellChartYAxis";
import { cn } from "@/utils/utils";
import { ChartDataItem } from "@/types/index.ts";
import { processTimeData } from "@/lib/time-utils";
import { UnitSelector } from "./UnitSelector";
import { Suspense, useState } from "react";
import AdvancedSwellChart from "./AdvancedSwellChart";
import AdvancedSwellChartYAxis from "./AdvancedSwellChart/AdvancedSwellChartYAxis";
import WeatherChart from "./WeatherChart";
import { TideChart } from "./TideChart";
import GraphSkeleton from "./GraphSkeleton";

const ChartsContainer = ({
  defaultPreferences,
  chartData,
  maxSurfHeight,
  chartWidth,
  weatherData,
  tideData,
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
}) => {
  // Update the existing swell chart data processing to use the new utility
  const { processedData } = processTimeData(
    chartData.map((item) => ({
      ...item,
      dateTime: item.localDateTimeISO,
      timestamp: new Date(item.localDateTimeISO).getTime(),
    }))
  );

  const [unitPreferences, setUnitPreferences] =
    useState<UnitPreferences>(defaultPreferences);

  return (
    <section className="display-flex tw:flex-col tw:gap-4 tw:w-full">
      <UnitSelector
        onChange={setUnitPreferences}
        defaultValues={unitPreferences}
      />

      <div
        className={cn(
          "tw:w-full tw:relative tw:bg-slate-100 tw:max-w-full tw:h-auto tw:mx-auto tw:pr-2 tw:md:px-4 tw:py-0 tw:overflow-hidden"
        )}
        style={{ width: chartWidth }}
      >
        <Suspense fallback={<GraphSkeleton />}>
          <ChartsWrapper>
            <Suspense fallback={<GraphSkeleton showMain />}>
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
              />
            </Suspense>

            <Suspense fallback={<GraphSkeleton showWeather />}>
              <WeatherChart weatherData={weatherData} />
              <div
                className={cn(
                  "tw:pointer-events-none tw:h-20 [&]:tw:w-12 [&]:tw:md:w-16",
                  "tw:absolute tw:left-0 tw:md:left-3 tw:bottom-[8.75rem] tw:z-10"
                )}
              >
                <svg className="weather-rect" width="100%" height="100%"></svg>
              </div>
            </Suspense>
            <Suspense fallback={<GraphSkeleton showTide />}>
              <TideChart tideData={tideData} swellData={processedData} />
            </Suspense>
          </ChartsWrapper>
        </Suspense>
      </div>
    </section>
  );
};

export default ChartsContainer;
