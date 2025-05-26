import { formatBulletinDateTime } from "@/lib/time-utils";
import { DrupalApiData } from "@/types";
import { cn } from "@/utils/utils";

/**
 * GraphHeader component
 * @description This component is used to display the header of the graph.
 * It is used to display the header of the graph in the graph.
 * @param locationName - The name of the location
 * @param modelType - The type of model
 * @param setModelType - The function to set the model type
 */
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
}) => {
  const hasForecastData =
    rawApiData.forecasts?.gfs || rawApiData.forecasts?.ecmwf;
  const bulletinTime = hasForecastData
    ? formatBulletinDateTime(
        modelType === "gfs"
          ? rawApiData.forecasts?.gfs?.bulletinDateTimeUtc || ""
          : rawApiData.forecasts?.ecmwf?.bulletinDateTimeUtc || ""
      )
    : "No forecast data available";

  return (
    <>
      <h2 className="tw:text-2xl tw:font-semibold tw:mb-4 tw:max-md:px-5">
        {locationName} Surf Forecast
      </h2>
      <div className="tw:flex tw:items-center tw:gap-2 tw:justify-between tw:max-md:px-5">
        <p className="tw:text-sm tw:mb-4">
          {hasForecastData ? (
            <>Model run time {bulletinTime}, next model run at..</>
          ) : (
            bulletinTime
          )}
        </p>
        {hasForecastData && (
          <div className="tw:flex tw:flex-col tw:items-center">
            <h5 className="margin-bottom-2 tw:text-sm">Choose model type</h5>
            <div className="tw:flex tw:items-center tw:gap-2">
              <div className="tw:relative tw:group">
                <label
                  className={cn(
                    "margin-none tw:relative tw:inline-flex tw:items-center tw:w-28 tw:h-8",
                    !rawApiData.forecasts?.gfs || !rawApiData.forecasts?.ecmwf
                      ? "tw:cursor-default"
                      : "tw:cursor-pointer"
                  )}
                >
                  <span
                    className={cn(
                      "tw:text-sm tw:absolute tw:left-1.5 tw:top-1/2 tw:-translate-y-1/2 tw:z-1",
                      modelType === "gfs"
                        ? "tw:text-[#008a93] tw:font-semibold"
                        : "tw:text-gray-500/50"
                    )}
                  >
                    GFS
                  </span>
                  <span
                    className={cn(
                      "tw:text-sm tw:absolute tw:right-1.5 tw:top-1/2 tw:-translate-y-1/2 tw:z-1",
                      modelType === "ecmwf"
                        ? "tw:text-[#008a93] tw:font-semibold"
                        : "tw:text-gray-500/50"
                    )}
                  >
                    ECMWF
                  </span>
                  <input
                    type="checkbox"
                    className="tw:sr-only tw:peer"
                    checked={modelType === "ecmwf"}
                    onChange={() =>
                      setModelType(modelType === "gfs" ? "ecmwf" : "gfs")
                    }
                    disabled={
                      !rawApiData.forecasts?.gfs || !rawApiData.forecasts?.ecmwf
                    }
                    aria-describedby={
                      !rawApiData.forecasts?.gfs || !rawApiData.forecasts?.ecmwf
                        ? "toggle-tooltip"
                        : undefined
                    }
                  />
                  <div
                    className={cn(
                      "tw:w-full tw:h-full tw:bg-slate-200 tw:transition-colors tw:duration-300 tw:relative",
                      "peer-checked:bg-[#008a93]"
                    )}
                  >
                    <span
                      className={cn(
                        "tw:absolute tw:top-1 tw:left-1 tw:h-6 tw:bg-white tw:shadow-md tw:transition-transform tw:duration-300",
                        modelType === "ecmwf"
                          ? "tw:translate-x-2/3 tw:w-16"
                          : "tw:translate-x-0 tw:w-8"
                      )}
                    />
                  </div>
                  {/* Tooltip */}
                  {(!rawApiData.forecasts?.gfs ||
                    !rawApiData.forecasts?.ecmwf) && (
                    <span
                      id="toggle-tooltip"
                      role="tooltip"
                      className={cn(
                        "tw:absolute tw:top-9 tw:left-1/2 tw:-translate-x-1/2 tw:bg-black tw:text-white tw:text-xs tw:px-2 tw:py-1 tw:whitespace-nowrap tw:z-10 tw:opacity-0 tw:group-hover:opacity-100 tw:transition-opacity tw:duration-250 tw:pointer-events-none",
                        "tw:before:absolute tw:before:-z-10 tw:before:-top-px tw:before:left-1/2 tw:before:-translate-x-1/2 tw:before:w-3 tw:before:h-3 tw:before:bg-black tw:before:rotate-45"
                      )}
                    >
                      {!rawApiData.forecasts?.gfs &&
                      !rawApiData.forecasts?.ecmwf
                        ? "Both models are unavailable"
                        : !rawApiData.forecasts?.gfs
                        ? "GFS model is unavailable"
                        : "ECMWF model is unavailable"}
                    </span>
                  )}
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
