import {
  Area,
  AreaChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
} from "recharts";

// import chartData from "@/data";
import { tideChartConfig } from "@/lib/chart-config";
import { ResponsiveContainer } from "recharts";
import { ChartContainer } from "./ui/chart";
import tideData from "@/data/tide-data";

const TideChart = () => {
  return (
    <ResponsiveContainer width={4848} height="100%" className="w-full mt-40">
      <ChartContainer
        config={tideChartConfig}
        className="aspect-auto h-[12.5rem] w-full"
      >
        <AreaChart
          accessibilityLayer
          data={tideData}
          margin={{
            left: 0,
            right: 12,
            bottom: 16,
          }}
        >
          <CartesianGrid
            vertical={true}
            horizontal={true}
            verticalFill={[
              "oklch(0.869 0.022 252.894)",
              "oklch(0.929 0.013 255.508)",
            ]}
            y={0}
            height={480}
            syncWithTicks
          />
          <Area
            type="monotone"
            dataKey="height"
            stroke="#3832a0"
            fill="#8884d8"
            connectNulls
          />

          <Tooltip />

          <XAxis dataKey="date" interval={3} />
          <XAxis dataKey="time" hide />

          <YAxis
            dataKey="height"
            unit="m"
            // tickLine={false}
            axisLine={false}
            // tickMargin={8}
            domain={[0, "dataMax + 0.2"]}
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};

export default TideChart;
