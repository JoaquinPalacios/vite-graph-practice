import { formatBulletinDateTime } from "@/lib/time-utils";
import { DrupalApiData, UnitPreferences } from "@/types";
import { cn } from "@/utils/utils";

import { ImTable2 } from "react-icons/im";
import { MdAccessTime, MdBarChart } from "react-icons/md";
import { VscSettings } from "react-icons/vsc";
import { PreferencesPanel } from "./PreferencesPanel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export interface UnitSelectorProps {
  onChange: (preferences: UnitPreferences) => void;
  defaultValues: UnitPreferences;
  modelType: "gfs" | "ecmwf";
  setModelType: (type: "gfs" | "ecmwf") => void;
  rawApiData: DrupalApiData;
  timezone: string;
  showAnalysis: boolean;
  setShowAnalysis: (show: boolean) => void;
}

/**
 * UnitSelector component
 * @description This component is used to select the unit preferences and model type.
 * It displays controls for both unit preferences and model type selection.
 */
export const UnitSelector = ({
  onChange,
  defaultValues,
  modelType,
  setModelType,
  rawApiData,
  timezone,
  showAnalysis,
  setShowAnalysis,
}: UnitSelectorProps) => {
  const hasGfsData = rawApiData.forecasts?.gfs?.forecastSteps?.length > 0;
  const hasEcmwfData = rawApiData.forecasts?.ecmwf?.forecastSteps?.length > 0;

  return (
    <>
      {/* Model run time */}
      <p className="margin-bottom-minus-11 tw:text-sm tw:hidden tw:lg:flex tw:items-center tw:gap-2">
        {hasGfsData || hasEcmwfData ? (
          <>
            <MdAccessTime className="tw:w-4 tw:h-4" />
            Updated{" "}
            {formatBulletinDateTime(
              modelType === "gfs"
                ? rawApiData.forecasts?.gfs?.bulletinDateTimeUtc
                : rawApiData.forecasts?.ecmwf?.bulletinDateTimeUtc,
              timezone
            )}
          </>
        ) : (
          "No forecast data available"
        )}
      </p>
      <div className="tw:flex tw:gap-4 tw:items-start tw:lg:items-center tw:max-md:px-5 tw:justify-between tw:lg:justify-end tw:max-lg:flex-col">
        <div className="tw:flex tw:items-start tw:sm:items-baseline tw:justify-between tw:sm:justify-start tw:gap-4 tw:sm:8 tw:md:gap-10 tw:w-full tw:sm:w-fit">
          {/* Settings button with expandable preferences */}
          <div className="tw:min-w-fit tw:max-md:pt-1.5">
            <Accordion
              type="single"
              collapsible
              className="tw:w-full tw:border-none accordion-trigger"
            >
              <AccordionItem value="preferences" className=" tw:border-none">
                <AccordionTrigger className="selector-btn preference-btn-wrapper tw:py-2 tw:px-0 hover:tw:no-underline tw:gap-0.5 tw:[&>svg]:hidden">
                  <div className="tw:flex tw:items-center tw:gap-2">
                    <span className="font-sm font-medium tw:text-gray-700 tw:hidden tw:sm:block">
                      Settings
                    </span>
                    <VscSettings className="tw:size-5 tw:transition-transform tw:duration-300" />
                  </div>
                </AccordionTrigger>
                <AccordionContent
                  className={cn(
                    "tw:absolute tw:top-[6.25rem] tw:lg:top-24 tw:left-1/2 tw:md:left-0 tw:max-md:-translate-x-1/2 tw:w-screen tw:md:w-full tw:h-full tw:min-w-fit tw:p-0",
                    "tw:data-[state=open]:animate-in tw:animation-[slide-down_0.5s_cubic-bezier(0.4,0,0.2,1)_0.2s_forwards]"
                  )}
                >
                  <PreferencesPanel
                    defaultValues={defaultValues}
                    onChange={onChange}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Advance chart toggle */}
          <div
            className={cn(
              "tw:flex tw:items-center tw:gap-2 tw:transition-opacity tw:order-last tw:lg:order-none",
              showAnalysis ? "tw:opacity-0" : "tw:opacity-100"
            )}
          >
            <span className="font-sm font-medium tw:text-gray-700 tw:hidden tw:sm:block">
              Graph
            </span>
            <div className="tw:relative tw:w-fit tw:h-8 tw:flex tw:items-center tw:overflow-hidden tw:gap-3 tw:px-2">
              <div
                className={cn(
                  "tw:absolute tw:top-1/2 tw:w-12 tw:-translate-y-1/2 tw:left-0 tw:h-7 tw:bg-gray-100 tw:shadow tw:z-0 tw:transition-transform tw:duration-200",
                  defaultValues.showAdvancedChart
                    ? "tw:translate-x-full"
                    : "tw:translate-x-0"
                )}
                style={{ willChange: "transform" }}
              />
              <button
                type="button"
                className={cn(
                  "selector-btn font-sm font-bold tw:relative tw:flex tw:items-center tw:justify-center tw:z-10 tw:w-fit tw:h-fit tw:border-none tw:bg-transparent tw:cursor-pointer tw:transition-colors tw:duration-200",
                  !defaultValues.showAdvancedChart
                    ? "tw:text-gray-900"
                    : "tw:text-gray-700"
                )}
                aria-pressed={!defaultValues.showAdvancedChart}
                onClick={() =>
                  onChange({
                    ...defaultValues,
                    showAdvancedChart: false,
                  })
                }
              >
                Basic
              </button>
              <button
                type="button"
                className={cn(
                  "selector-btn font-sm font-bold tw:relative tw:flex tw:items-center tw:justify-center tw:z-10 tw:w-fit tw:h-fit tw:border-none tw:bg-transparent tw:cursor-pointer tw:transition-colors tw:duration-250",
                  defaultValues.showAdvancedChart
                    ? "tw:text-gray-900"
                    : "tw:text-gray-700"
                )}
                aria-pressed={defaultValues.showAdvancedChart}
                onClick={() =>
                  onChange({
                    ...defaultValues,
                    showAdvancedChart: true,
                  })
                }
              >
                Adv
              </button>
            </div>
          </div>

          {/* Model type selector */}
          {(hasGfsData || hasEcmwfData) && (
            <div className="tw:flex tw:items-center tw:gap-2 tw:order-2 tw:lg:order-none">
              <Tooltip useTouch>
                <TooltipTrigger asChild>
                  <span className="font-sm font-medium tw:text-gray-700 tw:hidden tw:sm:block">
                    Model
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-xs margin-none tw:max-w-96 tw:w-fit">
                    Select the model to display the forecast data.
                    <br />
                    GFS: Global Forecast System
                    <br />
                    ECMWF: European Centre for Medium-Range Weather Forecasts
                  </p>
                </TooltipContent>
              </Tooltip>
              <div
                className={cn(
                  "tw:relative tw:w-fit tw:h-8 tw:flex tw:items-center tw:gap-3 tw:px-2 tw:overflow-hidden",
                  !hasGfsData || !hasEcmwfData ? "" : ""
                )}
              >
                <div
                  className={cn(
                    "tw:absolute tw:top-1/2 tw:-translate-y-1/2 tw:left-0 tw:h-7 tw:bg-gray-100 tw:shadow tw:z-0 tw:transition-transform tw:duration-200",
                    modelType !== "gfs"
                      ? "tw:translate-x-1/2 tw:w-20"
                      : "tw:translate-x-0 tw:w-10",
                    !hasGfsData && !hasEcmwfData ? "tw:hidden" : ""
                  )}
                  style={{ willChange: "transform" }}
                />

                {hasGfsData ? (
                  <button
                    type="button"
                    className={cn(
                      "selector-btn font-sm font-bold tw:relative tw:flex tw:items-center tw:justify-center tw:z-10 tw:w-fit tw:h-fit tw:border-none tw:bg-transparent tw:transition-colors tw:duration-300",
                      modelType === "gfs"
                        ? "tw:text-gray-900"
                        : "tw:text-gray-700",
                      "tw:cursor-pointer"
                    )}
                    aria-pressed={modelType === "gfs"}
                    onClick={() => setModelType("gfs")}
                    disabled={!hasGfsData}
                  >
                    GFS
                  </button>
                ) : (
                  <Tooltip useTouch>
                    <TooltipTrigger asChild>
                      <span className="tw:flex">
                        <button
                          type="button"
                          className={cn(
                            "selector-btn font-sm font-bold tw:relative tw:flex tw:items-center tw:justify-center tw:z-10 tw:w-fit tw:h-fit tw:border-none tw:bg-transparent tw:transition-colors tw:duration-300",
                            "tw:text-gray-700 tw:disabled:opacity-50"
                          )}
                          disabled
                        >
                          GFS
                        </button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="margin-none font-xs">Temporarly offline</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {hasEcmwfData ? (
                  <button
                    type="button"
                    className={cn(
                      "selector-btn font-sm font-bold tw:relative tw:flex tw:items-center tw:justify-center tw:z-10 tw:w-fit tw:h-fit tw:border-none tw:bg-transparent tw:cursor-pointer tw:transition-colors tw:duration-300",
                      modelType === "ecmwf"
                        ? "tw:text-gray-900"
                        : "tw:text-gray-700"
                    )}
                    aria-pressed={modelType === "ecmwf"}
                    onClick={() => setModelType("ecmwf")}
                    disabled={!hasEcmwfData}
                  >
                    ECMWF
                  </button>
                ) : (
                  <Tooltip useTouch>
                    <TooltipTrigger asChild>
                      <span className="tw:flex">
                        <button
                          type="button"
                          className={cn(
                            "selector-btn font-sm font-bold tw:relative tw:flex tw:items-center tw:justify-center tw:z-10 tw:w-fit tw:h-fit tw:border-none tw:bg-transparent tw:cursor-pointer tw:transition-colors tw:duration-300",
                            "tw:text-gray-700 tw:disabled:opacity-50"
                          )}
                          disabled
                        >
                          ECMWF
                        </button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="margin-none font-xs">Temporarly offline</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          )}

          {/* Charts/Analysis toggle with animated thumb */}
          <div className="tw:flex tw:items-center tw:gap-2 tw:order-1 tw:lg:order-none">
            <span className="font-sm font-medium tw:text-gray-700 tw:hidden tw:sm:block">
              View
            </span>
            <div className="tw:relative tw:w-16 tw:h-8 tw:rounded tw:flex tw:items-center tw:overflow-hidden">
              {/* Animated thumb */}
              <div
                className={cn(
                  "tw:absolute tw:top-1/2 tw:-translate-y-1/2 tw:left-0 tw:h-7 tw:w-1/2 tw:bg-gray-100 tw:shadow tw:transition-transform tw:duration-300 tw:z-0",
                  showAnalysis ? "tw:translate-x-full" : "tw:translate-x-0"
                )}
                style={{ willChange: "transform" }}
              />
              {/* Buttons */}
              <button
                type="button"
                className={cn(
                  "selector-btn font-sm font-bold tw:relative tw:flex tw:z-10 tw:w-1/2 tw:h-full tw:border-none tw:bg-transparent tw:cursor-pointer tw:transition-colors tw:duration-300",
                  !showAnalysis ? "tw:text-gray-900" : "tw:text-gray-700"
                )}
                aria-pressed={!showAnalysis}
                onClick={() => setShowAnalysis(false)}
              >
                <MdBarChart className="tw:w-4 tw:h-4 tw:m-auto" />
              </button>
              <button
                type="button"
                className={cn(
                  "selector-btn font-sm font-bold tw:relative tw:flex tw:z-10 tw:w-1/2 tw:h-full tw:border-none tw:bg-transparent tw:cursor-pointer tw:transition-colors tw:duration-300",
                  showAnalysis ? "tw:text-gray-900" : "tw:text-gray-700"
                )}
                aria-pressed={showAnalysis}
                onClick={() => setShowAnalysis(true)}
              >
                <ImTable2 className="tw:w-4 tw:h-4 tw:m-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
