import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { formatTooltipDate } from "@/lib/format-tooltip-date";
import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { SwellLabel } from "../SwellChart/SwellLabel";
import { memo } from "react";
import { getAdjustedDirection } from "@/lib/format-direction";

/**
 * SwellTooltip component
 * This component is used to display the tooltip of the SwellChart.
 * @param {TooltipProps<ValueType, NameType>} props - The props for the SwellTooltip component
 * @returns {React.ReactElement} The SwellTooltip component
 */
export const AdvanceCustomTooltip = memo(
  ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="tooltip-container tw:bg-white/96 tw:relative tw:shadow-md"
          style={{ visibility: "visible" }}
          role="tooltip"
          aria-label="Swell information"
        >
          <div
            className="pseudo-arrow tw:absolute tw:top-1.5 tw:z-0 tw:w-6 tw:h-5 tw:bg-white/96"
            aria-hidden
          />
          <h5 className="margin-none tw:px-2.5 tw:py-1.5 tw:border-b tw:border-slate-400/20 tw:relative z-10">
            {formatTooltipDate(payload[0].payload.localDateTimeISO)}
          </h5>
          <div className="tw:flex tw:flex-col tw:bg-white tw:p-2">
            {payload
              .slice()
              .sort((a, b) => (b.value as number) - (a.value as number))
              .map((item) => (
                <div
                  key={item.name}
                  className="tw:flex tw:gap-1 tw:items-center"
                >
                  <SwellLabel
                    value={item.payload.direction}
                    fill={item.color}
                  />
                  <p className="margin-none tooltip-paragraph">{item.value}m</p>
                  <p className="margin-none tooltip-paragraph">@</p>
                  <p className="margin-none tooltip-paragraph">
                    {item.payload.period}s
                  </p>
                  <p className="margin-none tooltip-paragraph">
                    {item.payload &&
                      degreesToCompassDirection(
                        getAdjustedDirection(item.payload.direction)
                      )}
                  </p>
                  <p className="margin-none tooltip-paragraph">
                    ({getAdjustedDirection(item.payload.direction)}°)
                  </p>
                </div>
              ))}
          </div>
        </div>
      );
    }

    return null;
  }
);
