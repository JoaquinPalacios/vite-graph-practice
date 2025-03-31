import { Area, AreaChart, CartesianGrid, YAxis, XAxis } from "recharts";

import { tideChartConfig } from "@/lib/chart-config";
import { ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "./ui/chart";
import tideData from "@/data/tide-data";
import CustomTideTooltip from "./CustomTideTooltip";
import { formatDateTick } from "@/lib/utils";
import { CustomTideAreaDot } from "./CustomTideAreaDot";

const TideChart = () => {
  return (
    <ResponsiveContainer width={4848} height="100%">
      <ChartContainer
        config={tideChartConfig}
        className="aspect-auto h-36 w-full"
      >
        <AreaChart
          accessibilityLayer
          data={tideData}
          margin={{
            left: 0,
            right: 12,
            bottom: 16,
          }}
          //   syncId="swellnet"
        >
          <CartesianGrid
            vertical={true}
            horizontal={true}
            verticalFill={[
              "oklch(0.869 0.022 252.894)",
              "oklch(0.929 0.013 255.508)",
            ]}
            y={0}
            height={200}
            syncWithTicks
          />

          {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
          <XAxis xAxisId={0} dataKey="date" hide interval={3} />

          {/* Duplicate XAxis for the legend. This is the legend shown in the chart */}
          <XAxis
            xAxisId={1}
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={0}
            allowDuplicatedCategory={false}
            tickFormatter={formatDateTick}
            textAnchor="middle"
            fontWeight={700}
          />

          <ChartTooltip content={<CustomTideTooltip />} />

          <Area
            type="monotone"
            dataKey="height"
            stroke="#008a93"
            fill="#008a93"
            connectNulls
            dot={(props) => {
              return <CustomTideAreaDot {...props} key={props.key} />;
            }}
          />

          <YAxis
            dataKey="height"
            unit="m"
            axisLine={false}
            domain={[0, "dataMax + 0.2"]}
            padding={{ top: 24 }}
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};

export default TideChart;
