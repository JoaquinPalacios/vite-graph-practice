import { UnitPreferences } from "@/types";

import ChartsWrapper from "./ChartsWrapper";
import SwellChart from "./SwellChart";
import SwellChartYAxis from "./SwellChart/SwellChartYAxis";
import { cn } from "@/utils/utils";
import { ChartDataItem } from "@/types/index.ts";
import { processTimeData } from "@/lib/time-utils";

const ChartsContainer = ({
  unitPreferences,
  chartData,
}: {
  unitPreferences: UnitPreferences;
  chartData: ChartDataItem[];
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
  return (
    <div
      className={cn(
        "w-full relative bg-slate-100 border-slate-700 max-w-[1340px] h-auto mx-auto pr-2 md:px-4 py-0 rounded-lg border overflow-hidden",
        "after:absolute after:bottom-0 after:left-0 after:md:left-7 after:w-[2.9375rem] after:md:w-12 after:h-56 after:bg-slate-100 after:z-10"
      )}
    >
      <ChartsWrapper>
        <SwellChart
          unitPreferences={unitPreferences}
          chartData={processedData}
        />
        <SwellChartYAxis
          unitPreferences={unitPreferences}
          chartData={processedData}
        />

        {/* <AdvancedSwellChart unitPreferences={unitPreferences} />
        <AdvancedSwellChartYAxis />

        <WeatherChart />

        <TideChart />
        <TideChartYAxis /> */}
      </ChartsWrapper>
    </div>
  );
};

export default ChartsContainer;
