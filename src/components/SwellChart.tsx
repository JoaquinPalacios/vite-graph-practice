import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import chartData from "@/data";

const chartConfig = {
  views: {
    label: "Wave height",
  },
  swellDirection: {
    label: "swellDirection",
    color: "hsl(var(--chart-1))",
  },
  windDirection: {
    label: "windDirection",
    color: "hsl(var(--chart-2))",
  },
  waveHeight: {
    label: "waveHeight",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

/* eslint-disable @typescript-eslint/no-explicit-any */
const RenderCustomizedLabel = (props: any) => {
  const { x, y, value } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      y={y - 20}
      x={x}
      height={16}
      width={16}
      fill="#008a93"
    >
      <path
        d="M14.13 9.11h-12l6-7 6 7z"
        transform={`rotate(${value}, 0, 0)`}
        style={{
          transformOrigin: "center",
        }}
      />
      <path
        d="M6.12 8h4v6h-4z"
        transform={`rotate(${value}, 0, 0)`}
        style={{
          transformOrigin: "center",
        }}
      />
    </svg>
  );
};

export function SwellChart() {
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
              // verticalCoordinatesGenerator={() => {
              //   const arr = chartData.map((item) => item.date);
              //   return arr.map((item) => new Date(item).getTime());
              // }}
              y={0}
              height={280}
            />

            <XAxis
              xAxisId={0}
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={0}
              minTickGap={4}
              tickCount={2}
              orientation="top"

              // allowDuplicatedCategory={false}
            />
            <XAxis
              xAxisId={1}
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
              // ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              unit="ft"
              padding={{
                top: 20,
              }}
              interval={"preserveStart"}
              overflow="visible"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px] bg-white"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey="waveHeight"
              fill="#008a93"
              cursor="pointer"
              activeBar={{ fill: "#00b4c6" }}
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
}
