"use client";

import { TideDataFromDrupal, UnitPreferences, WeatherData } from "@/types";
import ChartsWrapper from "./ChartsWrapper";
import { SwellChart } from "./SwellChart";
import { SwellChartYAxis } from "./SwellChart/SwellChartYAxis";
import { cn } from "@/utils/utils";
import { ChartDataItem } from "@/types/index.ts";
import { processTimeData } from "@/lib/time-utils";
import { UnitSelector } from "./UnitSelector";
import { useState } from "react";
import AdvancedSwellChart from "./AdvancedSwellChart";
import AdvancedSwellChartYAxis from "./AdvancedSwellChart/AdvancedSwellChartYAxis";
import WeatherChart from "./WeatherChart";
// import TideChart from "./TideChart";
// import TideChartYAxis from "./TideChart/TideChartYAxis";
import { DthreeChart } from "./TideChart/DthreeChart";

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
        <ChartsWrapper>
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

          <WeatherChart weatherData={weatherData} />
          <DthreeChart tideData={tideData} swellData={processedData} />
          {/* <TideChart
            tideData={tideData}
            length={processedData.length}
            swellData={processedData}
          /> */}
          {/* <TideChartYAxis tideData={tideData} /> */}
        </ChartsWrapper>
      </div>
    </section>
  );
};

export default ChartsContainer;
