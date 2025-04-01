import { Card } from "@/components/ui/card";

import { UnitPreferences } from "@/types";

import SwellChart from "./SwellChart";
import TideChart from "./TideChart";
import WeatherChart from "./WeatherChart";
import ChartsWrapper from "./ChartsWrapper";

const ChartsContainer = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  return (
    <Card className="w-full relative bg-slate-100 border-slate-700 max-w-[1340px] h-auto mx-auto px-4 py-0 rounded-lg">
      <ChartsWrapper>
        <SwellChart unitPreferences={unitPreferences} />
        <WeatherChart />
        <TideChart />
      </ChartsWrapper>
    </Card>
  );
};

export default ChartsContainer;
