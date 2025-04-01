export const generateTicks = (maxHeight: number, unit: "ft" | "m") => {
  if (unit === "ft") {
    // Base ticks for feet with increasing intervals
    const baseTicks = [
      0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 20, 25, 30, 35, 40, 45, 50,
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
    const baseTicksMeters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15];

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

// Helper function to format wave heights
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
