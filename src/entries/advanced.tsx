// Entry point for advanced D3 charts
// 🎯 PRIORITY 6: Loads LAST - hidden by default, heavy D3 library (~200KB)
// Separate entry for performance - allows critical content to load first
import { AdvanceD3Chart } from "@/components/AdvanceD3Chart";
import SwellTrainAnalysis from "@/components/SweeltrainAnalysis";
import "@/index.css";
import { BigPipeEntry } from "@/lib/bigpipe-entry";
import { ChartDataItem, DrupalApiData } from "@/types";

class AdvancedChartsEntry extends BigPipeEntry {
  protected setupEventListeners(): void {
    // Listen for advanced chart data from BigPipe
    document.addEventListener(
      "bigpipe:advanced-data",
      this.handleBigPipeEvent.bind(this)
    );

    // Listen for swell train analysis data
    document.addEventListener(
      "bigpipe:swell-analysis",
      this.handleBigPipeEvent.bind(this)
    );
  }

  protected mountExistingContainers(): void {
    // Mount existing advanced chart containers for all users
    const advancedContainers = document.querySelectorAll(
      '[data-chart-type="advanced"], [data-component="advanced-d3"], [data-component="swell-analysis"]'
    );

    advancedContainers.forEach((container) => {
      this.mountAdvancedChart(container as HTMLElement);
    });
  }

  protected handleDataEvent(
    container: Element,
    data: any,
    componentType?: string,
    placeholderId?: string
  ): void {
    const containerElement = container as HTMLElement;

    if (componentType === "advanced-d3" || !componentType) {
      this.mountAdvancedD3Chart(containerElement, data, placeholderId);
    } else if (componentType === "swell-analysis") {
      this.mountSwellAnalysis(containerElement, data, placeholderId);
    }
  }

  private checkUserSubscription(): boolean {
    // Check if user has subscription for styling/UI purposes
    // (Advanced charts are available to all users regardless)
    const modernSettings = (window as any).drupalSettings?.swellnetGraph;
    if (modernSettings?.user?.hasFullAccess) return true;

    const legacySettings = (window as any).Drupal?.settings?.swellnetGraph;
    if (legacySettings?.user?.hasFullAccess) return true;

    const rawData = (window as any).swellnetRawData;
    if (rawData?.user?.hasFullAccess) return true;

    return false;
  }

  private mountAdvancedChart(container: HTMLElement, data?: any): void {
    const chartType = container.getAttribute("data-chart-type");
    const componentType = container.getAttribute("data-component");
    const placeholderId = container.getAttribute("data-placeholder");

    if (chartType === "advanced" || componentType === "advanced-d3") {
      this.mountAdvancedD3Chart(container, data, placeholderId);
    } else if (componentType === "swell-analysis") {
      this.mountSwellAnalysis(container, data, placeholderId);
    }
  }

  private mountAdvancedD3Chart(
    container: HTMLElement,
    data?: DrupalApiData,
    placeholderId?: string | null
  ): void {
    if (!data) {
      // Try to get data from global window object as fallback
      data = (window as any).swellnetRawData;
    }

    if (!data) {
      console.warn("No data available for advanced D3 chart");
      return;
    }

    // Process chart data - combine GFS and ECMWF
    const chartData = this.processChartData(data);
    const maxSurfHeight = this.calculateMaxSurfHeight(chartData);

    const component = (
      <AdvanceD3Chart
        unitPreferences={{
          units: {
            surfHeight: data.preferences?.units?.surfHeight || "ft",
            temperature: data.preferences?.units?.temperature || "celsius",
            wind: data.preferences?.units?.wind || "knots",
            unitMeasurements: data.preferences?.units?.unitMeasurements || "m",
          },
          showAdvancedChart: true,
        }}
        chartData={chartData}
        maxSurfHeight={maxSurfHeight}
        hasSubscription={this.checkUserSubscription()}
      />
    );

    this.mountComponent(container, component, placeholderId || undefined);
  }

  private mountSwellAnalysis(
    container: HTMLElement,
    data?: DrupalApiData,
    placeholderId?: string | null
  ): void {
    if (!data) {
      // Try to get data from global window object as fallback
      data = (window as any).swellnetRawData;
    }

    if (!data) {
      console.warn("No data available for swell analysis");
      return;
    }

    // Process chart data
    const chartData = this.processChartData(data);

    const component = (
      <SwellTrainAnalysis
        chartData={chartData}
        defaultPreferences={{
          units: {
            surfHeight: data.preferences?.units?.surfHeight || "ft",
            temperature: data.preferences?.units?.temperature || "celsius",
            wind: data.preferences?.units?.wind || "knots",
            unitMeasurements: data.preferences?.units?.unitMeasurements || "m",
          },
          showAdvancedChart: true,
        }}
        timezone={data.location?.timezone || "UTC"}
        showAnalysis={true}
      />
    );

    this.mountComponent(container, component, placeholderId || undefined);
  }

  private processChartData(rawData: DrupalApiData): ChartDataItem[] {
    const gfsData = rawData.forecasts?.gfs?.forecastSteps || [];
    const ecmwfData = rawData.forecasts?.ecmwf?.forecastSteps || [];

    // Combine both datasets, preferring ECMWF data when available
    const combinedData: ChartDataItem[] = [];
    const maxLength = Math.max(gfsData.length, ecmwfData.length);

    for (let i = 0; i < maxLength; i++) {
      const ecmwfItem = ecmwfData[i];
      const gfsItem = gfsData[i];

      if (ecmwfItem) {
        combinedData.push(ecmwfItem);
      } else if (gfsItem) {
        combinedData.push(gfsItem);
      }
    }

    return combinedData;
  }

  private calculateMaxSurfHeight(chartData: ChartDataItem[]): number {
    return Math.max(
      0,
      ...chartData.map(
        (d) =>
          d?.secondary?.fullSurfHeightMetres ??
          d?.primary?.fullSurfHeightMetres ??
          0
      )
    );
  }
}

// Initialize when module loads - available for all users
// 🚀 Performance optimization: Defer heavy D3 loading slightly to allow critical content first
const initializeAdvancedCharts = () => {
  const advancedEntry = new AdvancedChartsEntry();
  advancedEntry.initialize();
};

// Use requestIdleCallback for better performance, with fallback
if ("requestIdleCallback" in window) {
  requestIdleCallback(initializeAdvancedCharts, { timeout: 2000 });
} else {
  // Fallback: small delay to allow critical content to load first
  setTimeout(initializeAdvancedCharts, 100);
}

export { AdvancedChartsEntry };
