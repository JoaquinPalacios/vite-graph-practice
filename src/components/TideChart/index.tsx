import {
  Area,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  // AreaChart,
  Bar,
  ComposedChart,
} from "recharts";
import { ResponsiveContainer } from "recharts";
import TideTooltip from "./TideTooltip";
import {
  formatDateTick,
  getChartWidth,
  generateTideTicks,
  // interpolateTideData,
  // transformTideData,
} from "@/utils/chart-utils";
import { ChartDataItem, TideDataFromDrupal } from "@/types";
import { useMemo } from "react";
import { trimToCompleteDays } from "@/lib/data-processing";
import { TideAreaDot } from "./TideAreaDot";

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

interface MasterBackgroundPoint extends ChartDataItem {
  localDateTimeISO: string;
  utcDateTimeISO: string;
}

export const TideChart = ({
  tideData,
  swellData,
  length,
}: {
  tideData: TideDataFromDrupal[];
  swellData: ChartDataItem[];
  length: number;
}) => {
  // Transform tide data to match the required format
  const transformedData = useMemo(() => {
    if (!tideData?.length) return [];

    // Find the last tide before midnight and the first tide after midnight
    const prevTide = tideData[0];
    const nextTide = tideData[1];

    const prevTime = new Date(prevTide._source.time_local).getTime();
    const nextTime = new Date(nextTide._source.time_local).getTime();
    const prevHeight = parseFloat(prevTide._source.value);
    const nextHeight = parseFloat(nextTide._source.value);

    // Calculate midnight for the date of the next tide in the same timezone as the tide data
    const nextTideLocal = nextTide._source.time_local;
    const localDate = nextTideLocal.split("T")[0];
    const localOffset = nextTideLocal.slice(19); // e.g., '+10:00'
    const midnightISO = `${localDate}T00:00:00${localOffset}`;
    const midnightTime = new Date(midnightISO).getTime();

    // Calculate time differences in minutes
    const totalMinutes = (nextTime - prevTime) / (1000 * 60);
    const minutesToMidnight = (midnightTime - prevTime) / (1000 * 60);

    // Linear interpolation for midnight value
    const ratio = minutesToMidnight / totalMinutes;
    const midnightHeight = prevHeight + (nextHeight - prevHeight) * ratio;

    // Replace the first tide after midnight with the midnight value
    const newFirst = {
      height: midnightHeight,
      timestamp: midnightTime,
      localDateTimeISO: midnightISO,
      utcDateTimeISO: midnightISO,
    };

    // The rest of the tides (after midnight)
    const rest = tideData.slice(1).map((point) => ({
      height: parseFloat(point._source.value),
      timestamp: new Date(point._source.time_local).getTime(),
      localDateTimeISO: point._source.time_local,
      utcDateTimeISO: point._source.time_local,
    }));

    return [newFirst, ...rest];
  }, [tideData]);

  console.log({ transformedData });

  const trimmedSwellData = trimToCompleteDays(swellData);
  let lastAllowedDate: string | null = null;
  if (trimmedSwellData.length > 0) {
    const lastItem = trimmedSwellData[trimmedSwellData.length - 1];
    lastAllowedDate = new Date(lastItem.localDateTimeISO)
      .toISOString()
      .split("T")[0];
  }

  const masterBackgroundTimeline = useMemo((): MasterBackgroundPoint[] => {
    if (!swellData?.length && !transformedData?.length) {
      // If no data at all, return empty. If only one exists, base range on that.
      if (!swellData?.length && transformedData?.length === 0) return [];
      if (swellData?.length === 0 && !transformedData?.length) return [];
    }

    let earliestTimestamp = Infinity;
    let latestTimestamp = -Infinity;
    let sampleLocalISOWithOffset: string | undefined = undefined;

    swellData?.forEach((item) => {
      const date = new Date(item.localDateTimeISO); // Assumes this is a valid ISO with offset or UTC
      earliestTimestamp = Math.min(earliestTimestamp, date.getTime());
      latestTimestamp = Math.max(latestTimestamp, date.getTime());
      if (
        !sampleLocalISOWithOffset &&
        (item.localDateTimeISO.includes("+") ||
          item.localDateTimeISO.includes("-") ||
          item.localDateTimeISO.endsWith("Z"))
      ) {
        sampleLocalISOWithOffset = item.localDateTimeISO;
      }
    });

    transformedData?.forEach((item) => {
      // item.timestamp is UTC epoch. item.localDateTimeISO has the local string
      earliestTimestamp = Math.min(earliestTimestamp, item.timestamp);
      latestTimestamp = Math.max(latestTimestamp, item.timestamp);
      if (
        !sampleLocalISOWithOffset &&
        (item.localDateTimeISO.includes("+") ||
          item.localDateTimeISO.includes("-") ||
          item.localDateTimeISO.endsWith("Z"))
      ) {
        sampleLocalISOWithOffset = item.localDateTimeISO;
      }
    });

    if (earliestTimestamp === Infinity || !sampleLocalISOWithOffset) {
      // Fallback if no offset could be determined or no data
      // Try to use swellData as primary source for timeline structure if transformedData is missing/malformed
      if (swellData?.length && !sampleLocalISOWithOffset) {
        sampleLocalISOWithOffset = swellData[0].localDateTimeISO; // Take first available
      } else if (!sampleLocalISOWithOffset) {
        console.warn(
          "MasterBackgroundTimeline: Could not determine a reliable local timezone offset."
        );
        return []; // Cannot reliably construct local time slots
      }
    }

    // Determine the local start date (12 AM)
    const startDate = new Date(earliestTimestamp); // This is a UTC Date object
    const startDateLocaleString = startDate.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }); // YYYY-MM-DD

    const offsetMatchTimeline =
      sampleLocalISOWithOffset.match(/[+-]\d{2}:\d{2}|Z$/);
    const timelineOffset = offsetMatchTimeline
      ? offsetMatchTimeline[0]
      : "+00:00"; // Default to UTC if somehow lost

    const firstDayLocalMidnightISO = `${startDateLocaleString}T00:00:00${timelineOffset}`;
    let currentLocalTime = new Date(firstDayLocalMidnightISO).getTime();

    // Set finalLoopEndDate to the end of the last allowed day (23:59:59.999 local time)
    let finalLoopEndDate;
    if (lastAllowedDate) {
      finalLoopEndDate = new Date(
        `${lastAllowedDate}T23:59:59.999${timelineOffset}`
      );
    } else {
      finalLoopEndDate = new Date(); // fallback
    }

    const timeline: MasterBackgroundPoint[] = [];
    const swellMap = new Map<string, ChartDataItem>(); // Key: localDateTimeISO string (YYYY-MM-DDTHH:MM:SS+Offset)
    swellData?.forEach((item) => {
      swellMap.set(item.localDateTimeISO, item);
    });

    const MAX_ITERATIONS = (length > 0 ? length + 5 : 15) * 8; // Safety break, e.g. (16+5)*8
    let iterations = 0;

    while (
      currentLocalTime <= finalLoopEndDate.getTime() &&
      iterations < MAX_ITERATIONS
    ) {
      const currentDateObj = new Date(currentLocalTime);
      const currentDateISO = currentDateObj.toISOString().split("T")[0];
      if (lastAllowedDate && currentDateISO > lastAllowedDate) {
        break;
      }
      // Format currentLocalTime into "YYYY-MM-DDTHH:MM:SS+HH:MM" using the determined timelineOffset
      const year = currentDateObj.getFullYear();
      const month = (currentDateObj.getMonth() + 1).toString().padStart(2, "0");
      const day = currentDateObj.getDate().toString().padStart(2, "0");
      const hours = currentDateObj.getHours().toString().padStart(2, "0");
      const minutes = currentDateObj.getMinutes().toString().padStart(2, "0");
      const seconds = currentDateObj.getSeconds().toString().padStart(2, "0");
      const currentSlotLocalISO = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timelineOffset}`;

      const swellPoint = swellMap.get(currentSlotLocalISO);

      timeline.push({
        localDateTimeISO: currentSlotLocalISO,
        utcDateTimeISO: currentDateObj.toISOString(), // UTC equivalent
        // Populate with swell data if found, otherwise defaults/nulls from ChartDataItem
        wind: swellPoint?.wind || {
          direction: null,
          speedKmh: null,
          speedKnots: null,
        },
        primary: swellPoint?.primary || {
          fullSurfHeightFeet: null,
          totalSigHeight: null,
          direction: null,
        },
        secondary: swellPoint?.secondary, // These can be undefined if optional in ChartDataItem
        trainData: swellPoint?.trainData,
      });

      currentLocalTime += 3 * 60 * 60 * 1000; // Add 3 hours
      iterations++;
    }

    if (iterations >= MAX_ITERATIONS) {
      console.warn(
        "MasterBackgroundTimeline: Max iterations reached. Timeline may be incomplete."
      );
    }

    return timeline;
  }, [swellData, transformedData, length]);

  if (!transformedData.length && !masterBackgroundTimeline.length) {
    // Or just !masterBackgroundTimeline.length if it's the primary driver
    console.warn("TideChart: No valid data available to render.");
    return null;
  }
  if (!masterBackgroundTimeline.length) {
    console.warn(
      "TideChart: Master background timeline is empty. Stripes and X-axis might not render correctly."
    );
    // Decide if you want to return null or try to render with only transformedData (which won't have stripes)
    return null;
  }

  if (!transformedData.length) {
    console.warn("TideChart: No valid tide data available");
    return null;
  }

  console.log(
    "Master Background Timeline (for Chart and X-Axes):",
    masterBackgroundTimeline
  );

  console.log("Tide Chart length: ", length);

  // Generate explicit day ticks for debugging
  const dayTicks = masterBackgroundTimeline
    .filter((item, idx, arr) => {
      const date = item.localDateTimeISO.split("T")[0];
      return idx === 0 || date !== arr[idx - 1].localDateTimeISO.split("T")[0];
    })
    .map((item) => item.localDateTimeISO);

  return (
    <ResponsiveContainer
      width={getChartWidth(length, 256, 60)}
      height="100%"
      className="tw:h-36 tw:min-h-36"
    >
      <ComposedChart
        accessibilityLayer
        data={masterBackgroundTimeline}
        margin={{
          bottom: 16,
          // left: 16,
        }}
        className="tw:[&>svg]:focus:outline-none"
      >
        <CartesianGrid
          vertical={true}
          horizontal={false}
          verticalFill={[
            "oklch(0.968 0.007 247.896)", // Tailwind slate-200
            "oklch(0.929 0.013 255.508)", // Tailwind slate-300
          ]}
          y={0}
          height={144}
          syncWithTicks
          scale="time"
        />
        {/* Tide Area Chart */}
        <Area
          type="monotone"
          data={transformedData}
          dataKey="height"
          stroke="#008a93"
          fill="#008a93"
          connectNulls
          dot={(props: DotProps) => {
            if (!props.payload.localDateTimeISO || props.key === "dot-0")
              return <span key={props.key} />;

            const isOriginalPoint = transformedData.some(
              (item) => item.localDateTimeISO === props.payload.localDateTimeISO
            );

            if (isOriginalPoint) {
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

        {/* Background XAxis for stripes */}
        <XAxis dataKey="localDateTimeISO" xAxisId={0} interval={7} hide />

        {/* Debug XAxis for day boundaries */}
        <XAxis
          dataKey="localDateTimeISO"
          xAxisId={99}
          ticks={dayTicks}
          orientation="bottom"
          tickLine={true}
          axisLine={true}
          fontSize={14}
          stroke="#ff0000"
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
        />

        {/* XAxis for the calendar date */}
        <XAxis
          dataKey="localDateTimeISO"
          xAxisId={1}
          tickLine={false}
          axisLine={false}
          orientation="top"
          tickFormatter={formatDateTick}
          fontSize={12}
          fontWeight={700}
          allowDuplicatedCategory={false}
          textAnchor="middle"
          ticks={
            masterBackgroundTimeline
              .reduce((acc: string[], curr) => {
                const date = new Date(curr.localDateTimeISO)
                  .toISOString()
                  .split("T")[0];
                // Only keep the first occurrence of each date
                if (
                  !acc.some(
                    (existingDate) =>
                      new Date(existingDate).toISOString().split("T")[0] ===
                      date
                  )
                ) {
                  acc.push(curr.localDateTimeISO);
                }
                return acc;
              }, [])
              .slice(1) // TODO - We remove the first tick due to being duplicated. We have to revise if this happens due to the time difference between the local time and UTC time.
          }
        />

        <Tooltip content={<TideTooltip />} isAnimationActive={false} />

        <Bar
          // data={masterBackgroundTimeline}
          dataKey="primary.fullSurfHeightMetres"
          stroke="#931100"
          fill="#931800"
          opacity={0.3}
          // connectNulls
        />

        <YAxis
          dataKey="height"
          unit="m"
          axisLine={false}
          tickLine={false}
          domain={[0, "dataMax"]}
          padding={{ top: 32 }}
          interval={0}
          allowDecimals={true}
          ticks={generateTideTicks(
            Math.max(...transformedData.map((item) => item.height))
          )}
          tick={() => {
            return <text></text>;
          }}
          opacity={0}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default TideChart;
