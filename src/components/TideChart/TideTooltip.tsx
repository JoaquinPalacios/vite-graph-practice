import { UnitPreferences } from "@/types";
import { cn } from "@/utils/utils";
import { formatInTimeZone } from "date-fns-tz";
import { memo } from "react";
import { IoClose } from "react-icons/io5";

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      localDateTimeISO: string;
      height: number;
    };
  }>;
  timezone: string;
  onClose?: () => void;
  useClickEvents?: boolean;
  unitPreferences: UnitPreferences;
};

/**
 * TideTooltip component
 * @description This component is used to display the tide tooltip in the graph.
 * @param active - The active state of the tooltip
 * @param payload - The payload of the tooltip
 * @param timezone - The timezone for date formatting
 * @param onClose - Function to close the tooltip (for small devices)
 * @param useClickEvents - Whether to show close button for click events
 * @param unitPreferences - The unit preferences for the chart
 * @returns The TideTooltip component
 */
export const TideTooltip = memo(
  ({
    active,
    payload,
    timezone,
    onClose,
    useClickEvents,
    unitPreferences,
  }: CustomTooltipProps) => {
    const isFeet = unitPreferences.units.unitMeasurements === "ft";

    if (active && payload && payload.length && payload[0].payload) {
      return (
        <div
          key={payload[0].payload.localDateTimeISO}
          className="tooltip-container fade-in-with-delay tw:bg-white/96 tw:shadow-md"
          role="tooltip"
          aria-label="Tide information"
        >
          <h5
            className={cn(
              "margin-none tw:pl-2.5 tw:pr-1.5 tw:lg:pr-2.5 tw:py-1.5 tw:border-b tw:border-gray-400/20 tw:flex tw:justify-between tw:items-center"
            )}
          >
            <span>
              {formatInTimeZone(
                new Date(payload[0].payload.localDateTimeISO),
                timezone,
                "h:mm a EEE d MMM"
              )
                .replace("AM", "am")
                .replace("PM", "pm")}
            </span>
            {useClickEvents && onClose && (
              <button
                onClick={onClose}
                className="tw:text-gray-500 hover:tw:text-gray-700 tw:transition-colors"
                aria-label="Close tooltip"
              >
                <IoClose className="tw:w-4 tw:h-4 tw:text-gray-600" />
              </button>
            )}
          </h5>
          <div className="tw:flex tw:flex-col tw:bg-white tw:p-2">
            <div className="tw:flex tw:gap-1 tw:items-center">
              {/* <LuWaves className="tw:w-3.5 tw:h-3.5" color="#008a93" /> */}
              <p className="margin-bottom-none tw:ml-px tw:text-xs">
                {payload[0].value && Number(payload[0].value).toFixed(1)}
                {isFeet ? "ft" : "m"}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
);
