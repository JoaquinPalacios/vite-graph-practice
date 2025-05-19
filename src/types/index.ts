// Define types for our unit options
export type UnitPreferences = {
  units: {
    surfHeight: "ft" | "m";
    temperature: "celsius" | "fahrenheit";
    wind: "knots" | "kmh";
  };
  showAdvancedChart: boolean;
};

export interface TideDataFromDrupal {
  sort: number[];
  _id: string; // "5646465"
  _index: string; // "tide-data-2025-05-09"
  _score: null; // null
  _source: {
    "@timestamp": string; // "2025-05-09T00:00:00.000Z"
    "@version": string; // "1"
    aac: string; // ""NSW_TP029""
    area: string; // "Kingscliff"
    id: number; // 1234657
    instance: "low" | "high"; // "low"
    sequence: number; // 1
    time_local: string; // "2025-05-09T00:00:00.000Z"
    value: string; // "1.0" in meters
  };
}

export interface TideData {
  id: string; // Using _id as the main identifier since it's a string and more unique
  index: string; // Renamed from _index for consistency
  source: {
    timestamp: string; // Renamed from @timestamp for cleaner access
    aac: string; // Area code
    area: string; // Location name
    instance: "low" | "high";
    localTimeISO: string; // Renamed from time_local for consistency
    value: string; // Tide height in meters
  };
}

export interface SurfReportItem {
  locationId: string;
  name: string;
  date: string;
  surfHeight: string;
  surfQuality: string;
  surfRating: string;
  swellDir: string;
  weather: string;
  wind: string;
  report: string;
}

export interface DrupalApiData {
  location: {
    name: string;
    timezone: string;
    localDateTime: string;
  };
  forecasts: {
    ecmwf: {
      bulletinDateTimeUtc: string;
      forecastSteps: ChartDataItem[];
    };
    gfs: {
      bulletinDateTimeUtc: string;
      forecastSteps: ChartDataItem[];
    };
  };
  preferences: {
    units: {
      surfHeight: "ft" | "m";
      temperature: "celsius" | "fahrenheit";
      wind: "knots" | "kmh";
    };
  };
  error: string | null;
  weather: {
    current: CurrentWeatherData;
    daily: SunriseSunsetData;
    hourly: {
      temperature_2m: number[];
      time: string[];
      weather_code: number[];
    };
  };
  tide: TideDataFromDrupal[];
  surf_report: SurfReportItem[];
}

export interface ChartDataItem {
  localDateTimeISO: string;
  utcDateTimeISO: string; // Needs to be derived or present in API data
  wind: {
    direction: number | null;
    speedKmh: number | null;
    speedKnots: number | null;
  };
  primary: {
    fullSurfHeightFeet: number | null;
    fullSurfHeightFeetLabelBin?: string;
    fullSurfHeightFeetLabelDescriptive?: string;
    fullSurfHeightMetres?: number | null;
    fullSurfHeightMetresLabelBin?: string;
    totalSigHeight?: number | null;
    direction: number | null;
  };
  secondary?: {
    fullSurfHeightFeet: number | null;
    fullSurfHeightFeetLabelBin?: string;
    fullSurfHeightFeetLabelDescriptive?: string;
    fullSurfHeightMetres?: number | null;
    fullSurfHeightMetresLabelBin?: string;
    totalSigHeight?: number | null;
    direction: number | null;
  };
  trainData?: {
    trainDelta: number;
    sigHeight: number | null;
    peakPeriod: number | null;
    direction: number | null;
  }[];
}

export interface WeatherData {
  index: number;
  localDateTimeISO: string;
  currentTemp: number;
  weatherId: number;
}

export interface CurrentWeatherData {
  is_day: number;
  temperature_2m: number;
  time: string;
  weather_code: number;
  wind_direction_10m: number;
  wind_speed_10m: number;
}

export interface SunriseSunsetData {
  sunrise: string[];
  sunset: string[];
  time: string[];
}

declare global {
  interface Window {
    swellnetRawData: DrupalApiData;
  }
}
