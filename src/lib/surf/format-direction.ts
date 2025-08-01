/**
 * Calculates the adjusted direction value (handles the 180-degree flip)
 * @param {number} direction - The original direction value
 * @returns {number} The adjusted direction value
 */
export const getAdjustedDirection = (direction: number): number => {
  return direction > 180 ? direction - 180 : direction + 180;
};
