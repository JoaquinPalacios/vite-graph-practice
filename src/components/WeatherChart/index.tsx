import { useScreenDetector } from "@/hooks/useScreenDetector";
import { formatDateTick, getChartWidth } from "@/lib/charts";
import { UnitPreferences, WeatherData } from "@/types";
import { cn } from "@/utils/utils";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WeatherBubble } from "./WeatherBubble";

type ScatterShapeProps = {
  cx?: number;
  cy?: number;
  payload?: WeatherData;
  index?: number;
};

// Convert Celsius to Fahrenheit
const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32;
};

const WeatherChart = ({
  weatherData,
  unitPreferences,
}: {
  weatherData: WeatherData[];
  unitPreferences: UnitPreferences;
}) => {
  const { isMobile, isLandscapeMobile } = useScreenDetector();

  const isFahrenheit = unitPreferences.units.temperature === "fahrenheit";

  // Convert temperature data based on unit preference
  const convertedWeatherData = useMemo(() => {
    if (!isFahrenheit) {
      return weatherData;
    }

    return weatherData.map((data) => ({
      ...data,
      currentTemp: data.currentTemp
        ? celsiusToFahrenheit(data.currentTemp)
        : data.currentTemp,
    }));
  }, [weatherData, isFahrenheit]);

  // Add index property to each data point
  const weatherDataWithIndex = convertedWeatherData.map((d, i) => ({
    ...d,
    index: i,
  }));
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <ResponsiveContainer
      width={getChartWidth(
        weatherData.length,
        256,
        isMobile || isLandscapeMobile ? 44 : 60
      )}
      height="100%"
      className={cn(
        "weather-chart tw:h-16 tw:min-h-16 tw:max-h-16 tw:relative",
        "tw:after:absolute tw:after:z-0 tw:after:h-16 tw:after:w-[calc(100%-3.75rem)] tw:after:sm:w-[calc(100%-4.75rem)] tw:after:top-0 tw:after:left-[3.75rem] tw:after:sm:left-[4.75rem] tw:after:border-y tw:after:border-gray-400/80 tw:after:pointer-events-none"
      )}
    >
      <ScatterChart
        data={weatherDataWithIndex}
        margin={{
          left: 0,
          right: 0,
          bottom: 16,
          top: 0,
        }}
        className="tw:[&>svg]:focus:outline-none"
        syncId="swellnet"
      >
        <CartesianGrid
          vertical={true}
          horizontal={false}
          verticalFill={[
            "oklch(96.7% 0.003 264.542)", // Tailwind gray-100
            "#eceef1", // Tailwind gray-150
          ]}
          y={0}
          height={64}
          syncWithTicks
        />

        {/* Background stripes XAxis */}
        <XAxis
          dataKey="localDateTimeISO"
          xAxisId={0}
          hide
          allowDataOverflow
          tickFormatter={formatDateTick}
          allowDuplicatedCategory={false}
          interval={7}
        />

        <Scatter
          dataKey="weatherId"
          shape={(props: ScatterShapeProps) => (
            <WeatherBubble {...props} isHover={hoverIndex === props.index} />
          )}
          overflow="visible"
          onMouseEnter={(_, index) => {
            setHoverIndex(index);
          }}
          onMouseLeave={() => {
            setHoverIndex(null);
          }}
          className="tw:transition-all tw:duration-300"
        />

        <Tooltip
          cursor={false}
          content={() => <span className="tw:sr-only">.</span>}
          trigger="hover"
          isAnimationActive={false}
        />

        <YAxis
          dataKey={() => 1}
          height={0}
          width={isMobile || isLandscapeMobile ? 44 : 60}
          domain={[1, 1]}
          padding={{ bottom: 16 }}
          opacity={0}
          tickLine={false}
          axisLine={false}
          type="number"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;
