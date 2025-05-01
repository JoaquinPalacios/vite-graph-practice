// Define types for our unit options
export type UnitPreferences = {
  waveHeight: "ft" | "m";
  windSpeed: "knots" | "km/h";
  temperature: "°C" | "°F";
  showAdvancedChart: boolean;
};

export interface SwellData {
  localDateTimeISO: string;
  swellDirection: number;
  windDirection: number;
  windSpeedKmh: number;
  windSpeedKnots: number;
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
