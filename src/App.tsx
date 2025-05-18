import { lazy, Suspense, useState } from "react";
import {
  UnitPreferences,
  DrupalApiData,
  WeatherData,
  TideDataFromDrupal,
  CurrentWeatherData,
  SunriseSunsetData,
} from "./types/index.ts";
import GraphSkeleton from "./components/GraphSkeleton.tsx";
import { SurfReport } from "./components/SurfReport/index.tsx";
import { formatBulletinDateTime } from "./lib/time-utils";
import { cn } from "./utils/utils.ts";
import { processApiDataToChartData } from "./lib/data-processing.ts";

interface AppProps {
  rawApiData: DrupalApiData;
  defaultPreferences: UnitPreferences;
  maxSurfHeight: {
    feet: number;
    meters: number;
  };
  locationName: string;
  localDateTimeISO: string;
  bulletinDateTimeUtc: string;
  chartWidth: number;
  weatherData: WeatherData[];
  currentWeatherData: CurrentWeatherData;
  tideData: TideDataFromDrupal[];
  sunriseSunsetData: SunriseSunsetData;
  timezone: string;
}

const ChartsContainer = lazy(() => import("./components/ChartsContainer"));

function App({
  rawApiData,
  defaultPreferences,
  maxSurfHeight,
  locationName,
  localDateTimeISO,
  bulletinDateTimeUtc,
  chartWidth,
  weatherData,
  currentWeatherData,
  tideData,
  sunriseSunsetData,
  timezone,
}: AppProps) {
  const [modelType, setModelType] = useState<"gfs" | "ecmwf">("gfs");

  // Process the data based on the selected model type
  const chartData = processApiDataToChartData(rawApiData, modelType);

  // Get the length of the chart data in order to limit the weather data to the same length
  const chartDataLength = chartData.length;

  return (
    <div className="tw:max-w-[86.75rem] tw:mx-auto">
      <SurfReport
        localDateTimeISO={localDateTimeISO}
        chartData={chartData[0]}
        weatherData={weatherData[0]}
        defaultPreferences={defaultPreferences}
        currentWeatherData={currentWeatherData}
        sunriseSunsetData={sunriseSunsetData}
        tideData={tideData}
        timezone={timezone}
      />
      <h2 className="tw:text-2xl tw:font-semibold tw:mb-4 tw:max-md:px-5">
        {locationName} Surf Forecast
      </h2>
      <div className="tw:flex tw:items-center tw:gap-2 tw:justify-between tw:max-md:px-5">
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
      <Suspense fallback={<GraphSkeleton showMain showWeather showTide />}>
        <ChartsContainer
          chartData={chartData}
          defaultPreferences={defaultPreferences}
          maxSurfHeight={maxSurfHeight}
          chartWidth={chartWidth}
          weatherData={weatherData.slice(0, chartDataLength)}
          tideData={tideData}
        />
      </Suspense>
    </div>
  );
}

export default App;
