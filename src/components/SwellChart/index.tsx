import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { UnitPreferences } from "@/types";
import {
  formatDateTick,
  generateTicks,
  getChartWidth,
} from "@/utils/chart-utils";
import { SwellLabel } from "./SwellLabel";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { SwellTooltip } from "./SwellTooltip";
import { SwellAxisTick } from "./SwellAxisTick";
import { WindSpeedTick } from "./WindSpeedTick";
import { cn } from "@/utils/utils";
import { ChartDataItem } from "@/types/index.ts";

/**
 * SwellChart component
 * @description This component is used to display the swell chart in the graph.
 * @param unitPreferences - The unit preferences
 * @param chartData - The chart data
 * @param maxSurfHeight - The max surf height
 * @returns The SwellChart component
 */
export const SwellChart = ({
  unitPreferences,
  chartData,
  maxSurfHeight,
}: {
  unitPreferences: UnitPreferences;
  chartData: ChartDataItem[];
  maxSurfHeight: number;
}) => {
  const { isMobile, isLandscapeMobile } = useScreenDetector();

  return (
    <ResponsiveContainer
      width={getChartWidth(chartData.length, 256, 60)}
      height="100%"
      className={cn(
        "tw:mb-0 tw:h-80 tw:min-h-80 tw:relative",
        unitPreferences.showAdvancedChart &&
          "tw:after:absolute tw:after:z-0 tw:after:h-16 tw:after:w-[calc(100%-4.75rem)] tw:after:bottom-0 tw:after:left-[4.75rem] tw:after:border-b tw:after:border-slate-400/80 tw:after:pointer-events-none"
      )}
      minHeight={320}
    >
      <BarChart
        data={chartData}
        barCategoryGap={1}
        margin={{
          bottom: 12,
        }}
        className="swellnet-bar-chart tw:[&>svg]:focus:outline-none"
      >
        <CartesianGrid
          vertical={true}
          verticalFill={[
            "oklch(0.968 0.007 247.896)", // Tailwind slate-200
            "oklch(0.929 0.013 255.508)", // Tailwind slate-300
          ]}
          horizontal={true}
          y={0}
          height={320}
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
        />

        {/* XAxis for the wind direction */}
        <XAxis
          dataKey="localDateTimeISO"
          xAxisId={3}
          allowDuplicatedCategory={false}
          allowDataOverflow
          tickLine={false}
          axisLine={false}
          tick={({ x, y, index }: { x: number; y: number; index: number }) => {
            const data = chartData[index];
            if (!data) {
              return <g />;
            }
            return (
              <SwellAxisTick
                payload={{ value: data.wind.direction ?? 0 }}
                windSpeed={data.wind.speedKnots || 0}
                x={x}
                y={y - 32}
              />
            );
          }}
          interval={0}
        />

        {/* XAxis for the wind speed with dynamic values */}
        <XAxis
          dataKey="localDateTimeISO"
          xAxisId={4}
          tick={({ x, y, index }: { x: number; y: number; index: number }) => {
            const data = chartData[index];
            if (!data) {
              return <g />;
            }
            return (
              <WindSpeedTick
                x={x}
                y={y - 32}
                payload={{
                  value:
                    unitPreferences.units.wind === "knots"
                      ? Math.round(data.wind.speedKnots ?? 0)
                      : Math.round(data.wind.speedKmh ?? 0),
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

        <Tooltip
          content={<SwellTooltip unitPreferences={unitPreferences} />}
          cursor={{
            fill: "oklch(0.129 0.042 264.695)",
            fillOpacity: 0.1,
            height: 280,
          }}
          trigger="hover"
          isAnimationActive={false}
          offset={24}
        />

        <Bar
          dataKey={(d) =>
            unitPreferences.units.surfHeight === "ft"
              ? d.primary.fullSurfHeightFeet
              : d.primary.fullSurfHeightMetres
          }
          fill="#008993"
          unit={unitPreferences.units.surfHeight}
          activeBar={{
            fill: "#00b4c6",
          }}
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

              // We only display the label if there is no secondary swell
              if (data.secondary) return null;

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
              ? unitPreferences.units.surfHeight === "ft"
                ? d.secondary.fullSurfHeightFeet - d.primary.fullSurfHeightFeet
                : d.secondary.fullSurfHeightMetres -
                  d.primary.fullSurfHeightMetres
              : null
          }
          fill="#ffa800"
          unit={unitPreferences.units.surfHeight}
          activeBar={{
            fill: "#ffc95d",
          }}
          className="tw:w-7 tw:min-w-7"
          stackId="a"
          animationEasing="ease-in-out"
        >
          <LabelList
            dataKey="secondary.direction"
            position="top"
            fill="#ffa800"
            content={({ x, y, value, fill, index }) => {
              if (typeof index === "undefined") return null;
              const data = chartData[index];

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
            top: unitPreferences.units.surfHeight === "ft" ? 20 : 0,
          }}
          interval={0}
          overflow="visible"
          opacity={0}
          allowDecimals={false}
          tickMargin={isMobile || isLandscapeMobile ? 20 : 8}
          unit={unitPreferences.units.surfHeight}
          tick={() => {
            return <text></text>;
          }}
          ticks={generateTicks(maxSurfHeight, unitPreferences.units.surfHeight)}
          height={320}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
