import { weatherData } from "@/data/weatherData";
// import { formatDateTick } from "@/lib/utils";
import { IoCloudOfflineOutline } from "react-icons/io5";

import {
  WiDayCloudyHigh,
  WiDayCloudy,
  WiDaySunny,
  WiShowers,
  WiDaySunnyOvercast,
  WiRain,
  WiCloud,
  WiDayFog,
  WiWindy,
} from "react-icons/wi";

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from "recharts";

import { ResponsiveContainer } from "recharts";

type WeatherData = {
  weatherId: number;
  date: string;
  time: string;
  currentTemp: number;
};

type WeatherIconProps = {
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  payload?: WeatherData;
};

export const WeatherIcon = (props: WeatherIconProps) => {
  if (!props.payload) return null;
  switch (props.payload.weatherId) {
    case 1:
      return <WiRain size={24} x={props.x && props.x - 7} y={props.y} />;
    case 2:
      return <WiCloud size={24} x={props.x && props.x - 7} y={props.y} />;
    case 3:
      return <WiDaySunny size={24} x={props.x && props.x - 7} y={props.y} />;
    case 4:
      return (
        <WiDayCloudyHigh size={24} x={props.x && props.x - 7} y={props.y} />
      );
    case 5:
      return <WiDayCloudy size={24} x={props.x && props.x - 7} y={props.y} />;
    case 6:
      return <WiDayFog size={24} x={props.x && props.x - 7} y={props.y} />;
    case 7:
      return <WiWindy size={24} x={props.x && props.x - 7} y={props.y} />;
    case 8:
    case 9:
      return <WiShowers size={24} x={props.x && props.x - 7} y={props.y} />;
    case 10:
      return (
        <WiDaySunnyOvercast size={24} x={props.x && props.x - 7} y={props.y} />
      );
    case 11:
    case 12:
      return (
        <WiDayCloudyHigh size={24} x={props.x && props.x - 7} y={props.y} />
      );
    default:
      return (
        <IoCloudOfflineOutline
          size={20}
          x={props.x && props.x - 7}
          y={props.y}
        />
      );
  }
};

const WeatherChart = () => {
  return (
    <ResponsiveContainer width={4848} height="100%" className="h-8 min-h-8">
      <ScatterChart
        data={weatherData}
        margin={{
          left: 0,
          right: 12,
          bottom: 16,
          top: 0,
        }}
      >
        <CartesianGrid
          vertical={true}
          horizontal={true}
          verticalFill={[
            "oklch(0.929 0.013 255.508)",
            "oklch(0.869 0.022 252.894)",
          ]}
          y={0}
          height={32}
          syncWithTicks
        />
        {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
        <XAxis xAxisId={0} dataKey="date" hide interval={7} />

        <YAxis
          dataKey="index"
          type="number"
          opacity={0}
          height={0}
          domain={[1]}
        />

        <Scatter
          dataKey="weatherId"
          stroke="#008a93"
          fill="#008a93"
          //   opacity={0.5}
          shape={<WeatherIcon />}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;
