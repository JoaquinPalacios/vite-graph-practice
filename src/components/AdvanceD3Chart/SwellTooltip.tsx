import React from "react";
import { SwellLabel } from "../SwellChart/SwellLabel";
import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { getAdjustedDirection } from "@/lib/format-direction";
import { colorPalette } from "@/utils/chart-utils";
import { cn } from "@/utils/utils";
import { SwellPoint, TooltipState } from "@/types";

// Format: 3pm Sat 14 Jun
function formatTooltipTime(dateInput: string | number | Date) {
  const date = new Date(dateInput);
  const hours = date.getHours();
  const period = hours >= 12 ? "pm" : "am";
  const hour = hours % 12 || 12;
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const weekday = date.toLocaleString("en-US", { weekday: "short" });
  return `${hour}${period} ${weekday} ${day} ${month}`;
}

interface SwellTooltipProps extends TooltipState {
  data: SwellPoint[];
  eventIds: string[];
}

export const SwellTooltip: React.FC<SwellTooltipProps> = React.memo(
  ({ visible, x, y, data, side, eventIds }) => {
    if (!visible || !data || data.length === 0) return null;
    return (
      <div
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          zIndex: 10,
          pointerEvents: "none",
        }}
        className="tooltip-container tw:bg-white/96 tw:shadow-md"
        role="tooltip"
        aria-label="Swell height and direction analysis over time"
        aria-live="polite"
      >
        <h5
          className={cn(
            "margin-none tw:relative tw:px-2.5 tw:py-1.5 tw:border-b tw:border-slate-400/20",
            "tw:before:bg-white/96 tw:before:absolute tw:before:w-6 tw:before:h-6 tw:before:block tw:before:rotate-45 tw:before:-z-10",
            side === "left"
              ? "tw:before:-right-[0.5625rem] tw:before:top-1"
              : "tw:before:-left-[0.5625rem] tw:before:top-1"
          )}
        >
          {formatTooltipTime(data[0].timestamp)}
        </h5>
        <div className="tw:flex tw:flex-col tw:bg-white tw:p-2">
          {data
            .slice()
            .sort((a, b) => b.height - a.height)
            .map((item, i) => (
              <div key={i} className="tw:flex tw:gap-1 tw:items-center">
                <SwellLabel
                  value={item.direction}
                  fill={
                    colorPalette[
                      eventIds.indexOf(item.eventId) % colorPalette.length
                    ]
                  }
                />
                <p className="margin-none tooltip-paragraph">{item.height}m</p>
                <p className="margin-none tooltip-paragraph">@</p>
                <p className="margin-none tooltip-paragraph">{item.period}s</p>
                <p className="margin-none tooltip-paragraph">
                  {degreesToCompassDirection(
                    getAdjustedDirection(item.direction)
                  )}
                </p>
                <p className="margin-none tooltip-paragraph">
                  ({getAdjustedDirection(item.direction)}°)
                </p>
              </div>
            ))}
        </div>
      </div>
    );
  }
);
