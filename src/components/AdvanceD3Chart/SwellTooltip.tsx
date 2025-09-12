import { colorPalette } from "@/lib/charts";
import { degreesToCompassDirection, getAdjustedDirection } from "@/lib/surf";
import { SwellPoint, TooltipState, UnitPreferences } from "@/types";
import { cn } from "@/utils/utils";
import { X } from "lucide-react";
import React from "react";
import { SwellLabel } from "../SwellChart/SwellLabel";

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
  onClose?: () => void;
  useClickEvents?: boolean;
  unitPreferences: UnitPreferences;
}

export const SwellTooltip: React.FC<SwellTooltipProps> = React.memo(
  ({
    visible,
    x,
    y,
    data,
    side,
    eventIds,
    onClose,
    useClickEvents,
    unitPreferences,
  }) => {
    if (!visible || !data || data.length === 0) return null;

    const isFeet = unitPreferences.units.unitMeasurements === "ft";

    return (
      <div
        key={data[0].timestamp}
        style={{
          position: "absolute",
          left: `${x}px`,
          top: y > 80 ? "80px" : `${y}px`,
          zIndex: 10,
          pointerEvents: useClickEvents ? "auto" : "none",
        }}
        className="tooltip-container fade-in-with-delay tw:bg-white/96 tw:shadow-md"
        role="tooltip"
        aria-label="Swell height and direction analysis over time"
        aria-live="polite"
      >
        <h5
          className={cn(
            "margin-none tw:relative tw:pl-2.5 tw:pr-1.5 tw:lg:pr-2.5 tw:py-1.5 tw:border-b tw:border-gray-400/20 tw:flex tw:justify-between tw:items-center",
            "tw:before:bg-white/96 tw:before:absolute tw:before:w-6 tw:before:h-6 tw:before:block tw:before:rotate-45 tw:before:-z-10",
            side === "left"
              ? "tw:before:-right-[0.5625rem] tw:before:top-1"
              : "tw:before:-left-[0.5625rem] tw:before:top-1"
          )}
        >
          <span>{formatTooltipTime(data[0].timestamp)}</span>
          {useClickEvents && onClose && (
            <button
              onClick={onClose}
              className="tw:text-gray-500 hover:tw:text-gray-700 tw:transition-colors"
              aria-label="Close tooltip"
            >
              <X className="tw:w-3.5 tw:h-3.5 tw:text-gray-600" />
            </button>
          )}
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
                <p className="margin-none tooltip-paragraph">
                  {item.height.toFixed(1)}
                  {isFeet ? "ft" : "m"}
                </p>
                <p className="margin-none tooltip-paragraph">@</p>
                <p className="margin-none tooltip-paragraph">
                  {Number(item.period).toFixed(1)}s
                </p>
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
