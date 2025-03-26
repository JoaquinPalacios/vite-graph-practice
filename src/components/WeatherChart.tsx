import { weatherData } from "@/data/weatherData";
import { formatDateTick } from "@/lib/utils";

import {
  ScatterChart,
  Scatter,
  XAxis,
  //   CartesianGrid,
  YAxis,
  ZAxis,
  CartesianGrid,
} from "recharts";

import { ResponsiveContainer } from "recharts";
import { ScatterCustomizedShape } from "recharts/types/cartesian/Scatter";

export const WeatherIcon = (props: ScatterCustomizedShape) => {
  console.log({ props });
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path d="M50 0L100 50L50 100L0 50Z" fill="#008a93" />
    </svg>
  );
};

export const parseDomain = () => [
  0,
  Math.max(
    Math.max.apply(
      null,
      weatherData.map((entry) => entry.currentTemp)
    ),
    Math.max.apply(
      null,
      weatherData.map((entry) => entry.currentTemp)
    )
  ),
];

const WeatherChart = () => {
  return (
    <ResponsiveContainer width={4848} height={160} className="mt-10">
      <ScatterChart
        data={weatherData}
        margin={{
          left: 0,
          right: 12,
          bottom: 16,
          top: 0,
        }}
      >
        <CartesianGrid
          vertical={true}
          horizontal={true}
          verticalFill={[
            "oklch(0.929 0.013 255.508)",
            "oklch(0.869 0.022 252.894)",
          ]}
          y={0}
          height={160}
          syncWithTicks
        />
        {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
        <XAxis
          xAxisId={0}
          dataKey="date"
          // orientation="top"
          hide
          interval={7}
        />
        {/* This XAxis is the one that shows the time of the day */}
        <XAxis
          xAxisId={1}
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={0}
          minTickGap={16}
          interval={"preserveStart"}
        />
        {/* Duplicate XAxis for the legend. This is the legend shown in the chart */}
        <XAxis
          xAxisId={2}
          dataKey="date"
          interval={0}
          tickLine={false}
          axisLine={false}
          tickMargin={0}
          allowDuplicatedCategory={false}
          tickFormatter={formatDateTick}
          textAnchor="middle"
          fontWeight={700}
        />

        <YAxis
          dataKey="index"
          type="number"
          opacity={0}
          height={0}
          domain={[1]}
        />

        <ZAxis
          type="number"
          dataKey="currentTemp"
          domain={parseDomain()}
          range={[0, 225]}
        />

        <Scatter
          dataKey="currentTemp"
          stroke="#008a93"
          //   data={weatherData}
          //   shape={<WeatherIcon />}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;
