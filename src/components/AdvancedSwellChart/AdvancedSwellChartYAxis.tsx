import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import chartData from "@/data";
import { GiBigWave } from "react-icons/gi";
import { useMemo } from "react";
import processSwellData from "./ProcessDataSwell";
import { generateTicks } from "@/utils/chart-utils";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { chartArgs } from "@/lib/chart-args";

const AdvancedSwellChartYAxis = () => {
  const { isMobile, isLandscapeMobile } = useScreenDetector();

  /**
   * Process the swell data to identify events
   * useMemo prevents reprocessing on every render unless chartData changes
   */
  const processedSwellData = useMemo(() => processSwellData(chartData), []);

  const eventIds = Object.keys(processedSwellData);

  // Get all static args
  const { xAxisArgsBackground, yAxisArgs } = chartArgs;

  return (
    <ResponsiveContainer
      width={60}
      height="100%"
      className="mb-0 absolute top-80 left-0 md:left-4 z-10 h-48 min-h-48 max-h-48"
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          bottom: 12,
          left: 11,
        }}
        className="[&>svg]:focus:outline-none"
      >
        <CartesianGrid
          vertical={true}
          horizontal={true}
          y={0}
          height={192}
          syncWithTicks
        />

        <XAxis {...xAxisArgsBackground} />

        <YAxis
          {...yAxisArgs}
          tickMargin={isMobile || isLandscapeMobile ? 20 : 8}
          minTickGap={0}
          unit="m"
          interval="preserveStart"
          allowDecimals={false}
          padding={{ bottom: 16, top: 20 }}
          overflow="visible"
          ticks={generateTicks(
            Math.max(...chartData.map((d) => d.waveHeightMetres ?? 0)),
            "m"
          )}
          tick={(value: {
            x: number;
            y: number;
            index: number;
            payload: { value: number };
          }) => {
            return value.index === 0 ? (
              <GiBigWave
                className="w-6 h-6"
                x={value.x - 30}
                y={value.y - 20}
                size={20}
                color="#666"
              />
            ) : (
              <text
                x={value.x - 11}
                y={value.y}
                dy={1}
                textAnchor="end"
                fontSize={12}
                fill="#666"
              >
                {value.payload.value}m
              </text>
            );
          }}
          className="transition-opacity ease-in-out duration-200"
        />

        {eventIds.map((eventId, index) => {
          const eventData = processedSwellData[eventId];

          return (
            <Line
              key={index}
              data={eventData} // Data specific to this swell event
              type="monotone"
              dataKey="height"
              name={eventId}
              activeDot={false}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AdvancedSwellChartYAxis;
