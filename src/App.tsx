import { lazy, Suspense } from "react";
import { ChartDataItem, UnitPreferences } from "./types/index.ts";
import GraphSkeleton from "./components/GraphSkeleton.tsx";
import { SurfReport } from "./components/SurfReport/index.tsx";
import { formatBulletinDateTime } from "./lib/time-utils";

export interface AppProps {
  chartData: ChartDataItem[]; // Expects the processed array
  locationName: string;
  timezone: string;
  defaultPreferences: UnitPreferences;
  maxSurfHeight: number;
  localDateTimeISO: string;
  bulletinDateTimeUtc: string;
}

const ChartsContainer = lazy(() => import("./components/ChartsContainer"));

function App({
  chartData,
  defaultPreferences,
  maxSurfHeight,
  locationName,
  localDateTimeISO,
  bulletinDateTimeUtc,
}: AppProps) {
  return (
    <div className="App">
      <Suspense fallback={<GraphSkeleton />}>
        <SurfReport
          localDateTimeISO={localDateTimeISO}
          chartData={chartData[0]}
          defaultPreferences={defaultPreferences}
        />
        <h2 className="tw:text-2xl tw:font-semibold tw:mb-4">
          {locationName} Surf Forecast
        </h2>
        <p className="tw:text-sm tw:mb-4">
          Model run time {formatBulletinDateTime(bulletinDateTimeUtc)}, next
          model run at..
        </p>
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
