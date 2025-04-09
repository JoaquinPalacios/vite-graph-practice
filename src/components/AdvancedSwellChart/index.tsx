import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import chartData from "@/data";
import { swellChartConfig } from "@/lib/chart-config";
import { UnitPreferences } from "@/types";
import { GiBigWave } from "react-icons/gi";
import { LuWind } from "react-icons/lu";
import { SwellTooltip } from "../SwellChart/SwellTooltip";
import SwellAxisTick from "../SwellChart/SwellAxisTick";

const AdvancedSwellChart = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  return (
    <ResponsiveContainer width={4848} height="100%" className="mb-0">
      <ChartContainer
        config={swellChartConfig}
        className="aspect-auto h-[20rem] w-full"
      >
        <LineChart
          accessibilityLayer
          data={chartData}
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
          <XAxis xAxisId={0} dataKey="date" hide interval={7} />

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
            xAxisId={1}
            dataKey="windDirection"
            tickLine={false}
            axisLine={true}
            tickMargin={0}
            minTickGap={0}
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

          <Line
            dataKey="primarySwellHeight"
            fill="#008993"
            unit="m"
            activeDot={{
              fill: "#00b4c6",
            }}
            width={28}
            animationEasing="linear"
            animationDuration={220}
          />

          <Line
            dataKey="secondarySwellHeight"
            fill="#ffa800"
            unit="m"
            activeDot={{
              fill: "#ffc95d",
            }}
            className="w-7 min-w-7"
            animationBegin={210}
            animationEasing="ease-in-out"
          />

          <Line
            dataKey="tertiarySwellHeight"
            fill="#fd6363"
            unit="m"
            activeDot={{
              fill: "#fd6363",
            }}
            className="w-7 min-w-7"
            animationBegin={210}
            animationEasing="ease-in-out"
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={0}
            unit="m"
            padding={{
              top: 20,
            }}
            interval="preserveStart"
            overflow="visible"
            type="number"
            domain={[0, "dataMax"]}
            allowDecimals={false}
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
                  {value.payload.value}m
                </text>
              );
            }}
            className="transition-opacity ease-in-out duration-200"
          />
        </LineChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};

export default AdvancedSwellChart;
