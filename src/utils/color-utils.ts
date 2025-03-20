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
