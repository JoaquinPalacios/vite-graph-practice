import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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
const SwellChart = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  console.log({ unitPreferences });
  return (
    <Card className="w-full bg-slate-200 border-slate-700">
      <CardContent className="px-2 sm:p-6">
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
              // verticalPoints={[
              //   100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
              // ]}

              syncWithTicks
            />

            {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
            <XAxis
              xAxisId={0}
              // offset={10}
              dataKey="date"
              // tickLine={false}
              // axisLine={false}
              // tickMargin={0}
              minTickGap={100}
              // tickCount={0}
              orientation="top"
              // tickFormatter={(value) => {
              //   const date = new Date(value);
              //   return date.toLocaleDateString("en-US", {
              //     month: "short",
              //     day: "numeric",
              //   });
              // }}
              hide
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

            {/* Duplicate XAxis for the legend. This is the legend shown in the chart */}
            <XAxis
              xAxisId={2}
              offset={10}
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={0}
              minTickGap={160}
              tickCount={8}
              orientation="top"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <YAxis
              tickLine={true}
              axisLine={false}
              tickMargin={8}
              minTickGap={0}
              unit="ft"
              padding={{
                top: 20,
              }}
              interval={"preserveStart"}
              overflow="visible"
            />
            <ChartTooltip content={<CustomTooltip />} />
            <Bar
              dataKey="waveHeight"
              fill="#008a93"
              activeBar={{ fill: "#00b4c6" }}
              unit="ft"
            >
              <LabelList
                dataKey="swellDirection"
                position="top"
                fill="#008a93"
                content={<RenderCustomizedLabel />}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SwellChart;
