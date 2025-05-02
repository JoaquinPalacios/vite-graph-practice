"use client";

import { useState } from "react";
import ChartsContainer from "./ChartsContainer";
import { UnitPreferences } from "@/types";
import { UnitSelector } from "./UnitSelector";
import { ChartDataItem } from "@/types/index.ts";

const SwellChartContainerLayout = ({
  chartData,
  defaultPreferences,
}: {
  chartData: ChartDataItem[];
  defaultPreferences: UnitPreferences;
}) => {
  const [unitPreferences, setUnitPreferences] =
    useState<UnitPreferences>(defaultPreferences);

  return (
    <section className="flex flex-col gap-4 w-full">
      <UnitSelector
        onChange={setUnitPreferences}
        defaultValues={unitPreferences}
      />

      <ChartsContainer
        unitPreferences={unitPreferences}
        chartData={chartData}
      />
    </section>
  );
};

export default SwellChartContainerLayout;
