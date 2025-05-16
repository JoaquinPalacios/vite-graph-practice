import { LuWaves } from "react-icons/lu";
import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { memo } from "react";

const TideTooltip = memo(
  ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const date = new Date(payload[0].payload.localDateTimeISO);

      return (
        <div className="tw:bg-slate-400 tw:rounded-md tw:overflow-hidden">
          <h6 className="margin-none text-color-white tw:p-2 tw:text-center tw:font-medium tw:text-xs">
            {date
              .toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
              .toLowerCase()}
            &nbsp;-&nbsp;
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </h6>
          <div className="tw:flex tw:flex-col tw:bg-white tw:p-2">
            <div className="tw:flex tw:gap-1 tw:items-center">
              <LuWaves className="tw:w-3.5 tw:h-3.5" color="#008a93" />
              <p className="margin-bottom-none tw:ml-px tw:text-xs">
                {payload[0].value && Number(payload[0].value).toFixed(1)}m
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
);

export default TideTooltip;
