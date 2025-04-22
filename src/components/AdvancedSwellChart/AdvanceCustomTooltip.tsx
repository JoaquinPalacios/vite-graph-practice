import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { UnitPreferences } from "@/types";
import { cn } from "@/utils/utils";

/**
 * SwellTooltip component
 * This component is used to display the tooltip of the SwellChart.
 * @param {TooltipProps<ValueType, NameType> & { unitPreferences: UnitPreferences }} props - The props for the SwellTooltip component
 * @returns {React.ReactElement} The SwellTooltip component
 */
export const AdvanceCustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType> & {
  unitPreferences: UnitPreferences;
  hoverEventId: string | null;
}) => {
  console.log({ payload });
  if (active && payload && payload.length) {
    const getColorClass = (color: string) => {
      switch (color) {
        // Regular colors
        case "oklch(50.5% 0.213 27.518)":
          return "bg-red-700";
        case "oklch(55.5% 0.163 48.998)":
          return "bg-amber-700";
        case "oklch(48.8% 0.243 264.376)":
          return "bg-blue-700";
        case "oklch(52.7% 0.154 150.069)":
          return "bg-green-700";
        case "oklch(49.6% 0.265 301.924)":
          return "bg-purple-700";
        case "oklch(52.5% 0.223 3.958)":
          return "bg-pink-700";
        case "oklch(27.9% 0.041 260.031)":
          return "bg-slate-800";
        case "oklch(52% 0.105 223.128)":
          return "bg-cyan-700";
        case "oklch(53.2% 0.157 131.589)":
          return "bg-lime-700";

        // Active colors
        case "oklch(57.7% 0.245 27.325)":
          return "bg-red-600";
        case "oklch(66.6% 0.179 58.318)":
          return "bg-amber-600";
        case "oklch(54.6% 0.245 262.881)":
          return "bg-blue-600";
        case "oklch(62.7% 0.194 149.214)":
          return "bg-green-600";
        case "oklch(55.8% 0.288 302.321)":
          return "bg-purple-600";
        case "oklch(59.2% 0.249 0.584)":
          return "bg-pink-600";
        case "oklch(55.4% 0.046 257.417)":
          return "bg-slate-500";
        case "oklch(60.9% 0.126 221.723)":
          return "bg-cyan-600";
        case "oklch(76.8% 0.233 130.85)":
          return "bg-lime-500";

        default:
          return "bg-slate-700";
      }
    };

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
              <div className="flex gap-1 items-center">
                <span
                  className={cn(
                    "w-2 h-2 rounded-xs",
                    item.color && getColorClass(item.color || "")
                  )}
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
