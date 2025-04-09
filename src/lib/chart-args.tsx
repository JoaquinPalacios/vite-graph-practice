import SwellAxisTick from "@/components/SwellChart/SwellAxisTick";
import WindSpeedTick from "@/components/SwellChart/WindSpeedTick";
import { generateHourlyTicks, multiFormat } from "@/lib/time-utils";
import {
  baseChartXAxisProps,
  dayTicks,
  endDateObj,
  formatDateTick,
  processedData,
  startDateObj,
  timeScale,
} from "@/utils/chart-utils";
import {
  CartesianGridProps,
  TooltipProps,
  XAxisProps,
  YAxisProps,
} from "recharts";
import { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";

/**
 * Static chart arguments that can be extended with dynamic values in components
 */
export const chartArgs = {
  /**
   * XAxis args for the background stripes
   */
  xAxisArgsBackground: {
    ...baseChartXAxisProps,
    xAxisId: 0,
    hide: true,
    ticks: dayTicks,
    tickFormatter: multiFormat,
  } as XAxisProps,

  /**
   * XAxis args for the calendar date
   */
  xAxisArgsCalendarDate: {
    ...baseChartXAxisProps,
    xAxisId: 2,
    tickLine: false,
    axisLine: false,
    ticks: timeScale.ticks(16).map((date) => {
      const centeredDate = new Date(date);
      centeredDate.setHours(12, 0, 0, 0);
      return centeredDate.getTime();
    }),
    orientation: "top" as const,
    tickFormatter: formatDateTick,
    fontWeight: 700,
  } as XAxisProps,

  /**
   * XAxis args for the time of day
   */
  xAxisArgsTimeOfDay: {
    ...baseChartXAxisProps,
    xAxisId: 1,
    tickLine: false,
    axisLine: false,
    ticks: generateHourlyTicks(startDateObj, endDateObj, [0, 6, 12, 18]),
    tickFormatter: (timestamp: number) => {
      const date = new Date(timestamp);
      const hours = date.getHours();
      const period = hours >= 12 ? "pm" : "am";
      const hour = hours % 12 || 12;
      return `${hour}${period}`;
    },
    orientation: "top" as const,
  } as XAxisProps,

  /**
   * XAxis args for the wind direction
   */
  xAxisArgsWindDirection: {
    ...baseChartXAxisProps,
    xAxisId: 3,
    tickLine: false,
    axisLine: false,
    tickMargin: 0,
    tick: ({ x, y, index }: { x: number; y: number; index: number }) => {
      const data = processedData[index];
      if (!data) {
        return <g />;
      }
      return (
        <SwellAxisTick
          payload={{ value: data.windDirection }}
          windSpeed={data.windSpeed_knots || 0}
          x={x}
          y={y}
        />
      );
    },
    interval: 0,
    ticks: generateHourlyTicks(startDateObj, endDateObj),
  } as XAxisProps,

  /**
   * XAxis args for the wind speed
   */
  xAxisArgsWindSpeed: {
    ...baseChartXAxisProps,
    xAxisId: 4,
    tickLine: false,
    axisLine: false,
    tickMargin: 16,
    tick: ({ x, y, index }: { x: number; y: number; index: number }) => {
      const data = processedData[index];
      if (!data) {
        return <g />;
      }
      return (
        <WindSpeedTick
          x={x}
          y={y}
          payload={{
            value: data.windSpeed_knots,
          }}
        />
      );
    },
    interval: 0,
    ticks: generateHourlyTicks(startDateObj, endDateObj),
  } as XAxisProps,

  /**
   * YAxis args
   */
  yAxisArgs: {
    tickLine: false,
    axisLine: false,
    opacity: 0,
    type: "number" as const,
    domain: [0, "dataMax"],
  } as YAxisProps,

  /**
   * BarChart args
   */
  mainChartArgs: {
    accessibilityLayer: true,
    margin: {
      bottom: 12,
    },
  } as CategoricalChartProps,

  /**
   * CartesianGrid args
   */
  cartesianGridArgs: {
    vertical: true,
    horizontal: true,
    y: 0,
    height: 320,
    syncWithTicks: true,
  } as CartesianGridProps,

  /**
   * ChartTooltip args
   */
  chartTooltipArgs: {
    cursor: {
      fill: "oklch(0.129 0.042 264.695)",
      fillOpacity: 0.1,
      height: 280,
    },
    trigger: "hover",
  } as TooltipProps<number, string>,
};
