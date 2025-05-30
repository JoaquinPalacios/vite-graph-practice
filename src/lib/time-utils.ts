import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { TideDataFromDrupal } from "@/types";

interface TimeDataItem {
  localDateTimeISO: string;
  dateTime?: string; // Optional if it still exists
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow other properties
}

export function processTimeData<T extends TimeDataItem>(
  data: T[],
  timezone: string
) {
  // Process the data to include CORRECT timestamps from localDateTimeISO
  const processedData = data
    .map((item) => {
      // Parse the ISO string with timezone offset
      const date = new Date(item.localDateTimeISO);
      const timestampMs = date.getTime();

      if (isNaN(timestampMs)) {
        console.warn(
          "Failed to parse localDateTimeISO:",
          item.localDateTimeISO
        );
        return { ...item, timestamp: NaN };
      }

      // Convert the timestamp to the target timezone
      const zonedDate = toZonedTime(date, timezone);

      const localDateTimeISO = zonedDate.toISOString().replace("Z", "+00:00");

      return {
        ...item,
        timestamp: timestampMs,
        localDateTimeISO,
        // Add a date field for easier day boundary detection
        date: zonedDate.toISOString().split("T")[0],
      };
    })
    .filter((item) => !isNaN(item.timestamp))
    // Sort by timestamp to ensure correct order
    .sort((a, b) => a.timestamp - b.timestamp);

  // Ensure there's valid data to process
  if (processedData.length === 0) {
    const now = new Date();
    const todayMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    return {
      processedData: [],
      startDate: new Date(todayMidnight),
      endDate: new Date(todayMidnight + 86400000),
      dayTicks: [todayMidnight, todayMidnight + 86400000],
    };
  }

  // Get the start and end timestamps
  const timeValues = processedData.map((row) => row.timestamp);
  const startTimestamp = Math.min(...timeValues);
  const endTimestamp = Math.max(...timeValues);

  // Create Date objects for the start and end of the day range in the target timezone
  const startDate = toZonedTime(new Date(startTimestamp), timezone);
  const endDate = toZonedTime(new Date(endTimestamp), timezone);

  // Set start date to beginning of day in the target timezone
  startDate.setHours(0, 0, 0, 0);

  // Set end date to beginning of the next day in the target timezone
  endDate.setHours(0, 0, 0, 0);
  endDate.setDate(endDate.getDate() + 1);

  // Generate ticks for each day in the target timezone
  const dayTicks: number[] = [];
  const currentDate = new Date(startDate);

  // Generate ticks for each day boundary
  while (currentDate.getTime() < endDate.getTime()) {
    // Convert to target timezone to ensure correct day boundaries
    const zonedDate = toZonedTime(currentDate, timezone);
    dayTicks.push(zonedDate.getTime());
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    processedData,
    startDate,
    endDate,
    dayTicks,
  };
}

