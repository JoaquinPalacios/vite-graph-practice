// Entry point for basic chart components (GFS/ECMWF forecasts)
import ChartsContainer from "@/components/ChartsContainer";
import { SwellChart } from "@/components/SwellChart";
import "@/index.css";
import { BigPipeEntry } from "@/lib/bigpipe-entry";
import { ChartDataItem, DrupalApiData } from "@/types";

class ChartsEntry extends BigPipeEntry {
  protected setupEventListeners(): void {
    // Listen for forecast data from BigPipe
    document.addEventListener(
      "bigpipe:forecast-data",
      this.handleBigPipeEvent.bind(this)
    );

    // Listen for chart preferences updates
    document.addEventListener(
      "bigpipe:chart-preferences",
      this.handleBigPipeEvent.bind(this)
    );
  }

  protected mountExistingContainers(): void {
    // Mount any existing chart containers that are already in the DOM
    const chartContainers = document.querySelectorAll(
      '[data-chart-type="forecast"], [data-component="swell-chart"]'
    );

    chartContainers.forEach((container) => {
      this.mountChart(container as HTMLElement);
    });
  }

  protected handleDataEvent(
    container: Element,
    data: any,
    componentType?: string,
    placeholderId?: string
  ): void {
    const containerElement = container as HTMLElement;

    if (componentType === "charts-container" || !componentType) {
      this.mountChartsContainer(containerElement, data, placeholderId);
    } else if (componentType === "swell-chart") {
      this.mountSwellChart(containerElement, data, placeholderId);
    }
  }

  private mountChart(container: HTMLElement, data?: any): void {
    const chartType = container.getAttribute("data-chart-type");
    const placeholderId = container.getAttribute("data-placeholder");

    if (chartType === "forecast") {
      this.mountChartsContainer(container, data, placeholderId);
    }
  }

  private mountChartsContainer(
    container: HTMLElement,
    data?: DrupalApiData,
    placeholderId?: string | null
  ): void {
    if (!data) {
      // Try to get data from global window object as fallback
      data = (window as any).swellnetRawData;
    }

    if (!data) {
      console.warn("No forecast data available for charts container");
      return;
    }

    // Process chart data
    const chartData = this.processChartData(data);

    // Create default props for ChartsContainer
    const component = (
      <ChartsContainer
        defaultPreferences={{
          units: {
            surfHeight: "ft" as const,
            temperature: "celsius" as const,
            wind: "knots" as const,
            unitMeasurements: "m" as const,
          },
          showAdvancedChart: false,
        }}
        chartData={chartData}
        maxSurfHeight={{
          feet: 10,
          meters: 3,
          surfersFeet: 8,
        }}
        maxSurfHeightAdvanced={3}
        chartWidth={800}
        weatherData={[]}
        tideData={[]}
        timezone="UTC"
        rawApiData={data}
        modelType="gfs"
        setModelType={() => {}}
        mobileContext={{
          isWebView: false,
          appVersion: "0.0.0",
          featureFlags: {
            supportsStyleUpdates: false,
            supportsAdvancedChart: false,
          },
        }}
      />
    );

    this.mountComponent(container, component, placeholderId || undefined);
  }

  private mountSwellChart(
    container: HTMLElement,
    data?: ChartDataItem[],
    placeholderId?: string | null
  ): void {
    if (!data || data.length === 0) {
      console.warn("No chart data available for swell chart");
      return;
    }

    // Process data to add timestamps
    const processedData = data.map((item, index) => ({
      ...item,
      timestamp: new Date(item.localDateTimeISO).getTime() + index,
    }));

    const component = (
      <SwellChart
        unitPreferences={{
          units: {
            surfHeight: "ft",
            temperature: "celsius",
            wind: "knots",
            unitMeasurements: "m",
          },
          showAdvancedChart: false,
        }}
        chartData={processedData}
        maxSurfHeight={10}
        currentLocationTime={data[0]?.localDateTimeISO}
        exactTimestamp={new Date(data[0]?.localDateTimeISO).getTime()}
        referenceTimestamp={new Date(data[0]?.localDateTimeISO).getTime()}
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
}

// Initialize when module loads
const chartsEntry = new ChartsEntry();
chartsEntry.initialize();

export { ChartsEntry };
