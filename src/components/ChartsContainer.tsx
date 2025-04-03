import { UnitPreferences } from "@/types";

import SwellChart from "./SwellChart/SwellChart";
import TideChart from "./TideChart/TideChart";
import WeatherChart from "./WeatherChart/WeatherChart";
import ChartsWrapper from "./ChartsWrapper";

const ChartsContainer = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  return (
    <div className="w-full relative bg-slate-100 border-slate-700 max-w-[1340px] h-auto mx-auto px-4 py-0 rounded-lg border">
      <ChartsWrapper>
        <SwellChart unitPreferences={unitPreferences} />
        <WeatherChart />
        <TideChart />
      </ChartsWrapper>
    </div>
  );
};

export default ChartsContainer;
