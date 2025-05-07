import { IoCloudOfflineOutline } from "react-icons/io5";
import {
  WiDayCloudyHigh,
  WiNightCloudyHigh,
  WiDayCloudy,
  WiNightCloudy,
  WiDaySunny,
  WiNightClear,
  WiShowers,
  WiDaySunnyOvercast,
  WiNightPartlyCloudy,
  WiRain,
  WiNightFog,
  WiDayFog,
  WiWindy,
  WiCloudy,
} from "react-icons/wi";

type WeatherData = {
  weatherId: number;
  localDateTimeISO: string;
  currentTemp: number;
};

type WeatherBubbleProps = {
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  payload?: WeatherData;
};

const WeatherBubble = (props: WeatherBubbleProps) => {
  if (!props.payload) return null;

  // Common wrapper for all icons to provide a larger hit area
  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <g
      transform={`translate(${(props.x || 0) - 7}, ${props.y || 0})`}
      className="tw:hover:[&>svg]:fill-gray-800 tw:hover:[&>text]:fill-gray-800 tw:[&>svg]:transition-colors"
    >
      {/* Invisible hit area */}
      <rect width="24" height="40" fill="transparent" />
      {children}
    </g>
  );

  const CurrentTemp = ({ payload }: { payload: WeatherData }) => {
    return (
      <text
        className="tw:transition-colors"
        fill="#666"
        dy={36}
        dx={4}
        fontSize={10}
      >
        {payload.currentTemp}°
      </text>
    );
  };

  const dayOrNight = (() => {
    const date = new Date(props.payload.localDateTimeISO);
    const hours = date.getHours();
    // Consider daytime between 6am and 6pm
    return hours >= 6 && hours < 18 ? "day" : "night";
  })();

  switch (props.payload.weatherId) {
    case 1:
      return (
        <IconWrapper>
          <WiRain size={24} color="#666" aria-label="Rain" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 2:
      return (
        <IconWrapper>
          <WiCloudy size={24} color="#666" aria-label="Cloudy" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 3:
      if (dayOrNight === "day") {
        return (
          <IconWrapper>
            <WiDaySunny size={24} color="#666" aria-label="Sunny" />
            <CurrentTemp payload={props.payload} />
          </IconWrapper>
        );
      }
      return (
        <IconWrapper>
          <WiNightClear size={24} color="#666" aria-label="Clear" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 4:
      if (dayOrNight === "day") {
        return (
          <IconWrapper>
            <WiDayCloudyHigh size={24} color="#666" aria-label="Cloudy" />
            <CurrentTemp payload={props.payload} />
          </IconWrapper>
        );
      }
      return (
        <IconWrapper>
          <WiNightCloudyHigh size={24} color="#666" aria-label="Cloudy" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 5:
      if (dayOrNight === "day") {
        return (
          <IconWrapper>
            <WiDayCloudy size={24} color="#666" aria-label="Cloudy" />
            <CurrentTemp payload={props.payload} />
          </IconWrapper>
        );
      }
      return (
        <IconWrapper>
          <WiNightCloudy size={24} color="#666" aria-label="Cloudy" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 6:
      if (dayOrNight === "day") {
        return (
          <IconWrapper>
            <WiDayFog size={24} color="#666" aria-label="Fog" />
            <CurrentTemp payload={props.payload} />
          </IconWrapper>
        );
      }
      return (
        <IconWrapper>
          <WiNightFog size={24} color="#666" aria-label="Fog" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 7:
      if (dayOrNight === "day") {
        return (
          <IconWrapper>
            <WiWindy size={24} color="#666" aria-label="Windy" />
            <CurrentTemp payload={props.payload} />
          </IconWrapper>
        );
      }
      return (
        <IconWrapper>
          <WiNightFog size={24} color="#666" aria-label="Fog" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 8:
      if (dayOrNight === "day") {
        return (
          <IconWrapper>
            <WiDayFog size={24} color="#666" aria-label="Fog" />
            <CurrentTemp payload={props.payload} />
          </IconWrapper>
        );
      }
      return (
        <IconWrapper>
          <WiNightFog size={24} color="#666" aria-label="Fog" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 9:
      return (
        <IconWrapper>
          <WiShowers size={24} color="#666" aria-label="Showers" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 10:
      if (dayOrNight === "day") {
        return (
          <IconWrapper>
            <WiDaySunnyOvercast size={24} color="#666" aria-label="Sunny" />
            <CurrentTemp payload={props.payload} />
          </IconWrapper>
        );
      }
      return (
        <IconWrapper>
          <WiNightPartlyCloudy size={24} color="#666" aria-label="Cloudy" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 11:
      return (
        <IconWrapper>
          <WiDayCloudyHigh size={24} color="#666" aria-label="Cloudy" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    case 12:
      if (dayOrNight === "day") {
        return (
          <IconWrapper>
            <WiDayCloudyHigh size={24} color="#666" aria-label="Cloudy" />
            <CurrentTemp payload={props.payload} />
          </IconWrapper>
        );
      }
      return (
        <IconWrapper>
          <WiNightPartlyCloudy size={24} color="#666" aria-label="Cloudy" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
    default:
      return (
        <IconWrapper>
          <IoCloudOfflineOutline size={20} color="#666" aria-label="Cloud" />
          <CurrentTemp payload={props.payload} />
        </IconWrapper>
      );
  }
};

export default WeatherBubble;
