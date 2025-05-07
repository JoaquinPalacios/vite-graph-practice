import { lazy, Suspense, useState } from "react";
import { UnitPreferences, DrupalApiData } from "./types/index.ts";
import GraphSkeleton from "./components/GraphSkeleton.tsx";
import { SurfReport } from "./components/SurfReport/index.tsx";
import { formatBulletinDateTime } from "./lib/time-utils";
import { cn } from "./utils/utils.ts";
import { processApiDataToChartData } from "./lib/data-processing.ts";

export interface AppProps {
  rawApiData: DrupalApiData;
  locationName: string;
  timezone: string;
  defaultPreferences: UnitPreferences;
  maxSurfHeight: number;
  localDateTimeISO: string;
  bulletinDateTimeUtc: string;
}

const ChartsContainer = lazy(() => import("./components/ChartsContainer"));

function App({
  rawApiData,
  defaultPreferences,
  maxSurfHeight,
  locationName,
  localDateTimeISO,
  bulletinDateTimeUtc,
}: AppProps) {
  const [modelType, setModelType] = useState<"gfs" | "ecmwf">("gfs");

  // Process the data based on the selected model type
  const chartData = processApiDataToChartData(rawApiData, modelType);

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
        <div className="tw:flex tw:items-center tw:gap-2 tw:justify-between">
          <p className="tw:text-sm tw:mb-4">
            Model run time {formatBulletinDateTime(bulletinDateTimeUtc)}, next
            model run at..
          </p>
          <div className="tw:flex tw:items-center">
            <h5 className="tw:text-sm">Choose model type</h5>
            <div className="tw:flex tw:gap-2">
              <button
                className={cn(
                  "tw:p-2 tw:rounded tw:border tw:border-gray-300 tw:hover:bg-gray-100",
                  modelType === "gfs" && "tw:bg-gray-100"
                )}
                onClick={() => setModelType("gfs")}
              >
                GFS
              </button>
              <button
                className={cn(
                  "tw:p-2 tw:rounded tw:border tw:border-gray-300 tw:hover:bg-gray-100",
                  modelType === "ecmwf" && "tw:bg-gray-100"
                )}
                onClick={() => setModelType("ecmwf")}
              >
                ECMWF
              </button>
            </div>
          </div>
        </div>

        <ChartsContainer
          chartData={chartData}
          defaultPreferences={defaultPreferences}
          maxSurfHeight={maxSurfHeight}
        />
      </Suspense>
    </div>
  );
}

export default App;
