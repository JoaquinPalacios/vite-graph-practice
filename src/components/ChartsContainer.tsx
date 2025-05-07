"use client";

import { UnitPreferences } from "@/types";

import ChartsWrapper from "./ChartsWrapper";
import { SwellChart } from "./SwellChart";
import { SwellChartYAxis } from "./SwellChart/SwellChartYAxis";
import { cn } from "@/utils/utils";
import { ChartDataItem } from "@/types/index.ts";
import { processTimeData } from "@/lib/time-utils";
import { UnitSelector } from "./UnitSelector";
import { useState } from "react";

const ChartsContainer = ({
  defaultPreferences,
  chartData,
  maxSurfHeight,
}: {
  defaultPreferences: UnitPreferences;
  chartData: ChartDataItem[];
  maxSurfHeight: number;
}) => {
  // Update the existing swell chart data processing to use the new utility
  // const { processedData, dayTicks } = processTimeData(
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
    <section className="tw:flex tw:flex-col tw:gap-4 tw:w-full">
      <UnitSelector
        onChange={setUnitPreferences}
        defaultValues={unitPreferences}
      />
      <div
        className={cn(
          "tw:w-full tw:relative tw:bg-slate-100 tw:border-slate-700 tw:max-w-[1340px] tw:h-auto tw:mx-auto tw:pr-2 tw:md:px-4 tw:py-0 tw:rounded-lg tw:border tw:overflow-hidden",
          "tw:after:absolute tw:after:bottom-0 tw:after:left-0 tw:after:md:left-7 tw:after:w-[2.9375rem] tw:after:md:w-12 tw:after:h-56 tw:after:bg-slate-100 tw:after:z-10"
        )}
      >
        <ChartsWrapper>
          <SwellChart
            unitPreferences={unitPreferences}
            chartData={processedData}
            maxSurfHeight={maxSurfHeight}
          />
          <SwellChartYAxis
            unitPreferences={unitPreferences}
            chartData={processedData}
            maxSurfHeight={maxSurfHeight}
          />

          {/* <AdvancedSwellChart unitPreferences={unitPreferences} />
        <AdvancedSwellChartYAxis />

        <WeatherChart />

        <TideChart />
        <TideChartYAxis /> */}
        </ChartsWrapper>
      </div>
    </section>
  );
};

export default ChartsContainer;
