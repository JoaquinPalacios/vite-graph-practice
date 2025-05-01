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
import chartData from "@/data";
import RenderCustomizedLabel from "./SwellLabel";
import { UnitPreferences } from "@/types";
import {
  formatDateTick,
  generateTicks,
  processedData,
} from "@/utils/chart-utils";
import SwellLabel from "./SwellLabel";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { SwellTooltip } from "./SwellTooltip";
import SwellAxisTick from "./SwellAxisTick";
import WindSpeedTick from "./WindSpeedTick";
import { cn } from "@/utils/utils";

const SwellChart = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  const { isMobile, isLandscapeMobile } = useScreenDetector();

  return (
    <ResponsiveContainer
      width={4848}
      height="100%"
      className={cn(
        "mb-0 h-80 min-h-80 relative",
        "after:absolute after:z-0 after:h-16 after:w-[calc(100%-6rem)] after:bottom-0 after:left-20 after:border-b after:border-slate-300 after:pointer-events-none"
      )}
    >
      <BarChart
        accessibilityLayer
        data={processedData}
        barCategoryGap={1}
        margin={{
          bottom: 12,
        }}
        className="[&>svg]:focus:outline-none"
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
          height={320}
          syncWithTicks
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
            processedData
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
              .slice(1) // TODO - We remove the first tick due to being duplicated. We have to revise if this happens due to the time difference between the local time and UTC time.
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
          tickCount={2}
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
            const data = processedData[index];
            if (!data) {
              return <g />;
            }
            return (
              <SwellAxisTick
                payload={{ value: data.wind.direction }}
                windSpeed={data.wind.speedKnots || 0}
                x={x}
                y={y}
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
            const data = processedData[index];
            if (!data) {
              return <g />;
            }
            return (
              <WindSpeedTick
                x={x}
                y={y}
                payload={{
                  value:
                    unitPreferences.windSpeed === "knots"
                      ? data.wind.speedKnots
                      : data.wind.speedKmh,
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
          accessibilityLayer
          content={<SwellTooltip unitPreferences={unitPreferences} />}
          cursor={{
            fill: "oklch(0.129 0.042 264.695)",
            fillOpacity: 0.1,
            height: 280,
          }}
          trigger="hover"
          isAnimationActive={false}
        />

        <Bar
          dataKey={(d) =>
            unitPreferences.waveHeight === "ft"
              ? d.primary.fullSurfHeightFeet
              : d.primary.fullSurfHeightMetres
          }
          fill="#008993"
          unit={unitPreferences.waveHeight}
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
                  className="animate-in fade-in-0 duration-1000"
                />
              );
            }}
          />
        </Bar>

        <Bar
          dataKey={(d) =>
            d.secondary
              ? unitPreferences.waveHeight === "ft"
                ? d.secondary.fullSurfHeightFeet - d.primary.fullSurfHeightFeet
                : d.secondary.fullSurfHeightMetres -
                  d.primary.fullSurfHeightMetres
              : null
          }
          fill="#ffa800"
          unit={unitPreferences.waveHeight}
          activeBar={{
            fill: "#ffc95d",
          }}
          className="w-7 min-w-7"
          stackId="a"
          animationBegin={210}
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
                  <RenderCustomizedLabel
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
          domain={[0, "dataMax"]}
          minTickGap={0}
          padding={{
            top: unitPreferences.waveHeight === "ft" ? 32 : 0,
          }}
          interval="preserveStart"
          overflow="visible"
          opacity={0}
          allowDecimals={false}
          tickMargin={isMobile || isLandscapeMobile ? 20 : 8}
          unit={unitPreferences.waveHeight}
          tick={() => {
            return <text></text>;
          }}
          ticks={generateTicks(
            unitPreferences.waveHeight === "ft"
              ? Math.max(
                  ...chartData.map((d) =>
                    d.secondary
                      ? d.secondary.fullSurfHeightFeet
                      : d.primary.fullSurfHeightFeet
                  )
                )
              : Math.max(
                  ...chartData.map((d) =>
                    d.secondary
                      ? d.secondary.fullSurfHeightMetres
                      : d.primary.fullSurfHeightMetres
                  )
                ),
            unitPreferences.waveHeight
          )}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SwellChart;
