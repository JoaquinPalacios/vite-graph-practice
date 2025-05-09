import { CartesianGrid, YAxis, XAxis, ScatterChart, Scatter } from "recharts";

import { ResponsiveContainer } from "recharts";
import { weatherData } from "@/data/weatherData";
import WeatherBubble from "./WeatherBubble";
import { formatDateTick } from "@/utils/chart-utils";
import { cn } from "@/utils/utils";

const WeatherChart = () => {
  return (
    <ResponsiveContainer
      width={4848}
      height="100%"
      className={cn(
        "h-16 min-h-16 relative",
        "after:absolute after:z-0 after:h-16 after:w-[calc(100%-6rem)] after:top-0 after:left-20 after:border-y after:border-slate-300 after:pointer-events-none"
      )}
    >
      <ScatterChart
        data={weatherData}
        accessibilityLayer
        margin={{
          left: 0,
          right: 0,
          bottom: 16,
          top: 0,
        }}
        className="[&>svg]:focus:outline-none"
      >
        <CartesianGrid
          vertical={true}
          horizontal={true}
          verticalFill={[
            "oklch(0.968 0.007 247.896)", // Tailwind slate-200
            "oklch(0.929 0.013 255.508)", // Tailwind slate-300
          ]}
          y={0}
          height={64}
          syncWithTicks
        />

        {/* Background stripes XAxis */}
        <XAxis
          dataKey="localDateTimeISO"
          xAxisId={0}
          hide
          allowDataOverflow
          tickFormatter={formatDateTick}
          allowDuplicatedCategory={false}
          interval={7}
        />

        <Scatter
          dataKey="weatherId"
          shape={<WeatherBubble />}
          overflow="visible"
        />

        <YAxis
          dataKey="index"
          height={0}
          domain={[1]}
          padding={{ bottom: 16 }}
          opacity={0}
          tickLine={false}
          axisLine={false}
          type="number"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;
