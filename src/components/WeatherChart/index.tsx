import { CartesianGrid, YAxis, XAxis, ScatterChart, Scatter } from "recharts";

import { ResponsiveContainer } from "recharts";
import { weatherData } from "@/data/weatherData";
import { convertTo24Hour } from "@/lib/time-utils";
import { processTimeData } from "@/lib/time-utils";
import WeatherBubble from "./WeatherBubble";
import { chartArgs } from "@/lib/chart-args";

const { processedData } = processTimeData(
  weatherData.map((item) => ({
    ...item,
    dateTime: `${item.date} ${convertTo24Hour(item.time)}`,
    timestamp: new Date(`${item.date} ${convertTo24Hour(item.time)}`).getTime(),
  }))
);

const WeatherChart = () => {
  // Get all static args
  const { xAxisArgsBackground, yAxisArgs, mainChartArgs, cartesianGridArgs } =
    chartArgs;

  /**
   * Scatter chart args
   */
  const dynamicScatterChartArgs = {
    ...mainChartArgs,
    margin: {
      left: 0,
      right: 0,
      bottom: 16,
      top: 0,
    },
  };

  /**
   * Cartesian grid args
   */
  const dynamicCartesianGridArgs = {
    ...cartesianGridArgs,
    verticalFill: [
      "oklch(0.968 0.007 247.896)", // Tailwind slate-200
      "oklch(0.929 0.013 255.508)", // Tailwind slate-300
    ],
    overflow: "visible",
  };

  /**
   * XAxis args for the background stripes
   */
  const dynamicXAxisBackgroundArgs = {
    ...xAxisArgsBackground,
    xAxisId: 0,
    hide: true,
    allowDataOverflow: true,
  };

  /**
   * Legend XAxis args
   */
  const dynamicXAxisLegendArgs = {
    xAxisId: 1,
    dataKey: "date",
    hide: true,
    tickLine: false,
    axisLine: false,
    interval: "preserveStart" as const,
    overflow: "visible",
    allowDataOverflow: true,
  };

  /**
   * YAxis args
   */
  const dynamicYAxisArgs = {
    ...yAxisArgs,
    dataKey: "index",
    height: 0,
    domain: [1],
    padding: { bottom: 16 },
  };

  return (
    <ResponsiveContainer
      width={4848}
      height="100%"
      className="h-16 min-h-16 relative after:absolute after:z-0 after:h-16 after:w-[calc(100%-5rem)] after:top-0 after:left-[4.5rem] after:border-y after:border-slate-300 after:pointer-events-none"
    >
      <ScatterChart
        data={processedData}
        {...dynamicScatterChartArgs}
        className="[&>svg]:focus:outline-none"
      >
        <CartesianGrid {...dynamicCartesianGridArgs} />

        {/* Background stripes XAxis */}
        <XAxis {...dynamicXAxisBackgroundArgs} />

        {/* Legend XAxis */}
        <XAxis {...dynamicXAxisLegendArgs} />

        <Scatter
          dataKey="weatherId"
          shape={<WeatherBubble />}
          overflow="visible"
        />

        <YAxis {...dynamicYAxisArgs} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;
