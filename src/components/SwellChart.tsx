import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
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
// import { getWindColor } from "@/utils/color-utils";

const SwellChart = ({
  unitPreferences,
}: // maxWaveHeight,
{
  unitPreferences: UnitPreferences;
  // maxWaveHeight: number;
}) => {
  // const [activeIndex, setActiveIndex] = useState<number | undefined>();
  return (
    <Card className="w-full bg-slate-200 border-slate-700">
      <CardContent className="px-2 sm:p-6">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-96 w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 0,
                right: 12,
                bottom: 16,
              }}
              // className="[&>svg>path]:fill-transparent"
              // onMouseMove={(props) => {
              //   setActiveIndex(props.activeTooltipIndex);
              // }}
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
                overflow="visible"
              />

              {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
              <XAxis
                xAxisId={0}
                dataKey="date"
                orientation="top"
                hide
                interval={7}
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
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                textAnchor="middle"
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
                tickMargin={16}
                minTickGap={0}
                unit={unitPreferences.waveHeight}
                padding={{
                  top: 20,
                }}
                interval="preserveStart"
                overflow="visible"
                type="number"
                // domain={[0, "dataMax"]}
                allowDecimals={false}
                ticks={generateTicks(
                  unitPreferences.waveHeight === "ft"
                    ? Math.max(...chartData.map((d) => d.waveHeight_ft))
                    : Math.max(...chartData.map((d) => d.waveHeight_m)),
                  unitPreferences.waveHeight
                )}
                tick={(value) => {
                  return value.index === 0 ? (
                    <g>
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
                    <text x={value.x} y={value.y} dy={1}>
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
                stackId="a"
                fill="#008a93"
                unit={unitPreferences.waveHeight}
                activeBar={{
                  fill: "#00b4c6",
                }}
              >
                <LabelList
                  dataKey="swellDirection"
                  position="top"
                  fill="#008a93"
                  content={<RenderCustomizedLabel />}
                />
              </Bar>
              <Bar
                dataKey="secondarySwellHeight"
                stackId="a"
                fill="#ffa800"
                unit={unitPreferences.waveHeight}
                activeBar={{
                  fill: "#ffa800",
                }}
              >
                <LabelList
                  dataKey="swellDirection"
                  position="top"
                  fill="#ffa800"
                  content={<RenderCustomizedLabel />}
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
