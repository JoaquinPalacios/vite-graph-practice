import { CartesianGrid, YAxis, XAxis, ScatterChart, Scatter } from "recharts";
import { ResponsiveContainer } from "recharts";
import WeatherBubble from "./WeatherBubble";
import { formatDateTick, getChartWidth } from "@/utils/chart-utils";
import { cn } from "@/utils/utils";
import { WeatherData } from "@/types";

const WeatherChart = ({ weatherData }: { weatherData: WeatherData[] }) => {
  return (
    <ResponsiveContainer
      width={getChartWidth(weatherData.length, 256, 60)}
      height="100%"
      className={cn(
        "tw:h-16 tw:min-h-16 tw:relative",
        "tw:after:absolute tw:after:z-0 tw:after:h-16 tw:after:w-[calc(100%-5.75rem)] tw:after:top-0 tw:after:left-[4.75rem] tw:after:border-y tw:after:border-slate-300 tw:after:pointer-events-none"
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
        className="tw:[&>svg]:focus:outline-none"
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
