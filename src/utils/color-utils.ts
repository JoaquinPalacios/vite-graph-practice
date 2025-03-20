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
    { max: 10, color: "#1d5f9d" }, // Light winds
    { max: 14, color: "#88e579" }, // Light to moderate
    { max: 19, color: "#fee792" }, // Moderate
    { max: 24, color: "#e8564e" }, // Strong
    { max: 29, color: "purple" }, // Very strong
    { max: Infinity, color: "black" }, // Extreme
  ];

  // Find the first range where wind speed is less than or equal to max
  const range = windSpeedRanges.find((range) => windSpeed <= range.max);
  return range?.color || "grey";
};
