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
  dayTicks,
  endDateObj,
  formatDateTick,
  generateTicks,
  processedData,
  startDateObj,
  timeScale,
} from "@/utils/chart-utils";
import SwellLabel from "./SwellLabel";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { SwellTooltip } from "./SwellTooltip";
import WindSpeedTick from "./WindSpeedTick";
import { generateHourlyTicks, multiFormat } from "@/lib/time-utils";
import SwellAxisTick from "./SwellAxisTick";

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
      className="mb-0 h-80 min-h-80 relative after:absolute after:z-0 after:h-16 after:w-[calc(100%-5rem)] after:bottom-0 after:left-[4.5rem] after:border-b after:border-slate-300 after:pointer-events-none"
    >
      <BarChart
        accessibilityLayer
        data={processedData}
        barCategoryGap={1}
        margin={{
          bottom: 12,
        }}
        className="[&>svg]:focus:outline-none"
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
        <XAxis
          dataKey="timestamp"
          xAxisId={0}
          type="number"
          scale={timeScale}
          domain={timeScale.domain().map((date) => date.valueOf())}
          interval="preserveStart"
          allowDuplicatedCategory={false}
          allowDataOverflow
          hide
          ticks={dayTicks}
          tickFormatter={multiFormat}
          padding={{ left: 12 }}
        />

        {/* XAxis for the calendar date */}
        <XAxis
          dataKey="timestamp"
          xAxisId={2}
          tickLine={false}
          axisLine={false}
          ticks={timeScale.ticks(16).map((date) => {
            // Create a UTC date to avoid DST issues
            const utcDate = new Date(
              Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate() + 1,
                0,
                0,
                0,
                0
              )
            );
            // Convert back to local time for display
            return utcDate.getTime();
          })}
          orientation="top"
          tickFormatter={formatDateTick}
          fontSize={12}
          fontWeight={700}
          type="number"
          scale={timeScale}
          domain={timeScale.domain().map((date) => date.valueOf())}
          interval="preserveStart"
          allowDuplicatedCategory={false}
          allowDataOverflow
          padding={{ left: 12 }}
        />
        {/* XAxis for the time of day */}
        <XAxis
          dataKey="timestamp"
          xAxisId={1}
          tickLine={false}
          axisLine={false}
          ticks={generateHourlyTicks(startDateObj, endDateObj, [0, 6, 12, 18])}
          tickFormatter={(timestamp: number) => {
            const date = new Date(timestamp);
            const hours = date.getHours();
            const period = hours >= 12 ? "pm" : "am";
            const hour = hours % 12 || 12;
            return `${hour}${period}`;
          }}
          orientation="top"
          fontSize={12}
          scale={timeScale}
          domain={timeScale.domain().map((date) => date.valueOf())}
          interval="preserveStart"
          allowDuplicatedCategory={false}
          allowDataOverflow
          padding={{ left: 12 }}
        />

        {/* XAxis for the wind direction */}
        <XAxis
          dataKey="timestamp"
          xAxisId={3}
          type="number"
          scale={timeScale}
          domain={timeScale.domain().map((date) => date.valueOf())}
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
                payload={{ value: data.windDirection }}
                windSpeed={data.windSpeed_knots || 0}
                x={x}
                y={y}
              />
            );
          }}
          interval={0}
          ticks={generateHourlyTicks(startDateObj, endDateObj)}
          padding={{ left: 12 }}
        />

        {/* XAxis for the wind speed with dynamic values */}
        <XAxis
          dataKey="timestamp"
          xAxisId={4}
          type="number"
          scale={timeScale}
          domain={timeScale.domain().map((date) => date.valueOf())}
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
                      ? data.windSpeed_knots
                      : data.windSpeed_kmh,
                }}
              />
            );
          }}
          interval={0}
          ticks={generateHourlyTicks(startDateObj, endDateObj)}
          axisLine={false}
          tickLine={false}
          tickMargin={16}
          allowDuplicatedCategory={false}
          allowDataOverflow
          padding={{ left: 12 }}
        />

        <Tooltip
          content={<SwellTooltip unitPreferences={unitPreferences} />}
          cursor={{
            fill: "oklch(0.129 0.042 264.695)",
            fillOpacity: 0.1,
            height: 280,
          }}
          trigger="hover"
        />

        <Bar
          dataKey={(d) =>
            unitPreferences.waveHeight === "ft"
              ? d.waveHeight_ft
              : d.waveHeight_m
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
            dataKey="swellDirection"
            position="top"
            fill="#008a93"
            content={({ x, y, value, fill, index }) => {
              if (typeof index === "undefined") return null;
              const data = chartData[index];
              if (data.faceWaveHeight_ft && unitPreferences.waveHeight === "ft")
                return null;

              return (
                <SwellLabel
                  x={x}
                  y={y}
                  value={value}
                  fill={fill}
                  hasFaceWaveHeight={false}
                  className="animate-in fade-in-0 duration-1000"
                />
              );
            }}
          />
        </Bar>

        <Bar
          dataKey={(d) =>
            unitPreferences.waveHeight === "ft" && d.faceWaveHeight_ft
              ? d.faceWaveHeight_ft - d.waveHeight_ft
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
            dataKey="secondarySwellDirection"
            position="top"
            fill="#ffa800"
            content={({ x, y, value, fill, index }) => {
              if (typeof index === "undefined") return null;
              const data = chartData[index];

              if (
                data.faceWaveHeight_ft &&
                unitPreferences.waveHeight === "ft"
              ) {
                return (
                  <RenderCustomizedLabel
                    value={value}
                    x={x}
                    y={y}
                    fill={fill}
                    hasFaceWaveHeight={
                      unitPreferences.waveHeight === "ft" &&
                      data?.faceWaveHeight_ft
                        ? true
                        : false
                    }
                    primarySwellDirection={data?.swellDirection}
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
              ? Math.max(...chartData.map((d) => d.waveHeight_ft ?? 0))
              : Math.max(...chartData.map((d) => d.waveHeight_m ?? 0)),
            unitPreferences.waveHeight
          )}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SwellChart;
