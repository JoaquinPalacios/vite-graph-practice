import { LuWaves } from "react-icons/lu";
import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

const TideTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-400 rounded-md overflow-hidden">
        <h5 className="mb-2 px-2 pt-2 text-center text-white font-medium text-xs">
          {payload[0].payload.time}&nbsp;-&nbsp;
          {new Date(label).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </h5>
        <div className="flex flex-col bg-white p-2">
          <div className="flex gap-1">
            <LuWaves className="w-3.5 h-3.5" color="#008a93" />
            <p className="ml-px text-xs">{payload && payload[0].value}m</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default TideTooltip;
