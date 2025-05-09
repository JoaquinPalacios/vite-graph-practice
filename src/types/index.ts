// Define types for our unit options
export type UnitPreferences = {
  units: {
    surfHeight: "ft" | "m";
    temperature: "celsius" | "fahrenheit";
    wind: "knots" | "kmh";
  };
  showAdvancedChart: boolean;
};

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
  tide?: unknown;
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
