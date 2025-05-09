import chartData from "@/data";
import { processTimeData } from "@/lib/time-utils";
import { scaleTime } from "d3-scale";
import { XAxisProps } from "recharts";

export const generateTicks = (maxHeight: number, unit: "ft" | "m") => {
  if (unit === "ft") {
    // Base ticks for feet with increasing intervals
    const baseTicks = [
      0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 20, 25, 30, 35, 40, 45, 50, 55,
      60, 65, 70, 75, 80, 85, 90, 95, 100,
    ];

    // Find the appropriate max tick (rounded up to next increment)
    let maxTick = 0;
    for (let i = 0; i < baseTicks.length; i++) {
      if (baseTicks[i] >= maxHeight) {
        maxTick = baseTicks[i];
        break;
      }
      if (i === baseTicks.length - 1) {
        // If we reach the end, calculate the next increment (adding 5)
        const lastTick = baseTicks[baseTicks.length - 1];
        maxTick = lastTick + 5 * Math.ceil((maxHeight - lastTick) / 5);
      }
    }

    return baseTicks.filter((tick) => tick <= maxTick).concat(maxTick);
  } else {
    // For meters, use smaller increments
    const baseTicksMeters = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 35, 40,
    ];

    let maxTick = 0;
    for (let i = 0; i < baseTicksMeters.length; i++) {
      if (baseTicksMeters[i] >= maxHeight) {
        maxTick = baseTicksMeters[i];
        break;
      }
      if (i === baseTicksMeters.length - 1) {
        // If we reach the end, calculate the next increment
        const lastTick = baseTicksMeters[baseTicksMeters.length - 1];
        maxTick =
          lastTick +
          (maxHeight > 15 ? 5 : 1) *
            Math.ceil((maxHeight - lastTick) / (maxHeight > 15 ? 5 : 1));
      }
    }

    return baseTicksMeters.filter((tick) => tick <= maxTick).concat(maxTick);
  }
};

export const formatDateTick = (value: string) => {
  // Parse the ISO datetime string which includes timezone offset
  const date = new Date(value);

  // Format the date using local time methods
  const formattedDate = date
    .toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
    })
    .toLocaleUpperCase()
    .replace(",", "");

  const [weekday, datePart] = formattedDate.split(" ");
  const [month, day] = datePart.split("/");
  const reversedDate = `${day}/${month.padStart(2, "0")}`;

  return `${weekday} ${reversedDate}`;
};

/**
 * Maps wind speed (in knots) to standard wind speed colors
 * @param windSpeed - The wind speed in knots
 * @returns - A hex color code
 */
export const getWindColor = (windSpeed: number): string => {
  if (typeof windSpeed === "undefined" || isNaN(windSpeed)) {
    return "grey";
  }

  // Define wind speed thresholds and their corresponding colors
  const windSpeedRanges = [
    { max: 3, color: "#9ac8ff" }, // Very light winds (soft sky blue)
    { max: 6, color: "#6daafc" }, // Light breeze (light blue)
    { max: 9, color: "#2a78d2" }, // Gentle breeze (deeper blue)
    { max: 12, color: "#42d67c" }, // Moderate breeze (soft green)
    { max: 15, color: "#7fde4f" }, // Fresh breeze (vibrant green)
    { max: 18, color: "#f7d154" }, // Strong breeze (yellow-orange)
    { max: 21, color: "#f4a72c" }, // Near gale (darker orange)
    { max: 24, color: "#f05b25" }, // Gale (deep orange-red)
    { max: 27, color: "#e02f2f" }, // Strong gale (red)
    { max: 30, color: "#b71d51" }, // Storm-force (dark red)
    { max: 33, color: "#a012b1" }, // Violent storm (purple)
    { max: 36, color: "#900fa4" }, // Increasing intensity (darker purple)
    { max: 39, color: "#7b018a" }, // Hurricane-force (deep violet)
    { max: 42, color: "#650073" }, // Extreme winds (dark violet)
    { max: 45, color: "#4d0066" }, // Catastrophic winds (very dark purple)
    { max: 48, color: "#37004d" }, // Near blackout (deep indigo)
    { max: 50, color: "#a012b1" }, // 50 knots - defined purple
    { max: 55, color: "#800f92" }, // Slowly fading into black
    { max: 60, color: "#600d75" }, // Darker transition
    { max: 70, color: "#400954" }, // Almost black
    { max: 80, color: "#24052e" }, // Near complete blackout
    { max: 90, color: "#120216" }, // Very close to black
    { max: 100, color: "#000000" }, // Max extreme (black)
  ];

  // Find the first range where wind speed is less than or equal to max
  const range = windSpeedRanges.find((range) => windSpeed <= range.max);
  return range?.color || "grey";
};

/**
 * Generic time processing utility that can be used for any time-series data
 */
export const processTimeScaleData = (timestamps: number[]) => {
  const startTimestamp = Math.min(...timestamps);
  const endTimestamp = Math.max(...timestamps);

  // Create Date objects for the start and end of the day
  const startDateObj = new Date(startTimestamp);
  const endDateObj = new Date(endTimestamp);

  // Set start date to beginning of day (00:00:00)
  startDateObj.setDate(startDateObj.getDate());
  startDateObj.setHours(0, 0, 0, 0);

  // Set end date to beginning of next day (00:00:00)
  endDateObj.setDate(endDateObj.getDate() + 1);
  endDateObj.setHours(0, 0, 0, 0);

  // Create time scale with numeric timestamps
  const timeScale = scaleTime().domain([startDateObj, endDateObj]).nice();

  // Generate ticks for each day
  const dayTicks: number[] = [];
  let currentDate = new Date(startDateObj);
  while (currentDate <= endDateObj) {
    dayTicks.push(currentDate.getTime());
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    startDateObj,
    endDateObj,
    timeScale,
    dayTicks,
  };
};

