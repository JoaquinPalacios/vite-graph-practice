import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import chartData from "@/data";
import RenderCustomizedLabel from "./SwellLabel";
import { chartConfig } from "@/lib/chart-config";
import { UnitPreferences } from "@/types";
import { generateTicks } from "@/utils/chart-utils";
import { GiBigWave } from "react-icons/gi";
import { LuWind } from "react-icons/lu";
import { formatDateTick } from "@/utils/chart-utils";
import { SwellTooltip } from "./SwellTooltip";
import SwellLabel from "./SwellLabel";
import SwellAxisTick from "./SwellAxisTick";
import { multiFormat, processTimeData } from "@/lib/time-utils";
import { scaleTime } from "d3-scale";

const convertTo24Hour = (time: string) => {
  const [hours, period] = time.match(/(\d+)([ap]m)/i)?.slice(1) || [];
  if (!hours || !period) return time;
  let hour = parseInt(hours);
  if (period.toLowerCase() === "pm" && hour !== 12) hour += 12;
  if (period.toLowerCase() === "am" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:00`;
};

// Process the weather data
const { processedData, dayTicks } = processTimeData(
  chartData.map((item) => ({
    ...item,
    dateTime: `${item.date} ${convertTo24Hour(item.time)}`,
    timestamp: new Date(`${item.date} ${convertTo24Hour(item.time)}`).getTime(),
  }))
);

// Get the start and end timestamps
const timeValues = processedData.map((row) => row.timestamp);
const startTimestamp = Math.min(...timeValues);
const endTimestamp = Math.max(...timeValues);

// Create Date objects for the start and end of the day
const startDateObj = new Date(startTimestamp);
const endDateObj = new Date(endTimestamp);

// Set start date to beginning of day (00:00:00)
startDateObj.setDate(startDateObj.getDate());
startDateObj.setHours(0, 0, 0, 0);

// Set end date to beginning of next day (00:00:00)
endDateObj.setDate(endDateObj.getDate() + 1);
endDateObj.setHours(0, 0, 0, 0);

// Create time scale with numeric timestamps
const timeScale = scaleTime().domain([startDateObj, endDateObj]).nice();

// Generate ticks for each day
// const dayTicks: number[] = [];
let currentDate = new Date(startDateObj);
while (currentDate <= endDateObj) {
  dayTicks.push(currentDate.getTime());
  currentDate = new Date(currentDate);
  currentDate.setDate(currentDate.getDate() + 1);
}

const SwellChartTest = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  return (
    <ResponsiveContainer width={4848} height="100%" className="mb-0">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[20rem] w-full"
      >
        <BarChart
          accessibilityLayer
          data={processedData}
          margin={{
            left: 0,
            right: 12,
            bottom: 12,
          }}
          // syncId="swellnet"
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
          <XAxis
            xAxisId={0}
            dataKey="timestamp"
            hide
            type="number"
            scale={timeScale}
            domain={timeScale.domain().map((date) => date.valueOf())}
            ticks={dayTicks}
            tickFormatter={multiFormat}
            interval={"preserveStart"}
            allowDataOverflow
            // padding={{ left: 12 }}
          />

          {/* Duplicate XAxis for the legend. This XAxis is the one that shows the calendar date */}
          <XAxis
            xAxisId={2}
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            type="number"
            scale={timeScale}
            domain={timeScale.domain().map((date) => date.valueOf())}
            ticks={timeScale.ticks(16).map((date) => {
              const centeredDate = new Date(date);
              centeredDate.setHours(12, 0, 0, 0); // Set to noon to center the date
              return centeredDate.getTime();
            })}
            padding={{ left: 12 }}
            allowDataOverflow
            interval={"preserveStart"}
            allowDuplicatedCategory={false}
            orientation="top"
            tickFormatter={formatDateTick}
            textAnchor="middle"
            fontWeight={700}
          />

          {/* This XAxis is the one that shows the time of the day */}
          <XAxis
            xAxisId={1}
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            // tickMargin={0}
            type="number"
            scale={timeScale}
            domain={timeScale.domain().map((date) => date.valueOf())}
            ticks={(() => {
              const ticks: number[] = [];
              const currentDate = new Date(startDateObj);
              const hours = [0, 6, 12, 18];
              const lastValidTimestamp = endTimestamp; // Use the actual last data point timestamp

              while (currentDate <= endDateObj) {
                hours.forEach((hour) => {
                  const date = new Date(currentDate);
                  date.setHours(hour, 0, 0, 0);
                  const timestamp = date.getTime();
                  // Only add the tick if it's before or equal to our last data point
                  if (timestamp <= lastValidTimestamp) {
                    ticks.push(timestamp);
                  }
                });
                currentDate.setDate(currentDate.getDate() + 1);
              }

              return ticks;
            })()}
            tickFormatter={(timestamp) => {
              const date = new Date(timestamp);
              const hours = date.getHours();
              const period = hours >= 12 ? "pm" : "am";
              const hour = hours % 12 || 12;
              return `${hour}${period}`;
            }}
            orientation="top"
          />

          <ChartTooltip
            cursor={{
              height: 280,
              fill: "oklch(0.129 0.042 264.695)",
              fillOpacity: 0.1,
            }}
            content={<SwellTooltip unitPreferences={unitPreferences} />}
            trigger="hover"
          />

          {/* This XAxis is the one that shows the wind direction */}
          <XAxis
            xAxisId={3}
            dataKey="windDirection"
            tickLine={false}
            axisLine={false}
            tickMargin={0}
            minTickGap={0}
            orientation="bottom"
            tick={({ payload, x, y, index }) => {
              const data = chartData[index];

              return (
                <SwellAxisTick
                  payload={payload}
                  windSpeed={data?.windSpeed_knots || 0}
                  x={x}
                  y={y}
                />
              );
            }}
            interval={0}
            padding={{
              left: 0,
              right: 0,
            }}
          />

          {/* This XAxis is the one that shows the wind speed */}
          <XAxis
            xAxisId={4}
            dataKey={
              unitPreferences.windSpeed === "knots"
                ? "windSpeed_knots"
                : "windSpeed_kmh"
            }
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            fontSize={12}
            minTickGap={0}
            interval={0}
            padding={{
              left: 0,
              right: 0,
            }}
            stroke="#666"
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
            width={28}
            barSize={36}
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
                if (
                  data.faceWaveHeight_ft &&
                  unitPreferences.waveHeight === "ft"
                )
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
            tickMargin={8}
            minTickGap={0}
            unit={unitPreferences.waveHeight}
            padding={{
              top: 20,
            }}
            interval="preserveStart"
            overflow="visible"
            type="number"
            domain={[0, "dataMax"]}
            allowDecimals={false}
            ticks={generateTicks(
              unitPreferences.waveHeight === "ft"
                ? Math.max(...chartData.map((d) => d.waveHeight_ft))
                : Math.max(...chartData.map((d) => d.waveHeight_m)),
              unitPreferences.waveHeight
            )}
            tick={(value) => {
              return value.index === 0 ? (
                <g transform="translate(-10, 0)">
                  <GiBigWave
                    className="w-6 h-6"
                    x={value.x - 8}
                    y={value.y - 24}
                    size={24}
                    color="#666"
                  />
                  <LuWind
                    className="w-4 h-4"
                    x={value.x - 8}
                    y={value.y + 12}
                    size={24}
                    color="#666"
                  />
                  {unitPreferences.windSpeed === "knots" ? (
                    <text
                      x={value.x + 12}
                      y={value.y + 52}
                      dy={1}
                      textAnchor="end"
                    >
                      kts
                    </text>
                  ) : (
                    <text
                      x={value.x + 12}
                      y={value.y + 52}
                      dy={1}
                      textAnchor="end"
                    >
                      km/h
                    </text>
                  )}
                </g>
              ) : (
                <text x={value.x} y={value.y} dy={1} textAnchor="end">
                  {value.payload.value}
                  {unitPreferences.waveHeight}
                </text>
              );
            }}
            className="transition-opacity ease-in-out duration-200"
          />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};

export default SwellChartTest;
