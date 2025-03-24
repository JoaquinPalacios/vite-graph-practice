import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  // ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
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

const SwellChart = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  // Add this at the beginning of the component
  // const fiveDaysData = chartData.filter((entry) => {
  //   const entryDate = new Date(entry.date);
  //   const startDate = new Date(chartData[0].date);
  //   const diffTime = Math.abs(entryDate.getTime() - startDate.getTime());
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   return diffDays < 5;
  // });

  // Calculate width based on data points
  // const minWidth = 800; // Minimum width of the chart
  // const barWidth = 40; // Width per data point
  // const width = Math.max(minWidth, fiveDaysData.length * barWidth);

  return (
    <Card className="w-full bg-slate-200 border-slate-700 max-w-[1340px]">
      <CardContent className="p-2 w-full overflow-x-scroll overflow-y-auto">
        <ResponsiveContainer
          // width={width}
          width={4000}
          height="100%"
          // className="overflow-x-scroll overflow-y-auto"
        >
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[30rem] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 0,
                right: 12,
                bottom: 16,
              }}
              barCategoryGap={2}
              // barGap={-32}
              barSize={120}
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
                height={480}
                syncWithTicks
                // overflow="visible"
              />

              {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
              <XAxis
                xAxisId={0}
                dataKey="date"
                orientation="top"
                hide
                interval={7}
                // tickCount={5}
              />

              {/* Duplicate XAxis for the legend. This is the legend shown in the chart */}
              <XAxis
                xAxisId={2}
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={0}
                allowDuplicatedCategory={false}
                orientation="top"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  const formattedDate = date
                    .toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "numeric",
                      month: "numeric",
                    })
                    .toLocaleUpperCase()
                    .replace(",", "");

                  // Split into weekday and date parts
                  const [weekday, datePart] = formattedDate.split(" ");
                  // Split date into month and day, reverse them, and pad with zero if needed
                  const [month, day] = datePart.split("/");
                  const reversedDate = `${day}/${month.padStart(2, "0")}`;

                  return `${weekday} ${reversedDate}`;
                }}
                textAnchor="middle"
                fontWeight={700}
                // tickCount={5}
              />

              {/* This XAxis is the one that shows the time of the day */}
              <XAxis
                xAxisId={1}
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={0}
                minTickGap={4}
                tickCount={2}
                orientation="top"
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
                fontSize={9}
                minTickGap={0}
                orientation="bottom"
                interval={0}
                unit={
                  unitPreferences.windSpeed === "knots"
                    ? "kts"
                    : unitPreferences.windSpeed
                }
                padding={{
                  left: 0,
                  right: 0,
                }}
              />

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
                    </g>
                  ) : (
                    <text x={value.x} y={value.y} dy={1} textAnchor="end">
                      {value.payload.value}
                      {unitPreferences.waveHeight}
                    </text>
                  );
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
                className="w-7 min-w-7"
                barSize={32}
                stackId="a"
              >
                <LabelList
                  dataKey="swellDirection"
                  position="top"
                  fill="#008a93"
                  // content={<RenderCustomizedLabel hasFaceWaveHeight={false} />}
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
                // width={28}
                className="w-7 min-w-7"
                // barSize={32}
                stackId="a"
                // width={28}
                // barSize={32}
              >
                <LabelList
                  dataKey="secondarySwellDirection"
                  position="top"
                  fill="#ffa800"
                  content={({ x, y, value, fill, index }) => {
                    if (typeof index === "undefined") return null;
                    const data = chartData[index];

                    if (data.faceWaveHeight_ft) {
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
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SwellChart;
