import { Area, AreaChart, CartesianGrid, YAxis, XAxis } from "recharts";
import { scaleTime } from "d3-scale";
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

import { tideChartConfig } from "@/lib/chart-config";
import { ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "../ui/chart";
import tideData from "@/data/tide-data";
import TideTooltip from "./TideTooltip";
import { TideAreaDot } from "./TideAreaDot";

// Previous tide data
const previousTide = {
  date: "2024-03-31",
  time: "9:54pm",
  dateTime: "2024-03-31 21:54:00",
  timeStamp: 1711925640,
  height: 1.6,
};

// First tide data
const firstTide = tideData[0];

// Calculate time differences in hours
const previousTideTime = new Date(previousTide.dateTime).getTime();
const firstTideTime = new Date(firstTide.dateTime).getTime();
const midnightTime = new Date(`${firstTide.date} 00:00:00`).getTime();

// Calculate rate of change (meters per hour)
const totalHours = (firstTideTime - previousTideTime) / (1000 * 60 * 60);
const heightChange = firstTide.height - previousTide.height;
const rateOfChange = heightChange / totalHours;

// Calculate hours from previous tide to midnight
const hoursToMidnight = (midnightTime - previousTideTime) / (1000 * 60 * 60);

// Calculate height at midnight
const heightAtMidnight = previousTide.height + rateOfChange * hoursToMidnight;

// Process the data to include timestamps
const processedData = [
  {
    date: firstTide.date,
    time: "12:00am",
    dateTime: `${firstTide.date} 00:00:00`,
    height: heightAtMidnight,
    timestamp: midnightTime,
  },
  ...tideData.map((item) => ({
    ...item,
    timestamp: new Date(item.dateTime).getTime(),
  })),
];

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

// Create time scale with numeric timestamps
const timeScale = scaleTime().domain([startDate, endDate]).nice();

// Generate ticks for each day
const dayTicks: number[] = [];
let currentDate = new Date(startDate);
while (currentDate <= endDate) {
  dayTicks.push(currentDate.getTime());
  currentDate = new Date(currentDate);
  currentDate.setDate(currentDate.getDate() + 1);
}

// Time formatting utilities
const formatMillisecond = timeFormat(".%L"),
  formatSecond = timeFormat(":%S"),
  formatMinute = timeFormat("%I:%M"),
  formatHour = timeFormat("%I %p"),
  formatDay = timeFormat("%a %d"),
  formatWeek = timeFormat("%b %d"),
  formatMonth = timeFormat("%B"),
  formatYear = timeFormat("%Y");

function multiFormat(date: Date): string {
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

const TideChart = () => {
  return (
    <ResponsiveContainer width={4848} height="100%">
      <ChartContainer
        config={tideChartConfig}
        className="aspect-auto h-36 w-full"
      >
        <AreaChart
          accessibilityLayer
          data={processedData}
          margin={{
            left: 0,
            right: 12,
            bottom: 16,
          }}
        >
          <CartesianGrid
            vertical={true}
            horizontal={true}
            verticalFill={[
              "oklch(0.929 0.013 255.508)", // Tailwind slate-300
              "oklch(0.968 0.007 247.896)", // Tailwind slate-200
            ]}
            y={0}
            height={200}
            syncWithTicks
          />

          {/* Background stripes XAxis */}
          <XAxis
            xAxisId={0}
            dataKey="timestamp"
            hide
            type="number"
            scale={timeScale}
            domain={timeScale.domain().map((date) => date.valueOf())}
            // domain={[startDate.getTime() + 1, endDate.getTime()]}
            ticks={dayTicks}
            tickFormatter={multiFormat}
            interval={"preserveStart"}
            allowDataOverflow
          />

          {/* Legend XAxis */}
          <XAxis
            xAxisId={1}
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            tickMargin={0}
            allowDuplicatedCategory={false}
            type="number"
            scale={timeScale}
            domain={timeScale.domain().map((date) => date.valueOf())}
            // domain={[startDate.getTime(), endDate.getTime()]}
            ticks={timeScale.ticks(5).map((date) => date.valueOf())}
            tickFormatter={multiFormat}
            textAnchor="middle"
            fontWeight={700}
            allowDataOverflow
            interval={"preserveStart"}
          />

          <ChartTooltip content={<TideTooltip />} />

          <Area
            type="monotone"
            dataKey="height"
            stroke="#008a93"
            fill="#008a93"
            connectNulls
            dot={(props) => {
              if (props.key === "dot-0") return <span key={props.key} />;
              return <TideAreaDot {...props} key={props.key} />;
            }}
            isAnimationActive={false}
          />

          <YAxis
            dataKey="height"
            unit="m"
            axisLine={false}
            domain={[0, "dataMax + 0.2"]}
            padding={{ top: 32 }}
            opacity={0}
            className="transition-opacity ease-in-out duration-200"
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};

export default TideChart;
