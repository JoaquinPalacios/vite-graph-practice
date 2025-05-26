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
  const [modelType, setModelType] = useState<"gfs" | "ecmwf">(() => {
    // Set initial model type based on available data
    if (rawApiData.forecasts?.gfs?.forecastSteps?.length) return "gfs";
    if (rawApiData.forecasts?.ecmwf?.forecastSteps?.length) return "ecmwf";
    return "gfs"; // fallback if both are empty
  });

  // Process the data based on the selected model type
  const chartData = processApiDataToChartData(rawApiData, modelType);

  // Get the length of the chart data in order to limit the weather data to the same length
  const chartDataLength = chartData.length;

  // Create a default chart data item if none exists
  const defaultChartData = {
    localDateTimeISO: localDateTimeISO,
    utcDateTimeISO: new Date(localDateTimeISO).toISOString(),
    wind: { direction: null, speedKmh: null, speedKnots: null },
    primary: {
      fullSurfHeightFeet: null,
      direction: null,
      fullSurfHeightMetres: null,
      totalSigHeight: null,
    },
    secondary: undefined,
    trainData: [],
  };

  // Create a default weather data item if none exists
  const defaultWeatherData = {
    index: 1,
    localDateTimeISO: localDateTimeISO,
    currentTemp: null,
    weatherId: null,
  };

  // Create default weather data if none exists
  const defaultCurrentWeatherData = {
    temperature_2m: null,
    weather_code: null,
    wind_speed_10m: null,
    wind_direction_10m: null,
  };

  // Create default sunrise/sunset data if none exists
  const defaultSunriseSunsetData = {
    sunrise: [],
    sunset: [],
    time: [],
  };

  return (
    <div className="tw:max-w-[86.75rem] tw:mx-auto">
      <SurfReport
        localDateTimeISO={localDateTimeISO}
        chartData={chartData[0] || defaultChartData}
        weatherData={weatherData[0] || defaultWeatherData}
        defaultPreferences={defaultPreferences}
        currentWeatherData={currentWeatherData || defaultCurrentWeatherData}
        sunriseSunsetData={sunriseSunsetData || defaultSunriseSunsetData}
        tideData={
          isAustralia
            ? (tideData as TideDataAustraliaFromDrupal[])
            : (tideData as TideDataWorldWideFromDrupal[])
        }
        timezone={timezone}
        surfReport={surfReport || []}
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
