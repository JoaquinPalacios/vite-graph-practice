import { Surfcam } from "@/types";
import { SurfcamCard } from "./components/SurfcamCard";
import { cn } from "@/utils/utils";

export const NearCams = ({ surfcams }: { surfcams: Surfcam[] }) => {
  return (
    <div className="tw:bg-slate-100 tw:p-4 tw:h-min">
      <h2 className="tw:text-lg tw:font-semibold tw:mb-3">Nearest Surfcams</h2>
      <div
        className={cn(
          "tw:grid tw:gap-2",
          surfcams.length > 3 ? "tw:grid-cols-2" : "tw:grid-cols-1"
        )}
      >
        {surfcams.length > 0 ? (
          surfcams.map((surfcam) => (
            <SurfcamCard key={surfcam.id} surfcam={surfcam} />
          ))
        ) : (
          <p className="">No surfcams available</p>
        )}
      </div>
    </div>
  );
};
