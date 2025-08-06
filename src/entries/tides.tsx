// Entry point for tide charts
import { TideChart } from "@/components/TideChart";
import "@/index.css";
import { BigPipeEntry } from "@/lib/bigpipe-entry";
import { TideDataFromDrupal } from "@/types";

class TidesEntry extends BigPipeEntry {
  protected setupEventListeners(): void {
    // Listen for tide data from BigPipe
    document.addEventListener(
      "bigpipe:tide-data",
      this.handleBigPipeEvent.bind(this)
    );
  }

  protected mountExistingContainers(): void {
    // Mount existing tide chart containers
    const tideContainers = document.querySelectorAll(
      '[data-component="tide-chart"], [data-chart-type="tide"]'
    );

    tideContainers.forEach((container) => {
      this.mountTideChart(container as HTMLElement);
    });
  }

  protected handleDataEvent(
    container: Element,
    data: any,
    _componentType?: string,
    placeholderId?: string
  ): void {
    this.mountTideChart(container as HTMLElement, data, placeholderId);
  }

  private mountTideChart(
    container: HTMLElement,
    data?: any,
    placeholderId?: string | null
  ): void {
    let tideData: TideDataFromDrupal[] = [];
    let swellData: any[] = [];
    let timezone = "UTC";

    if (!data) {
      // Try to get data from global window object as fallback
      const rawData = (window as any).swellnetRawData;
      if (rawData) {
        tideData = rawData.tide || [];
        // Get swell data for context
        swellData =
          rawData.forecasts?.gfs?.forecastSteps ||
          rawData.forecasts?.ecmwf?.forecastSteps ||
          [];
        timezone = rawData.location?.timezone || "UTC";
      }
    } else if (Array.isArray(data)) {
      // Direct tide data array
      tideData = data;
    } else if (data.tide) {
      // Full data object
      tideData = data.tide || [];
      swellData =
        data.forecasts?.gfs?.forecastSteps ||
        data.forecasts?.ecmwf?.forecastSteps ||
        [];
      timezone = data.location?.timezone || "UTC";
    }

    if (!tideData || tideData.length === 0) {
      console.warn("No tide data available for tide chart");
      return;
    }

    const component = (
      <TideChart
        tideData={tideData}
        swellData={swellData}
        timezone={timezone}
        exactTimestamp={Date.now()}
        unitPreferences={{
          units: {
            surfHeight: "ft",
            temperature: "celsius",
            wind: "knots",
            unitMeasurements: "m",
          },
          showAdvancedChart: false,
        }}
      />
    );

    this.mountComponent(container, component, placeholderId || undefined);
  }
}

// Initialize when module loads
const tidesEntry = new TidesEntry();
tidesEntry.initialize();

export { TidesEntry };
