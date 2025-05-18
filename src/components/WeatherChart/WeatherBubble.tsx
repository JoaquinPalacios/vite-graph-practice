import { WeatherIcon } from "@/components/WeatherIcon";

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
        {Math.round(payload.currentTemp)}°
      </text>
    );
  };

  return (
    <IconWrapper>
      <WeatherIcon
        weatherId={props.payload.weatherId}
        size={24}
        className="tw:fill-[#666]"
      />
      <CurrentTemp payload={props.payload} />
    </IconWrapper>
  );
};

export default WeatherBubble;
