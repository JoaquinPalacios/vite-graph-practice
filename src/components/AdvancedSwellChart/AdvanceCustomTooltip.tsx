import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { SwellLabel } from "../SwellChart/SwellLabel";
import { memo } from "react";
/**
 * SwellTooltip component
 * This component is used to display the tooltip of the SwellChart.
 * @param {TooltipProps<ValueType, NameType> } props - The props for the SwellTooltip component
 * @returns {React.ReactElement} The SwellTooltip component
 */
export const AdvanceCustomTooltip = memo(
  (props: TooltipProps<ValueType, NameType>) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div
          className="tw:bg-slate-400 tw:rounded-md tw:overflow-hidden"
          style={{ visibility: "visible" }}
        >
          <h5 className="tw:mb-2 tw:px-2 tw:pt-2 tw:text-center tw:text-white tw:font-medium tw:text-xs">
            {new Date(payload[0].payload.localDateTimeISO)
              .toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: true,
              })
              .toLowerCase()
              .replace(" ", "")}
            &nbsp;-&nbsp;
            {new Date(label).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
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
                  <p className="tw:ml-px tw:text-xs">{item.value}m</p>
                  <p className="tw:ml-px tw:text-xs">@</p>
                  <p className="tw:ml-px tw:text-xs">{item.payload.period}s</p>
                  <p className="tw:text-xs">
                    {item.payload &&
                      degreesToCompassDirection(item.payload.direction)}
                  </p>
                  <p className="tw:ml-px tw:text-xs">
                    ({item.payload.direction}°)
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
