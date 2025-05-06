import { timeFormat } from "d3-time-format";
import {
  timeDay,
  timeHour,
  timeMinute,
  timeMonth,
  timeSecond,
  timeWeek,
  timeYear,
} from "d3-time";

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

export function processTimeData<T extends TimeDataItem>(data: T[]) {
  // Process the data to include CORRECT timestamps from localDateTimeISO
  const processedData = data
    .map((item) => {
      const timestampMs = new Date(item.localDateTimeISO).getTime();
      if (isNaN(timestampMs)) {
        console.warn(
          "Failed to parse localDateTimeISO:",
          item.localDateTimeISO
        );
        // Return item with null/invalid timestamp or handle error appropriately
        return { ...item, timestamp: NaN };
      }
      return {
        ...item,
        timestamp: timestampMs, // Use timestamp derived from localDateTimeISO
      };
    })
    .filter((item) => !isNaN(item.timestamp)); // Filter out items where parsing failed

  // Ensure there's valid data to process
  if (processedData.length === 0) {
    // Return default/empty values or throw error
    const now = new Date();
    const todayMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    return {
      processedData: [],
      startDate: new Date(todayMidnight),
      endDate: new Date(todayMidnight + 86400000), // Add one day
      dayTicks: [todayMidnight, todayMidnight + 86400000],
    };
  }

  // Get the start and end timestamps
  const timeValues = processedData.map((row) => row.timestamp);
  const startTimestamp = Math.min(...timeValues);
  const endTimestamp = Math.max(...timeValues);

  // Create Date objects for the start and end of the day range
  // These Date objects will represent time based on the LOCAL timezone of the environment
  // where the code is running, but derived from the correct absolute timestamps.
  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);

  // Set start date to beginning of day (00:00:00)
  // startDate.setDate(startDate.getDate());
  // startDate.setHours(0, 0, 0, 0);

  // Set start date to beginning of ITS local day (00:00:00)
  // No need to change date, just time
  startDate.setHours(0, 0, 0, 0);

  // Set end date to beginning of next day (00:00:00)
  // endDate.setDate(endDate.getDate() + 1);
  // endDate.setHours(0, 0, 0, 0);

  // Set end date to beginning of the day AFTER the last data point's day
  // No need to change date, just time
  endDate.setHours(0, 0, 0, 0);
  endDate.setDate(endDate.getDate() + 1); // Move to midnight starting the next day

  // Generate ticks for each LOCAL day's start within the range
  const dayTicks: number[] = [];
  // Start loop from the calculated start date (local midnight)
  const currentDate = new Date(startDate);
  // Loop until the currentDate exceeds the calculated end date (midnight after last data)
  while (currentDate.getTime() < endDate.getTime()) {
    // Use < to avoid including the end date itself if not needed
    dayTicks.push(currentDate.getTime());
    // Advance currentDate by exactly one day (handles DST correctly)
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    processedData, // Includes the correct ms timestamp
    startDate, // Date object for local midnight start
    endDate, // Date object for local midnight end (day after last data)
    dayTicks, // Array of ms timestamps for local midnights
  };
}

export const generateHourlyTicks = (
  startDate: Date,
  endDate: Date,
  hours: number[] = [0, 3, 6, 9, 12, 15, 18, 21]
) => {
  const ticks: number[] = [];
  const currentDate = new Date(startDate);
  const lastValidTimestamp = endDate.getTime();

  while (currentDate <= endDate) {
    hours.forEach((hour) => {
      const date = new Date(currentDate);
      date.setHours(hour, 0, 0, 0);
      const timestamp = date.getTime();
      if (timestamp <= lastValidTimestamp) {
        ticks.push(timestamp);
      }
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return ticks;
};
