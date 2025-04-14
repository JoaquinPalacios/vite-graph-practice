import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import chartData from "@/data";
import { UnitPreferences } from "@/types";
import { GiBigWave } from "react-icons/gi";
import SwellArrowDot from "./SwellArrowDot";
import { useMemo } from "react";
import processSwellData from "./ProcessDataSwell";
import { generateTicks } from "@/utils/chart-utils";
import { useScreenDetector } from "@/hooks/useScreenDetector";

const AdvancedSwellChartYAxis = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  const { isMobile, isLandscapeMobile } = useScreenDetector();
  // --- Process data to identify events ---
  // useMemo prevents reprocessing on every render unless chartData changes
  const processedSwellData = useMemo(() => processSwellData(chartData), []);
  const eventIds = Object.keys(processedSwellData);

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

        <XAxis dataKey="timestamp" hide />

        <XAxis xAxisId={0} dataKey="timestamp" hide />

        <YAxis
          tickLine={false}
          axisLine={false}
          type="number"
          domain={[0, "dataMax"]}
          tickMargin={isMobile || isLandscapeMobile ? 20 : 8}
          minTickGap={0}
          unit={unitPreferences.waveHeight}
          interval="preserveStart"
          allowDecimals={false}
          padding={{ bottom: 16, top: 20 }}
          overflow="visible"
          ticks={generateTicks(
            unitPreferences.waveHeight === "ft"
              ? Math.max(...chartData.map((d) => d.waveHeight_ft))
              : Math.max(...chartData.map((d) => d.waveHeight_m)),
            unitPreferences.waveHeight
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
                {value.payload.value}
                {unitPreferences.waveHeight}
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
              strokeWidth={2}
              // activeDot={false}
              connectNulls={false} // Show gaps if event disappears temporarily
              dot={<SwellArrowDot />}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AdvancedSwellChartYAxis;
