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

const WeatherIcon = (props: WeatherIconProps) => {
  if (!props.payload) return null;

  // Common wrapper for all icons to provide a larger hit area
  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <g
      transform={`translate(${(props.x || 0) - 7}, ${props.y || 0})`}
      className="hover:[&>svg]:fill-gray-800 hover:[&>text]:fill-gray-800 [&>svg]:transition-colors"
    >
      {/* Invisible hit area */}
      <rect
        width="24"
        height="40"
        fill="transparent"
        className="cursor-pointer"
      />
      {children}
    </g>
  );

  const CurrentTemp = ({ payload }: { payload: WeatherData }) => {
    return (
      <text
        className="transition-colors"
        fill="#666"
        dy={36}
        dx={4}
        fontSize={10}
      >
        {payload.currentTemp}°
      </text>
    );
  };

  switch (props.payload.weatherId) {
    case 1:
      return (
        <IconWrapper>
          <WiRain size={24} color="#666" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 2:
      return (
        <IconWrapper>
          <WiCloud size={24} color="#666" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 3:
      return (
        <IconWrapper>
          <WiDaySunny size={24} color="#666" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 4:
      return (
        <IconWrapper>
          <WiDayCloudyHigh size={24} color="#666" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 5:
      return (
        <IconWrapper>
          <WiDayCloudy size={24} color="#666" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 6:
      return (
        <IconWrapper>
          <WiDayFog size={24} color="#666" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 7:
      return (
        <IconWrapper>
          <WiWindy size={24} color="#666" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 8:
    case 9:
      return (
        <IconWrapper>
          <WiShowers size={24} color="#666" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 10:
      return (
        <IconWrapper>
          <WiDaySunnyOvercast size={24} color="#666" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 11:
    case 12:
      return (
        <IconWrapper>
          <WiDayCloudyHigh size={24} color="#666" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    default:
      return (
        <IconWrapper>
          <IoCloudOfflineOutline size={20} color="#666" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
  }
};

export default WeatherIcon;
