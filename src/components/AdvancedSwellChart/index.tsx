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
import { dayTicks, generateTicks, timeScale } from "@/utils/chart-utils";
import { chartArgs } from "@/lib/chart-args";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { AdvanceCustomTooltip } from "./AdvanceCustomTooltip";
import { useState } from "react";
import { cn } from "@/utils/utils";

const AdvancedSwellChart = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverEventId, setHoverEventId] = useState<string | null>(null);

  const { isMobile, isLandscapeMobile } = useScreenDetector();
  // --- Process data to identify events ---
  // useMemo prevents reprocessing on every render unless chartData changes
  const processedSwellData = useMemo(
    () => processSwellData(chartData, undefined, unitPreferences.waveHeight),
    [unitPreferences.waveHeight]
  );
  const eventIds = Object.keys(processedSwellData);

  // --- Define a color palette ---
  const colorPalette = [
    "oklch(57.7% 0.245 27.325)", // Tailwind red-600
    "oklch(64.6% 0.222 41.116)", // Tailwind orange-600
    "oklch(54.6% 0.245 262.881)", // Tailwind blue-600
    "oklch(62.7% 0.194 149.214)", // Tailwind green-600
    "oklch(55.8% 0.288 302.321)", // Tailwind purple-600
    "oklch(59.2% 0.249 0.584)", // Tailwind pink-600
    "oklch(79.5% 0.184 86.047)", // Tailwind yellow-500
    "oklch(60.9% 0.126 221.723)", // Tailwind cyan-600
    "oklch(76.8% 0.233 130.85)", // Tailwind lime-500
  ];

  // Get all static args
  const { xAxisArgsBackground } = chartArgs;

  // Calculate custom vertical points for the grid
  const verticalPoints = useMemo(() => {
    const chartWidth = 4848; // Width from ResponsiveContainer
    const xAxisLeftMargin = 12; // From your padding
    const yAxisWidth = 60; // Approximate width of YAxis
    const xPadding = 0;

    const leftX = yAxisWidth + xAxisLeftMargin + xPadding;
    const rightX = chartWidth - xPadding;

    // Use timeScale to generate points
    return dayTicks.map((tick) => {
      const x = timeScale(new Date(tick));
      // Map the x value to the chart's pixel space
      return leftX + x * (rightX - leftX);
    });
  }, []);

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
          left: 11,
        }}
        className="[&>svg]:focus:outline-none"
        onMouseLeave={() => {
          console.log("mouse leave");
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
          verticalPoints={verticalPoints}
        />

        <XAxis
          dataKey="timestamp"
          type="number" // Timestamps are numbers
          scale="time" // Tell recharts it's time data
          domain={["dataMin", "dataMax"]} // Use min/max timestamps from data
          axisLine={false}
          tickLine={false}
          allowDuplicatedCategory={false}
          hide
        />

        <XAxis {...xAxisArgsBackground} />

        <YAxis
          tickLine={false}
          axisLine={false}
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
            unitPreferences.waveHeight === "ft"
              ? Math.max(...chartData.map((d) => d.waveHeight_ft))
              : Math.max(...chartData.map((d) => d.waveHeight_m)),
            unitPreferences.waveHeight
          )}
          tick={() => {
            return <text></text>;
          }}
        />

        <Tooltip
          content={
            <AdvanceCustomTooltip
              unitPreferences={unitPreferences}
              hoverEventId={hoverEventId}
            />
          }
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

          return (
            <Line
              key={index}
              data={eventData} // Data specific to this swell event
              type="monotone"
              dataKey={"height"}
              name={eventId}
              stroke={color}
              strokeWidth={2}
              // activeDot={false}
              connectNulls={false}
              dot={<SwellArrowDot isHover={hoverIndex === index} />}
              opacity={hoverIndex === index ? 1 : 0.25}
              onMouseEnter={() => {
                setHoverEventId(eventId);
                setHoverIndex(index);
              }}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AdvancedSwellChart;
