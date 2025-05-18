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

type WeatherIconProps = {
  weatherId: number;
  size?: number;
  className?: string;
  showLabel?: boolean;
};

export const WeatherIcon = ({
  weatherId,
  size = 24,
  className = "",
  showLabel = false,
}: WeatherIconProps) => {
  const weatherInfo = weatherConfig[weatherId as keyof typeof weatherConfig];

  if (!weatherInfo) {
    return (
      <>
        <AiOutlineStop
          size={20}
          className={className}
          aria-label="Unknown weather"
        />
        {showLabel && <span>Unknown</span>}
      </>
    );
  }

  const Icon = weatherInfo.icon;
  return (
    <>
      <Icon size={size} className={className} aria-label={weatherInfo.label} />
      {showLabel && <span>{weatherInfo.label}</span>}
    </>
  );
};

// Export the weather config for direct access to labels if needed
export const getWeatherLabel = (weatherId: number): string => {
  return (
    weatherConfig[weatherId as keyof typeof weatherConfig]?.label || "Unknown"
  );
};
