import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { memo } from "react";
import { formatTooltipDate } from "@/lib/format-tooltip-date";

const TideTooltip = memo(
  ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip-container tw:bg-white/96 tw:shadow-md">
          <h5 className="margin-none tw:px-2.5 tw:py-1.5 tw:border-b tw:border-slate-400/20">
            {formatTooltipDate(payload[0].payload.localDateTimeISO)}
          </h5>
          <div className="tw:flex tw:flex-col tw:bg-white tw:p-2">
            <div className="tw:flex tw:gap-1 tw:items-center">
              {/* <LuWaves className="tw:w-3.5 tw:h-3.5" color="#008a93" /> */}
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
