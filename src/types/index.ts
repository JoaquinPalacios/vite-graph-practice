export type UnitPreferences = {
  units: {
    surfHeight: "ft" | "m" | "surfers_feet";
    temperature: "celsius" | "fahrenheit";
    wind: "knots" | "km" | "mph";
    unitMeasurements: "m" | "ft";
  };
  showAdvancedChart: boolean;
};

export interface TideDataAustraliaFromDrupal {
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
    instance: "low" | "high";
    sequence: number;
    time_local: string; // "2025-05-09T00:00:00.000Z"
    value: string; // "1.0" in meters
  };
}

export interface TideDataFromDrupal {
  _source: {
    height: number; // 5646465
    time_local: string; // "2025-05-09T00:00:00.000Z"
    type: "low" | "high";
    is_boundary?: boolean; // Optional boolean flag for boundary points
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
    isAustralia: boolean;
  };
  user: {
    hasFullAccess: boolean;
    subscriptionStatus: string;
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
      surfHeight: "ft" | "m" | "surfers_feet";
      temperature: "celsius" | "fahrenheit";
      wind: "knots" | "km" | "mph";
      unitMeasurements: "m" | "ft";
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
  tide: TideDataFromDrupal[] | [];
  surf_report: SurfReportItem[];
  surfcams: SurfcamProps[];
}

export interface MobileContext {
  isWebView: boolean;
  appVersion: string;
  featureFlags: {
    supportsStyleUpdates: boolean;
    supportsAdvancedChart: boolean;
  };
}

export interface ChartDataItem {
  localDateTimeISO: string;
  utcDateTimeISO: string; // Needs to be derived or present in API data
  dateTime?: string; // Local time with timezone
  bulletinDateTimeUtc?: string; // UTC bulletin time
  location?: string; // Location name
  wind: {
    direction: number | null;
    speedKmh: number | null;
    speedKnots: number | null;
    speedMph: number | null;
  };
  primary: {
    fullSurfHeightFaceFeet: number | null;
    fullSurfHeightFeet: number | null;
    fullSurfHeightFeetLabelBin?: string;
    fullSurfHeightFaceFeetLabelBin?: string;
    fullSurfHeightFeetLabelDescriptive?: string;
    fullSurfHeightMetres?: number | null;
    fullSurfHeightMetresLabelBin?: string;
    totalSigHeight?: number | null;
    direction: number | null;
  };
  secondary?: {
    fullSurfHeightFaceFeet: number | null;
    fullSurfHeightFeet: number | null;
    fullSurfHeightFeetLabelBin?: string;
    fullSurfHeightFaceFeetLabelBin?: string;
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
  _isMissingData?: boolean;
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

export interface SurfcamProps {
  name: string;
  streamName: string;
  updatedAt: string;
}

export interface SwellPoint {
  height: number;
  direction: number;
  period: number;
  localDateTimeISO: string;
  timestamp: number;
  eventId: string;
}

export interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  data: SwellPoint | SwellPoint[] | null;
  side: "left" | "right";
}

// New types for the user API endpoint
export interface UserStatus {
  isLoggedIn: boolean;
  hasFullAccess: boolean;
  username: string;
  userId: string;
  isSubscriber: boolean;
  isPastDue: boolean;
  userLocationCountry: string;
  userLocationRegion: string;
  surf_height_preference: "ft" | "m" | "surfers_feet";
  wind_preference: "knots" | "km" | "mph";
  temperature_preference: "celsius" | "fahrenheit";
  unit_of_measurement: "m" | "ft";
}

export interface DrupalUserApiResponse {
  user_status: {
    isLoggedIn: boolean;
    hasFullAccess: boolean;
  };
  user: {
    username: string;
    userId: string;
    isSubscriber: boolean;
    isPastDue: boolean;
    userLocationCountry: string;
    userLocationRegion: string;
    surf_height_preference: "ft" | "m" | "surfers_feet";
    wind_preference: "knots" | "km" | "mph";
    temperature_preference: "celsius" | "fahrenheit";
    unit_of_measurement: "m" | "ft";
  };
}

declare global {
  interface Window {
    swellnetRawData: DrupalApiData;
  }
}
