import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import processSwellData from "./ProcessDataSwell";
import { formatDateTick, generateTicks } from "@/utils/chart-utils";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { ChartDataItem, UnitPreferences } from "@/types";
import { cn } from "@/utils/utils";

const AdvancedSwellChartYAxis = ({
  chartData,
  maxSurfHeight,
  unitPreferences,
}: {
  chartData: ChartDataItem[];
  maxSurfHeight: number;
  unitPreferences: UnitPreferences;
}) => {
  const { isMobile, isLandscapeMobile } = useScreenDetector();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(unitPreferences.showAdvancedChart);
    }, 50);
  }, [unitPreferences.showAdvancedChart]);

  /**
   * Process the swell data to identify events
   * useMemo prevents reprocessing on every render unless chartData changes
   */
  const processedSwellData = useMemo(
    () => processSwellData(chartData),
    [chartData]
  );

  const eventIds = Object.keys(processedSwellData);

  return (
    <ResponsiveContainer
      width={72}
      height={unitPreferences.showAdvancedChart ? "100%" : 0}
      className={cn(
        "tw:mb-0 tw:h-48 tw:min-h-48 tw:max-h-48 tw:transition-[height,min-height] tw:duration-250 tw:ease-out",
        "tw:absolute tw:top-80 tw:left-0 tw:md:left-4 tw:z-10",
        !unitPreferences.showAdvancedChart && "tw:!h-0 tw:min-h-0"
      )}
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        className="tw:[&>svg]:focus:outline-none"
      >
        <CartesianGrid
          vertical={false}
          horizontal={false}
          y={0}
          height={192}
          syncWithTicks
        />

        <XAxis
          dataKey="localDateTimeISO"
          xAxisId={0}
          allowDuplicatedCategory={false}
          allowDataOverflow
          hide
          tickFormatter={formatDateTick}
          padding={{ left: 11, right: 11 }}
          interval={7}
          opacity={0}
        />

        {eventIds.map((eventId, index) => {
          const eventData = processedSwellData[eventId];

          return (
            <Line
              key={index}
              data={eventData} // Data specific to this swell event
              type="monotone"
              dataKey="height"
              name={eventId}
              activeDot={false}
              opacity={0}
            />
          );
        })}

        <YAxis
          type="number"
          domain={[0, "dataMax"]}
          tickMargin={isMobile || isLandscapeMobile ? 20 : 8}
          minTickGap={0}
          interval="preserveEnd"
          allowDecimals={false}
          padding={{ bottom: 16, top: 20 }}
          overflow="visible"
          ticks={generateTicks(maxSurfHeight, "m")}
          unit="m"
          axisLine={false}
          transform="translate(-5, 0)"
          tick={(value: {
            x: number;
            y: number;
            index: number;
            payload: { value: number };
          }) =>
            value.index !== 0 ? (
              <text
                x={value.x - 2}
                y={value.y}
                dy={1}
                textAnchor="end"
                fontSize={12}
                fill="#666"
                fillOpacity={isVisible ? 1 : 0}
                className="y-axis-tick-animation"
              >
                {value.payload.value}m
              </text>
            ) : (
              <text></text>
            )
          }
          className={cn(
            "advance-y-axis tw:transition-opacity tw:ease-in tw:duration-300 tw:delay-150",
            isVisible && "tick-visible"
          )}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AdvancedSwellChartYAxis;
