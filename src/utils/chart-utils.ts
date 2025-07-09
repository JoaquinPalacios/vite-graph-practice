import { scaleTime } from "d3-scale";

/**
 * Generate ticks for the charts.
 * @description This function generates ticks for the charts based on the maximum height and unit.
 * It maps the ticks to the nearest increment and returns an array of ticks.
 * @param maxHeight - The maximum height of the tide
 * @param unit - The unit of the tide (ft or m)
 * @returns - An array of ticks
 */
export const generateTicks = (maxHeight: number, unit: "ft" | "m") => {
  if (unit === "ft") {
    // Round maxHeight to nearest whole number
    const roundedMax = Math.ceil(maxHeight) + 1;

    // Special cases for feet based on rounded maxHeight
    if (roundedMax <= 5) {
      // Show all ticks up to the actual maximum
      const ticks = [];
      for (let i = 0; i <= roundedMax; i++) {
        ticks.push(i);
      }
      return ticks;
    } else if (roundedMax <= 14) {
      const roundedToTwo = Math.ceil(roundedMax / 2) * 2;
      const ticks = [];
      for (let i = 0; i <= roundedToTwo; i += 2) {
        ticks.push(i);
      }
      return ticks;
    } else if (roundedMax <= 16) {
      return [0, 4, 8, 12, 16];
    } else {
      // For values greater than 16, show ticks in increments of 5
      // Round up to the nearest multiple of 5
      const roundedToFive = Math.ceil(roundedMax / 5) * 5;
      const ticks = [];
      for (let i = 0; i <= roundedToFive; i += 5) {
        ticks.push(i);
      }
      return ticks;
    }
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
 * Format the date tick for the charts.
 * @description This function formats the date tick for the charts based on the ISO datetime string.
 * It parses the ISO datetime string which includes timezone offset, formats the date using local time methods,
 * and returns the formatted date.
 * @param value - The ISO datetime string
 * @returns - The formatted date
 */
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
 * Creates a continuous time scale for tide data, starting at midnight of the first day
 */
export const createTideTimeScale = (timestamps: number[]) => {
  if (!timestamps.length) return null;

  // Get the first timestamp and create a date object
  const firstTimestamp = Math.min(...timestamps);
  const firstDate = new Date(firstTimestamp);

  // Set to midnight of the first day
  const startDate = new Date(firstDate);
  startDate.setHours(0, 0, 0, 0);

  // Get the last timestamp and create a date object
  const lastTimestamp = Math.max(...timestamps);
  const lastDate = new Date(lastTimestamp);

  // Set to midnight of the day after the last data point
  const endDate = new Date(lastDate);
  endDate.setDate(endDate.getDate() + 1);
  endDate.setHours(0, 0, 0, 0);

  // Create time scale with numeric timestamps
  const timeScale = scaleTime().domain([startDate, endDate]).nice();

  // Generate ticks for each day
  const dayTicks: number[] = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dayTicks.push(currentDate.getTime());
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    startDate,
    endDate,
    timeScale,
    dayTicks,
  };
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

/**
 * Define the color palette of each Advanced Swell event
 */
export const colorPalette = [
  "oklch(50.5% 0.213 27.518)", // Tailwind red-700
  "oklch(55.5% 0.163 48.998)", // Tailwind amber-700
  "oklch(48.8% 0.243 264.376)", // Tailwind blue-700
  "oklch(52.7% 0.154 150.069)", // Tailwind green-700
  "oklch(49.6% 0.265 301.924)", // Tailwind purple-700
  "oklch(52.5% 0.223 3.958)", // Tailwind pink-700
  "oklch(27.9% 0.041 260.031)", // Tailwind slate-800
  "oklch(52% 0.105 223.128)", // Tailwind cyan-700
  "oklch(53.2% 0.157 131.589)", // Tailwind lime-700
];

/**
 * Define the active color palette of the hovered Advanced Swell event
 */
export const activeColorPalette = [
  "oklch(57.7% 0.245 27.325)", // Tailwind red-600
  "oklch(66.6% 0.179 58.318)", // Tailwind amber-600
  "oklch(54.6% 0.245 262.881)", // Tailwind blue-600
  "oklch(62.7% 0.194 149.214)", // Tailwind green-600
  "oklch(55.8% 0.288 302.321)", // Tailwind purple-600
  "oklch(59.2% 0.249 0.584)", // Tailwind pink-600
  "oklch(55.4% 0.046 257.417)", // Tailwind slate-500
  "oklch(60.9% 0.126 221.723)", // Tailwind cyan-600
  "oklch(76.8% 0.233 130.85)", // Tailwind lime-500
];

/**
 * Calculates the tooltip position and side (left/right) to keep it within chart bounds.
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param tooltipWidth - Tooltip width
 * @param tooltipHeight - Tooltip height
 * @param chartWidth - Chart drawing width
 * @param chartHeight - Chart drawing height
 * @param margin - Chart margin object
 * @returns Object with x, y, and side ("left" | "right")
 */
export const calculateTooltipPosition = (
  x: number,
  y: number,
  tooltipWidth: number,
  tooltipHeight: number,
  chartWidth: number,
  chartHeight: number,
  margin: { left: number; right: number; top: number; bottom: number }
) => {
  const offsetX = 24;
  const offsetY = -8;
  const spaceRight = chartWidth - (x + margin.left);
  const spaceTop = y + margin.top;
  let tooltipX = x + margin.left + offsetX;
  let side: "left" | "right" = "right";
  if (spaceRight < tooltipWidth + offsetX) {
    tooltipX = x + margin.left - tooltipWidth - offsetX;
    side = "left";
  }
  let tooltipY = y + margin.top + offsetY;
  if (spaceTop < tooltipHeight + Math.abs(offsetY)) {
    tooltipY = y + margin.top + Math.abs(offsetY);
  }
  tooltipX = Math.max(
    margin.left,
    Math.min(chartWidth - tooltipWidth - margin.right, tooltipX)
  );
  tooltipY = Math.max(
    margin.top,
    Math.min(chartHeight - tooltipHeight - margin.bottom, tooltipY)
  );
  return { x: tooltipX, y: tooltipY, side };
};
