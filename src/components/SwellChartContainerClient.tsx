"use client";

import { useState } from "react";
import SwellChartContainer from "./SwellChartContainer";
import { UnitPreferences, UnitSelector } from "./UnitSelector";
// import TideChart from "./TideChart";

const SwellChartContainerClient = () => {
  const [unitPreferences, setUnitPreferences] = useState<UnitPreferences>({
    waveHeight: "ft",
    windSpeed: "knots",
    temperature: "°C",
    tideHeight: "m",
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <UnitSelector onChange={setUnitPreferences} />

      <SwellChartContainer unitPreferences={unitPreferences} />
      {/* <TideChart /> */}
    </div>
  );
};

export default SwellChartContainerClient;
