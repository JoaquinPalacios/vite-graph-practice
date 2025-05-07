"use client";

// import { useState } from "react";
import {
  Cloud,
  Droplets,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartDataItem, UnitPreferences } from "@/types";
import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { cn } from "@/utils/utils";

export const SurfReportPanel = ({
  localDateTimeISO,
  chartData,
  defaultPreferences,
}: {
  localDateTimeISO: string;
  chartData: ChartDataItem;
  defaultPreferences: UnitPreferences;
}) => {
  // This would come from your API in a real implementation
  const surfData = {
    report:
      "The surf is looking clean this morning with light offshore winds creating glassy conditions. Wave heights are holding in the 3-4ft range with occasional larger sets at south-facing breaks. The swell direction is primarily from the southwest (215°) creating some nice peaky sections at Trestles. The morning high tide is causing some sections to be a bit mushy, but conditions should improve as the tide drops through mid-day. Overall, it's a solid day to get in the water with the best waves expected between 10am-2pm.",
    conditions: {
      waveHeight: "3-4ft",
      waveQuality: "Good",
      waterTemp: 29,
      airTemp: 29,
      wind: {
        speed: 5,
        direction: "ENE",
        description: "Light offshore",
      },
      weather: {
        condition: "Partly Cloudy",
        forecast:
          "Sunny intervals throughout the day with a slight chance of afternoon clouds",
      },
      tide: {
        current: "High",
        next: {
          type: "Low",
          time: "12:45 PM",
          height: "0.8ft",
        },
      },
      sun: {
        sunrise: "6:05 AM",
        sunset: "7:42 PM",
      },
    },
  };

  // Calculate surf quality score (1-10)
  const surfQualityScore = 7.5;

  return (
    <div className="tw:w-full tw:max-w-4xl tw:bg-slate-100 tw:p-4 tw:rounded-lg">
      <div className="tw:flex tw:flex-col tw:gap-4">
        <div className="tw:flex tw:items-center tw:justify-between">
          <div>
            <p className="tw:mb-0">
              {new Date(localDateTimeISO).toLocaleDateString(undefined, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <span className="tw:px-3 tw:py-1 tw:text-lg tw:rounded tw:bg-emerald-600 tw:text-white tw:font-semibold">
            {surfData.conditions.waveQuality}
          </span>
        </div>

        <Tabs defaultValue="report" className="tw:w-full">
          <TabsList className="tw:grid tw:w-full tw:grid-cols-2 tw:bg-gray-100 tw:rounded-lg tw:p-1 tw:mb-2">
            <TabsTrigger
              value="report"
              className="tw:relative tw:rounded-full tw:py-2 tw:px-4 tw:font-semibold tw:transition-all tw:duration-300 tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-emerald-400 tw:focus-visible:ring-offset-2 tw:data-[state=active]:bg-white tw:data-[state=active]:shadow tw:data-[state=active]:z-10 tw:text-gray-600"
            >
              Surf Report
            </TabsTrigger>
            <TabsTrigger
              value="conditions"
              className="tw:relative tw:rounded-full tw:py-2 tw:px-4 tw:font-semibold tw:transition-all tw:duration-300 tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-emerald-400 tw:focus-visible:ring-offset-2 tw:data-[state=active]:bg-white tw:data-[state=active]:shadow tw:data-[state=active]:z-10 tw:text-gray-600"
            >
              Current Conditions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="report" className="tw:mt-4 tw:bg-white">
            <div className="tw:rounded-lg tw:border tw:bg-card tw:text-card-foreground tw:shadow-sm">
              <div className="tw:p-6 tw:pb-2">
                <div className="tw:flex tw:items-center tw:gap-2 tw:text-lg tw:font-semibold">
                  <div className="tw:h-3 tw:w-3 tw:rounded-full tw:bg-emerald-500"></div>
                  Today's Surf Report
                </div>
                <div className="tw:text-sm tw:text-muted-foreground">
                  Updated at 7:30 AM
                </div>
              </div>
              <div className="tw:p-6 tw:pt-0">
                <div className="tw:mb-4">
                  <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
                    <span className="tw:text-sm tw:font-medium">
                      Surf Quality
                    </span>
                    <span className="tw:text-sm tw:font-medium">
                      {surfQualityScore}/10
                    </span>
                  </div>
                  <div className="tw:w-full tw:bg-gray-200 tw:rounded-full tw:h-1 tw:shadow-inner tw:overflow-hidden">
                    <div
                      className="tw:h-1 tw:rounded-full tw:bg-gradient-to-r tw:from-emerald-400 tw:to-emerald-600 tw:shadow-md tw:transition-all tw:duration-700"
                      style={{ width: `${surfQualityScore * 10}%` }}
                    ></div>
                  </div>
                </div>

                <p className="tw:text-base tw:leading-relaxed">
                  {surfData.report}
                </p>

                <div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:mt-6">
                  <div className="tw:flex tw:items-center tw:gap-2">
                    <div>
                      <p className="tw:text-sm tw:font-medium tw:mb-2">
                        Wave Height
                      </p>
                      <p className="tw:text-lg tw:font-semibold tw:flex tw:gap-2 tw:mb-0 tw:items-center">
                        <Droplets className="tw:h-4 tw:w-4 tw:text-blue-500" />
                        {defaultPreferences.units.surfHeight === "ft"
                          ? chartData.primary.fullSurfHeightFeetLabelBin
                          : chartData.primary.fullSurfHeightMetresLabelBin}
                      </p>
                    </div>
                  </div>
                  <div className="tw:flex tw:items-center tw:gap-2">
                    <div>
                      <p className="tw:text-sm tw:font-medium tw:mb-2">
                        Water Temp
                      </p>
                      <p className="tw:text-lg tw:font-semibold tw:flex tw:gap-2 tw:mb-0 tw:items-center">
                        <Thermometer className="tw:h-4 tw:w-4 tw:text-red-500" />
                        {surfData.conditions.waterTemp}°C
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conditions" className="tw:mt-4">
            <div className="tw:grid tw:gap-4 tw:md:tw:grid-cols-2">
              <div className="tw:rounded-lg tw:border tw:bg-white tw:shadow-sm tw:p-4">
                <h5 className="tw:text-base tw:font-semibold tw:mb-2">
                  Weather & Temperature
                </h5>

                <div className="tw:flex tw:items-center tw:justify-between tw:mb-2.5">
                  <div className="tw:flex tw:items-start tw:flex-col">
                    <p className="tw:text-sm tw:mb-0">
                      {surfData.conditions.weather.condition}
                    </p>
                    <p className="tw:text-xl tw:font-semibold tw:flex tw:gap-2 tw:items-center tw:mb-0">
                      <Cloud className="tw:h-4 tw:w-4 tw:text-blue-400" />
                      {surfData.conditions.airTemp}°C
                    </p>
                  </div>
                  <div>
                    <div className="tw:flex tw:items-center tw:gap-1">
                      <Sunrise className="tw:h-4 tw:w-4 tw:text-amber-500" />
                      <span className="tw:text-sm">
                        {surfData.conditions.sun.sunrise}
                      </span>
                    </div>
                    <div className="tw:flex tw:items-center tw:gap-1">
                      <Sunset className="tw:h-4 tw:w-4 tw:text-orange-500" />
                      <span className="tw:text-sm">
                        {surfData.conditions.sun.sunset}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="">
                  <h5 className="tw:text-sm tw:mb-2">Today's Forecast</h5>
                  <p className="tw:text-sm tw:mb-0">
                    {surfData.conditions.weather.forecast}
                  </p>
                </div>
              </div>

              <div className="tw:rounded-lg tw:border tw:bg-white tw:shadow-sm tw:p-4">
                <h5 className="tw:text-base tw:font-semibold tw:mb-2">
                  Wind & Tide
                </h5>

                <div className="tw:flex tw:flex-col tw:justify-center tw:items-start">
                  <p className="tw:text-sm tw:mb-0">
                    {surfData.conditions.wind.description}
                  </p>
                  <div className="tw:flex tw:items-center tw:gap-2 tw:mb-2">
                    <Wind className="tw:h-4 tw:w-4 tw:text-cyan-500" />
                    <p className="tw:text-xl tw:font-semibold tw:mb-0">
                      {surfData.conditions.wind.speed} mph
                    </p>
                    <p className="tw:text-sm tw:mb-0">
                      {surfData.conditions.wind.direction}
                    </p>
                  </div>

                  <div className="">
                    <p className="tw:text-sm tw:text-muted-foreground tw:mb-1">
                      Current Tide: {surfData.conditions.tide.current}
                    </p>
                    <p className="tw:text-sm">
                      Next: {surfData.conditions.tide.next.type} at{" "}
                      {surfData.conditions.tide.next.time} (
                      {surfData.conditions.tide.next.height})
                    </p>
                  </div>
                </div>
              </div>

              <div className="tw:rounded-lg tw:border tw:bg-white tw:shadow-sm tw:md:col-span-2 tw:p-4">
                <h5 className="tw:text-base tw:font-semibold tw:mb-2">
                  Swell Information
                </h5>
                <div className="">
                  <div
                    className={cn(
                      "tw:grid tw:grid-cols-1 tw:gap-4",
                      chartData.secondary
                        ? "tw:md:grid-cols-2"
                        : "tw:md:grid-cols-1"
                    )}
                  >
                    <div className="tw:space-y-2">
                      <p className="tw:text-sm tw:font-medium tw:mb-1.5">
                        Primary Swell
                      </p>
                      <div
                        className={cn(
                          "tw:grid tw:grid-cols-2 tw:gap-2",
                          !chartData.secondary && "tw:lg:grid-cols-4"
                        )}
                      >
                        <div className="tw:bg-slate-100 tw:p-1.5 tw:rounded-md tw:h-fit">
                          <p className="tw:text-xs tw:mb-0">Height</p>
                          <p className="tw:font-semibold tw:mb-0">
                            {defaultPreferences.units.surfHeight === "ft"
                              ? Math.round(
                                  chartData.primary.fullSurfHeightFeet ?? 0
                                )
                              : Math.round(
                                  chartData.primary.fullSurfHeightMetres ?? 0
                                )}
                            {defaultPreferences.units.surfHeight === "ft"
                              ? "ft"
                              : "m"}
                          </p>
                        </div>
                        <div className="tw:bg-slate-100 tw:p-1.5 tw:rounded-md tw:h-fit">
                          <p className="tw:text-xs tw:mb-0">Period</p>
                          <p className="tw:font-semibold tw:mb-0">
                            {chartData.trainData?.map((train) =>
                              Math.round(train.peakPeriod ?? 0)
                            )}
                          </p>
                        </div>
                        {chartData.primary.direction && (
                          <div className="tw:bg-slate-100 tw:p-1.5 tw:rounded-md tw:h-fit">
                            <p className="tw:text-xs tw:mb-0">Direction</p>
                            <p className="tw:font-semibold tw:mb-0">
                              {degreesToCompassDirection(
                                chartData.primary.direction > 180
                                  ? chartData.primary.direction - 180
                                  : chartData.primary.direction + 180
                              )}
                            </p>
                          </div>
                        )}
                        {chartData.primary.direction && (
                          <div className="tw:bg-slate-100 tw:p-1.5 tw:rounded-md tw:h-fit">
                            <p className="tw:text-xs tw:mb-0">Angle</p>
                            <p className="tw:font-semibold tw:mb-0">
                              {chartData.primary.direction > 180
                                ? chartData.primary.direction - 180
                                : chartData.primary.direction + 180}
                              °
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {chartData.secondary && (
                      <div className="tw:space-y-2">
                        <p className="tw:text-sm tw:font-medium tw:mb-1.5">
                          Secondary Swell
                        </p>
                        <div className="tw:grid tw:grid-cols-2 tw:gap-2">
                          <div className="tw:bg-slate-100 tw:p-1.5 tw:rounded-md tw:h-fit">
                            <p className="tw:text-xs tw:mb-0">Height</p>
                            <p className="tw:font-semibold tw:mb-0">
                              {defaultPreferences.units.surfHeight === "ft"
                                ? chartData.secondary.fullSurfHeightFeet
                                : chartData.secondary.fullSurfHeightMetres}
                            </p>
                          </div>
                          <div className="tw:bg-slate-100 tw:p-1.5 tw:rounded-md tw:h-fit">
                            <p className="tw:text-xs tw:mb-0">Period</p>
                            <p className="tw:font-semibold tw:mb-0">
                              {chartData.trainData?.map(
                                (train) => train.peakPeriod
                              )}
                            </p>
                          </div>
                          {chartData.secondary.direction && (
                            <div className="tw:bg-slate-100 tw:p-1.5 tw:rounded-md tw:h-fit">
                              <p className="tw:text-xs tw:mb-0">Direction</p>
                              <p className="tw:font-semibold tw:mb-0">
                                {degreesToCompassDirection(
                                  chartData.secondary.direction > 180
                                    ? chartData.secondary.direction - 180
                                    : chartData.secondary.direction + 180
                                )}
                              </p>
                            </div>
                          )}
                          <div className="tw:bg-slate-100 tw:p-1.5 tw:rounded-md tw:h-fit">
                            <p className="tw:text-xs tw:mb-0">Angle</p>
                            <p className="tw:font-semibold tw:mb-0">
                              {chartData.secondary.direction}°
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
