import {
  Area,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  ComposedChart,
} from "recharts";
import { ResponsiveContainer } from "recharts";
import TideTooltip from "./TideTooltip";
import { multiFormat } from "@/lib/time-utils";
import { processTimeScaleData, generateTideTicks } from "@/utils/chart-utils";
import { TideDataFromDrupal } from "@/types";

const TideChartYAxis = ({ tideData }: { tideData: TideDataFromDrupal[] }) => {
  if (!tideData || tideData.length === 0) {
    return null;
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
  const firstTideLocalTime = firstTide._source.time_local;
  const firstTideHeight = parseFloat(firstTide._source.value);

  // Calculate time differences in hours
  const previousTideTime = new Date(previousTide.dateTime).getTime();
  const firstTideTime = new Date(firstTideLocalTime).getTime();
  const firstTideDate = firstTideLocalTime.split("T")[0];
  const midnightTime = new Date(`${firstTideDate}T00:00:00.000Z`).getTime();

  // Calculate rate of change (meters per hour)
  const totalHours = (firstTideTime - previousTideTime) / (1000 * 60 * 60);
  const heightChange = firstTideHeight - previousTide.height;
  const rateOfChange = heightChange / totalHours;

  // Calculate hours from previous tide to midnight
  const hoursToMidnight = (midnightTime - previousTideTime) / (1000 * 60 * 60);

  // Calculate height at midnight
  const heightAtMidnight = previousTide.height + rateOfChange * hoursToMidnight;

  // Process the data to include timestamps
  const processedData = [
    {
      date: firstTideDate,
      time: "12:00am",
      dateTime: `${firstTideDate}T00:00:00.000Z`,
      height: heightAtMidnight,
      timestamp: midnightTime,
    },
    ...tideData.map((item) => ({
      date: item._source.time_local.split("T")[0],
      time: new Date(item._source.time_local).toLocaleTimeString(),
      dateTime: item._source.time_local,
      height: parseFloat(item._source.value),
      timestamp: new Date(item._source.time_local).getTime(),
      instance: item._source.instance,
    })),
  ];

  // Get time scale data
  const timeValues = processedData.map((row) => row.timestamp);
  const { timeScale } = processTimeScaleData(timeValues);

  // Find the maximum height in the data
  const maxHeight = Math.max(...processedData.map((item) => item.height));

  return (
    <ResponsiveContainer
      width={60}
      height="100%"
      className="tw:h-36 tw:min-h-36 tw:max-h-36 tw:absolute tw:bottom-0 tw:left-0 tw:md:left-4 tw:z-20"
    >
      <ComposedChart
        accessibilityLayer
        data={processedData}
        margin={{
          bottom: 16,
          left: 0,
        }}
        className="tw:[&>svg]:focus:outline-none"
        width={60}
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
          syncWithTicks
          width={60}
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
          // ticks={dayTicks}
          tickFormatter={multiFormat}
          padding={{ left: 12 }}
        />

        <Tooltip content={<TideTooltip />} />

        <Area
          type="monotone"
          dataKey="height"
          stroke="#008a93"
          fill="#008a93"
          isAnimationActive={false}
        />

        <YAxis
          dataKey="height"
          unit="m"
          axisLine={false}
          domain={[0, "dataMax"]}
          padding={{ top: 32 }}
          fontSize={12}
          allowDecimals={true}
          ticks={generateTideTicks(maxHeight)}
          interval={0}
          tickCount={Math.ceil(maxHeight * 2) + 1}
          tick={(value) => {
            // Skip rendering the first tick (0m)
            if (value.index === 0) {
              return <text></text>;
            }

            const isWholeNumber = Number.isInteger(value.payload.value);
            return (
              <text
                x={value.x}
                y={value.y}
                dy={1}
                textAnchor="end"
                fontSize={12}
                fill="#666"
              >
                {isWholeNumber
                  ? `${value.payload.value}m`
                  : `${value.payload.value.toFixed(1)}m`}
              </text>
            );
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default TideChartYAxis;
