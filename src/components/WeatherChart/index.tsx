import { CartesianGrid, YAxis, XAxis, ScatterChart, Scatter } from "recharts";

import { ResponsiveContainer } from "recharts";
import { weatherData } from "@/data/weatherData";
import { multiFormat, convertTo24Hour } from "@/lib/time-utils";
import { processTimeData } from "@/lib/time-utils";
import WeatherBubble from "./WeatherBubble";
import { dayTicks, timeScale } from "@/utils/chart-utils";

const { processedData } = processTimeData(
  weatherData.map((item) => ({
    ...item,
    dateTime: `${item.date} ${convertTo24Hour(item.time)}`,
    timestamp: new Date(`${item.date} ${convertTo24Hour(item.time)}`).getTime(),
  }))
);

const WeatherChart = () => {
  return (
    <ResponsiveContainer
      width={4848}
      height="100%"
      className="h-16 min-h-16 relative after:absolute after:z-0 after:h-16 after:w-[calc(100%-5rem)] after:top-0 after:left-[4.5rem] after:border-y after:border-slate-300 after:pointer-events-none"
    >
      <ScatterChart
        data={processedData}
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
          overflow="visible"
        />

        {/* Background stripes XAxis */}
        <XAxis
          dataKey="timestamp"
          type="number"
          scale={timeScale}
          domain={timeScale.domain().map((date) => date.valueOf())}
          xAxisId={0}
          hide
          allowDataOverflow
          ticks={dayTicks}
          tickFormatter={multiFormat}
          interval="preserveStart"
          padding={{ left: 12 }}
          allowDuplicatedCategory={false}
        />

        {/* Legend XAxis */}
        <XAxis
          xAxisId={1}
          dataKey="date"
          hide
          tickLine={false}
          axisLine={false}
          interval="preserveStart"
          overflow="visible"
          allowDataOverflow
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
