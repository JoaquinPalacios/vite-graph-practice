import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import chartData from "@/data";
import { UnitPreferences } from "@/types";
import SwellArrowDot from "./SwellArrowDot";
import { useMemo } from "react";
import processSwellData from "./ProcessDataSwell";
import { formatDateTick, generateTicks } from "@/utils/chart-utils";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { AdvanceCustomTooltip } from "./AdvanceCustomTooltip";
import { useState } from "react";
import { cn } from "@/utils/utils";

/**
 * Advanced Swell Chart
 *  @description - This is a line chart that shows the different incoming swells
 * and their relative heights.
 * @param unitPreferences - The unit preferences for the chart
 * @returns The Advanced Swell Chart component
 */
const AdvancedSwellChart = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverEventId, setHoverEventId] = useState<string | null>(null);

  const { isMobile, isLandscapeMobile } = useScreenDetector();

  /**
   * Process the swell data to identify events
   * useMemo prevents reprocessing on every render unless chartData changes
   */
  const processedSwellData = useMemo(() => processSwellData(chartData), []);

  const eventIds = Object.keys(processedSwellData);

  /**
   * Define the color palette of each event
   */
  const colorPalette = [
    "oklch(50.5% 0.213 27.518)", // Tailwind red-700
    "oklch(55.5% 0.163 48.998)", // Tailwind amber-700
    "oklch(48.8% 0.243 264.376)", // Tailwind blue-700
    "oklch(52.7% 0.154 150.069)", // Tailwind green-700
    "oklch(49.6% 0.265 301.924)", // Tailwind purple-700
    "oklch(52.5% 0.223 3.958)", // Tailwind pink-700
    "oklch(27.9% 0.041 260.031)", // Tailwind slate-800
    "oklch(52% 0.105 223.128)", // Tailwind cyan-700
    "oklch(53.2% 0.157 131.589)", // Tailwind lime-700
  ];

  /**
   * Define the active color palette of the hovered event
   */
  const activeColorPalette = [
    "oklch(57.7% 0.245 27.325)", // Tailwind red-600
    "oklch(66.6% 0.179 58.318)", // Tailwind amber-600
    "oklch(54.6% 0.245 262.881)", // Tailwind blue-600
    "oklch(62.7% 0.194 149.214)", // Tailwind green-600
    "oklch(55.8% 0.288 302.321)", // Tailwind purple-600
    "oklch(59.2% 0.249 0.584)", // Tailwind pink-600
    "oklch(55.4% 0.046 257.417)", // Tailwind slate-500
    "oklch(60.9% 0.126 221.723)", // Tailwind cyan-600
    "oklch(76.8% 0.233 130.85)", // Tailwind lime-500
  ];

  return (
    <ResponsiveContainer
      width={4848}
      height="100%"
      className={cn(
        "mb-0 h-48 min-h-48 transition-[height,min-height] duration-300 ease-in-out",
        !unitPreferences.showAdvancedChart && "!h-0 !min-h-0"
      )}
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          bottom: 12,
        }}
        className="[&>svg]:focus:outline-none"
        onMouseLeave={() => {
          setHoverIndex(null);
        }}
      >
        <CartesianGrid
          vertical={true}
          horizontal={true}
          verticalFill={[
            "oklch(0.968 0.007 247.896)", // Tailwind slate-200
            "oklch(0.929 0.013 255.508)", // Tailwind slate-300
          ]}
          y={0}
          height={192}
          syncWithTicks
        />

        {/* Background XAxis */}
        <XAxis
          dataKey="localDateTimeISO"
          xAxisId={0}
          allowDuplicatedCategory={false}
          allowDataOverflow
          hide
          tickFormatter={formatDateTick}
          padding={{ left: 19, right: 19 }}
          interval={7}
        />

        <YAxis
          type="number"
          domain={[0, "dataMax"]}
          tickMargin={isMobile || isLandscapeMobile ? 20 : 8}
          minTickGap={0}
          interval="preserveStart"
          allowDecimals={false}
          padding={{ bottom: 16, top: 20 }}
          overflow="visible"
          opacity={0}
          ticks={generateTicks(
            Math.max(...chartData.map((d) => d.waveHeight_m)),
            "m"
          )}
          tick={() => {
            return <text></text>;
          }}
          tickLine={false}
          axisLine={false}
        />

        <Tooltip
          content={<AdvanceCustomTooltip hoverEventId={hoverEventId} />}
          cursor={{
            fill: "oklch(0.129 0.042 264.695)",
            fillOpacity: 0.1,
            height: 280,
          }}
          trigger="hover"
        />

        {eventIds.map((eventId, index) => {
          const eventData = processedSwellData[eventId];

          const color = colorPalette[index % colorPalette.length]; // Cycle through palette
          const activeColor =
            activeColorPalette[index % activeColorPalette.length]; // Cycle through active palette

          return (
            <Line
              key={index}
              data={eventData} // Data specific to this swell event
              type="monotone"
              dataKey={"height"}
              name={eventId}
              stroke={hoverIndex === index ? activeColor : color}
              strokeWidth={2}
              connectNulls={false}
              dot={<SwellArrowDot isHover={hoverIndex === index} />}
              activeDot={false}
              opacity={hoverIndex === index ? 1 : 0.25}
              onMouseEnter={() => {
                setHoverEventId(eventId);
                setHoverIndex(index);
              }}
              className="[&>g>svg]:transition-opacity [&>g>svg]:duration-150 [&>g>svg]:ease-in-out"
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AdvancedSwellChart;
