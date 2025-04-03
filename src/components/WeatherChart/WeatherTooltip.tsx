import { formatWeatherText } from "@/utils/chart-utils";
import { TooltipProps } from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

import { NameType } from "recharts/types/component/DefaultTooltipContent";

const WeatherTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload) return null;

  return (
    <div className="rounded-md bg-white shadow-md overflow-hidden">
      <h5 className="text-xs bg-slate-400 text-white p-2 text-center">
        {new Date(payload[0].payload.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
        &nbsp;-&nbsp;
        {payload[0].payload.time}
      </h5>
      <p className="text-xs pt-2 pl-4 pr-2 relative before:absolute before:bg-swell/50 before:left-1 before:top-3 before:w-2 before:h-2 before:z-10 before:rounded-xs">
        {formatWeatherText(payload[0].payload.weather)}
      </p>
      <p className="text-xs pl-4 pr-2 pb-2 relative before:absolute before:bg-swell/50 before:left-1 before:top-1 before:w-2 before:h-2 before:z-10 before:rounded-xs">
        {payload[0].payload.minTemp}°C / {payload[0].payload.maxTemp}°C
      </p>
    </div>
  );
};

export default WeatherTooltip;
