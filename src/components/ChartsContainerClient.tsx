"use client";

import { useState } from "react";
import ChartsContainer from "./ChartsContainer";
import { UnitPreferences } from "@/types";
import { UnitSelector } from "./UnitSelector";

const SwellChartContainerLayout = () => {
  const [unitPreferences, setUnitPreferences] = useState<UnitPreferences>({
    waveHeight: "ft",
    windSpeed: "knots",
    temperature: "°C",
    tideHeight: "m",
    showAdvancedChart: true,
  });

  return (
    <section className="flex flex-col gap-4 w-full">
      <UnitSelector onChange={setUnitPreferences} />

      <ChartsContainer unitPreferences={unitPreferences} />

      {/* <TestChart /> */}
    </section>
  );
};

export default SwellChartContainerLayout;
