import { weatherData } from "@/data/weatherData";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { ResponsiveContainer } from "recharts";
import WeatherTooltip from "./WeatherTooltip";
import WeatherIcon from "./WeatherIcon";

const WeatherChart = () => {
  return (
    <ResponsiveContainer
      width={4848}
      height="100%"
      className="h-16 min-h-16 border-y border-slate-400"
    >
      <ScatterChart
        data={weatherData}
        margin={{
          left: 0,
          right: 12,
          bottom: 16,
          top: 0,
        }}
        // syncId="swellnet"
      >
        <CartesianGrid
          vertical={true}
          horizontal={false}
          verticalFill={[
            "oklch(0.968 0.007 247.896)", // Tailwind slate-200
            "oklch(0.929 0.013 255.508)", // Tailwind slate-300
          ]}
          y={0}
          height={64}
          syncWithTicks
          overflow="hidden"
        />
        {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
        <XAxis
          xAxisId={0}
          dataKey="date"
          hide
          interval={7}
          tickLine={false}
          axisLine={false}
        />

        <YAxis
          dataKey="index"
          type="number"
          tickLine={false}
          axisLine={false}
          opacity={0}
          height={0}
          domain={[1]}
          padding={{ bottom: 16 }}
        />

        <Tooltip
          cursor={false}
          wrapperStyle={{ zIndex: 100 }}
          content={<WeatherTooltip />}
        />

        <Scatter
          dataKey="weatherId"
          //   opacity={0.5}
          shape={<WeatherIcon />}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;
