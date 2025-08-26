import { useScreenDetector } from "@/hooks/useScreenDetector";
import { formatDateTick, generateTicks, getChartWidth } from "@/lib/charts";
import { generateEventTicks } from "@/lib/events";
import { EventData, UnitPreferences } from "@/types";
import { ChartDataItem } from "@/types/index.ts";
import { cn } from "@/utils/utils";
import { memo, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EventTickRenderer } from "./EventTickRenderer";
import { SwellAxisTick } from "./SwellAxisTick";
import { SwellLabel } from "./SwellLabel";
import { SwellTooltip } from "./SwellTooltip";
import { WindSpeedTick } from "./WindSpeedTick";

/**
 * SwellChart component
 * @description This component is used to display the swell chart in the graph.
 * @param unitPreferences - The unit preferences
 * @param chartData - The chart data
 * @param maxSurfHeight - The max surf height
 * @returns The SwellChart component
 */
export const SwellChart = memo(
  ({
    unitPreferences,
    chartData,
    maxSurfHeight,
    currentLocationTime,
    exactTimestamp,
    referenceTimestamp,
    isEmbedded,
    event,
  }: {
    unitPreferences: UnitPreferences;
    chartData: (ChartDataItem & { timestamp: number })[];
    maxSurfHeight: number;
    currentLocationTime?: string;
    exactTimestamp?: number;
    referenceTimestamp?: number;
    isEmbedded?: boolean;
    event?: EventData;
  }) => {
    const { isMobile, isLandscapeMobile, isTablet } = useScreenDetector();

    const isSmallScreen = isMobile || isLandscapeMobile || isTablet;
    const [isTooltipClosed, setIsTooltipClosed] = useState(false);

    const handleClose = () => {
      // Set the flag to indicate tooltip was closed
      setIsTooltipClosed(true);

      // Simulate Escape key press to close the tooltip
      const escapeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        which: 27,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(escapeEvent);
    };

    // Calculate interpolated position for ReferenceLine
    const interpolatedData = useMemo(() => {
      if (!currentLocationTime || !exactTimestamp || !referenceTimestamp) {
        return undefined;
      }

      const currentIndex = chartData.findIndex(
        (item) => item.localDateTimeISO === currentLocationTime
      );

      if (currentIndex === -1) return { translateX: 0 };

      const nextSlot = chartData[currentIndex + 1];

      // Use the passed-in, consistent timestamp for the current slot.
      const currentSlotTimestamp = referenceTimestamp;

      let nextSlotTimestamp;
      if (nextSlot) {
        nextSlotTimestamp = nextSlot.timestamp;
      } else {
        // It's the last slot, assume 3 hours duration for interpolation
        const threeHoursInMillis = 3 * 60 * 60 * 1000;
        nextSlotTimestamp = currentSlotTimestamp + threeHoursInMillis;
      }

      // Calculate the ratio of where we are between the two slots
      const timeRatio =
        (exactTimestamp - currentSlotTimestamp) /
        (nextSlotTimestamp - currentSlotTimestamp);

      // Clamp the ratio between 0 and 1
      const clampedRatio = Math.max(0, Math.min(1, timeRatio));

      // Calculate the translation distance
      const barWidth = 32; // This should match the cursor width from tooltip
      const translateX = barWidth * clampedRatio;

      return { translateX };
    }, [chartData, currentLocationTime, exactTimestamp, referenceTimestamp]);

    const embeddedHeight = isEmbedded ? 360 : 320;

    return (
      <ResponsiveContainer
        width={getChartWidth(
          chartData.length,
          256,
          isMobile || isLandscapeMobile ? 44 : 60
        )}
        height="100%"
        className={cn(
          "tw:mb-0 tw:relative",
          unitPreferences.showAdvancedChart && // border bottom that's only there when the advanced chart is shown
            "tw:after:absolute tw:after:z-0 tw:after:h-px tw:after:w-[calc(100%-4.75rem)] tw:after:sm:w-[calc(100%-4.75rem)] tw:after:bottom-0 tw:after:left-[3.75rem] tw:after:sm:left-[4.75rem] tw:after:bg-gray-400/80 tw:after:pointer-events-none",
          isEmbedded
            ? "tw:h-[22.5rem] tw:min-h-[22.5rem]"
            : "tw:h-80 tw:min-h-80"
        )}
        minHeight={isEmbedded ? 360 : 320}
      >
        <ComposedChart
          data={chartData}
          barCategoryGap={1}
          className={cn(
            "swellnet-bar-chart tw:[&>svg]:focus:outline-none",
            isTooltipClosed
              ? "tw:[&>svg>.recharts-rectangle.recharts-tooltip-cursor]:fill-transparent"
              : ""
          )}
          onClick={() => {
            setIsTooltipClosed(false);
          }}
          {...(isEmbedded && {
            // this is to offset the top margin of the YAxis for the embedded chart to have labels flash with outer border of the chart
            margin: {
              top: -12,
            },
          })}
        >
          <CartesianGrid
            vertical={true}
            verticalFill={[
              "oklch(96.7% 0.003 264.542)", // Tailwind gray-100
              "#eceef1", // Tailwind gray-150
            ]}
            horizontal={true}
            y={0}
            height={embeddedHeight}
            syncWithTicks
            className=""
          />

          {/* Duplicate XAxis for the stripes in the background */}
          <XAxis dataKey="localDateTimeISO" xAxisId={0} interval={7} hide />

          {/* XAxis for the calendar date */}
          <XAxis
            dataKey="localDateTimeISO"
            xAxisId={2}
            tickLine={false}
            axisLine={false}
            orientation="top"
            tickFormatter={formatDateTick}
            fontSize={12}
            fontWeight={700}
            allowDuplicatedCategory={false}
            textAnchor="middle"
            ticks={
              chartData
                .reduce((acc: string[], curr) => {
                  const date = new Date(curr.localDateTimeISO)
                    .toISOString()
                    .split("T")[0];
                  // Only keep the first occurrence of each date
                  if (
                    !acc.some(
                      (existingDate) =>
                        new Date(existingDate).toISOString().split("T")[0] ===
                        date
                    )
                  ) {
                    acc.push(curr.localDateTimeISO);
                  }
                  return acc;
                }, [])
                .slice(1) // We remove the first tick due to being duplicated.
            }
          />

          {/* XAxis for the time of day */}
          <XAxis
            dataKey="localDateTimeISO"
            xAxisId={1}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: string) => {
              const date = new Date(value);
              // Use the timezone-aware date for formatting
              const hours = date.getHours();
              const period = hours >= 12 ? "pm" : "am";
              const hour = hours % 12 || 12;
              return `${hour}${period}`;
            }}
            orientation="top"
            fontSize={12}
            interval="preserveStart"
            allowDuplicatedCategory={false}
            allowDataOverflow
            minTickGap={16}
            tickCount={4} // Increased from 2 to show more time points
            color="#000"
          />

          {isEmbedded && event && (
            <XAxis
              dataKey="localDateTimeISO"
              xAxisId={3}
              tickLine={false}
              axisLine={false}
              orientation="top"
              allowDuplicatedCategory={false}
              textAnchor="middle"
              interval={0}
              minTickGap={0}
              domain={["dataMin", "dataMax"]}
              // tickMargin={16}
              ticks={generateEventTicks(chartData)}
              tick={(props: {
                x: number;
                y: number;
                payload: { value: string };
                index?: number;
              }) => <EventTickRenderer {...props} eventData={event} />}
            />
          )}

          {/* XAxis for the swell period */}
          <XAxis
            dataKey="localDateTimeISO"
            xAxisId={isEmbedded ? 4 : 3}
            tickLine={false}
            axisLine={false}
            allowDataOverflow
            allowDuplicatedCategory={false}
            tick={({
              x,
              y,
              index,
            }: {
              x: number;
              y: number;
              index: number;
            }) => {
              const data = chartData[index];
              if (!data) {
                return <g />;
              }
              return (
                <g
                  className="tw:text-white tw:px-1 tw:py-1"
                  transform={`translate(0, ${y - 21})`}
                >
                  <rect
                    x={x - 15}
                    y={-18}
                    width={29}
                    height={20}
                    fill={data._isMissingData ? "#bdbcbc" : "#1aa7b1"}
                  />
                  <text
                    x={
                      Math.round(
                        data.trainData?.[0]?.peakPeriod || 0
                      ).toString().length === 2
                        ? x - 7
                        : x - 3
                    }
                    y={-2}
                    fontSize={11}
                    fill="white"
                  >
                    {data._isMissingData
                      ? ""
                      : Math.round(data.trainData?.[0]?.peakPeriod || 0)}
                  </text>
                </g>
              );
            }}
            interval={0}
          />

          {/* XAxis for the wind direction */}
          <XAxis
            dataKey="localDateTimeISO"
            xAxisId={isEmbedded ? 5 : 4}
            allowDuplicatedCategory={false}
            allowDataOverflow
            tickLine={false}
            axisLine={false}
            tick={({
              x,
              y,
              index,
            }: {
              x: number;
              y: number;
              index: number;
            }) => {
              const data = chartData[index];
              if (!data || data._isMissingData) {
                return <g />;
              }
              return (
                <SwellAxisTick
                  payload={{ value: data.wind.direction ?? 0 }}
                  windSpeed={data.wind.speedKnots || 0}
                  x={x}
                  y={y - 40}
                />
              );
            }}
            interval={0}
          />

          {/* XAxis for the wind speed with dynamic values */}
          <XAxis
            dataKey="localDateTimeISO"
            xAxisId={isEmbedded ? 6 : 5}
            tick={({
              x,
              y,
              index,
            }: {
              x: number;
              y: number;
              index: number;
            }) => {
              const data = chartData[index];
              if (!data || data._isMissingData) {
                return <g />;
              }
              return (
                <WindSpeedTick
                  x={x}
                  y={y - 40}
                  payload={{
                    value:
                      unitPreferences.units.wind === "knots"
                        ? Math.round(data.wind.speedKnots ?? 0)
                        : unitPreferences.units.wind === "km"
                        ? Math.round(data.wind.speedKmh ?? 0)
                        : unitPreferences.units.wind === "mph"
                        ? Math.round(data.wind.speedMph ?? 0)
                        : 0,
                  }}
                />
              );
            }}
            interval={0}
            axisLine={false}
            tickLine={false}
            tickMargin={16}
            allowDuplicatedCategory={false}
            allowDataOverflow
          />

          {currentLocationTime && (
            <ReferenceLine
              x={currentLocationTime}
              stroke="#484a4f" // Custom Tailwind gray-350
              strokeWidth={1}
              strokeDasharray="4 4"
              strokeOpacity={0.26}
              y1={60}
              y2={320}
              style={{
                transform: interpolatedData
                  ? `translateX(${interpolatedData.translateX}px)`
                  : undefined,
              }}
            >
              <Label
                position="top"
                fill="#b7bcc5" // Custom Tailwind gray-350
                fontSize={12}
                fontWeight={700}
                offset={-6}
                style={{
                  transform: interpolatedData
                    ? `translateX(${interpolatedData.translateX}px)`
                    : undefined,
                }}
              >
                &#9660;
              </Label>
            </ReferenceLine>
          )}

          <Tooltip
            content={
              <SwellTooltip
                unitPreferences={unitPreferences}
                onClose={handleClose}
              />
            }
            cursor={{
              width: 32,
              height: 320,
              stroke: "oklch(0.129 0.042 264.695)",
              strokeWidth: 32,
              strokeOpacity: 0.1,
              overflow: "visible",
              className: isEmbedded
                ? "tw:scale-y-175 tw:-translate-y-16"
                : "tw:scale-y-175 tw:-translate-y-9",
            }}
            trigger={isSmallScreen ? "click" : "hover"}
            isAnimationActive={false}
            offset={24}
            wrapperStyle={{
              pointerEvents: "auto",
            }}
          />

          <Bar
            dataKey={(d) =>
              unitPreferences.units.surfHeight === "surfers_feet"
                ? d.primary.fullSurfHeightFeet
                : unitPreferences.units.surfHeight === "ft"
                ? d.primary.fullSurfHeightFaceFeet
                : d.primary.fullSurfHeightMetres
            }
            fill="#008993"
            unit={unitPreferences.units.surfHeight}
            activeBar={!isTooltipClosed ? { fill: "#00b4c6" } : undefined}
            stackId="a"
            animationEasing="linear"
            animationDuration={220}
          >
            <LabelList
              dataKey="primary.direction"
              position="top"
              fill="#008a93"
              content={({ x, y, value, fill, index }) => {
                if (typeof index === "undefined") return null;
                const data = chartData[index];

                // Safety check: ensure data exists and has the required structure
                if (!data || !data.primary) return null;

                // We only display the label if there is no secondary swell
                if (
                  data.secondary ||
                  data._isMissingData ||
                  (unitPreferences.units.surfHeight === "surfers_feet" &&
                    String(data.primary.fullSurfHeightFeet) === "0.00") ||
                  (unitPreferences.units.surfHeight === "ft" &&
                    String(data.primary.fullSurfHeightFaceFeet) === "0.00") ||
                  (unitPreferences.units.surfHeight === "m" &&
                    String(data.primary.fullSurfHeightMetres) === "0.00")
                )
                  return null;

                return (
                  <SwellLabel
                    x={x}
                    y={y}
                    value={value}
                    fill={fill}
                    hasSecondary={false}
                    className="tw:animate-in tw:fade-in-0 tw:duration-1000"
                  />
                );
              }}
            />
          </Bar>

          <Bar
            dataKey={(d) =>
              d.secondary
                ? unitPreferences.units.surfHeight === "surfers_feet"
                  ? d.secondary.fullSurfHeightFeet -
                    d.primary.fullSurfHeightFeet
                  : unitPreferences.units.surfHeight === "ft"
                  ? d.secondary.fullSurfHeightFaceFeet -
                    d.primary.fullSurfHeightFaceFeet
                  : d.secondary.fullSurfHeightMetres -
                    d.primary.fullSurfHeightMetres
                : null
            }
            fill="#ffa800"
            unit={unitPreferences.units.surfHeight}
            activeBar={!isTooltipClosed ? { fill: "#ffc95d" } : undefined}
            className="tw:w-7 tw:min-w-7"
            stackId="a"
            animationEasing="ease-in-out"
          >
            <LabelList
              dataKey={(d) => d.secondary?.direction ?? null}
              position="top"
              fill="#ffa800"
              content={({ x, y, value, fill, index }) => {
                if (typeof index === "undefined") return null;
                const data = chartData[index];

                // Safety check: ensure data exists and has the required structure
                if (!data || !data.primary) return null;

                if (data.secondary) {
                  return (
                    <SwellLabel
                      value={value}
                      x={x}
                      y={y}
                      fill={fill}
                      hasSecondary={data?.secondary ? true : false}
                      primarySwellDirection={data?.primary.direction}
                    />
                  );
                }
                return null;
              }}
            />
          </Bar>

          <YAxis
            tickLine={false}
            axisLine={false}
            type="number"
            minTickGap={0}
            padding={{
              top:
                unitPreferences.units.surfHeight === "ft" ||
                unitPreferences.units.surfHeight === "surfers_feet"
                  ? 20
                  : 16,
            }}
            width={isMobile || isLandscapeMobile ? 44 : 60}
            interval={0}
            overflow="visible"
            opacity={0}
            allowDecimals={false}
            tickMargin={isMobile || isLandscapeMobile ? 20 : 8}
            unit={unitPreferences.units.surfHeight}
            tick={() => {
              return <text></text>;
            }}
            ticks={useMemo(
              () =>
                generateTicks(maxSurfHeight, unitPreferences.units.surfHeight),
              [maxSurfHeight, unitPreferences.units.surfHeight]
            )}
            height={embeddedHeight}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
);
