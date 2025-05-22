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
  activeColorPalette,
  colorPalette,
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
export const AdvancedSwellChart = ({
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

  // Map localDateTimeISO to dateTime for robust tick formatting
  const isoToLocalMap = useMemo(() => {
    const map = new Map<string, string>();

    // Get the timezone offset from the first data point
    const firstPoint = chartData[0];
    if (!firstPoint?.dateTime) return map;

    // Extract timezone offset from the first point's dateTime (e.g., "+09:30" from "2024-03-21T23:30:00+09:30")
    const timezoneOffset = firstPoint.dateTime.match(/[+-]\d{2}:\d{2}/)?.[0];
    if (!timezoneOffset) return map;

    chartData.forEach((d) => {
      if (d.localDateTimeISO && d.dateTime) {
        // Parse the local date from dateTime
        const localDate = new Date(d.dateTime);

        // Create a new date at 12am in the location's timezone
        const dateAtMidnight = new Date(localDate);
        dateAtMidnight.setHours(0, 0, 0, 0);

        // Format it with the location's timezone offset
        const midnightLocalTime = dateAtMidnight
          .toISOString()
          .replace("Z", timezoneOffset);

        map.set(d.localDateTimeISO, midnightLocalTime);
      }
    });
    return map;
  }, [chartData]);

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
      height={unitPreferences.showAdvancedChart ? "100%" : 0}
      className={cn(
        "tw:mb-0 tw:h-48 tw:min-h-48 tw:transition-[height,min-height] tw:duration-250 tw:ease-out",
        !unitPreferences.showAdvancedChart && "tw:!h-0 tw:min-h-0"
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
          padding={{ left: 11, right: 11 }}
          interval={7}
          tickFormatter={(value: string) => {
            // Get the local time string with offset for this UTC ISO value
            const localTimeWithOffset = isoToLocalMap.get(value) || value;
            const date = new Date(localTimeWithOffset);

            // Now this will always be the local hour for the surf spot
            const hours = date.getHours();
            const period = hours >= 12 ? "pm" : "am";
            const hour = hours % 12 || 12;
            return `${hour}${period}`;
          }}
          hide
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
          ticks={generateTicks(maxSurfHeight, "m")}
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
          offset={28}
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
              className="tw:transition-all tw:duration-300 tw:[&>g>svg]:transition-opacity tw:[&>g>svg]:duration-250 tw:[&>g>svg]:ease-in-out"
              animationDuration={250}
              isAnimationActive={false}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};
