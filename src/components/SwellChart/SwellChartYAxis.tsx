import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import chartData from "@/data";
import { UnitPreferences } from "@/types";
import { generateTicks, processedData } from "@/utils/chart-utils";
import { GiBigWave } from "react-icons/gi";
import { LuWind } from "react-icons/lu";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { chartArgs } from "@/lib/chart-args";
import { swellChartConfig } from "@/lib/chart-config";

/**
 * SwellChartYAxis component
 * This component is used to display the YAxis of the SwellChart.
 * It is a duplicate of the YAxis of the main SwellChart component.
 * This is a workaround in order to have the Y axis fix on the left side while the X axis is scrollable.
 * @param {UnitPreferences} unitPreferences - The unit preferences for the chart
 * @returns {React.ReactElement} The SwellChartYAxis component
 */
const SwellChartYAxis = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  const { isMobile, isLandscapeMobile } = useScreenDetector();

  // Get all static args
  const { yAxisArgs, cartesianGridArgs, mainChartArgs } = chartArgs;

  /**
   * YAxis args
   */
  const dynamicYAxisArgs = {
    ...yAxisArgs,
    tickMargin: isMobile || isLandscapeMobile ? 20 : 8,
    minTickGap: 0,
    unit: unitPreferences.waveHeight,
    interval: "preserveStart" as const,
    overflow: "visible",
    allowDecimals: false,
    ticks: generateTicks(
      unitPreferences.waveHeight === "ft"
        ? Math.max(...chartData.map((d) => d.waveHeight_ft))
        : Math.max(...chartData.map((d) => d.waveHeight_m)),
      unitPreferences.waveHeight
    ),
    padding: {
      top: 20,
    },
    tick: (value: {
      x: number;
      y: number;
      index: number;
      payload: { value: number };
    }) => {
      return value.index === 0 ? (
        <g transform="translate(-10, 0)">
          <GiBigWave
            className="w-6 h-6"
            x={value.x - 8}
            y={value.y - 20}
            size={20}
            color="#666"
          />
          <LuWind
            className="w-4 h-4"
            x={value.x - 8}
            y={value.y + 12}
            size={20}
            color="#666"
          />
          {unitPreferences.windSpeed === "knots" ? (
            <text
              x={value.x + 12}
              y={value.y + 52}
              dy={1}
              textAnchor="end"
              fontSize={10}
            >
              kts
            </text>
          ) : (
            <text
              x={value.x + 12}
              y={value.y + 52}
              dy={1}
              textAnchor="end"
              fontSize={10}
            >
              km/h
            </text>
          )}
        </g>
      ) : (
        <text x={value.x} y={value.y} dy={1} textAnchor="end">
          {value.payload.value}
          {unitPreferences.waveHeight}
        </text>
      );
    },
  };

  /**
   * BarChart args
   */
  const dynamicBarChartArgs = {
    ...mainChartArgs,
    width: 60,
  };

  return (
    <ResponsiveContainer
      width={60}
      height="100%"
      className="mb-0 absolute top-0 left-0 md:left-4 z-10"
    >
      <ChartContainer
        config={swellChartConfig}
        className="aspect-auto h-80 w-full"
      >
        <BarChart data={processedData} {...dynamicBarChartArgs}>
          <CartesianGrid {...cartesianGridArgs} />

          {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
          <XAxis xAxisId={0} dataKey="timestamp" hide />

          {/* Duplicate XAxis for the legend. This XAxis is the one that shows the calendar date */}
          <XAxis xAxisId={2} dataKey="timestamp" orientation="top" />

          {/* This XAxis is the one that shows the time of the day */}
          <XAxis xAxisId={1} dataKey="timestamp" orientation="top" />

          {/* This XAxis is the one that shows the wind direction */}
          <XAxis xAxisId={3} dataKey="timestamp" />

          {/* This XAxis is the one that shows the wind speed */}
          <XAxis xAxisId={4} dataKey="timestamp" />

          <Bar
            dataKey={(d) =>
              unitPreferences.waveHeight === "ft"
                ? d.waveHeight_ft
                : d.waveHeight_m
            }
            stackId="b"
          />

          <Bar
            dataKey={(d) =>
              unitPreferences.waveHeight === "ft" && d.faceWaveHeight_ft
                ? d.faceWaveHeight_ft - d.waveHeight_ft
                : null
            }
            stackId="b"
          />

          <YAxis {...dynamicYAxisArgs} />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};

export default SwellChartYAxis;
