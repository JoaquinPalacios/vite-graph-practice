import {
  ChartDataItem,
  CurrentWeatherData,
  SunriseSunsetData,
  UnitPreferences,
  SurfReportItem,
  TideDataWorldWideFromDrupal,
  Surfcam,
} from "@/types";
import { SurfReportPanel } from "./ReportTabs";
import { NearCams } from "./NearCams";

export const SurfReport = ({
  localDateTimeISO,
  chartData,
  defaultPreferences,
  currentWeatherData,
  sunriseSunsetData,
  tideData,
  timezone,
  surfReport,
  surfcams = [],
}: {
  localDateTimeISO: string;
  chartData: ChartDataItem;
  defaultPreferences: UnitPreferences;
  currentWeatherData: CurrentWeatherData;
  sunriseSunsetData: SunriseSunsetData;
  tideData: TideDataWorldWideFromDrupal[];
  timezone: string;
  surfReport: SurfReportItem[];
  surfcams?: Surfcam[];
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
              currentWeatherData={currentWeatherData}
              sunriseSunsetData={sunriseSunsetData}
              tideData={tideData}
              timezone={timezone}
              surfReport={surfReport}
            />
          </div>
          <NearCams surfcams={surfcams} />
        </div>
      </div>
    </section>
  );
};
