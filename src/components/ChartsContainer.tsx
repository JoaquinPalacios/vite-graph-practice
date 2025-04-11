import { UnitPreferences } from "@/types";

import TideChart from "./TideChart";
import WeatherChart from "./WeatherChart";
import ChartsWrapper from "./ChartsWrapper";
import SwellChart from "./SwellChart";
import SwellChartYAxis from "./SwellChart/SwellChartYAxis";
import { cn } from "@/utils/utils";
import AdvancedSwellChart from "./AdvancedSwellChart";

const ChartsContainer = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  return (
    <div
      className={cn(
        "w-full relative bg-slate-100 border-slate-700 max-w-[1340px] h-auto mx-auto pr-2 md:px-4 py-0 rounded-lg border overflow-hidden",
        "after:absolute after:bottom-0 after:left-0 after:md:left-7 after:w-[2.9375rem] after:md:w-12 after:h-56 after:bg-slate-100 after:z-10"
      )}
    >
      <ChartsWrapper>
        <SwellChart unitPreferences={unitPreferences} />
        <SwellChartYAxis unitPreferences={unitPreferences} />

        <AdvancedSwellChart unitPreferences={unitPreferences} />

        <WeatherChart />
        <TideChart />
      </ChartsWrapper>
    </div>
  );
};

export default ChartsContainer;
