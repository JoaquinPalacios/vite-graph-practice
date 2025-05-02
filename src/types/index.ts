// Define types for our unit options
export type UnitPreferences = {
  units: {
    surfHeight: "ft" | "m";
    temperature: "celsius" | "fahrenheit";
    wind: "knots" | "kmh";
  };
  showAdvancedChart: boolean;
};

export interface SwellData {
  localDateTimeISO: string;
  swellDirection: number;
  wind: {
    direction: number;
    speedKmh: number;
    speedKnots: number;
  };
  waveHeightMetres: number;
  waveHeightFeet: number;
  faceWaveHeight_ft?: number;
  isRising: boolean;
  nextHighTide?: string;
  nextHighTideHeight?: number;
  nextLowTide?: string;
  nextLowTideHeight?: number;
  nextTideTime?: string;
  nextTideHeight?: number;
  // Primary swell
  primarySwellHeight?: number;
  primarySwellDirection?: number;
  primarySwellPeriod?: number;
  // Secondary swell
  secondarySwellHeight?: number;
  secondarySwellDirection?: number;
  secondarySwellPeriod?: number;
  // Tertiary swell
  tertiarySwellHeight?: number;
  tertiarySwellDirection?: number;
  tertiarySwellPeriod?: number;
  // Fourth swell
  fourthSwellHeight?: number;
  fourthSwellDirection?: number;
  fourthSwellPeriod?: number;
  // Fifth swell
  fifthSwellHeight?: number;
  fifthSwellDirection?: number;
  fifthSwellPeriod?: number;
  primary: {
    fullSurfHeightFeet: number;
    fullSurfHeightFeetLabelBin: string;
    fullSurfHeightFeetLabelDescriptive: string;
    fullSurfHeightMetres: number;
    totalSigHeight: number;
    direction: number;
  };
  secondary?: {
    fullSurfHeightFeet: number;
    fullSurfHeightFeetLabelBin: string;
    fullSurfHeightFeetLabelDescriptive: string;
    fullSurfHeightMetres: number;
    totalSigHeight: number;
    direction: number;
  } | null;
  trainData: {
    trainDelta: number;
    sigHeight: number;
    peakPeriod: number;
    direction: number;
  }[];
}

export type ChartData = SwellData[];

export interface DrupalApiData {
  location: {
    name: string;
    timezone: string;
  };
  forecasts: {
    ecmwf: {
      bulletinTimeUtc: string;
      forecastSteps: ChartDataItem[];
    };
    gfs: {
      bulletinTimeUtc: string;
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
}

export interface ChartDataItem {
  bulletinDatetimeUtc?: string; // Only on the first item
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

declare global {
  interface Window {
    swellnetRawData: DrupalApiData;
  }
}
