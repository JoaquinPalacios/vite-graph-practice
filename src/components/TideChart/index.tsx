import {
  Area,
  AreaChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
} from "recharts";
import { ResponsiveContainer } from "recharts";
import tideData from "@/data/tide-data";
import TideTooltip from "./TideTooltip";
import { TideAreaDot } from "./TideAreaDot";
import { multiFormat } from "@/lib/time-utils";
import { dayTicks, processTimeScaleData } from "@/utils/chart-utils";

interface TideDataItem {
  date: string;
  time: string;
  dateTime: string;
  height: number;
}

/**
 * Tide data for the previous tide
 * This needs to be fixed in the future when real data is fetched.
 * We will need to somehow store the previous tide data
 * and use that to calculate the height at midnight.
 * @todo: Fix this
 */
const previousTide = {
  date: "2024-03-31",
  time: "9:54pm",
  dateTime: "2024-03-31 21:54:00",
  timeStamp: 1711925640,
  height: 1.6,
};

// First tide data
const firstTide = tideData[0];

// Calculate time differences in hours
const previousTideTime = new Date(previousTide.dateTime).getTime();
const firstTideTime = new Date(firstTide.dateTime).getTime();
const midnightTime = new Date(`${firstTide.date} 00:00:00`).getTime();

// Calculate rate of change (meters per hour)
const totalHours = (firstTideTime - previousTideTime) / (1000 * 60 * 60);
const heightChange = firstTide.height - previousTide.height;
const rateOfChange = heightChange / totalHours;

// Calculate hours from previous tide to midnight
const hoursToMidnight = (midnightTime - previousTideTime) / (1000 * 60 * 60);

// Calculate height at midnight
const heightAtMidnight = previousTide.height + rateOfChange * hoursToMidnight;

// Process the data to include timestamps
const processedData = [
  {
    date: firstTide.date,
    time: "12:00am",
    dateTime: `${firstTide.date} 00:00:00`,
    height: heightAtMidnight,
    timestamp: midnightTime,
  },
  ...tideData.map((item: TideDataItem) => ({
    ...item,
    timestamp: new Date(item.dateTime).getTime(),
  })),
];

// Get time scale data
const timeValues = processedData.map((row) => row.timestamp);
const { timeScale } = processTimeScaleData(timeValues);

const TideChart = () => {
  return (
    <ResponsiveContainer width={4848} height="100%" className="h-36 min-h-36">
      <AreaChart
        accessibilityLayer
        data={processedData}
        margin={{
          left: 0,
          right: 0,
          bottom: 16,
        }}
        className="[&>svg]:focus:outline-none"
      >
        <CartesianGrid
          vertical={true}
          horizontal={true}
          verticalFill={[
            "oklch(0.968 0.007 247.896)", // Tailwind slate-200
            "oklch(0.929 0.013 255.508)", // Tailwind slate-300
          ]}
          y={0}
          height={192}
          syncWithTicks
        />

        {/* Background stripes XAxis */}
        <XAxis
          dataKey="timestamp"
          xAxisId={0}
          type="number"
          scale={timeScale}
          domain={timeScale.domain().map((date) => date.valueOf())}
          interval="preserveStart"
          allowDuplicatedCategory={false}
          allowDataOverflow
          hide
          ticks={dayTicks}
          tickFormatter={multiFormat}
          padding={{ left: 12 }}
        />

        <Tooltip content={<TideTooltip />} />

        <Area
          type="monotone"
          dataKey="height"
          stroke="#008a93"
          fill="#008a93"
          connectNulls
          dot={(props) => {
            if (props.key === "dot-0") return <span key={props.key} />;
            return <TideAreaDot {...props} key={props.key} />;
          }}
          isAnimationActive={false}
        />

        <YAxis
          dataKey="height"
          unit="m"
          axisLine={false}
          domain={["dataMin - 0.2", "dataMax + 0.2"]}
          padding={{ top: 32 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TideChart;
