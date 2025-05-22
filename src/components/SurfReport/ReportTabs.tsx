import { Waves, Sunrise, Sunset, Thermometer, Wind } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartDataItem,
  CurrentWeatherData,
  SunriseSunsetData,
  UnitPreferences,
  WeatherData,
  TideDataFromDrupal,
  SurfReportItem,
} from "@/types";
import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { cn } from "@/utils/utils";
import { WeatherIcon, getWeatherLabel } from "@/components/WeatherIcon";
import {
  findCurrentDaySunriseSunset,
  findCurrentDayTides,
} from "@/lib/time-utils";
import { formatInTimeZone } from "date-fns-tz";
import { PreviousReportItem } from "./PreviousReport";
import { getSurfHeightLabel } from "@/lib/surf-height-utils";
import { useMemo } from "react";
import { MetricCard } from "./components/MetricCard";
import { MetricDisplay } from "./components/MetricDisplay";
import { SwellMetrics } from "./components/SwellMetrics";

type SurfReportPanelProps = {
  localDateTimeISO: string;
  chartData: ChartDataItem;
  defaultPreferences: UnitPreferences;
  weatherData: WeatherData;
  currentWeatherData: CurrentWeatherData;
  sunriseSunsetData: SunriseSunsetData;
  tideData: TideDataFromDrupal[];
  timezone: string;
  surfReport?: SurfReportItem[];
};

const formatTime = (dateStr: string) => {
  return dateStr.split(" ")[1].replace(/(\d{2}):(\d{2})/, (_, h, m) => {
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  });
};

/**
 * SurfReportPanel component
 * @description This component is used to display the surf report panel in the graph.
 * @param localDateTimeISO - The local date time ISO
 * @param chartData - The chart data
 * @param defaultPreferences - The default preferences
 * @param currentWeatherData - The current weather data
 * @param sunriseSunsetData - The sunrise and sunset data
 * @param tideData - The tide data
 * @param timezone - The timezone
 * @param surfReport - The surf report
 * @returns The SurfReportPanel component
 */
