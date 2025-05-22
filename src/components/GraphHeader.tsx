import { formatBulletinDateTime } from "@/lib/time-utils";
import { DrupalApiData } from "@/types";
import { cn } from "@/utils/utils";

export const GraphHeader = ({
  locationName,
  modelType,
  setModelType,
  rawApiData,
}: {
  locationName: string;
  modelType: "gfs" | "ecmwf";
  setModelType: (modelType: "gfs" | "ecmwf") => void;
  rawApiData: DrupalApiData;
}) => (
  <>
    <h2 className="tw:text-2xl tw:font-semibold tw:mb-4 tw:max-md:px-5">
      {locationName} Surf Forecast
    </h2>
    <div className="tw:flex tw:items-center tw:gap-2 tw:justify-between tw:max-md:px-5">
      <p className="tw:text-sm tw:mb-4">
        Model run time{" "}
        {formatBulletinDateTime(
          modelType === "gfs"
            ? rawApiData.forecasts.gfs.bulletinDateTimeUtc
            : rawApiData.forecasts.ecmwf.bulletinDateTimeUtc
        )}
        , next model run at..
      </p>
      <div className="tw:flex tw:items-center">
        <h5 className="tw:text-sm">Choose model type</h5>
        <div className="tw:flex tw:gap-2">
          <button
            className={cn(
              "tw:p-2 tw:rounded tw:border tw:border-gray-300 tw:hover:bg-gray-100",
              modelType === "gfs" && "tw:bg-gray-100"
            )}
            onClick={() => setModelType("gfs")}
          >
            GFS
          </button>
          <button
            className={cn(
              "tw:p-2 tw:rounded tw:border tw:border-gray-300 tw:hover:bg-gray-100",
              modelType === "ecmwf" && "tw:bg-gray-100"
            )}
            onClick={() => setModelType("ecmwf")}
          >
            ECMWF
          </button>
        </div>
      </div>
    </div>
  </>
);
