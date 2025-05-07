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
// import { multiFormat } from "@/lib/time-utils";
import {
  dayTicks,
  processTimeScaleData,
  interpolateTideData,
} from "@/utils/chart-utils";

interface DotProps {
  cx: number;
  cy: number;
  value: number;
  key: string;
  payload: {
    height: number;
    timestamp: number;
    localDateTimeISO: string;
    time?: string;
    utcDateTimeISO: string;
  };
}

/**
 * Tide data for the previous tide
 * This needs to be fixed in the future when real data is fetched.
 * We will need to somehow store the previous tide data
 * and use that to calculate the height at midnight.
 * @todo: Fix this
 */
const previousTide = {
  localDateTimeISO: "2024-03-31T21:54:00+11:00",
  height: 1.6,
};

// First tide data
const firstTide = tideData[0];

// Calculate time differences in hours
const previousTideTime = new Date(previousTide.localDateTimeISO).getTime();
const firstTideTime = new Date(firstTide.localDateTimeISO).getTime();
const midnightTime = new Date(
  firstTide.localDateTimeISO.split("T")[0] + "T00:00:00+11:00"
).getTime();

// Calculate rate of change (meters per hour)
const totalHours = (firstTideTime - previousTideTime) / (1000 * 60 * 60);
const heightChange = firstTide.height - previousTide.height;
const rateOfChange = heightChange / totalHours;

// Calculate hours from previous tide to midnight
const hoursToMidnight = (midnightTime - previousTideTime) / (1000 * 60 * 60);

// Calculate height at midnight
const heightAtMidnight = previousTide.height + rateOfChange * hoursToMidnight;

// Process the data to include timestamps
const baseData = [
  {
    height: heightAtMidnight,
    timestamp: midnightTime,
    localDateTimeISO:
      firstTide.localDateTimeISO.split("T")[0] + "T00:00:00+11:00",
    utcDateTimeISO: new Date(
      firstTide.localDateTimeISO.split("T")[0] + "T00:00:00+11:00"
    ).toISOString(),
  },
  ...tideData.map((item) => ({
    ...item,
    timestamp: new Date(item.localDateTimeISO).getTime(),
    utcDateTimeISO: item.utcDateTimeISO,
  })),
];

// Interpolate data for every 3 minutes
const processedData = interpolateTideData(baseData);

// Get time scale data
const timeValues = processedData.map((row) => row.timestamp);
const { timeScale } = processTimeScaleData(timeValues);

const TideChart = () => {
  return (
    <ResponsiveContainer
      width={4848}
      height="100%"
      className="tw:h-36 tw:min-h-36"
    >
      <AreaChart
        accessibilityLayer
        data={processedData}
        margin={{
          bottom: 16,
        }}
        className="tw:[&>svg]:focus:outline-none"
      >
        <CartesianGrid
          vertical={true}
          horizontal={true}
          verticalFill={[
            "oklch(0.968 0.007 247.896)", // Tailwind slate-200
            "oklch(0.929 0.013 255.508)", // Tailwind slate-300
          ]}
          y={0}
          height={144}
          width={300}
          widths={300}
          // syncWithTicks
        />

        {/* Background stripes XAxis */}
        <XAxis
          dataKey="timestamp"
          xAxisId={0}
          type="number"
          scale={timeScale}
          domain={timeScale.domain().map((date) => date.valueOf())}
          interval={"preserveStart"}
          allowDuplicatedCategory={false}
          allowDataOverflow
          hide
          ticks={dayTicks}
          // tickFormatter={multiFormat}
          padding={{ left: 19 }}
          width={300}
        />

        {/* Background stripes XAxis */}
        {/* <XAxis
          dataKey="timestamp"
          xAxisId={1}
          type="number"
          scale={timeScale}
          domain={timeScale.domain().map((date) => date.valueOf())}
          interval="preserveStart"
          allowDuplicatedCategory={false}
          allowDataOverflow
          hide
          ticks={dayTicks}
          tickFormatter={multiFormat}
          padding={{ left: 19 }}
        /> */}

        <Tooltip content={<TideTooltip />} isAnimationActive={false} />

        <Area
          type="monotone"
          dataKey="height"
          stroke="#008a93"
          fill="#008a93"
          connectNulls
          dot={(props: DotProps) => {
            // Only show dots for original data points, not interpolated ones
            if (!props.payload.localDateTimeISO || props.key === "dot-0")
              return <span key={props.key} />;
            const isOriginalPoint = tideData.some(
              (item) => item.localDateTimeISO === props.payload.localDateTimeISO
            );
            if (isOriginalPoint) {
              // Add the time property expected by TideAreaDot
              const dotProps = {
                ...props,
                payload: {
                  ...props.payload,
                  time: props.payload.localDateTimeISO,
                },
              };
              return <TideAreaDot {...dotProps} key={props.key} />;
            }
            return <span key={props.key} />;
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
