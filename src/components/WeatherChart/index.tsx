import { CartesianGrid, YAxis, XAxis, ScatterChart, Scatter } from "recharts";
import { scaleTime } from "d3-scale";
import { ResponsiveContainer } from "recharts";
import { weatherData } from "@/data/weatherData";
import { multiFormat } from "@/lib/time-utils";
import { processTimeData } from "@/lib/time-utils";
import WeatherBubble from "./WeatherBubble";

const convertTo24Hour = (time: string) => {
  const [hours, period] = time.match(/(\d+)([ap]m)/i)?.slice(1) || [];
  if (!hours || !period) return time;
  let hour = parseInt(hours);
  if (period.toLowerCase() === "pm" && hour !== 12) hour += 12;
  if (period.toLowerCase() === "am" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:00`;
};

// Process the weather data
const { processedData, dayTicks } = processTimeData(
  weatherData.map((item) => ({
    ...item,
    dateTime: `${item.date} ${convertTo24Hour(item.time)}`,
    timestamp: new Date(`${item.date} ${convertTo24Hour(item.time)}`).getTime(),
  }))
);

// Get the start and end timestamps
const timeValues = processedData.map((row) => row.timestamp);
const startTimestamp = Math.min(...timeValues);
const endTimestamp = Math.max(...timeValues);

// Create Date objects for the start and end of the day
const startDateObj = new Date(startTimestamp);
const endDateObj = new Date(endTimestamp);

// Set start date to beginning of day (00:00:00)
startDateObj.setDate(startDateObj.getDate());
startDateObj.setHours(0, 0, 0, 0);

// Set end date to beginning of next day (00:00:00)
endDateObj.setDate(endDateObj.getDate() + 1);
endDateObj.setHours(0, 0, 0, 0);

// Create time scale with numeric timestamps
const timeScale = scaleTime().domain([startDateObj, endDateObj]).nice();

// Generate ticks for each day
// const dayTicks: number[] = [];
let currentDate = new Date(startDateObj);
while (currentDate <= endDateObj) {
  dayTicks.push(currentDate.getTime());
  currentDate = new Date(currentDate);
  currentDate.setDate(currentDate.getDate() + 1);
}

const WeatherChart = () => {
  console.log({ processedData });
  return (
    <ResponsiveContainer
      width={4848}
      height="100%"
      className="h-16 min-h-16 relative after:absolute after:z-0 after:h-16 after:w-[calc(100%-5rem)] after:top-0 after:left-[4.5rem] after:border-y after:border-slate-300 after:pointer-events-none"
    >
      <ScatterChart
        accessibilityLayer
        data={processedData}
        margin={{
          left: 0,
          right: 0,
          bottom: 16,
          top: 0,
        }}
      >
        <CartesianGrid
          vertical={true}
          horizontal={true}
          verticalFill={[
            "oklch(0.968 0.007 247.896)", // Tailwind slate-200
            "oklch(0.929 0.013 255.508)", // Tailwind slate-300
          ]}
          y={0}
          height={200}
          syncWithTicks
          overflow="visible"
        />

        {/* Background stripes XAxis */}
        <XAxis
          xAxisId={0}
          dataKey="timestamp"
          hide
          type="number"
          scale={timeScale}
          domain={timeScale.domain().map((date) => date.valueOf())}
          ticks={dayTicks}
          tickFormatter={multiFormat}
          interval={"preserveStart"}
          allowDataOverflow
          padding={{ left: 12 }}
        />

        {/* Legend XAxis */}
        <XAxis
          xAxisId={1}
          dataKey="date"
          hide
          tickLine={false}
          axisLine={false}
          interval={"preserveStart"}
          overflow="visible"
          allowDataOverflow
        />

        <Scatter
          dataKey="weatherId"
          shape={<WeatherBubble />}
          overflow="visible"
        />

        <YAxis
          dataKey="index"
          type="number"
          tickLine={false}
          axisLine={false}
          opacity={0}
          height={0}
          domain={[1]}
          padding={{ bottom: 16 }}
          className="transition-opacity ease-in-out duration-200"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;
