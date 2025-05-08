"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ChartDataItem, UnitPreferences } from "@/types";
import SwellArrowDot from "./SwellArrowDot";
import { useMemo } from "react";
import processSwellData from "./ProcessDataSwell";
import {
  formatDateTick,
  generateTicks,
  getChartWidth,
} from "@/utils/chart-utils";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { useState } from "react";
import { cn } from "@/utils/utils";
import CustomCursor from "./CustomCursor";
import { AdvanceCustomTooltip } from "./AdvanceCustomTooltip";
import { Payload } from "recharts/types/component/DefaultTooltipContent";

/**
 * Advanced Swell Chart
 *  @description - This is a line chart that shows the different incoming swells
 * and their relative heights.
 * @param unitPreferences - The unit preferences for the chart
 * @returns The Advanced Swell Chart component
 */

const AdvancedSwellChart = ({
  unitPreferences,
  chartData,
  maxSurfHeight,
}: {
  unitPreferences: UnitPreferences;
  chartData: ChartDataItem[];
  maxSurfHeight: number;
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltipHoveredIndex, setTooltipHoveredIndex] = useState<number | null>(
    null
  );

  const { isMobile, isLandscapeMobile, isTablet } = useScreenDetector();

  /**
   * Process the swell data to identify events
   * useMemo prevents reprocessing on every render unless chartData changes
   */
  const processedSwellData = useMemo(
    () => processSwellData(chartData),
    [chartData]
  );

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

  /**
   * Handles the tooltip content generation
   * @param props - The tooltip props from Recharts
   * @returns The tooltip content or null
   */
  const handleTooltipContent = (props: TooltipProps<ValueType, NameType>) => {
    if (props.active) {
      // If we have payload data, use it directly
      if (props.payload && props.payload.length > 0) {
        return <AdvanceCustomTooltip {...props} />;
      }

      // If no payload but we have a hovered index, construct the payload
      if (tooltipHoveredIndex !== null && props.label) {
        const dataPoint = chartData[tooltipHoveredIndex];
        if (dataPoint) {
          const constructedPayload = eventIds
            .map((eventId, index) => {
              const eventData = processedSwellData[eventId];
              const matchingPoint = eventData.find(
                (point) => point.localDateTimeISO === dataPoint.localDateTimeISO
              );

              if (matchingPoint) {
                return {
                  name: eventId,
                  value: matchingPoint.height,
                  payload: {
                    ...matchingPoint,
                    direction: matchingPoint.direction,
                    period: matchingPoint.period,
                    localDateTimeISO: matchingPoint.localDateTimeISO,
                  },
                  color:
                    hoverIndex === index
                      ? activeColorPalette[index % activeColorPalette.length]
                      : colorPalette[index % colorPalette.length],
                } as unknown as Payload<ValueType, NameType>;
              }
              return undefined;
            })
            .filter((p): p is Payload<ValueType, NameType> => p !== undefined);

          return (
            <AdvanceCustomTooltip {...props} payload={constructedPayload} />
          );
        }
      }
    }
    return null;
  };

  if (getChartWidth(chartData.length) === 0) {
    return null;
  }

  return (
    <ResponsiveContainer
      width={getChartWidth(chartData.length, 256, 60)}
      height="100%"
      className={cn(
        "tw:mb-0 tw:h-48 tw:min-h-48 tw:transition-[height,min-height] tw:duration-300 tw:ease-in-out",
        !unitPreferences.showAdvancedChart && "tw:!h-0 tw:!min-h-0"
      )}
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        className="tw:[&>svg]:focus:outline-none"
        onMouseLeave={() => {
          setHoverIndex(null);
        }}
        syncId="swellnet"
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
          padding={{ left: 11, right: 11 }}
          interval={7}
        />

        <YAxis
          type="number"
          domain={[0, "dataMax"]}
          tickMargin={isMobile || isLandscapeMobile ? 20 : 8}
          minTickGap={0}
          interval="preserveEnd"
          allowDecimals={false}
          padding={{ bottom: 16, top: 20 }}
          overflow="visible"
          opacity={0}
          ticks={generateTicks(
            maxSurfHeight,
            unitPreferences.units.surfHeight === "ft" ? "ft" : "m"
          )}
          tick={() => {
            return <text></text>;
          }}
          tickLine={false}
          axisLine={false}
        />

        <Tooltip
          accessibilityLayer
          content={handleTooltipContent}
          cursor={
            <CustomCursor setTooltipHoveredIndex={setTooltipHoveredIndex} />
          }
          trigger="hover"
          shared
          isAnimationActive={false}
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
              stroke={
                !isMobile &&
                !isTablet &&
                !isLandscapeMobile &&
                hoverIndex === index
                  ? activeColor
                  : color
              }
              strokeWidth={2}
              connectNulls={false}
              dot={
                <SwellArrowDot
                  isHover={
                    !isMobile &&
                    !isTablet &&
                    !isLandscapeMobile &&
                    hoverIndex === index
                  }
                />
              }
              activeDot={false}
              opacity={
                !isMobile &&
                !isTablet &&
                !isLandscapeMobile &&
                hoverIndex === index
                  ? 1
                  : 0.25
              }
              onMouseEnter={() => {
                setHoverIndex(index);
              }}
              className="tw:[&>g>svg]:transition-opacity tw:[&>g>svg]:duration-150 tw:[&>g>svg]:ease-in-out"
              // animationDuration={150}
              isAnimationActive={false}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AdvancedSwellChart;
