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

/**
 * Formats the wave height for the tooltip
 * @param height - The wave height
 * @param unit - The unit of the wave height
 * @returns The formatted wave height
 */
export const formatWaveHeight = (
  height: number | undefined,
  unit: string | undefined
) => {
  if (!height) return "0m"; // Handle undefined height
  const actualUnit = unit || "m"; // Default to meters if unit is undefined

  if (actualUnit === "ft") {
    // For feet, show as a range (e.g., 2-3ft)
    const lowerBound = Math.floor(height);
    const upperBound = Math.ceil(height);

    // If the height is already a whole number, just return that value
    if (lowerBound === upperBound) {
      return `${lowerBound}${actualUnit}`;
    }

    return `${lowerBound}-${upperBound}${actualUnit}`;
  }

  // For meters, show one decimal place
  return `${height.toFixed(1)}${actualUnit}`;
};

export const formatDateTick = (value: string) => {
  // Parse the date and convert to UTC to avoid DST issues
  const date = new Date(value);
  const utcDate = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      12,
      0,
      0,
      0
    )
  );

  // Format the date using UTC methods
  const formattedDate = utcDate
    .toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
      timeZone: "UTC", // Ensure consistent formatting regardless of local timezone
    })
    .toLocaleUpperCase()
    .replace(",", "");

  const [weekday, datePart] = formattedDate.split(" ");
  const [month, day] = datePart.split("/");
  const reversedDate = `${day}/${month.padStart(2, "0")}`;

  return `${weekday} ${reversedDate}`;
};

export const formatWeatherText = (text: string) => {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
 * Convert a 12-hour time string to a 24-hour time string
 * @param time - The 12-hour time string
 * @returns The 24-hour time string
 */
const convertTo24Hour = (time: string) => {
  const [hours, period] = time.match(/(\d+)([ap]m)/i)?.slice(1) || [];
  if (!hours || !period) return time;
  let hour = parseInt(hours);
  if (period.toLowerCase() === "pm" && hour !== 12) hour += 12;
  if (period.toLowerCase() === "am" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:00`;
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

// Update the existing swell chart data processing to use the new utility
export const { processedData, dayTicks } = processTimeData(
  chartData.map((item) => ({
    ...item,
    dateTime: `${item.date} ${convertTo24Hour(item.time)}`,
    timestamp: new Date(`${item.date} ${convertTo24Hour(item.time)}`).getTime(),
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
