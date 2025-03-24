import { Area, AreaChart, CartesianGrid, YAxis, XAxis } from "recharts";

import chartData from "@/data";
import { chartConfig } from "@/lib/chart-config";
import { ResponsiveContainer } from "recharts";
import { ChartContainer } from "./ui/chart";

const TideChart = () => {
  return (
    <ResponsiveContainer width={4848} height="100%" className="w-full mt-40">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[12.5rem] w-full"
      >
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 0,
            right: 12,
            bottom: 16,
          }}
        >
          <CartesianGrid vertical={false} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
          />

          <XAxis dataKey="date" />
          <YAxis dataKey="value" />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};

export default TideChart;