// TODO - Remove this once we have the new utility working
export const { processedData, dayTicks } = processTimeData(
  chartData.map((item) => ({
    ...item,
    dateTime: item.localDateTimeISO,
    timestamp: new Date(item.localDateTimeISO).getTime(),
  }))
);

const timeValues = processedData.map((row) => row.timestamp);
const { startDateObj, endDateObj, timeScale } =
  processTimeScaleData(timeValues);

export { startDateObj, endDateObj, timeScale };

/**
 * Base XAxis configuration
 */
export const baseChartXAxisProps: Partial<XAxisProps> = {
  dataKey: "timestamp",
  // dataKey: (item) => new Date(item.dateTimeISO).getTime(),
  type: "number" as const,
  scale: timeScale,
  domain: timeScale.domain().map((date) => date.valueOf()),
  interval: "preserveStart" as const,
  padding: { left: 12 },
  allowDuplicatedCategory: false,
  allowDataOverflow: true,
};

// Convert meters to feet with one decimal place precision
export const metersToFeet = (meters: number): number => {
  return Number((meters * 3.28084).toFixed(1));
};

/**
 * Calculates the coefficients for cubic spline interpolation
 * @param x Array of x values (timestamps)
 * @param y Array of y values (heights)
 * @returns Array of coefficients for cubic spline interpolation
 */
const calculateSplineCoefficients = (x: number[], y: number[]) => {
  const n = x.length;
  const h: number[] = [];
  const alpha: number[] = [];
  const l: number[] = new Array(n).fill(0);
  const mu: number[] = new Array(n).fill(0);
  const z: number[] = new Array(n).fill(0);
  const c: number[] = new Array(n).fill(0);
  const b: number[] = new Array(n - 1).fill(0);
  const d: number[] = new Array(n - 1).fill(0);

  // Calculate h values
  for (let i = 0; i < n - 1; i++) {
    h[i] = x[i + 1] - x[i];
  }

  // Calculate alpha values
  for (let i = 1; i < n - 1; i++) {
    alpha[i] =
      (3 / h[i]) * (y[i + 1] - y[i]) - (3 / h[i - 1]) * (y[i] - y[i - 1]);
  }

  // Calculate l, mu, and z values
  l[0] = 1;
  for (let i = 1; i < n - 1; i++) {
    l[i] = 2 * (x[i + 1] - x[i - 1]) - h[i - 1] * mu[i - 1];
    mu[i] = h[i] / l[i];
    z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
  }

  // Calculate c, b, and d values
  l[n - 1] = 1;
  for (let j = n - 2; j >= 0; j--) {
    c[j] = z[j] - mu[j] * c[j + 1];
    b[j] = (y[j + 1] - y[j]) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3;
    d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
  }

  return { b, c, d };
};

interface TideDataPoint {
  height: number;
  timestamp: number;
  localDateTimeISO: string;
  utcDateTimeISO: string;
}

// Interpolate tide data with natural curves
export const interpolateTideData = (data: TideDataPoint[]): TideDataPoint[] => {
  if (data.length < 2) return data;

  const result: TideDataPoint[] = [];
  const POINTS_BETWEEN = 20; // Number of points to add between each actual data point

  // Calculate spline coefficients using UTC timestamps for consistent intervals
  const timestamps = data.map((point) =>
    new Date(point.utcDateTimeISO).getTime()
  );
  const heights = data.map((point) => point.height);
  const { b, c, d } = calculateSplineCoefficients(timestamps, heights);

  // Interpolate between each pair of points
  for (let i = 0; i < data.length - 1; i++) {
    const startPoint = data[i];
    const endPoint = data[i + 1];

    // Add the start point
    result.push(startPoint);

    // Calculate time step in milliseconds between the two points
    const startTime = new Date(startPoint.utcDateTimeISO).getTime();
    const endTime = new Date(endPoint.utcDateTimeISO).getTime();
    const timeStep = (endTime - startTime) / (POINTS_BETWEEN + 1);

    // Add interpolated points using cubic spline
    for (let j = 1; j <= POINTS_BETWEEN; j++) {
      const timestamp = startTime + timeStep * j;
      const x = timestamp - timestamps[i]; // Use the same time base as coefficients

      // Calculate height using cubic spline formula
      const height = heights[i] + b[i] * x + c[i] * x * x + d[i] * x * x * x;

      // Create proper UTC and local time strings
      const utcDate = new Date(timestamp);
      const localDate = new Date(timestamp + 11 * 60 * 60 * 1000); // Add 11 hours for +11:00 timezone

      result.push({
        height,
        timestamp,
        localDateTimeISO: localDate.toISOString().replace("Z", "+11:00"),
        utcDateTimeISO: utcDate.toISOString(),
      });
    }
  }

  // Add the last point
  result.push(data[data.length - 1]);

  return result;
};

/**
 * Calculates the chart width based on number of days in the data.
 * @param dataLength Number of 3-hour data points
 * @param widthPerDay Width in px for each day (default 294)
 * @param extraSpace Additional px to add for chart padding/margins (default 0)
 * @returns Total width in px for the chart
 */
export const getChartWidth = (
  dataLength: number,
  widthPerDay = 256,
  extraSpace = 0
): number => {
  const days = Math.ceil(dataLength / 8);
  return days * widthPerDay + extraSpace;
};