export const SurfReportPanel = ({
  localDateTimeISO,
  chartData,
  defaultPreferences,
  currentWeatherData,
  sunriseSunsetData,
  tideData,
  timezone,
  surfReport = [],
}: SurfReportPanelProps) => {
  // TODO: Remove this once we have the real data
  const dummySurfData = {
    conditions: {
      waterTemp: 22,
      weather: {
        forecast:
          "Sunny intervals throughout the day with a slight chance of afternoon clouds",
      },
    },
  };

  // Memoize expensive computations
  const { sunrise, sunset } = useMemo(
    () =>
      findCurrentDaySunriseSunset(
        sunriseSunsetData.sunrise,
        sunriseSunsetData.sunset,
        localDateTimeISO,
        timezone
      ),
    [
      sunriseSunsetData.sunrise,
      sunriseSunsetData.sunset,
      localDateTimeISO,
      timezone,
    ]
  );

  const { current: currentTide, next: nextTide } = useMemo(
    () => findCurrentDayTides(tideData, localDateTimeISO, timezone),
    [tideData, localDateTimeISO, timezone]
  );

  const formattedDate = useMemo(
    () =>
      formatInTimeZone(new Date(localDateTimeISO), timezone, "MMMM d, yyyy"),
    [localDateTimeISO, timezone]
  );

  const defaultTab = useMemo(() => {
    return surfReport && surfReport.length > 0 ? "report" : "conditions";
  }, [surfReport]);

  return (
    <article className="tw:w-full tw:max-w-4xl tw:bg-slate-100 tw:p-4 tw:rounded-lg">
      <div className="tw:flex tw:flex-col tw:gap-4">
        <div className="tw:flex tw:items-center tw:justify-between">
          <div>
            <p className="margin-none">{formattedDate}</p>
          </div>
          <span className="tw:px-3 tw:py-1 tw:text-lg tw:rounded tw:bg-emerald-600 tw:text-white tw:font-semibold">
            Good
          </span>
        </div>

        <Tabs defaultValue={defaultTab} className="tw:w-full">
          <TabsList className="tw:grid tw:w-full tw:grid-cols-2 tw:bg-gray-100 tw:rounded-lg tw:p-1 tw:mb-2">
            <TabsTrigger
              value="report"
              className="tw:relative tw:rounded-full tw:py-2 tw:px-4 tw:font-semibold tw:transition-all tw:duration-300 tw:focus-visible:outline-none tw:data-[state=active]:bg-white tw:data-[state=active]:shadow tw:data-[state=active]:z-10 tw:text-gray-600"
            >
              Surf Report
            </TabsTrigger>
            <TabsTrigger
              value="conditions"
              className="tw:relative tw:rounded-full tw:py-2 tw:px-4 tw:font-semibold tw:transition-all tw:duration-300 tw:focus-visible:outline-none tw:data-[state=active]:bg-white tw:data-[state=active]:shadow tw:data-[state=active]:z-10 tw:text-gray-600"
            >
              Current Conditions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="report" className="tw:mt-4 tw:bg-white">
            <div className="tw:rounded-lg tw:border tw:bg-card tw:text-card-foreground tw:shadow-sm">
              {surfReport && surfReport.length > 0 ? (
                <>
                  <div className="tw:p-6 tw:pb-2">
                    <div className="tw:flex tw:items-center tw:gap-2 tw:text-lg tw:font-semibold">
                      <div className="tw:h-3 tw:w-3 tw:rounded-full tw:bg-emerald-500"></div>
                      Today's Surf Report
                    </div>
                    <div className="tw:text-sm tw:text-muted-foreground">
                      Updated at {formatTime(surfReport[0].date)}
                    </div>
                  </div>
                  <div className="tw:p-6 tw:pt-0">
                    <div className="tw:mb-4">
                      <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
                        <span className="tw:text-sm tw:font-medium">
                          Surf Quality
                        </span>
                        <span className="tw:text-sm tw:font-medium">
                          {surfReport[0].surfRating}/10
                        </span>
                      </div>
                      <div className="tw:w-full tw:bg-gray-200 tw:rounded-full tw:h-1 tw:shadow-inner tw:overflow-hidden">
                        <div
                          className="tw:h-1 tw:rounded-full tw:bg-gradient-to-r tw:from-emerald-400 tw:to-emerald-600 tw:shadow-md tw:transition-all tw:duration-700"
                          style={{
                            width: `${Number(surfReport[0].surfRating) * 10}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="tw:flex tw:items-center tw:gap-2">
                      <p className="tw:text-base tw:leading-relaxed">
                        Surf condition: {surfReport[0].surfQuality}
                      </p>
                    </div>

                    <p className="tw:text-base tw:leading-relaxed tw:text-pretty">
                      {surfReport[0].report}
                    </p>

                    <div className="tw:grid tw:grid-cols-3 tw:gap-4">
                      <MetricCard>
                        <MetricDisplay
                          label="Wave Height"
                          value={`${getSurfHeightLabel(
                            surfReport[0].surfHeight
                          )}${
                            defaultPreferences.units.surfHeight === "ft"
                              ? ""
                              : "m"
                          }`}
                          icon={
                            <Waves className="tw:h-4 tw:w-4 tw:text-blue-500" />
                          }
                        />
                      </MetricCard>
                      <MetricCard>
                        <MetricDisplay
                          label="Water Temp"
                          value={`${dummySurfData.conditions.waterTemp}°C`}
                          icon={
                            <Thermometer className="tw:h-4 tw:w-4 tw:text-red-500" />
                          }
                        />
                      </MetricCard>
                      <MetricCard>
                        <MetricDisplay
                          label="Wind Direction"
                          value={surfReport[0].wind}
                          icon={
                            <Wind className="tw:h-4 tw:w-4 tw:text-cyan-500" />
                          }
                        />
                      </MetricCard>
                    </div>

                    {surfReport && surfReport.length > 1 && (
                      <div className="tw:mt-5">
                        <h5 className="tw:text-base tw:font-semibold">
                          Previous reports
                        </h5>
                        {surfReport.slice(1).map((report) => (
                          <PreviousReportItem
                            key={report.date}
                            report={report}
                            units={defaultPreferences.units}
                            timezone={timezone}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="tw:p-6">
                  <div className="tw:flex tw:items-center tw:gap-2 tw:text-lg tw:font-semibold">
                    <div className="tw:h-3 tw:w-3 tw:rounded-full tw:bg-gray-400"></div>
                    No Surf Report Available
                  </div>
                  <p className="tw:text-sm tw:text-muted-foreground tw:mt-2">
                    There are currently no surf reports available for this
                    location.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="conditions" className="tw:mt-4">
            <div className="tw:grid tw:gap-4 tw:md:tw:grid-cols-2">
              <div className="tw:rounded-lg tw:border tw:bg-white tw:shadow-sm tw:p-4">
                <h5 className="margin-bottom-2 tw:text-base tw:font-semibold">
                  Weather & Temperature
                </h5>

                <div className="tw:flex tw:items-center tw:justify-between tw:mb-4">
                  <div className="tw:flex tw:items-start tw:flex-col">
                    <p className="margin-none tw:text-sm">
                      {getWeatherLabel(currentWeatherData.weather_code)}
                    </p>
                    <p className="margin-none tw:text-xl tw:font-semibold tw:flex tw:gap-2 tw:items-center">
                      <WeatherIcon
                        weatherId={currentWeatherData.weather_code}
                        size={24}
                        className="tw:text-blue-400"
                      />
                      {currentWeatherData.temperature_2m}°C
                    </p>
                  </div>
                  <div>
                    <div className="tw:flex tw:items-center tw:gap-1">
                      <Sunrise className="tw:h-4 tw:w-4 tw:text-amber-500" />
                      <span className="tw:text-sm">{sunrise}</span>
                    </div>
                    <div className="tw:flex tw:items-center tw:gap-1">
                      <Sunset className="tw:h-4 tw:w-4 tw:text-orange-500" />
                      <span className="tw:text-sm">{sunset}</span>
                    </div>
                  </div>
                </div>

                <div className="">
                  <h5 className="margin-bottom-2 tw:text-sm">
                    Today's Forecast
                  </h5>
                  <p className="margin-none tw:text-sm">
                    {dummySurfData.conditions.weather.forecast}
                  </p>
                </div>
              </div>

              <div className="tw:rounded-lg tw:border tw:bg-white tw:shadow-sm tw:p-4">
                <h5 className="margin-bottom-2 tw:text-base tw:font-semibold">
                  Wind & Tide
                </h5>

                <div className="tw:flex tw:flex-col tw:justify-center tw:items-start">
                  <div className="tw:flex tw:items-center tw:gap-2 tw:mb-2">
                    <Wind className="tw:h-4 tw:w-4 tw:text-cyan-500" />
                    <p className="margin-none tw:text-xl tw:font-semibold">
                      {currentWeatherData.wind_speed_10m} km/h
                    </p>
                    <p className="margin-none tw:text-sm">
                      {degreesToCompassDirection(
                        currentWeatherData.wind_direction_10m
                      )}
                    </p>
                  </div>

                  <div className="">
                    <p className="margin-none tw:text-sm tw:text-muted-foreground">
                      Current Tide: {currentTide.type} at {currentTide.time} (
                      {currentTide.height})
                    </p>
                    <p className="margin-none tw:text-sm">
                      Next: {nextTide.type} at {nextTide.time} (
                      {nextTide.height})
                    </p>
                  </div>
                </div>
              </div>

              <div className="tw:rounded-lg tw:border tw:bg-white tw:shadow-sm tw:md:col-span-2 tw:p-4">
                <h5 className="margin-bottom-2 tw:text-base tw:font-semibold">
                  Swell Information
                </h5>
                <div
                  className={cn(
                    "tw:grid tw:grid-cols-1 tw:gap-4",
                    chartData.secondary
                      ? "tw:md:grid-cols-2"
                      : "tw:md:grid-cols-1"
                  )}
                >
                  <SwellMetrics
                    chartData={chartData}
                    defaultPreferences={defaultPreferences}
                    type="primary"
                  />
                  {chartData.secondary && (
                    <SwellMetrics
                      chartData={chartData}
                      defaultPreferences={defaultPreferences}
                      type="secondary"
                    />
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </article>
  );
};
