/**
 * Maps wind speed to a color between green and red
 * @param windSpeed - The wind speed in knots
 * @returns - A hex color code
 */
export const getWindColor = (windSpeed: number): string => {
  // Define wind speed thresholds (in knots)
  const MIN_SPEED = 0; // Green - very light wind
  const MAX_SPEED = 35; // Red - very strong wind

  // Clamp wind speed between min and max
  const clampedSpeed = Math.min(Math.max(windSpeed, MIN_SPEED), MAX_SPEED);

  // Calculate percentage between min and max
  const percentage = (clampedSpeed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED);

  // Define color stops
  const colors = {
    0: "#2ecc71", // Green (light wind)
    0.25: "#27ae60", // Darker green (light-moderate wind)
    0.5: "#f1c40f", // Yellow (moderate wind)
    0.75: "#e67e22", // Orange (strong wind)
    1: "#e74c3c", // Red (very strong wind)
  };

  // Find the two closest color stops
  const stops = Object.entries(colors).map(([stop, color]) => ({
    stop: parseFloat(stop),
    color,
  }));

  let lowerStop = stops[0];
  let upperStop = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (percentage >= stops[i].stop && percentage <= stops[i + 1].stop) {
      lowerStop = stops[i];
      upperStop = stops[i + 1];
      break;
    }
  }

  // Interpolate between the two colors
  const range = upperStop.stop - lowerStop.stop;
  const adjustedPercentage = (percentage - lowerStop.stop) / range;

  // Convert hex to RGB and interpolate
  const lowerRGB = hexToRGB(lowerStop.color);
  const upperRGB = hexToRGB(upperStop.color);

  const r = Math.round(
    lowerRGB.r + (upperRGB.r - lowerRGB.r) * adjustedPercentage
  );
  const g = Math.round(
    lowerRGB.g + (upperRGB.g - lowerRGB.g) * adjustedPercentage
  );
  const b = Math.round(
    lowerRGB.b + (upperRGB.b - lowerRGB.b) * adjustedPercentage
  );

  return rgbToHex(r, g, b);
};

// Helper function to convert hex to RGB
const hexToRGB = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// Helper function to convert RGB to hex
const rgbToHex = (r: number, g: number, b: number) => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};
