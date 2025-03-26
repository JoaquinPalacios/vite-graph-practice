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

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
} from "recharts";

import { ResponsiveContainer } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

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

  // Common wrapper for all icons to provide a larger hit area
  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <g transform={`translate(${props.x || 0}, ${props.y || 0})`}>
      {/* Invisible hit area */}
      <rect
        width="24"
        height="24"
        fill="transparent"
        className="cursor-pointer"
      />
      {children}
    </g>
  );

  switch (props.payload.weatherId) {
    case 1:
      return (
        <IconWrapper>
          <WiRain size={24} />
        </IconWrapper>
      );
    case 2:
      return (
        <IconWrapper>
          <WiCloud size={24} />
        </IconWrapper>
      );
    case 3:
      return (
        <IconWrapper>
          <WiDaySunny size={24} />
        </IconWrapper>
      );
    case 4:
      return (
        <IconWrapper>
          <WiDayCloudyHigh size={24} />
        </IconWrapper>
      );
    case 5:
      return (
        <IconWrapper>
          <WiDayCloudy size={24} />
        </IconWrapper>
      );
    case 6:
      return (
        <IconWrapper>
          <WiDayFog size={24} />
        </IconWrapper>
      );
    case 7:
      return (
        <IconWrapper>
          <WiWindy size={24} />
        </IconWrapper>
      );
    case 8:
    case 9:
      return (
        <IconWrapper>
          <WiShowers size={24} />
        </IconWrapper>
      );
    case 10:
      return (
        <IconWrapper>
          <WiDaySunnyOvercast size={24} />
        </IconWrapper>
      );
    case 11:
    case 12:
      return (
        <IconWrapper>
          <WiDayCloudyHigh size={24} />
        </IconWrapper>
      );
    default:
      return (
        <IconWrapper>
          <IoCloudOfflineOutline size={20} />
        </IconWrapper>
      );
  }
};

export const formatWeatherText = (text: string) => {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const WeatherTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload) return null;

  console.log({ payload });

  return (
    <div className="rounded-md bg-white p-2 shadow-md">
      <h5 className="">{payload[0].payload.time}</h5>
      <p className="text-sm">{formatWeatherText(payload[0].payload.weather)}</p>
    </div>
  );
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
        // syncId="swellnet"
      >
        <CartesianGrid
          vertical={true}
          horizontal={false}
          verticalFill={[
            "oklch(0.929 0.013 255.508)",
            "oklch(0.869 0.022 252.894)",
          ]}
          y={0}
          height={32}
          syncWithTicks
        />
        {/* Duplicate XAxis for the stripes in the background. This is one in charge of the background stripes */}
        <XAxis
          xAxisId={0}
          dataKey="date"
          hide
          interval={7}
          tickLine={false}
          axisLine={false}
        />

        <YAxis
          dataKey="index"
          type="number"
          tickLine={false}
          axisLine={false}
          opacity={0}
          height={0}
          domain={[1]}
        />

        <Tooltip
          cursor={false}
          wrapperStyle={{ zIndex: 100 }}
          content={<WeatherTooltip />}
        />

        <Scatter
          dataKey="weatherId"
          //   opacity={0.5}
          shape={<WeatherIcon />}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;
