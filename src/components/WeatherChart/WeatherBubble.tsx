import { memo } from "react";
import { WeatherIcon } from "@/components/WeatherIcon";
import { cn } from "@/utils/utils";

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
  index?: number;
  isHover?: boolean;
};

/**
 * WeatherBubble component
 * @description This component is used to display the weather bubble in the graph.
 * @param props - The props of the component
 * @returns The WeatherBubble component
 */
export const WeatherBubble = memo((props: WeatherBubbleProps) => {
  if (!props.payload) return null;

  // Common wrapper for all icons to provide a larger hit area
  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <g
      transform={`translate(${(props.x || 0) - 7}, ${props.y || 0})`}
      className={cn(
        "tw:[&>svg]:transition-colors tw:[&>text]:transition-colors",
        props.isHover
          ? "tw:[&>svg]:fill-gray-800 tw:[&>text]:fill-gray-800"
          : "tw:[&>svg]:fill-[#666] tw:[&>text]:fill-[#666]"
      )}
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
        fill={props.isHover ? "#000" : "#666"}
        dy={36}
        dx={Math.abs(payload.currentTemp) < 10 ? 8 : 4}
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
        className={cn(
          "tw:transition-colors",
          props.isHover ? "tw:fill-gray-900" : "tw:fill-[#666]"
        )}
      />
      <CurrentTemp payload={props.payload} />
    </IconWrapper>
  );
});
