/**
 * Determines the beach facing direction based on swell direction in degrees
 * @param direction - The swell direction in degrees (0-360)
 * @returns The beach facing direction text
 */
export const getBeachFacingDirection = (direction: number): string => {
  // If direction is between 90 and 270 degrees, beaches face south
  // Otherwise, they face north-east
  return direction > 90 && direction < 270
    ? "Northeast Facing"
    : "South Facing";
};
