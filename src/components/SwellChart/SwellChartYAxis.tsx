import { useScreenDetector } from "@/hooks/useScreenDetector";
import { UnitPreferences } from "@/types";
import { ChartDataItem } from "@/types/index.ts";
import { generateTicks } from "@/utils/chart-utils";
import { cn } from "@/utils/utils";
import { LuWind } from "react-icons/lu";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
  hasSubscription,
}: {
  unitPreferences: UnitPreferences;
  chartData: ChartDataItem[];
  maxSurfHeight: number;
  hasSubscription: boolean;
}) => {
  const { isMobile, isLandscapeMobile } = useScreenDetector();

  return (
    <ResponsiveContainer
      width={48}
      height={320}
      minHeight={320}
      className={cn(
        "swell-y-axis tw:mb-0 tw:absolute tw:top-0 tw:left-0 tw:md:left-5 tw:z-20 tw:h-80 tw:min-h-80 tw:max-h-80",
        !hasSubscription && "tw:max-md:top-80"
      )}
    >
      <BarChart
        data={chartData}
        margin={
          {
            // bottom: 12,
          }
        }
        width={48}
        className="tw:[&>svg]:focus:outline-none"
        height={320}
      >
        <CartesianGrid
          vertical={true}
          horizontal={true}
          verticalFill={[
            "oklch(96.7% 0.003 264.542)", // Tailwind gray-100
            "#eceef1", // Tailwind gray-150
          ]}
          y={0}
          height={320}
          syncWithTicks
        />

        {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
        <XAxis xAxisId={0} dataKey="localDateTimeISO" hide />

        {/* Duplicate XAxis for the legend. This XAxis is the one that shows the calendar date */}
        <XAxis xAxisId={2} dataKey="localDateTimeISO" orientation="top" />

        {/* This XAxis is the one that shows the time of the day */}
        <XAxis xAxisId={1} dataKey="localDateTimeISO" orientation="top" />

        {/* This XAxis is the one that shows the swell period */}
        <XAxis xAxisId={3} dataKey="localDateTimeISO" />

        {/* This XAxis is the one that shows the wind direction */}
        <XAxis xAxisId={4} dataKey="localDateTimeISO" />

        {/* This XAxis is the one that shows the wind speed */}
        <XAxis xAxisId={5} dataKey="localDateTimeISO" />

        <Bar
          dataKey={(d) =>
            unitPreferences.units.surfHeight === "ft"
              ? d.primary.fullSurfHeightFeet
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
              ? unitPreferences.units.surfHeight === "ft"
                ? d.secondary.fullSurfHeightFeet - d.primary.fullSurfHeightFeet
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
          tickMargin={isMobile || isLandscapeMobile ? 20 : 20}
          minTickGap={0}
          unit={unitPreferences.units.surfHeight}
          interval={0}
          overflow="visible"
          allowDecimals={false}
          ticks={generateTicks(maxSurfHeight, unitPreferences.units.surfHeight)}
          padding={{
            top: unitPreferences.units.surfHeight === "ft" ? 20 : 16,
          }}
          height={320}
          width={48}
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
                <LuWind
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
                fontSize={12}
                fill="#666"
              >
                {value.payload.value}
                {unitPreferences.units.surfHeight === "m" &&
                Number.isInteger(value.payload.value)
                  ? unitPreferences.units.surfHeight
                  : unitPreferences.units.surfHeight === "ft"
                  ? unitPreferences.units.surfHeight
                  : ""}
              </text>
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
