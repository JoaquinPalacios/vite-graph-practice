import {
  ChartDataItem,
  CurrentWeatherData,
  SunriseSunsetData,
  UnitPreferences,
  WeatherData,
  TideDataAustraliaFromDrupal,
  SurfReportItem,
  TideDataWorldWideFromDrupal,
} from "@/types";
import { SurfReportPanel } from "./ReportTabs";

export const SurfReport = ({
  localDateTimeISO,
  chartData,
  weatherData,
  defaultPreferences,
  currentWeatherData,
  sunriseSunsetData,
  tideData,
  timezone,
  surfReport,
  isAustralia,
}: {
  localDateTimeISO: string;
  chartData: ChartDataItem;
  weatherData: WeatherData;
  defaultPreferences: UnitPreferences;
  currentWeatherData: CurrentWeatherData;
  sunriseSunsetData: SunriseSunsetData;
  tideData: TideDataAustraliaFromDrupal[] | TideDataWorldWideFromDrupal[];
  timezone: string;
  surfReport: SurfReportItem[];
  isAustralia: boolean;
}) => {
  return (
    <section className="tw:mb-4 tw:max-w-[1340px] tw:h-auto tw:mx-auto tw:w-full tw:max-md:px-5">
      <div className="">
        <div className="tw:grid tw:md:grid-cols-3 tw:gap-6">
          <div className="tw:col-span-2">
            <SurfReportPanel
              localDateTimeISO={localDateTimeISO}
              chartData={chartData}
              defaultPreferences={defaultPreferences}
              weatherData={weatherData}
              currentWeatherData={currentWeatherData}
              sunriseSunsetData={sunriseSunsetData}
              tideData={tideData}
              timezone={timezone}
              surfReport={surfReport}
              isAustralia={isAustralia}
            />
          </div>
          <div className="tw:bg-slate-100 tw:p-4 tw:h-min">
            <h2 className="tw:text-lg tw:font-semibold tw:mb-3">
              Nearest Surfcams
            </h2>
            <div className="tw:space-y-3">
              <div className="tw:aspect-video tw:bg-slate-200 tw:overflow-hidden">
                <img
                  src="https://placehold.co/180x320"
                  alt="T Street Cam"
                  className="tw:w-full tw:h-full tw:object-cover"
                />
                <p className="tw:text-xs tw:font-medium tw:p-1">T Street</p>
              </div>
              <div className="tw:aspect-video tw:bg-slate-200 tw:overflow-hidden">
                <img
                  src="https://placehold.co/180x320"
                  alt="Trestles Cam"
                  className="tw:w-full tw:h-full tw:object-cover"
                />
                <p className="tw:text-xs tw:font-medium tw:p-1">Trestles</p>
              </div>
              <div className="tw:aspect-video tw:bg-slate-200 tw:overflow-hidden">
                <img
                  src="https://placehold.co/180x320"
                  alt="San Onofre Cam"
                  className="tw:w-full tw:h-full tw:object-cover"
                />
                <p className="tw:text-xs tw:font-medium tw:p-1">San Onofre</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
