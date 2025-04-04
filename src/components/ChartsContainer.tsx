import { UnitPreferences } from "@/types";

// import SwellChart from "./SwellChart";
import TideChart from "./TideChart";
// import WeatherChart from "./WeatherChart";
import ChartsWrapper from "./ChartsWrapper";
import WeatherChartTest from "./WeatherChart/WeatherChartTest";
import SwellChartTest from "./SwellChart/SwellChartTest";
const ChartsContainer = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  return (
    <div className="w-full relative bg-slate-100 border-slate-700 max-w-[1340px] h-auto mx-auto px-4 py-0 rounded-lg border">
      <ChartsWrapper>
        {/* <SwellChart unitPreferences={unitPreferences} /> */}

        <SwellChartTest unitPreferences={unitPreferences} />

        {/* <WeatherChart /> */}
        <WeatherChartTest />
        <TideChart />
      </ChartsWrapper>
    </div>
  );
};

export default ChartsContainer;
