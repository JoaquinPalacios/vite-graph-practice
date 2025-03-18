/**
 * Generates appropriate tick values for foot measurements on the Y-axis
 * Uses a standard surf-report scale with varying increments
 */
export const generateFootTicks = (maxHeight: number) => {
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

  // Return all ticks up to our maxTick
  return baseTicks.filter((tick) => tick <= maxTick).concat(maxTick);
};
