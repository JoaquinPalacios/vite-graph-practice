import { lazy, Suspense, useState } from "react";
import {
  UnitPreferences,
  DrupalApiData,
  WeatherData,
  CurrentWeatherData,
  SurfReportItem,
  TideDataFromDrupal,
  SurfcamProps,
} from "./types/index.ts";
import GraphSkeleton from "./components/GraphSkeleton.tsx";
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
  tideData: TideDataFromDrupal[];
  timezone: string;
  surfReport: SurfReportItem[];
  surfcams: SurfcamProps[];
}

const ChartsContainer = lazy(() => import("./components/ChartsContainer"));

function App({
  rawApiData,
  defaultPreferences,
  maxSurfHeight,
  locationName,
  // localDateTimeISO,
  chartWidth,
  weatherData,
  // currentWeatherData,
  tideData,
  timezone,
}: // surfReport,
// surfcams,
AppProps) {
  const [modelType, setModelType] = useState<"gfs" | "ecmwf">(() => {
    // Set initial model type based on available data
    if (rawApiData.forecasts?.gfs?.forecastSteps?.length) return "gfs";
    if (rawApiData.forecasts?.ecmwf?.forecastSteps?.length) return "ecmwf";
    return "gfs"; // fallback if both are empty
  });

  // Process the data based on the selected model type
  let chartData = processApiDataToChartData(rawApiData, modelType);

  if (!rawApiData.user.hasFullAccess) {
    chartData = chartData.slice(0, 24);
  }

  // Get the length of the chart data in order to limit the weather data to the same length
  const chartDataLength = chartData.length;

  // Calculate max significant height across both model types
  const maxSurfHeightAdvanced = Math.ceil(
    Math.max(
      ...processApiDataToChartData(rawApiData, "gfs")
        .map((d) => d.trainData?.map((d) => d.sigHeight ?? 0))
        .flat()
        .filter((n): n is number => n !== undefined),
      ...processApiDataToChartData(rawApiData, "ecmwf")
        .map((d) => d.trainData?.map((d) => d.sigHeight ?? 0))
        .flat()
        .filter((n): n is number => n !== undefined)
    )
  );

  // Create a default chart data item if none exists
  // const defaultChartData = {
  //   localDateTimeISO: localDateTimeISO,
  //   utcDateTimeISO: new Date(localDateTimeISO).toISOString(),
  //   wind: { direction: null, speedKmh: null, speedKnots: null },
  //   primary: {
  //     fullSurfHeightFeet: null,
  //     direction: null,
  //     fullSurfHeightMetres: null,
  //     totalSigHeight: null,
  //   },
  //   secondary: undefined,
  //   trainData: [],
  // };

  // Create default weather data if none exists
  // const defaultCurrentWeatherData = {
  //   temperature_2m: null,
  //   weather_code: null,
  //   wind_speed_10m: null,
  //   wind_direction_10m: null,
  // };

  // Create default sunrise/sunset data if none exists
  // const defaultSunriseSunsetData = {
  //   sunrise: [],
  //   sunset: [],
  //   time: [],
  // };

  return (
    <div className="tw:max-w-[86.75rem] tw:mx-auto">
      {/* <SurfReport
        localDateTimeISO={localDateTimeISO}
        chartData={chartData[0] || defaultChartData}
        defaultPreferences={defaultPreferences}
        currentWeatherData={currentWeatherData || defaultCurrentWeatherData}
        sunriseSunsetData={sunriseSunsetData || defaultSunriseSunsetData}
        tideData={tideData}
        timezone={timezone}
        surfReport={surfReport || []}
        surfcams={surfcams}
      /> */}
      <GraphHeader locationName={locationName} />

      <Suspense fallback={<GraphSkeleton showMain showWeather showTide />}>
        <ChartsContainer
          chartData={chartData}
          defaultPreferences={defaultPreferences}
          maxSurfHeight={maxSurfHeight}
          maxSurfHeightAdvanced={maxSurfHeightAdvanced}
          chartWidth={chartWidth}
          weatherData={weatherData.slice(0, chartDataLength)}
          tideData={tideData}
          timezone={timezone}
          rawApiData={rawApiData}
          modelType={modelType}
          setModelType={setModelType}
        />
      </Suspense>
    </div>
  );
}

export default App;
