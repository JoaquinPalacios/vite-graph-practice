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
    <div className="rounded-md bg-white p-2 shadow-md">
      <h5 className="">{payload[0].payload.time}</h5>
      <p className="text-sm">{formatWeatherText(payload[0].payload.weather)}</p>
    </div>
  );
};

export default WeatherTooltip;
