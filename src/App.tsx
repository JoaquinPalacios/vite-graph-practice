import { lazy, Suspense } from "react";
import "./App.css";
import { ChartDataItem, UnitPreferences } from "./types/index.ts";
import GraphSkeleton from "./components/GraphSkeleton.tsx";

export interface AppProps {
  chartData: ChartDataItem[]; // Expects the processed array
  locationName: string;
  timezone: string;
  defaultPreferences: UnitPreferences;
  maxSurfHeight: number;
}

const ChartsContainer = lazy(() => import("./components/ChartsContainer"));

function App({ chartData, defaultPreferences, maxSurfHeight }: AppProps) {
  return (
    <div className="App">
      <Suspense fallback={<GraphSkeleton />}>
        <ChartsContainer
          chartData={chartData}
          defaultPreferences={defaultPreferences}
          maxSurfHeight={maxSurfHeight}
        />
        {/* <GraphSkeleton /> */}
      </Suspense>
    </div>
  );
}

export default App;
