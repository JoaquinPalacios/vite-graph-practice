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
import { generateFootTicks } from "@/utils/chart-utils";
import RenderCustomAxisTick from "./RenderCustomAxisTick";

const SwellChart = ({
  unitPreferences,
  maxWaveHeight,
}: {
  unitPreferences: UnitPreferences;
  maxWaveHeight: number;
}) => {
  // const [activeIndex, setActiveIndex] = useState<number | undefined>();
  return (
    <Card className="w-full bg-slate-200 border-slate-700">
      <CardContent className="px-2 sm:p-6">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
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
                  "oklch(0.869 0.022 252.894)",
                  "oklch(0.929 0.013 255.508)",
                ]}
                y={0}
                height={280}
                // syncWithTicks
                verticalPoints={[
                  0, 84, 274, 464, 654, 844, 1034, 1224, 1414, 1604,
                ]}
              />

              {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
              <XAxis
                xAxisId={0}
                dataKey="date"
                // minTickGap={100}
                orientation="top"
                hide
              />

              {/* Duplicate XAxis for the legend. This is the legend shown in the chart */}
              <XAxis
                xAxisId={2}
                offset={0}
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={0}
                tickCount={5}
                allowDuplicatedCategory={false}
                orientation="top"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
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
              <XAxis
                xAxisId={3}
                dataKey="windDirection"
                tickLine={false}
                axisLine={false}
                tickMargin={0}
                minTickGap={0}
                orientation="bottom"
                tick={<RenderCustomAxisTick />}
                interval={0}
                padding={{
                  left: 0,
                  right: 0,
                }}
              />

              <YAxis
                tickLine={true}
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
                domain={[0, maxWaveHeight]}
                allowDecimals={false}
                ticks={generateFootTicks(maxWaveHeight)}
              />
              <ChartTooltip
                content={<CustomTooltip unitPreferences={unitPreferences} />}
              />
              <Bar
                dataKey={(d) =>
                  unitPreferences.waveHeight === "ft"
                    ? d.waveHeight / 0.3048
                    : d.waveHeight
                }
                fill="#008a93"
                unit={unitPreferences.waveHeight}
                activeBar={{
                  fill: "#00b4c6",
                }}
                // label={({ index }) => {
                //   return (
                //     <RenderCustomizedLabel
                //       fill={activeIndex === index ? "#00b4c6" : "#008a93"}
                //     />
                //   );
                // }}
              >
                <LabelList
                  dataKey="swellDirection"
                  position="top"
                  fill="#008a93"
                  // fill={activeIndex === index ? "#00b4c6" : "#008a93"}
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
