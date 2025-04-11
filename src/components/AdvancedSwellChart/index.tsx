import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import chartData from "@/data";
import { UnitPreferences } from "@/types";
import { GiBigWave } from "react-icons/gi";
import { LuWind } from "react-icons/lu";
import SwellAxisTick from "../SwellChart/SwellAxisTick";
import SwellArrowDot from "./SwellArrowDot";
import { useMemo } from "react";
import processSwellData from "./ProcessDataSwell";
import { chartArgs } from "@/lib/chart-args";
import { timeScale } from "@/utils/chart-utils";

const AdvancedSwellChart = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  // --- Process data to identify events ---
  // useMemo prevents reprocessing on every render unless chartData changes
  const processedSwellData = useMemo(() => processSwellData(chartData), []);
  const eventIds = Object.keys(processedSwellData);

  // --- Define a color palette ---
  const colorPalette = [
    "#FF3B30", // Vibrant Red
    "#007AFF", // iOS Blue
    "#4CD964", // Bright Green
    "#FF9500", // Orange
    "#5856D6", // Purple
    "#FF2D55", // Pink
    "#00C7BE", // Teal
    "#FFD60A", // Yellow
    "#BF5AF2", // Magenta
    "#64D2FF", // Light Blue
  ];

  // --- Find overall max height for Y-axis domain ---
  const overallMaxHeight = useMemo(() => {
    let maxH = 0;
    eventIds.forEach((id) => {
      processedSwellData[id].forEach((point) => {
        if (point.height > maxH) {
          maxH = point.height;
        }
      });
    });
    return maxH;
  }, [processedSwellData, eventIds]);

  // Get all static args
  const {
    xAxisArgsBackground,
    // xAxisArgsCalendarDate,
    // xAxisArgsTimeOfDay,
    // xAxisArgsWindDirection,
    // xAxisArgsWindSpeed,
    // yAxisArgs,
    // mainChartArgs,
    // cartesianGridArgs,
    // chartTooltipArgs,
  } = chartArgs;

  return (
    <ResponsiveContainer
      width={4848}
      height="100%"
      className="mb-0 h-80 min-h-80"
    >
      <LineChart
        accessibilityLayer
        // data={chartData}
        margin={{
          left: 0,
          right: 12,
          bottom: 12,
        }}
      >
        <CartesianGrid
          vertical={true}
          horizontal={true}
          verticalFill={[
            "oklch(0.968 0.007 247.896)", // Tailwind slate-200
            "oklch(0.929 0.013 255.508)", // Tailwind slate-300
          ]}
          y={0}
          height={320}
          syncWithTicks
        />

        {/* Define XAxis based on timestamp */}
        <XAxis
          dataKey="timestamp"
          type="number" // Timestamps are numbers
          scale="time" // Tell recharts it's time data
          domain={["dataMin", "dataMax"]} // Use min/max timestamps from data
          axisLine={false}
          tickLine={false}
          // You'll likely want a custom tick formatter for timestamps
          // tickFormatter={(unixTime) => new Date(unixTime * 1000).toLocaleTimeString()}
          hide // Hide this main time axis, rely on others below if needed
        />

        {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
        <XAxis {...xAxisArgsBackground} />

        {/* This XAxis is the one that shows the wind direction */}
        <XAxis
          xAxisId={1}
          scale={timeScale}
          type="number"
          domain={timeScale.domain().map((date) => date.valueOf())}
          dataKey="timestamp" // Use timestamp to position ticks correctly
          tickLine={true}
          axisLine={true}
          tickMargin={0}
          minTickGap={0}
          tick={({
            payload,
            x,
            y,
          }: {
            payload: { value: number };
            x: number;
            y: number;
          }) => {
            const timestampValue = payload.value;
            const index = chartData.findIndex(
              (d) => d.timestamp === timestampValue
            );
            const data = chartData[index];
            if (!data) return <g />; // Return empty group instead of null
            return (
              <SwellAxisTick
                payload={payload}
                windSpeed={data?.windSpeed_knots || 0}
                x={x}
                y={y}
              />
            );
          }}
          interval={0} // Show all ticks
          allowDuplicatedCategory={false}
          padding={{ left: 0, right: 0 }}
        />

        {/* This XAxis is the one that shows the wind speed */}
        <XAxis
          xAxisId={4}
          dataKey={
            unitPreferences.windSpeed === "knots"
              ? "windSpeed_knots"
              : "windSpeed_kmh"
          }
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          fontSize={12}
          minTickGap={0}
          interval={0}
          padding={{
            left: 0,
            right: 0,
          }}
          stroke="#666"
        />

        <XAxis
          xAxisId={4}
          scale="time"
          type="number"
          domain={["dataMin", "dataMax"]}
          dataKey="timestamp" // Use timestamp to position ticks correctly
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          fontSize={12}
          minTickGap={0}
          interval={0} // Show all ticks
          allowDuplicatedCategory={false}
          padding={{ left: 0, right: 0 }}
          stroke="#666"
          // Format the timestamp tick value as wind speed
          tickFormatter={(unixTime: number) => {
            const index = chartData.findIndex((d) => d.timestamp === unixTime);
            const data = chartData[index];
            if (!data) return "";
            return String(
              unitPreferences.windSpeed === "knots"
                ? data.windSpeed_knots
                : data.windSpeed_kmh
            );
          }}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={0}
          unit="m"
          padding={{ top: 20 }}
          interval="preserveStart"
          overflow="visible"
          type="number"
          // Use the calculated overall max height
          domain={[0, Math.ceil(overallMaxHeight) + 0.5]}
          allowDecimals={false}
          tick={(value) => {
            return value.index === 0 ? (
              <g transform="translate(-10, 0)">
                <GiBigWave
                  className="w-6 h-6"
                  x={value.x - 8}
                  y={value.y - 24}
                  size={24}
                  color="#666"
                />
                <LuWind
                  className="w-4 h-4"
                  x={value.x - 8}
                  y={value.y + 12}
                  size={24}
                  color="#666"
                />
                {unitPreferences.windSpeed === "knots" ? (
                  <text
                    x={value.x + 12}
                    y={value.y + 52}
                    dy={1}
                    textAnchor="end"
                  >
                    kts
                  </text>
                ) : (
                  <text
                    x={value.x + 12}
                    y={value.y + 52}
                    dy={1}
                    textAnchor="end"
                  >
                    km/h
                  </text>
                )}
              </g>
            ) : (
              <text x={value.x} y={value.y} dy={1} textAnchor="end">
                {value.payload.value}m
              </text>
            );
          }}
          className="transition-opacity ease-in-out duration-200"
        />

        {eventIds.map((eventId, index) => {
          const eventData = processedSwellData[eventId];
          const color = colorPalette[index % colorPalette.length]; // Cycle through palette

          return (
            <Line
              key={eventId}
              data={eventData} // Data specific to this swell event
              type="monotone"
              dataKey="height" // Plotting the 'height' property within eventData
              xAxisId={0} // Link to the main (hidden) time axis
              name={eventId}
              stroke={color}
              fill="none"
              strokeWidth={2}
              // activeDot={false}
              connectNulls={false} // Show gaps if event disappears temporarily
              dot={<SwellArrowDot />}
            />
          );
        })}

        {/* <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={0}
          unit="m"
          padding={{
            top: 20,
          }}
          interval="preserveStart"
          overflow="visible"
          type="number"
          domain={[0, "dataMax"]}
          allowDecimals={false}
          tick={(value) => {
            return value.index === 0 ? (
              <g transform="translate(-10, 0)">
                <GiBigWave
                  className="w-6 h-6"
                  x={value.x - 8}
                  y={value.y - 24}
                  size={24}
                  color="#666"
                />
                <LuWind
                  className="w-4 h-4"
                  x={value.x - 8}
                  y={value.y + 12}
                  size={24}
                  color="#666"
                />
                {unitPreferences.windSpeed === "knots" ? (
                  <text
                    x={value.x + 12}
                    y={value.y + 52}
                    dy={1}
                    textAnchor="end"
                  >
                    kts
                  </text>
                ) : (
                  <text
                    x={value.x + 12}
                    y={value.y + 52}
                    dy={1}
                    textAnchor="end"
                  >
                    km/h
                  </text>
                )}
              </g>
            ) : (
              <text x={value.x} y={value.y} dy={1} textAnchor="end">
                {value.payload.value}m
              </text>
            );
          }}
          className="transition-opacity ease-in-out duration-200"
        /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AdvancedSwellChart;
