import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { UnitPreferences } from "@/types";
import { generateTicks } from "@/utils/chart-utils";
import { LuWind } from "react-icons/lu";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { ChartDataItem } from "@/types/index.ts";
import { cn } from "@/utils/utils";

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
      width={60}
      height={320}
      minHeight={320}
      className={cn(
        "swell-y-axis tw:mb-0 tw:absolute tw:top-0 tw:left-0 tw:md:left-4 tw:z-20 tw:h-80 tw:min-h-80 tw:max-h-80",
        !hasSubscription && "tw:max-md:top-72"
      )}
    >
      <BarChart
        data={chartData}
        margin={{
          bottom: 12,
        }}
        width={60}
        className="tw:[&>svg]:focus:outline-none"
        height={320}
      >
        <CartesianGrid
          vertical={true}
          horizontal={true}
          verticalFill={[
            "oklch(0.968 0.007 247.896)", // Tailwind slate-200
            "oklch(0.929 0.013 255.508)", // Tailwind slate-300
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

        {/* This XAxis is the one that shows the wind direction */}
        <XAxis xAxisId={3} dataKey="localDateTimeISO" />

        {/* This XAxis is the one that shows the wind speed */}
        <XAxis xAxisId={4} dataKey="localDateTimeISO" />

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
          // hide
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
          // hide
          aria-hidden
        />

        <YAxis
          tickMargin={isMobile || isLandscapeMobile ? 20 : 8}
          minTickGap={0}
          unit={unitPreferences.units.surfHeight}
          interval="preserveEnd"
          overflow="visible"
          allowDecimals={false}
          ticks={generateTicks(maxSurfHeight, unitPreferences.units.surfHeight)}
          padding={{
            top: unitPreferences.units.surfHeight === "ft" ? 48 : 0,
          }}
          height={320}
          axisLine={false}
          type="number"
          domain={[0, "dataMax"]}
          tick={(value) => {
            return value.index === 0 ? (
              <g transform="translate(-10, 0)">
                <LuWind
                  className="tw:w-4 tw:h-4"
                  x={value.x - 6}
                  y={value.y + 8}
                  size={20}
                  color="#666"
                />
                {unitPreferences.units.wind === "knots" ? (
                  <text
                    x={value.x + 10}
                    y={value.y + 48}
                    dy={1}
                    textAnchor="end"
                    fontSize={10}
                  >
                    kts
                  </text>
                ) : (
                  <text
                    x={value.x + 12}
                    y={value.y + 48}
                    dy={1}
                    textAnchor="end"
                    fontSize={10}
                  >
                    km/h
                  </text>
                )}
              </g>
            ) : (
              <text
                x={value.x}
                y={value.y}
                dy={1}
                textAnchor="end"
                fontSize={12}
                fill="#666"
              >
                {value.payload.value}
                {unitPreferences.units.surfHeight}
              </text>
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
