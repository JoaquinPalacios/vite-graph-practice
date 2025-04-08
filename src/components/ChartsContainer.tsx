import { UnitPreferences } from "@/types";

import TideChart from "./TideChart";
import WeatherChart from "./WeatherChart";
import ChartsWrapper from "./ChartsWrapper";
import SwellChart from "./SwellChart";
const ChartsContainer = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  return (
    <div className="w-full relative bg-slate-100 border-slate-700 max-w-[1340px] h-auto mx-auto px-3 sm:px-4 py-0 rounded-lg border overflow-hidden">
      <ChartsWrapper>
        <SwellChart unitPreferences={unitPreferences} />

        <WeatherChart />
        <TideChart />
      </ChartsWrapper>
    </div>
  );
};

export default ChartsContainer;
