import {
  CartesianGrid,
  YAxis,
  XAxis,
  ScatterChart,
  Scatter,
  Tooltip,
} from "recharts";
import { ResponsiveContainer } from "recharts";
import { WeatherBubble } from "./WeatherBubble";
import { formatDateTick, getChartWidth } from "@/utils/chart-utils";
import { cn } from "@/utils/utils";
import { WeatherData } from "@/types";
import { useState } from "react";

type ScatterShapeProps = {
  cx?: number;
  cy?: number;
  payload?: WeatherData;
  index?: number;
};

const WeatherChart = ({ weatherData }: { weatherData: WeatherData[] }) => {
  // Add index property to each data point
  const weatherDataWithIndex = weatherData.map((d, i) => ({ ...d, index: i }));
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <ResponsiveContainer
      width={getChartWidth(weatherData.length, 256, 60)}
      height="100%"
      className={cn(
        "weather-chart tw:h-16 tw:min-h-16 tw:relative",
        "tw:after:absolute tw:after:z-0 tw:after:h-16 tw:after:w-[calc(100%-4.75rem)] tw:after:top-0 tw:after:left-[4.75rem] tw:after:border-y tw:after:border-slate-400/80 tw:after:pointer-events-none"
      )}
    >
      <ScatterChart
        data={weatherDataWithIndex}
        margin={{
          left: 0,
          right: 0,
          bottom: 16,
          top: 0,
        }}
        className="tw:[&>svg]:focus:outline-none"
        syncId="swellnet"
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
          shape={(props: ScatterShapeProps) => (
            <WeatherBubble {...props} isHover={hoverIndex === props.index} />
          )}
          overflow="visible"
          onMouseEnter={(_, index) => {
            setHoverIndex(index);
          }}
          onMouseLeave={() => {
            setHoverIndex(null);
          }}
          className="tw:transition-all tw:duration-300"
        />

        <Tooltip
          cursor={false}
          content={() => <span className="tw:sr-only">.</span>}
          trigger="hover"
          isAnimationActive={false}
        />

        <YAxis
          dataKey={() => 1}
          height={0}
          // domain={[1]}
          domain={[1, 1]}
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
