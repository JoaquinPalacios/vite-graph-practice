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
  0: { icon: WiDaySunny, label: "Clear" }, // WiNightClear
  1: { icon: WiDaySunnyOvercast, label: "Mostly Clear" }, // WiNightAltPartlyCloudy
  2: { icon: WiDayCloudy, label: "Partly Cloudy" }, // WiNightAltCloudy
  3: { icon: WiCloudy, label: "Overcast" }, // same WiCloudy
  45: { icon: WiDayFog, label: "Fog" }, // WiNightFog
  48: { icon: WiCloudyWindy, label: "Icy Fog" }, // same WiCloudyWindy
  51: { icon: WiDaySprinkle, label: "Light Drizzle" }, // WiNightAltSprinkle
  53: { icon: WiDaySprinkle, label: "Drizzle" }, // WiNightAltSprinkle
  55: { icon: WiDayShowers, label: "Heavy Drizzle" }, // WiNightShowers
  56: { icon: WiSnow, label: "Light Icy Drizzle" }, // WiSnow
  57: { icon: WiSnow, label: "Icy Drizzle" }, // WiSnow
  61: { icon: WiDayShowers, label: "Light Rain" }, // WiNightShowers
  63: { icon: WiRain, label: "Rain" }, // WiRain
  65: { icon: WiRainWind, label: "Heavy Rain" }, // WiRainWind
  66: { icon: WiSnow, label: "Light Icy Rain" }, // WiSnow
  67: { icon: WiSnow, label: "Icy Rain" }, // WiSnow
  71: { icon: WiSnow, label: "Light Snow" }, // WiSnow
  73: { icon: WiSnow, label: "Snow" }, // WiSnow
  75: { icon: WiSnow, label: "Heavy Snow" }, // WiSnow
  77: { icon: WiSnow, label: "Snow grains" }, // WiSnow
  80: { icon: WiRain, label: "Light Showers" }, // WiNightShowers
  81: { icon: WiDayShowers, label: "Showers" }, // WiNightShowers
  82: { icon: WiRainWind, label: "Heavy Showers" }, // WiRainWind
  95: { icon: WiThunderstorm, label: "Thunderstorm" }, // WiThunderstorm
  96: { icon: WiStormShowers, label: "Thunderstorm + Light Hail" }, // WiStormShowers
  99: { icon: WiStormShowers, label: "Thunderstorm + Hail" }, // WiStormShowers
} as const;

type WeatherIconProps = {
  weatherId: number;
  size?: number;
  className?: string;
  showLabel?: boolean;
};

/**
 * WeatherIcon component
 * @description This component is used to display the weather icon for a given weather id.
 * @param weatherId - The weather id
 * @param size - The size of the icon
 * @param className - The class name of the icon
 * @param showLabel - Whether to show the label
 * @returns The WeatherIcon component
 */
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
