import {
  WiDayCloudy,
  WiDaySunny,
  WiDaySunnyOvercast,
  WiRain,
  WiDayFog,
  WiCloudy,
  WiCloudyWindy,
  WiDaySprinkle,
  WiDayShowers,
  WiSnow,
  WiRainWind,
  WiThunderstorm,
  WiStormShowers,
} from "react-icons/wi";
import { AiOutlineStop } from "react-icons/ai";

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

const weatherConfig = {
  0: { icon: WiDaySunny, label: "Clear" },
  1: { icon: WiDaySunnyOvercast, label: "Mostly Clear" },
  2: { icon: WiDayCloudy, label: "Partly Cloudy" },
  3: { icon: WiCloudy, label: "Overcast" },
  45: { icon: WiDayFog, label: "Fog" },
  48: { icon: WiCloudyWindy, label: "Icy Fog" },
  51: { icon: WiDaySprinkle, label: "Light Drizzle" },
  53: { icon: WiDaySprinkle, label: "Drizzle" },
  55: { icon: WiDayShowers, label: "Heavy Drizzle" },
  56: { icon: WiSnow, label: "Light Icy Drizzle" },
  57: { icon: WiSnow, label: "Icy Drizzle" },
  61: { icon: WiDayShowers, label: "Light Rain" },
  63: { icon: WiRain, label: "Rain" },
  65: { icon: WiRainWind, label: "Heavy Rain" },
  66: { icon: WiSnow, label: "Light Icy Rain" },
  67: { icon: WiSnow, label: "Icy Rain" },
  71: { icon: WiSnow, label: "Light Snow" },
  73: { icon: WiSnow, label: "Snow" },
  75: { icon: WiSnow, label: "Heavy Snow" },
  77: { icon: WiSnow, label: "Snow grains" },
  80: { icon: WiRain, label: "Light Showers" },
  81: { icon: WiDayShowers, label: "Showers" },
  82: { icon: WiRainWind, label: "Heavy Showers" },
  95: { icon: WiThunderstorm, label: "Thunderstorm" },
  96: { icon: WiStormShowers, label: "Thunderstorm + Light Hail" },
  99: { icon: WiStormShowers, label: "Thunderstorm + Hail" },
} as const;

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
        {Math.round(payload.currentTemp)}°
      </text>
    );
  };

  // const dayOrNight = (() => {
  //   const date = new Date(props.payload.localDateTimeISO);
  //   const hours = date.getHours();
  //   // Consider daytime between 6am and 6pm
  //   return hours >= 6 && hours < 18 ? "day" : "night";
  // })();

  const weatherInfo =
    weatherConfig[props.payload.weatherId as keyof typeof weatherConfig];

  if (!weatherInfo) {
    return (
      <IconWrapper>
        <AiOutlineStop size={20} color="#666" aria-label="Cloud" />
        <CurrentTemp payload={props.payload} />
      </IconWrapper>
    );
  }

  const Icon = weatherInfo.icon;

  return (
    <IconWrapper>
      <Icon size={24} color="#666" aria-label={weatherInfo.label} />
      <CurrentTemp payload={props.payload} />
    </IconWrapper>
  );
};

export default WeatherBubble;
