// Define types for our unit options
export type UnitPreferences = {
  units: {
    surfHeight: "ft" | "m";
    temperature: "celsius" | "fahrenheit";
    wind: "knots" | "kmh";
  };
  showAdvancedChart: boolean;
};

export interface TideData {
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
    hourly: {
      temperature_2m: number[];
      time: string[];
      weather_code: number[];
    };
  };
  tide: TideData[];
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

declare global {
  interface Window {
    swellnetRawData: DrupalApiData;
  }
}
