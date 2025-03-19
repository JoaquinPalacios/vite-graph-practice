"use client";

import { useState } from "react";
import SwellChart from "./SwellChart";
import { UnitPreferences, UnitSelector } from "./UnitSelector";

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

      <SwellChart unitPreferences={unitPreferences} />
    </div>
  );
};

export default SwellChartContainerClient;
