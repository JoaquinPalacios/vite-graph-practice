// import { formatWeatherText } from "@/utils/chart-utils";
import { TooltipProps } from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

import { NameType } from "recharts/types/component/DefaultTooltipContent";

const WeatherTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload) return null;

  console.log({ payload });

  return (
    <div className="tw:rounded-md tw:bg-white tw:shadow-md tw:overflow-hidden">
      <h5 className="tw:text-xs tw:bg-slate-400 tw:text-white tw:p-2 tw:text-center">
        {new Date(payload[0].payload.localDateTimeISO).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          }
        )}
        &nbsp;-&nbsp;
        {new Date(payload[0].payload.localDateTimeISO)
          .toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true,
          })
          .toLowerCase()}
      </h5>
      <p className="tw:text-xs tw:pt-2 tw:pl-4 tw:pr-2 tw:relative tw:before:absolute tw:before:bg-swell/50 tw:before:left-1 tw:before:top-3 tw:before:w-2 tw:before:h-2 tw:before:z-10 tw:before:rounded-xs">
        ID: {payload[0].payload.weatherId}
      </p>

      <p className="tw:text-xs tw:pl-4 tw:pr-2 tw:pb-2 tw:relative tw:before:absolute tw:before:bg-swell/50 tw:before:left-1 tw:before:top-1 tw:before:w-2 tw:before:h-2 tw:before:z-10 tw:before:rounded-xs">
        {payload[0].payload.currentTemp}°C
      </p>
    </div>
  );
};

export default WeatherTooltip;
