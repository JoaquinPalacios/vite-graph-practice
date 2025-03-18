/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { GiBigWave } from "react-icons/gi";
import { LuWind } from "react-icons/lu";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import chartData from "@/data";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { degreesToCompassDirection } from "@/utils/degrees-to-compass-direction";

export const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    console.log({ payload });
    return (
      <div className="bg-white p-2 rounded-md">
        <h5 className="mb-2">
          {payload[0].payload.time}&nbsp;-&nbsp;
          {new Date(label).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </h5>
        <div className="flex flex-col">
          {payload.map((pld: any) => (
            <>
              <div className="flex gap-1">
                <GiBigWave className="w-3.5 h-3.5" color="#008a93" />
                <p className="font-medium">
                  {pld.value}
                  {pld.unit || "ft"}
                </p>
                <p className="font-medium">
                  {degreesToCompassDirection(pld.payload.swellDirection)}
                </p>
              </div>
              <div className="flex gap-1">
                <LuWind className="w-3.5 h-3.5" color="#008a93" />
                <p className="font-medium">
                  {pld.payload.windSpeed}
                  km/h
                </p>
                <p className="font-medium">
                  {degreesToCompassDirection(pld.payload.windDirection)}
                </p>
              </div>
            </>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const chartConfig = {
  views: {
    label: "Wave height",
  },
  waveHeight: {
    label: "waveHeight",
    color: "hsl(var(--chart-3))",
  },
  swellDirection: {
    label: "swellDirection",
    color: "hsl(var(--chart-1))",
  },
  windDirection: {
    label: "windDirection",
    color: "hsl(var(--chart-2))",
  },
  windSpeed: {
    label: "windSpeed",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

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
              cursor="pointer"
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
}
