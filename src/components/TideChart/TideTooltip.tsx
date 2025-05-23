import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { memo } from "react";
import { formatInTimeZone } from "date-fns-tz";

/**
 * TideTooltip component
 * @description This component is used to display the tide tooltip in the graph.
 * @param active - The active state of the tooltip
 * @param payload - The payload of the tooltip
 * @returns The TideTooltip component
 */
export const TideTooltip = memo(
  ({
    active,
    payload,
    timezone,
  }: TooltipProps<ValueType, NameType> & { timezone: string }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="tooltip-container tw:bg-white/96 tw:shadow-md"
          role="tooltip"
          aria-label="Tide information"
        >
          <h5 className="margin-none tw:px-2.5 tw:py-1.5 tw:border-b tw:border-slate-400/20">
            {formatInTimeZone(
              new Date(payload[0].payload.localDateTimeISO),
              timezone,
              "h:mm a EEE d MMM"
            )
              .replace("AM", "am")
              .replace("PM", "pm")}
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
