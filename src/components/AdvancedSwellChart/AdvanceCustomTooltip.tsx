import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import RenderCustomizedLabel from "../SwellChart/SwellLabel";
/**
 * SwellTooltip component
 * This component is used to display the tooltip of the SwellChart.
 * @param {TooltipProps<ValueType, NameType> } props - The props for the SwellTooltip component
 * @returns {React.ReactElement} The SwellTooltip component
 */
export const AdvanceCustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType> & {
  hoverEventId: string | null;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-400 rounded-md overflow-hidden">
        <h5 className="mb-2 px-2 pt-2 text-center text-white font-medium text-xs">
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
        <div className="flex flex-col bg-white p-2">
          {payload
            .slice()
            .sort((a, b) => (b.value as number) - (a.value as number))
            .map((item) => (
              <div key={item.name} className="flex gap-1 items-center">
                <RenderCustomizedLabel
                  value={item.payload.direction}
                  fill={item.color}
                />
                <p className="ml-px text-xs">{item.value}m</p>
                <p className="ml-px text-xs">@</p>
                <p className="ml-px text-xs">{item.payload.period}s</p>
                <p className="text-xs">
                  {item.payload &&
                    degreesToCompassDirection(item.payload.direction)}
                </p>
                <p className="ml-px text-xs">({item.payload.direction}°)</p>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return null;
};
