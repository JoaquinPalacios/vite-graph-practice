"use client";

import { useState } from "react";
import SwellChartContainer from "./SwellChartContainer";
import { UnitPreferences } from "@/types";
import { UnitSelector } from "./UnitSelector";

const SwellChartContainerLayout = () => {
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
    </div>
  );
};

export default SwellChartContainerLayout;
