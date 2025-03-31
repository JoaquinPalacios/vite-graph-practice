import { formatWeatherText } from "@/lib/utils";
import { TooltipProps } from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

import { NameType } from "recharts/types/component/DefaultTooltipContent";

const WeatherTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload) return null;

  return (
    <div className="rounded-md bg-white shadow-md overflow-hidden relative before:absolute before:bg-swell before:left-0 before:top-0 before:w-1 before:h-full before:z-10 before:opacity-50">
      <h5 className="text-xs bg-slate-100 p-2 text-center">
        {new Date(payload[0].payload.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
        &nbsp;-&nbsp;
        {payload[0].payload.time}
      </h5>
      <p className="text-xs pt-2 px-2">
        {formatWeatherText(payload[0].payload.weather)}
      </p>
      <p className="text-xs px-2 pb-2">
        {payload[0].payload.minTemp}°C / {payload[0].payload.maxTemp}°C
      </p>
    </div>
  );
};

export default WeatherTooltip;
