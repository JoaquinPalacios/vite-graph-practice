import { timeFormat } from "d3-time-format";
import { formatInTimeZone } from "date-fns-tz";
import {
  timeDay,
  timeHour,
  timeMinute,
  timeMonth,
  timeSecond,
  timeWeek,
  timeYear,
} from "d3-time";
import { TideDataFromDrupal } from "@/types";
import { toZonedTime } from "date-fns-tz";

interface TimeDataItem {
  localDateTimeISO: string;
  dateTime?: string; // Optional if it still exists
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow other properties
}

// Time formatting utilities
export const formatMillisecond = timeFormat(".%L"),
  formatSecond = timeFormat(":%S"),
  formatMinute = timeFormat("%I:%M"),
  formatHour = timeFormat("%I %p"),
  formatDay = timeFormat("%a %d"),
  formatWeek = timeFormat("%b %d"),
  formatMonth = timeFormat("%B"),
  formatYear = timeFormat("%Y");

export function multiFormat(date: Date): string {
  if (timeSecond(date) < date) {
    return formatMillisecond(date);
  }
  if (timeMinute(date) < date) {
    return formatSecond(date);
  }
  if (timeHour(date) < date) {
    return formatMinute(date);
  }
  if (timeDay(date) < date) {
    return formatHour(date);
  }
  if (timeMonth(date) < date) {
    if (timeWeek(date) < date) {
      return formatDay(date);
    }
    return formatWeek(date);
  }
  if (timeYear(date) < date) {
    return formatMonth(date);
  }
  return formatYear(date);
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
    const sunriseIndex = sunriseData.findIndex((time) =>
      time.startsWith(currentDateInTz)
    );
    const sunsetIndex = sunsetData.findIndex((time) =>
      time.startsWith(currentDateInTz)
    );

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
      sunrise:
        sunriseIndex !== -1 ? formatTimeInTz(sunriseData[sunriseIndex]) : "N/A",
      sunset:
        sunsetIndex !== -1 ? formatTimeInTz(sunsetData[sunsetIndex]) : "N/A",
    };
  } catch (error) {
    console.warn("Error finding sunrise/sunset times:", error);
    return { sunrise: "N/A", sunset: "N/A" };
  }
};

export const findCurrentDayTides = (
  tideData: TideDataFromDrupal[],
  currentDate: string,
  timezone: string
): {
  current: { type: string; time: string; height: string };
  next: { type: string; time: string; height: string };
} => {
  try {
    // Convert current date to the target timezone
    const currentDateInTz = formatInTimeZone(
      new Date(currentDate),
      timezone,
      "yyyy-MM-dd"
    );

    // Find all tides for the current day
    const currentDayTides = tideData.filter((tide) =>
      tide._source.time_local.startsWith(currentDateInTz)
    );

    if (currentDayTides.length === 0) {
      return {
        current: { type: "N/A", time: "N/A", height: "N/A" },
        next: { type: "N/A", time: "N/A", height: "N/A" },
      };
    }

    // Get current time in the target timezone
    const now = new Date(currentDate);
    const currentTime = now.getTime();

    // Find the current and next tide
    let currentTide = null;
    let nextTide = null;

    for (let i = 0; i < currentDayTides.length; i++) {
      const tideTime = new Date(
        currentDayTides[i]._source.time_local
      ).getTime();
      if (tideTime > currentTime) {
        if (i > 0) {
          currentTide = currentDayTides[i - 1];
        }
        nextTide = currentDayTides[i];
        break;
      }
    }

    // If we haven't found a next tide, look for the first tide of the next day
    if (!nextTide) {
      const nextDayTides = tideData.filter((tide) => {
        const nextDay = new Date(currentDateInTz);
        nextDay.setDate(nextDay.getDate() + 1);
        return tide._source.time_local.startsWith(
          formatInTimeZone(nextDay, timezone, "yyyy-MM-dd")
        );
      });
      if (nextDayTides.length > 0) {
        nextTide = nextDayTides[0];
      }
    }

    // If we haven't found a current tide, use the last tide of the previous day
    if (!currentTide) {
      const prevDayTides = tideData.filter((tide) => {
        const prevDay = new Date(currentDateInTz);
        prevDay.setDate(prevDay.getDate() - 1);
        return tide._source.time_local.startsWith(
          formatInTimeZone(prevDay, timezone, "yyyy-MM-dd")
        );
      });
      if (prevDayTides.length > 0) {
        currentTide = prevDayTides[prevDayTides.length - 1];
      }
    }

    // Format the times and heights
    const formatTideInfo = (tide: TideDataFromDrupal | null) => {
      if (!tide) return { type: "N/A", time: "N/A", height: "N/A" };

      const [datePart, timePart] = tide._source.time_local.split("T");
      const [hours, minutes] = timePart.split(":");
      const utcDate = new Date(
        Date.UTC(
          parseInt(datePart.split("-")[0], 10),
          parseInt(datePart.split("-")[1], 10) - 1,
          parseInt(datePart.split("-")[2], 10),
          parseInt(hours, 10),
          parseInt(minutes, 10),
          0,
          0
        )
      );

      return {
        type: tide._source.instance === "high" ? "High" : "Low",
        time: formatInTimeZone(utcDate, timezone, "h:mm a").toLowerCase(),
        height: `${parseFloat(tide._source.value).toFixed(1)}m`,
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
