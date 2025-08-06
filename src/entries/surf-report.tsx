// Entry point for surf report and surfcam components
import { SurfReport } from "@/components/SurfReport";
import "@/index.css";
import { BigPipeEntry } from "@/lib/bigpipe-entry";
import { SurfcamProps, SurfReportItem } from "@/types";

class SurfReportEntry extends BigPipeEntry {
  protected setupEventListeners(): void {
    // Listen for surf report data from BigPipe
    document.addEventListener(
      "bigpipe:surf-report",
      this.handleBigPipeEvent.bind(this)
    );

    // Listen for surfcam data updates
    document.addEventListener(
      "bigpipe:surfcam-data",
      this.handleBigPipeEvent.bind(this)
    );
  }

  protected mountExistingContainers(): void {
    // Mount existing surf report containers
    const surfReportContainers = document.querySelectorAll(
      '[data-component="surf-report"], [data-chart-type="surf-report"]'
    );

    surfReportContainers.forEach((container) => {
      this.mountSurfReportComponent(container as HTMLElement);
    });
  }

  protected handleDataEvent(
    container: Element,
    data: any,
    componentType?: string,
    placeholderId?: string
  ): void {
    const containerElement = container as HTMLElement;

    if (componentType === "surf-report" || !componentType) {
      this.mountSurfReport(containerElement, data, placeholderId);
    }
  }

  private mountSurfReportComponent(container: HTMLElement, data?: any): void {
    const componentType = container.getAttribute("data-component");
    const chartType = container.getAttribute("data-chart-type");
    const placeholderId = container.getAttribute("data-placeholder");

    if (componentType === "surf-report" || chartType === "surf-report") {
      this.mountSurfReport(container, data, placeholderId);
    }
  }

  private mountSurfReport(
    container: HTMLElement,
    data?: { surfReport?: SurfReportItem[]; surfcams?: SurfcamProps[] },
    placeholderId?: string | null
  ): void {
    if (!data) {
      // Try to get surf report data from global window object as fallback
      const rawData = (window as any).swellnetRawData;
      if (rawData) {
        data = {
          surfReport: rawData.surf_report || [],
          surfcams: rawData.surfcams || [],
        };
      }
    }

    if (!data?.surfReport && !data?.surfcams) {
      console.warn("No surf report or surfcam data available");
      return;
    }

    const component = (
      <SurfReport
        localDateTimeISO={new Date().toISOString()}
        chartData={{} as any} // Minimal fallback
        defaultPreferences={{
          units: {
            surfHeight: "ft",
            temperature: "celsius",
            wind: "knots",
            unitMeasurements: "m",
          },
          showAdvancedChart: false,
        }}
        currentWeatherData={{} as any}
        sunriseSunsetData={{} as any} // Minimal fallback
        tideData={[]}
        timezone="UTC"
        surfReport={data.surfReport || []}
        surfcams={data.surfcams || []}
      />
    );

    this.mountComponent(container, component, placeholderId || undefined);
  }
}

// Initialize when module loads
const surfReportEntry = new SurfReportEntry();
surfReportEntry.initialize();

export { SurfReportEntry };
