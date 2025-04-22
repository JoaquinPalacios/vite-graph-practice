// Define types for our unit options
export type UnitPreferences = {
  waveHeight: "ft" | "m";
  windSpeed: "knots" | "km/h";
  temperature: "°C" | "°F";
  showAdvancedChart: boolean;
};

export interface SwellData {
  localDateTimeISO: string;
  timestamp: number;
  swellDirection: number;
  windDirection: number;
  windSpeed_kmh: number;
  windSpeed_knots: number;
  waveHeight_m: number;
  waveHeight_ft: number;
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
}

export type ChartData = SwellData[];
