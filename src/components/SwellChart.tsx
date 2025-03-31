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
import { CustomTooltip } from "./CustomTooltip";
import RenderCustomizedLabel from "./RenderCustomizedLabel";
import { chartConfig } from "@/lib/chart-config";
import { UnitPreferences } from "./UnitSelector";
import { generateTicks } from "@/utils/chart-utils";
import RenderCustomAxisTick from "./RenderCustomAxisTick";
import { GiBigWave } from "react-icons/gi";
import { LuWind } from "react-icons/lu";
import { formatDateTick } from "@/lib/utils";

const SwellChart = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  return (
    <ResponsiveContainer width={4848} height="100%" className="mb-0">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[20rem] w-full"
        // syncId="swellnet"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 0,
            right: 12,
            bottom: 12,
          }}
          syncId="swellnet"
          // className="[&>svg>path]:fill-transparent"
        >
          <CartesianGrid
            vertical={true}
            horizontal={true}
            verticalFill={[
              "oklch(0.929 0.013 255.508)",
              "oklch(0.869 0.022 252.894)",
            ]}
            y={0}
            height={320}
            syncWithTicks
          />

          {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
          <XAxis xAxisId={0} dataKey="date" hide interval={7} />

          {/* Duplicate XAxis for the legend. This is the legend shown in the chart */}
          <XAxis
            xAxisId={2}
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={0}
            allowDuplicatedCategory={false}
            orientation="top"
            tickFormatter={formatDateTick}
            textAnchor="middle"
            fontWeight={700}
          />

          {/* This XAxis is the one that shows the time of the day */}
          <XAxis
            xAxisId={1}
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={0}
            minTickGap={16}
            orientation="top"
            interval={"preserveStart"}
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
                <RenderCustomAxisTick
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
            orientation="bottom"
            interval={0}
            padding={{
              left: 0,
              right: 0,
            }}
          />

          <ChartTooltip
            content={<CustomTooltip unitPreferences={unitPreferences} />}
          />

          <Bar
            dataKey={(d) =>
              unitPreferences.waveHeight === "ft"
                ? d.waveHeight_ft
                : d.waveHeight_m
            }
            fill="#008a93"
            unit={unitPreferences.waveHeight}
            activeBar={{
              fill: "#00b4c6",
            }}
            width={28}
            barSize={32}
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
                  <RenderCustomizedLabel
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

export default SwellChart;
