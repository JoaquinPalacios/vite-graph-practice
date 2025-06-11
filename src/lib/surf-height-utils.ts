// Memoize the height map since it never changes
const heightMap: Record<string, string> = {
  "1": "Flat",
  "2": "0.5ft",
  "35": "0.5-1ft",
  "3": "1ft",
  "36": "1-1.5ft",
  "4": "1-2ft",
  "5": "2ft",
  "6": "2-3ft",
  "7": "3ft",
  "8": "3-4ft",
  "9": "4ft",
  "10": "3-5ft",
  "11": "4-5ft",
  "12": "5ft",
  "13": "4-6ft",
  "14": "5-6ft",
  "15": "6ft",
  "16": "6ft+",
  "17": "6-8ft",
  "18": "8ft",
  "19": "8ft+",
  "20": "8-10ft",
  "21": "10ft",
  "22": "10ft+",
  "23": "10-12ft",
  "24": "12-15ft",
  "25": "15-18ft",
  "26": "15-20ft",
  "27": "20ft+",
  "28": "20-25ft",
  "29": "25ft+",
  "30": "25-30ft",
  "31": "30ft+",
  "32": "30-35ft",
  "33": "35-40ft",
  "34": "40ft+",
} as const;

// Cache for memoization
const labelCache = new Map<string, string>();

/**
 * Get the surf height label.
 * @description This function gets the surf height label for a given value.
 * It uses memoization to cache the result.
 * @param value - The surf height value
 * @returns The surf height label
 */
export const getSurfHeightLabel = (value: string | number): string => {
  const key = value.toString();

  // Check cache first
  const cached = labelCache.get(key);
  if (cached) return cached;

  // Get value and cache it
  const result = heightMap[key] || key;
  labelCache.set(key, result);

  return result;
};
