import { useScreenDetector } from "@/hooks/useScreenDetector";
import { generateTicks } from "@/lib/charts";
import { UnitPreferences } from "@/types";
import { ChartDataItem } from "@/types/index.ts";
import { cn } from "@/utils/utils";
import { Wind } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

/**
 * SwellChartYAxis component
 * This component is used to display the YAxis of the SwellChart.
 * It is a duplicate of the YAxis of the main SwellChart component.
 * This is a workaround in order to have the Y axis fix on the left side while the X axis is scrollable.
 * @param {UnitPreferences} unitPreferences - The unit preferences for the chart
 * @returns {React.ReactElement} The SwellChartYAxis component
 */
export const SwellChartYAxis = ({
  unitPreferences,
  chartData,
  maxSurfHeight,
  isEmbedded,
}: {
  unitPreferences: UnitPreferences;
  chartData: ChartDataItem[];
  maxSurfHeight: number;
  isEmbedded?: boolean;
}) => {
  const { isMobile, isLandscapeMobile } = useScreenDetector();

  const embeddedHeight = isEmbedded ? 390 : 350; // it has 30px added of extra space to the height of the chart

  return (
    <ResponsiveContainer
      width={48}
      height={embeddedHeight}
      minHeight={embeddedHeight}
      className={cn(
        "swell-y-axis tw:mb-0 tw:absolute tw:top-0 tw:left-0 tw:md:left-5 tw:z-20",
        isEmbedded
          ? "tw:h-[24.375rem] tw:min-h-[24.375rem] tw:max-h-[24.375rem]"
          : "tw:h-[21.875rem] tw:min-h-[21.875rem] tw:max-h-[21.875rem]"
      )}
    >
      <ComposedChart
        data={chartData}
        width={48}
        className="tw:[&>svg]:focus:outline-none"
        height={embeddedHeight}
        {...(isEmbedded && {
          margin: {
            top: -12,
          },
        })}
        margin={
          {
            // bottom: 0,
          }
        }
      >
        <CartesianGrid
          vertical={true}
          horizontal={true}
          verticalFill={[
            "oklch(96.7% 0.003 264.542)", // Tailwind gray-100
            "#eceef1", // Tailwind gray-150
          ]}
          y={0}
          height={embeddedHeight}
          syncWithTicks
        />

        {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
        <XAxis xAxisId={0} dataKey="localDateTimeISO" hide />

        {/* Duplicate XAxis for the legend. This XAxis is the one that shows the calendar date */}
        <XAxis xAxisId={2} dataKey="localDateTimeISO" orientation="top" />

        {/* This XAxis is the one that shows the time of the day */}
        <XAxis xAxisId={1} dataKey="localDateTimeISO" orientation="top" />

        {isEmbedded && (
          <XAxis xAxisId={3} dataKey="localDateTimeISO" orientation="top" />
        )}

        {/* This XAxis is the one that shows the event status */}
        <XAxis xAxisId={isEmbedded ? 4 : 3} dataKey="localDateTimeISO" />

        {/* This XAxis is the one that shows the swell period */}
        <XAxis xAxisId={isEmbedded ? 5 : 4} dataKey="localDateTimeISO" />

        {/* This XAxis is the one that shows the wind direction */}
        <XAxis xAxisId={isEmbedded ? 6 : 5} dataKey="localDateTimeISO" />

        {/* This XAxis is the one that shows the wind speed */}
        <XAxis xAxisId={isEmbedded ? 7 : 6} dataKey="localDateTimeISO" />

        <Bar
          dataKey={(d) =>
            unitPreferences.units.surfHeight === "surfers_feet"
              ? d.primary.fullSurfHeightFeet
              : unitPreferences.units.surfHeight === "ft"
              ? d.primary.fullSurfHeightFaceFeet
              : d.primary.fullSurfHeightMetres
          }
          stackId="b"
          name="Y Wave Height"
          id="y-wave-height"
          key={`y-wave-height-${unitPreferences.units.surfHeight}`}
          aria-hidden
        />

        <Bar
          dataKey={(d) =>
            d.secondary
              ? unitPreferences.units.surfHeight === "surfers_feet"
                ? d.secondary.fullSurfHeightFeet - d.primary.fullSurfHeightFeet
                : unitPreferences.units.surfHeight === "ft"
                ? d.secondary.fullSurfHeightFaceFeet -
                  d.primary.fullSurfHeightFaceFeet
                : d.secondary.fullSurfHeightMetres -
                  d.primary.fullSurfHeightMetres
              : null
          }
          stackId="b"
          name="Y Face Wave Height"
          id="y-face-wave-height"
          key={`y-face-wave-height-${unitPreferences.units.surfHeight}`}
          aria-hidden
        />

        <YAxis
          tickMargin={isMobile || isLandscapeMobile ? 28 : 20}
          minTickGap={0}
          unit={unitPreferences.units.surfHeight}
          interval={0}
          overflow="visible"
          allowDecimals={false}
          ticks={generateTicks(maxSurfHeight, unitPreferences.units.surfHeight)}
          padding={{
            top:
              unitPreferences.units.surfHeight === "ft" ||
              unitPreferences.units.surfHeight === "surfers_feet"
                ? 20
                : 16,
          }}
          height={embeddedHeight}
          width={isMobile || isLandscapeMobile ? 56 : 48}
          axisLine={false}
          type="number"
          tick={(value) => {
            return value.index === 0 ? (
              // Wind Direction, Speed & Period
              <g transform="translate(-10, 0)">
                <text
                  x={value.x + 20}
                  y={value.y + 16}
                  fontSize={10}
                  textAnchor="end"
                >
                  Sec
                </text>
                <Wind
                  className="tw:w-4 tw:h-4"
                  x={value.x + 2}
                  y={value.y + 32}
                  size={20}
                  color="#666"
                />
                {unitPreferences.units.wind === "knots" ? (
                  <text
                    x={value.x + 18}
                    y={value.y + 70}
                    dy={1}
                    textAnchor="end"
                    fontSize={10}
                  >
                    kts
                  </text>
                ) : unitPreferences.units.wind === "mph" ? (
                  <text
                    x={value.x + 20}
                    y={value.y + 70}
                    dy={1}
                    textAnchor="end"
                    fontSize={10}
                  >
                    mph
                  </text>
                ) : (
                  <text
                    x={value.x + 20}
                    y={value.y + 70}
                    dy={1}
                    textAnchor="end"
                    fontSize={10}
                  >
                    km/h
                  </text>
                )}
              </g>
            ) : (
              // Surf Height
              <text
                x={value.x + 8}
                y={value.y}
                dy={1}
                textAnchor="end"
                fontSize={11}
                fill="#666"
              >
                {value.payload.value}
                {unitPreferences.units.surfHeight === "m" &&
                Number.isInteger(value.payload.value)
                  ? unitPreferences.units.surfHeight
                  : unitPreferences.units.surfHeight === "ft"
                  ? unitPreferences.units.surfHeight
                  : unitPreferences.units.surfHeight === "surfers_feet"
                  ? "ft"
                  : ""}
              </text>
            );
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
