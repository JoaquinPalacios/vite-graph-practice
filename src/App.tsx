import { lazy, Suspense } from "react";
import "./App.css";
import { ChartDataItem, UnitPreferences } from "./types/index.ts";

export interface AppProps {
  chartData: ChartDataItem[]; // Expects the processed array
  locationName: string;
  timezone: string;
  defaultPreferences: UnitPreferences;
}

const ChartsContainerClient = lazy(
  () => import("./components/ChartsContainerClient")
);

function App({ chartData, defaultPreferences }: AppProps) {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <ChartsContainerClient
          chartData={chartData}
          defaultPreferences={defaultPreferences}
        />
      </Suspense>
    </div>
  );
}

export default App;
