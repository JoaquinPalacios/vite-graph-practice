import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { GiBigWave } from "react-icons/gi";
import { useMemo } from "react";
import processSwellData from "./ProcessDataSwell";
import { formatDateTick, generateTicks } from "@/utils/chart-utils";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { ChartDataItem, UnitPreferences } from "@/types";

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
      width={60}
      height="100%"
      className="tw:mb-0 tw:absolute tw:top-80 tw:left-0 tw:md:left-4 tw:z-10 tw:h-48 tw:min-h-48 tw:max-h-48"
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          bottom: 12,
          left: 11,
        }}
        className="tw:[&>svg]:focus:outline-none"
      >
        <CartesianGrid
          vertical={true}
          horizontal={true}
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
          padding={{ left: 14, right: 14 }}
          interval={7}
        />

        <YAxis
          type="number"
          domain={[0, "dataMax"]}
          tickMargin={isMobile || isLandscapeMobile ? 20 : 8}
          minTickGap={0}
          interval="preserveStart"
          allowDecimals={false}
          padding={{ bottom: 16, top: 20 }}
          overflow="visible"
          opacity={0}
          ticks={generateTicks(
            maxSurfHeight,
            unitPreferences.units.surfHeight === "ft" ? "ft" : "m"
          )}
          unit={unitPreferences.units.surfHeight}
          tickLine={false}
          axisLine={false}
          tick={(value: {
            x: number;
            y: number;
            index: number;
            payload: { value: number };
          }) => {
            return value.index === 0 ? (
              <GiBigWave
                className="tw:w-6 tw:h-6"
                x={value.x - 30}
                y={value.y - 20}
                size={20}
                color="#666"
              />
            ) : (
              <text
                x={value.x - 11}
                y={value.y}
                dy={1}
                textAnchor="end"
                fontSize={12}
                fill="#666"
              >
                {value.payload.value}m
              </text>
            );
          }}
          className="tw:transition-opacity tw:ease-in-out tw:duration-200"
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
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AdvancedSwellChartYAxis;
