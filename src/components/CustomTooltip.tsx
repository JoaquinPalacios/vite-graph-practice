import { degreesToCompassDirection } from "@/utils/degrees-to-compass-direction";
import { GiBigWave } from "react-icons/gi";
import { LuWind, LuWaves } from "react-icons/lu";
import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import RenderCustomizedLabel from "./RenderCustomizedLabel";
import { PiWavesFill } from "react-icons/pi";

export const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    console.log({ payload });
    return (
      <div className="bg-stone-100 rounded-md">
        <h5 className="mb-2 px-2 pt-2">
          {payload[0].payload.time}&nbsp;-&nbsp;
          {new Date(label).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </h5>
        <div className="flex flex-col bg-stone-50 p-2">
          {payload.map((pld) => (
            <>
              <div className="flex gap-1">
                <GiBigWave className="w-3.5 h-3.5" color="#008a93" />
                <p className="font-medium ml-px">
                  {pld.value}
                  {pld.unit || "ft"}
                </p>
                <p className="font-medium">
                  {degreesToCompassDirection(pld.payload.swellDirection)}
                </p>
              </div>
              <div className="flex gap-1">
                <LuWind className="w-3.5 h-3.5" color="#008a93" />
                <p className="font-medium ml-px">
                  {pld.payload.windSpeed}
                  km/h
                </p>
                <p className="font-medium">
                  {degreesToCompassDirection(pld.payload.windDirection)}
                </p>
              </div>
              <div className="flex gap-1">
                <PiWavesFill className="w-3.5 h-3.5" color="#008a93" />
                <p className="font-medium ml-px">
                  {pld.payload.primarySwellHeight}m @
                </p>
                <p className="font-medium">{pld.payload.primarySwellPeriod}s</p>
                <p>
                  <RenderCustomizedLabel
                    value={pld.payload.primarySwellDirection}
                  />
                </p>
              </div>
              {pld.payload.secondarySwellHeight && (
                <div className="flex gap-1">
                  <PiWavesFill className="w-3.5 h-3.5" color="#008a93a6" />
                  <p className="font-medium ml-px">
                    {pld.payload.secondarySwellHeight}m @
                  </p>
                  <p>{pld.payload.secondarySwellPeriod}s</p>
                  <p className="">
                    <RenderCustomizedLabel
                      value={pld.payload.secondarySwellDirection}
                    />
                  </p>
                </div>
              )}
              {pld.payload.tertiarySwellHeight && (
                <div className="flex gap-1">
                  <PiWavesFill className="w-3.5 h-3.5" color="#008a9366" />
                  <p className="font-medium ml-px">
                    {pld.payload.tertiarySwellHeight}m @
                  </p>
                  <p className="font-medium">
                    {pld.payload.tertiarySwellPeriod}s
                  </p>
                  <p>
                    <RenderCustomizedLabel
                      value={pld.payload.tertiarySwellDirection}
                    />
                  </p>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