export const formatBulletinDateTime = (dateTimeUtc: string): string => {
  const date = new Date(dateTimeUtc);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hour = String(date.getUTCHours()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}Z`;
};

export const formatTime = (dateTimeStr: string, timezone: string): string => {
  try {
    return formatInTimeZone(new Date(dateTimeStr), timezone, "h:mm a");
  } catch (error) {
    console.warn("Error formatting time:", error);
    return "N/A";
  }
};

export const findCurrentDaySunriseSunset = (
  sunriseData: string[],
  sunsetData: string[],
  currentDate: string,
  timezone: string
): { sunrise: string; sunset: string } => {
  try {
    // Convert current date to the target timezone
    const currentDateInTz = formatInTimeZone(
      new Date(currentDate),
      timezone,
      "yyyy-MM-dd"
    );

    // Find the sunrise and sunset times for the current day
    const sunriseEntry = sunriseData.find((time) => {
      const dateInTz = formatInTimeZone(
        new Date(time + "Z"),
        timezone,
        "yyyy-MM-dd"
      );
      return dateInTz >= currentDateInTz;
    });
    const sunsetEntry = sunsetData.find((time) => {
      const dateInTz = formatInTimeZone(
        new Date(time + "Z"),
        timezone,
        "yyyy-MM-dd"
      );
      return dateInTz >= currentDateInTz;
    });

    // Convert the times from UTC to the target timezone
    const formatTimeInTz = (timeStr: string) => {
      // Create a UTC date object from the input time string
      const [datePart, timePart] = timeStr.split("T");
      const [hours, minutes] = timePart.split(":");
      const utcDate = new Date(
        Date.UTC(
          parseInt(datePart.split("-")[0], 10), // year
          parseInt(datePart.split("-")[1], 10) - 1, // month (0-based)
          parseInt(datePart.split("-")[2], 10), // day
          parseInt(hours, 10),
          parseInt(minutes, 10),
          0,
          0
        )
      );

      // Format the UTC date in the target timezone
      return formatInTimeZone(utcDate, timezone, "h:mm a");
    };

    return {
      sunrise: sunriseEntry ? formatTimeInTz(sunriseEntry) : "N/A",
      sunset: sunsetEntry ? formatTimeInTz(sunsetEntry) : "N/A",
    };
  } catch (error) {
    console.warn("Error finding sunrise/sunset times:", error);
    return { sunrise: "N/A", sunset: "N/A" };
  }
};

export const findCurrentDayTides = (
  tideData: TideDataFromDrupal[],
  timezone: string
): {
  current: { type: string; time: string; height: string };
  next: { type: string; time: string; height: string };
} => {
  try {
    // Get current time in the target timezone
    const now = new Date();
    const currentTimeInTz = toZonedTime(now, timezone);

    // Sort tides by their local time
    const sortedTides = [...tideData].sort((a, b) => {
      return a._source.time_local.localeCompare(b._source.time_local);
    });

    let currentTide = null;
    let nextTide = null;

    // Find the last tide before current time and the next tide
    for (let i = 0; i < sortedTides.length; i++) {
      const timeLocal = sortedTides[i]._source.time_local;

      // Create a date object from the tide time and adjust it to the target timezone
      const tideDate = new Date(timeLocal);
      const tideDateInTz = toZonedTime(tideDate, timezone);

      if (tideDateInTz > currentTimeInTz) {
        // Found the next tide
        nextTide = sortedTides[i];
        // The current tide is the previous one
        if (i > 0) {
          currentTide = sortedTides[i - 1];
        }
        break;
      }
    }

    // If we haven't found a next tide, use the last tide as current
    if (!nextTide && sortedTides.length > 0) {
      currentTide = sortedTides[sortedTides.length - 1];
    }

    // Format the times and heights
    const formatTideInfo = (tide: TideDataFromDrupal | null) => {
      if (!tide) return { type: "N/A", time: "N/A", height: "N/A" };

      const timeLocal = tide._source.time_local;
      const value = tide._source.height.toString();
      const instance = tide._source.type;

      // Extract the time part from the ISO string and format it
      const [, timePart] = timeLocal.split("T");
      const [hours, minutes] = timePart.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "pm" : "am";
      const hour12 = hour % 12 || 12;
      const formattedTime = `${hour12}:${minutes} ${ampm}`;

      // Format height with conditional decimal places
      const heightValue = parseFloat(value);
      const formattedHeight =
        heightValue % 1 === 0 ? heightValue.toFixed(1) : heightValue.toFixed(2);

      return {
        type: instance === "high" ? "High" : "Low",
        time: formattedTime,
        height: `${formattedHeight}m`,
      };
    };

    return {
      current: formatTideInfo(currentTide),
      next: formatTideInfo(nextTide),
    };
  } catch (error) {
    console.warn("Error finding tide times:", error);
    return {
      current: { type: "N/A", time: "N/A", height: "N/A" },
      next: { type: "N/A", time: "N/A", height: "N/A" },
    };
  }
};

/**
 * Returns a Date object representing midnight in the location's timezone, as a UTC timestamp.
 * @param date - The reference date (any time on the day)
 * @param timezone - The IANA timezone string
 */
export function getLocationMidnightUTC(date: Date, timezone: string): Date {
  // Format the date as YYYY-MM-DD in the location's timezone
  const localDay = formatInTimeZone(date, timezone, "yyyy-MM-dd");
  // Get the offset for that day in the location's timezone
  const offset = formatInTimeZone(date, timezone, "xxx");
  // Create a new Date at midnight in the location's timezone, interpreted as UTC
  return new Date(`${localDay}T00:00:00${offset}`);
}
