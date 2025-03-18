"use client";

import { useState } from "react";
import SwellChart from "./SwellChart";
import { UnitPreferences, UnitSelector } from "./UnitSelector";
import chartData from "@/data";
const SwellChartContainerClient = () => {
  const [unitPreferences, setUnitPreferences] = useState<UnitPreferences>({
    waveHeight: "ft",
    windSpeed: "knots",
    temperature: "°C",
    tideHeight: "m",
  });

  // get higher value in wave height, if it is converted to feet, then transform it to meters, rounded to the nearest up
  const maxWaveHeight = Math.ceil(
    Math.max(
      ...chartData.map((d) =>
        unitPreferences.waveHeight === "ft"
          ? d.waveHeight / 0.3048
          : d.waveHeight
      )
    )
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <UnitSelector onChange={setUnitPreferences} />

      <SwellChart
        unitPreferences={unitPreferences}
        maxWaveHeight={maxWaveHeight}
      />
    </div>
  );
};

export default SwellChartContainerClient;
