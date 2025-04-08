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

export function processTimeData<T extends { dateTime: string }>(data: T[]) {
  // Process the data to include timestamps
  const processedData = data.map((item) => ({
    ...item,
    timestamp: new Date(item.dateTime).getTime(),
  }));

  // Get the start and end timestamps
  const timeValues = processedData.map((row) => row.timestamp);
  const startTimestamp = Math.min(...timeValues);
  const endTimestamp = Math.max(...timeValues);

  // Create Date objects for the start and end of the day
  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);

  // Set start date to beginning of day (00:00:00)
  startDate.setDate(startDate.getDate());
  startDate.setHours(0, 0, 0, 0);

  // Set end date to beginning of next day (00:00:00)
  endDate.setDate(endDate.getDate() + 1);
  endDate.setHours(0, 0, 0, 0);

  // Generate ticks for each day
  const dayTicks: number[] = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dayTicks.push(currentDate.getTime());
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    processedData,
    startDate,
    endDate,
    dayTicks,
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

export const convertTo24Hour = (time: string) => {
  const [hours, period] = time.match(/(\d+)([ap]m)/i)?.slice(1) || [];
  if (!hours || !period) return time;
  let hour = parseInt(hours);
  if (period.toLowerCase() === "pm" && hour !== 12) hour += 12;
  if (period.toLowerCase() === "am" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:00`;
};
