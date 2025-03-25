import { LuWaves } from "react-icons/lu";
import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

const CustomTideTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    console.log({ payload });
    return (
      <div className="bg-stone-100 rounded-md overflow-hidden">
        <h5 className="mb-2 px-2 pt-2 text-center">
          {payload[0].payload.time}&nbsp;-&nbsp;
          {new Date(label).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </h5>
        <div className="flex flex-col bg-stone-50 p-2">
          <div className="flex gap-1">
            <LuWaves className="w-3.5 h-3.5" color="#008a93" />
            <p className="font-medium ml-px">{payload && payload[0].value}m</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTideTooltip;
