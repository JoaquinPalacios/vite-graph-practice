import { Surfcam } from "@/types";
import { cn } from "@/utils/utils";
import { ExternalLink } from "lucide-react";

interface SurfcamCardProps {
  surfcam: Surfcam;
  className?: string;
}

export const SurfcamCard = ({ surfcam, className }: SurfcamCardProps) => {
  return (
    <a
      href={surfcam.streamUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("tw:block tw:relative tw:group", className)}
    >
      {/* Thumbnail container */}
      <div className="tw:aspect-video tw:bg-slate-200 tw:overflow-hidden tw:relative">
        <img
          src={surfcam.thumbnailUrl}
          alt={`${surfcam.name} Cam`}
          className="tw:w-full tw:h-full tw:object-cover"
        />
        {/* External Link Overlay */}
        <div className="tw:absolute tw:inset-0 tw:bg-black/30 tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity tw:flex tw:items-center tw:justify-center">
          <ExternalLink className="tw:w-6 tw:h-6 tw:text-white" />
        </div>
        {/* Status Indicator */}
        <div
          className={cn(
            "tw:absolute tw:top-2 tw:right-2 tw:w-2 tw:h-2",
            surfcam.status === "active" && "tw:bg-green-500",
            surfcam.status === "inactive" && "tw:bg-red-500",
            surfcam.status === "maintenance" && "tw:bg-yellow-500"
          )}
        />
      </div>

      {/* Cam location name */}
      <p className="tw:text-xs tw:font-medium tw:p-1">{surfcam.name}</p>
    </a>
  );
};
