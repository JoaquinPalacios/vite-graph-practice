// Function to convert degrees to cardinal/ordinal direction
export const degreesToCompassDirection = (degrees: number): string => {
  // Normalize degrees to be within 0-360
  const normalized = ((degrees % 360) + 360) % 360;

  // Special case for North which spans across 348.75-360 and 0-11.25
  if (normalized >= 348.75 || normalized < 11.25) {
    return "N";
  }

  // Define direction ranges (16-point compass excluding North which is handled above)
  const directions = [
    { label: "NNE", min: 11.25, max: 33.75 },
    { label: "NE", min: 33.75, max: 56.25 },
    { label: "ENE", min: 56.25, max: 78.75 },
    { label: "E", min: 78.75, max: 101.25 },
    { label: "ESE", min: 101.25, max: 123.75 },
    { label: "SE", min: 123.75, max: 146.25 },
    { label: "SSE", min: 146.25, max: 168.75 },
    { label: "S", min: 168.75, max: 191.25 },
    { label: "SSW", min: 191.25, max: 213.75 },
    { label: "SW", min: 213.75, max: 236.25 },
    { label: "WSW", min: 236.25, max: 258.75 },
    { label: "W", min: 258.75, max: 281.25 },
    { label: "WNW", min: 281.25, max: 303.75 },
    { label: "NW", min: 303.75, max: 326.25 },
    { label: "NNW", min: 326.25, max: 348.75 },
  ];

  // Find the matching direction
  for (const direction of directions) {
    if (normalized >= direction.min && normalized < direction.max) {
      return direction.label;
    }
  }

  // Fallback (shouldn't get here if all angles are covered)
  return "Unknown";
};
