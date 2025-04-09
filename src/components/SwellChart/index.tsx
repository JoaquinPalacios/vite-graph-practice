import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
  XAxisProps,
  YAxisProps,
  CartesianGridProps,
  TooltipProps,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import chartData from "@/data";
import RenderCustomizedLabel from "./SwellLabel";
import { chartConfig } from "@/lib/chart-config";
import { UnitPreferences } from "@/types";
import {
  baseChartXAxisProps,
  generateTicks,
  timeScale,
  dayTicks,
  processedData,
  startDateObj,
  endDateObj,
} from "@/utils/chart-utils";
import { formatDateTick } from "@/utils/chart-utils";
import { SwellTooltip } from "./SwellTooltip";
import SwellLabel from "./SwellLabel";
import SwellAxisTick from "./SwellAxisTick";
import { generateHourlyTicks, multiFormat } from "@/lib/time-utils";
import WindSpeedTick from "./WindSpeedTick";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";

const SwellChart = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  const { isMobile, isLandscapeMobile } = useScreenDetector();

  /**
   * XAxis args for the background stripes
   */
  const xAxisArgsBackground: XAxisProps = {
    ...baseChartXAxisProps,
    xAxisId: 0,
    hide: true,
    ticks: dayTicks,
    tickFormatter: multiFormat,
  };

  /**
   * XAxis args for the calendar date
   */
  const xAxisArgsCalendarDate: XAxisProps = {
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
  };

  /**
   * XAxis args for the time of day
   */
  const xAxisArgsTimeOfDay: XAxisProps = {
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
  };

  /**
   * XAxis args for the wind direction
   */
  const xAxisArgsWindDirection: XAxisProps = {
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
  };

  /**
   * XAxis args for the wind speed
   */
  const xAxisArgsWindSpeed: XAxisProps = {
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
            value:
              unitPreferences.windSpeed === "knots"
                ? data.windSpeed_knots
                : data.windSpeed_kmh,
          }}
        />
      );
    },
    interval: 0,
    ticks: generateHourlyTicks(startDateObj, endDateObj),
  };

  /**
   * YAxis args
   */
  const yAxisArgs: YAxisProps = {
    tickLine: false,
    axisLine: false,
    tickMargin: isMobile || isLandscapeMobile ? 20 : 8,
    minTickGap: 0,
    unit: unitPreferences.waveHeight,
    padding: {
      top: 20,
    },
    opacity: 0,
    interval: "preserveStart" as const,
    overflow: "visible",
    type: "number" as const,
    domain: [0, "dataMax"],
    allowDecimals: false,
    ticks: generateTicks(
      unitPreferences.waveHeight === "ft"
        ? Math.max(...chartData.map((d) => d.waveHeight_ft ?? 0))
        : Math.max(...chartData.map((d) => d.waveHeight_m ?? 0)),
      unitPreferences.waveHeight
    ),
    tick: () => {
      return <text></text>;
    },
  };

  /**
   * BarChart args
   */
  const barChartArgs: CategoricalChartProps = {
    accessibilityLayer: true,
    margin: {
      bottom: 12,
    },
    barCategoryGap: 1,
  };

  /**
   * CartesianGrid args
   */
  const cartesianGridArgs: CartesianGridProps = {
    vertical: true,
    horizontal: true,
    verticalFill: [
      "oklch(0.968 0.007 247.896)", // Tailwind slate-200
      "oklch(0.929 0.013 255.508)", // Tailwind slate-300
    ],
    y: 0,
    height: 320,
    syncWithTicks: true,
  };

  /**
   * ChartTooltip args
   */
  const chartTooltipArgs: TooltipProps<number, string> = {
    cursor: {
      fill: "oklch(0.129 0.042 264.695)",
      fillOpacity: 0.1,
      height: 280,
    },
    content: <SwellTooltip unitPreferences={unitPreferences} />,
    trigger: "hover",
  };

  return (
    <ResponsiveContainer width={4848} height="100%" className="mb-0">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[20rem] w-full"
      >
        <BarChart data={processedData} {...barChartArgs}>
          <CartesianGrid {...cartesianGridArgs} />

          {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
          <XAxis {...xAxisArgsBackground} />

          {/* Duplicate XAxis for the legend. This XAxis is the one that shows the calendar date */}
          <XAxis {...xAxisArgsCalendarDate} />

          {/* This XAxis is the one that shows the time of the day */}
          <XAxis {...xAxisArgsTimeOfDay} />

          <ChartTooltip {...chartTooltipArgs} />

          {/* This XAxis is the one that shows the wind direction */}
          <XAxis {...xAxisArgsWindDirection} />

          {/* This XAxis is the one that shows the wind speed */}
          <XAxis {...xAxisArgsWindSpeed} />

          <Bar
            dataKey={(d) =>
              unitPreferences.waveHeight === "ft"
                ? d.waveHeight_ft
                : d.waveHeight_m
            }
            fill="#008993"
            unit={unitPreferences.waveHeight}
            activeBar={{
              fill: "#00b4c6",
            }}
            stackId="a"
            animationEasing="linear"
            animationDuration={220}
          >
            <LabelList
              dataKey="swellDirection"
              position="top"
              fill="#008a93"
              content={({ x, y, value, fill, index }) => {
                if (typeof index === "undefined") return null;
                const data = chartData[index];
                if (
                  data.faceWaveHeight_ft &&
                  unitPreferences.waveHeight === "ft"
                )
                  return null;

                return (
                  <SwellLabel
                    x={x}
                    y={y}
                    value={value}
                    fill={fill}
                    hasFaceWaveHeight={false}
                    className="animate-in fade-in-0 duration-1000"
                  />
                );
              }}
            />
          </Bar>

          <Bar
            dataKey={(d) =>
              unitPreferences.waveHeight === "ft" && d.faceWaveHeight_ft
                ? d.faceWaveHeight_ft - d.waveHeight_ft
                : null
            }
            fill="#ffa800"
            unit={unitPreferences.waveHeight}
            activeBar={{
              fill: "#ffc95d",
            }}
            className="w-7 min-w-7"
            stackId="a"
            animationBegin={210}
            animationEasing="ease-in-out"
          >
            <LabelList
              dataKey="secondarySwellDirection"
              position="top"
              fill="#ffa800"
              content={({ x, y, value, fill, index }) => {
                if (typeof index === "undefined") return null;
                const data = chartData[index];

                if (
                  data.faceWaveHeight_ft &&
                  unitPreferences.waveHeight === "ft"
                ) {
                  return (
                    <RenderCustomizedLabel
                      value={value}
                      x={x}
                      y={y}
                      fill={fill}
                      hasFaceWaveHeight={
                        unitPreferences.waveHeight === "ft" &&
                        data?.faceWaveHeight_ft
                          ? true
                          : false
                      }
                      primarySwellDirection={data?.swellDirection}
                    />
                  );
                }
                return null;
              }}
            />
          </Bar>

          <YAxis {...yAxisArgs} />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};

export default SwellChart;
