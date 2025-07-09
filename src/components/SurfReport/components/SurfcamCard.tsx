import { SurfcamProps } from "@/types";
import { cn } from "@/utils/utils";

export const SurfcamCard = ({
  surfcam,
  className,
}: {
  surfcam: SurfcamProps;
  className?: string;
}) => {
  const name = surfcam.streamName.replace(".stream", "");

  const camUrl = `/surfcams/${name}`;
  const thumbnailUrl = `https://static.swellnet.com/images/surfcams/${name}.jpg`;

  return (
    <a
      href={camUrl}
      target="_self"
      rel="noopener noreferrer"
      className={cn("tw:block tw:relative", className)}
    >
      {/* Thumbnail container */}
      <div className="tw:aspect-video tw:bg-gray-200 tw:overflow-hidden tw:relative tw:w-full">
        <img
          src={thumbnailUrl}
          alt={`${surfcam.name} Cam`}
          className="tw:w-full tw:h-full tw:object-cover tw:absolute tw:top-0 tw:left-0"
        />
      </div>

      {/* Cam location name */}
      <p className="margin-none">{surfcam.name}</p>
    </a>
  );
};
