import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import chartData from "@/data";
import RenderCustomizedLabel from "./SwellLabel";
import { UnitPreferences } from "@/types";
import { generateTicks, processedData } from "@/utils/chart-utils";
import SwellLabel from "./SwellLabel";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { SwellTooltip } from "./SwellTooltip";
import WindSpeedTick from "./WindSpeedTick";
import { chartArgs } from "@/lib/chart-args";

const SwellChart = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  const { isMobile, isLandscapeMobile } = useScreenDetector();

  // Get all static args
  const {
    xAxisArgsBackground,
    xAxisArgsCalendarDate,
    xAxisArgsTimeOfDay,
    xAxisArgsWindDirection,
    xAxisArgsWindSpeed,
    yAxisArgs,
    mainChartArgs,
    cartesianGridArgs,
    chartTooltipArgs,
  } = chartArgs;

  /**
   * YAxis args
   */
  const dynamicYAxisArgs = {
    ...yAxisArgs,
    minTickGap: 0,
    padding: {
      top: unitPreferences.waveHeight === "ft" ? 32 : 0,
    },
    interval: "preserveStart" as const,
    overflow: "visible",
    opacity: 0,
    allowDecimals: false,
    tickMargin: isMobile || isLandscapeMobile ? 20 : 8,
    unit: unitPreferences.waveHeight,
    tick: () => {
      return <text></text>;
    },
    ticks: generateTicks(
      unitPreferences.waveHeight === "ft"
        ? Math.max(...chartData.map((d) => d.waveHeight_ft ?? 0))
        : Math.max(...chartData.map((d) => d.waveHeight_m ?? 0)),
      unitPreferences.waveHeight
    ),
  };

  /**
   * Wind speed XAxis args
   */
  const dynamicWindSpeedArgs = {
    ...xAxisArgsWindSpeed,
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
  };

  /**
   * Tooltip args
   */
  const dynamicTooltipArgs = {
    ...chartTooltipArgs,
    content: <SwellTooltip unitPreferences={unitPreferences} />,
  };

  const dynamicCartesianGridArgs = {
    ...cartesianGridArgs,
    verticalFill: [
      "oklch(0.968 0.007 247.896)", // Tailwind slate-200
      "oklch(0.929 0.013 255.508)", // Tailwind slate-300
    ],
  };

  /**
   * Bar chart args
   */
  const dynamicBarChartArgs = {
    ...mainChartArgs,
    barCategoryGap: 1,
  };

  return (
    <ResponsiveContainer
      width={4848}
      height="100%"
      className="mb-0 h-80 min-h-80"
    >
      <BarChart
        data={processedData}
        {...dynamicBarChartArgs}
        className="[&>svg]:focus:outline-none"
      >
        <CartesianGrid {...dynamicCartesianGridArgs} />

        {/* Duplicate XAxis for the stripes in the background */}
        <XAxis {...xAxisArgsBackground} />

        {/* XAxis for the calendar date */}
        <XAxis {...xAxisArgsCalendarDate} />

        {/* XAxis for the time of day */}
        <XAxis {...xAxisArgsTimeOfDay} />

        {/* XAxis for the wind direction */}
        <XAxis {...xAxisArgsWindDirection} />

        {/* XAxis for the wind speed with dynamic values */}
        <XAxis {...dynamicWindSpeedArgs} />

        <Tooltip {...dynamicTooltipArgs} />

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
              if (data.faceWaveHeight_ft && unitPreferences.waveHeight === "ft")
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

        <YAxis {...dynamicYAxisArgs} domain={[0, "dataMax"]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SwellChart;
