import { lazy, Suspense, useState } from "react";
import {
  UnitPreferences,
  DrupalApiData,
  WeatherData,
  TideDataAustraliaFromDrupal,
  CurrentWeatherData,
  SunriseSunsetData,
  SurfReportItem,
  TideDataWorldWideFromDrupal,
} from "./types/index.ts";
import GraphSkeleton from "./components/GraphSkeleton.tsx";
import { SurfReport } from "./components/SurfReport/index.tsx";
import { processApiDataToChartData } from "./lib/data-processing.ts";
import { GraphHeader } from "./components/GraphHeader.tsx";

interface AppProps {
  rawApiData: DrupalApiData;
  defaultPreferences: UnitPreferences;
  maxSurfHeight: {
    feet: number;
    meters: number;
  };
  locationName: string;
  localDateTimeISO: string;
  chartWidth: number;
  weatherData: WeatherData[];
  currentWeatherData: CurrentWeatherData;
  tideData: TideDataAustraliaFromDrupal[] | TideDataWorldWideFromDrupal[];
  sunriseSunsetData: SunriseSunsetData;
  timezone: string;
  surfReport: SurfReportItem[];
  isAustralia: boolean;
}

const ChartsContainer = lazy(() => import("./components/ChartsContainer"));

function App({
  rawApiData,
  defaultPreferences,
  maxSurfHeight,
  locationName,
  localDateTimeISO,
  chartWidth,
  weatherData,
  currentWeatherData,
  tideData,
  sunriseSunsetData,
  timezone,
  surfReport,
  isAustralia,
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
        tideData={
          isAustralia
            ? (tideData as TideDataAustraliaFromDrupal[])
            : (tideData as TideDataWorldWideFromDrupal[])
        }
        timezone={timezone}
        surfReport={surfReport}
        isAustralia={isAustralia}
      />
      <GraphHeader
        locationName={locationName}
        modelType={modelType}
        setModelType={setModelType}
        rawApiData={rawApiData}
      />

      <Suspense fallback={<GraphSkeleton showMain showWeather showTide />}>
        <ChartsContainer
          chartData={chartData}
          defaultPreferences={defaultPreferences}
          maxSurfHeight={maxSurfHeight}
          chartWidth={chartWidth}
          weatherData={weatherData.slice(0, chartDataLength)}
          tideData={
            isAustralia
              ? (tideData as TideDataAustraliaFromDrupal[])
              : (tideData as TideDataWorldWideFromDrupal[])
          }
          timezone={timezone}
          isAustralia={isAustralia}
        />
      </Suspense>
    </div>
  );
}

export default App;
