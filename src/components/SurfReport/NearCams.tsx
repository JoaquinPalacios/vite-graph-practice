import { SurfcamProps } from "@/types";
import { SurfcamCard } from "./components/SurfcamCard";
import { cn } from "@/utils/utils";

export const NearCams = ({ surfcams }: { surfcams: SurfcamProps[] }) => {
  return (
    <article className="tw:bg-slate-100 tw:p-4 tw:h-min">
      <h2 className="tw:text-lg tw:font-semibold tw:mb-3">Nearest Surfcams</h2>
      <div
        className={cn(
          "tw:grid tw:gap-2 tw:grid-cols-2 tw:sm:grid-cols-3",
          surfcams.length > 3 ? "tw:lg:grid-cols-2" : "tw:lg:grid-cols-1"
        )}
      >
        {surfcams && surfcams.length > 0 && Array.isArray(surfcams) ? (
          surfcams.map((surfcam) => (
            <SurfcamCard key={surfcam.streamName} surfcam={surfcam} />
          ))
        ) : (
          <p className="">No surfcams available</p>
        )}
      </div>
    </article>
  );
};
