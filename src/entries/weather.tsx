// Entry point for weather widgets
import WeatherChart from "@/components/WeatherChart";
import { WeatherIcon } from "@/components/WeatherIcon";
import "@/index.css";
import { BigPipeEntry } from "@/lib/bigpipe-entry";
import { WeatherData } from "@/types";

class WeatherEntry extends BigPipeEntry {
  protected setupEventListeners(): void {
    // Listen for weather data from BigPipe
    document.addEventListener(
      "bigpipe:weather-data",
      this.handleBigPipeEvent.bind(this)
    );

    // Listen for current weather updates
    document.addEventListener(
      "bigpipe:current-weather",
      this.handleBigPipeEvent.bind(this)
    );
  }

  protected mountExistingContainers(): void {
    // Mount existing weather containers
    const weatherContainers = document.querySelectorAll(
      '[data-component="weather-chart"], [data-component="weather-icon"], [data-chart-type="weather"]'
    );

    weatherContainers.forEach((container) => {
      this.mountWeatherComponent(container as HTMLElement);
    });
  }

  protected handleDataEvent(
    container: Element,
    data: any,
    componentType?: string,
    placeholderId?: string
  ): void {
    const containerElement = container as HTMLElement;

    if (componentType === "weather-chart" || !componentType) {
      this.mountWeatherChart(containerElement, data, placeholderId);
    } else if (componentType === "weather-icon") {
      this.mountWeatherIcon(containerElement, data, placeholderId);
    }
  }

  private mountWeatherComponent(container: HTMLElement, data?: any): void {
    const componentType = container.getAttribute("data-component");
    const chartType = container.getAttribute("data-chart-type");
    const placeholderId = container.getAttribute("data-placeholder");

    if (componentType === "weather-chart" || chartType === "weather") {
      this.mountWeatherChart(container, data, placeholderId);
    } else if (componentType === "weather-icon") {
      this.mountWeatherIcon(container, data, placeholderId);
    }
  }

  private mountWeatherChart(
    container: HTMLElement,
    data?: WeatherData[] | any,
    placeholderId?: string | null
  ): void {
    let weatherData: WeatherData[] = [];

    if (!data) {
      // Try to get weather data from global window object as fallback
      const rawData = (window as any).swellnetRawData;
      if (rawData?.weather?.hourly) {
        weatherData = this.processWeatherData(rawData);
      } else if (rawData?.processedWeatherData) {
        weatherData = rawData.processedWeatherData;
      }
    } else if (Array.isArray(data)) {
      weatherData = data;
    } else if (data.weather?.hourly) {
      weatherData = this.processWeatherData(data);
    } else if (data.processedWeatherData) {
      weatherData = data.processedWeatherData;
    }

    if (!weatherData || weatherData.length === 0) {
      console.warn("No weather data available for weather chart");
      return;
    }

    const component = (
      <WeatherChart
        weatherData={weatherData}
        unitPreferences={{
          units: {
            surfHeight: "ft",
            temperature: "celsius",
            wind: "knots",
            unitMeasurements: "m",
          },
          showAdvancedChart: false,
        }}
        mobileContext={
          (window as any).swellnetMobileContext || {
            isWebView: false,
            appVersion: "0.0.0",
            featureFlags: {
              supportsStyleUpdates: false,
              supportsAdvancedChart: false,
            },
          }
        }
      />
    );

    this.mountComponent(container, component, placeholderId || undefined);
  }

  private mountWeatherIcon(
    container: HTMLElement,
    data?: any,
    placeholderId?: string | null
  ): void {
    // Extract weather ID from data
    let weatherId = 0; // Default clear weather

    if (typeof data === "number") {
      weatherId = data;
    } else if (data?.weatherId) {
      weatherId = data.weatherId;
    } else if (data?.weather_code) {
      weatherId = data.weather_code;
    } else if (data?.currentWeather?.weatherId) {
      weatherId = data.currentWeather.weatherId;
    }

    const component = (
      <WeatherIcon
        weatherId={weatherId}
        size={24}
        className="weather-icon"
        showLabel={true}
      />
    );

    this.mountComponent(container, component, placeholderId || undefined);
  }

  private processWeatherData(rawData: any): WeatherData[] {
    if (!rawData.weather?.hourly) return [];

    const timeData = rawData.weather.hourly.time;
    const hasFullAccess = rawData.user?.hasFullAccess;

    // Slice data for non-subscribers (3 days + midnight)
    const slicedTimeData = !hasFullAccess ? timeData.slice(0, 25) : timeData;

    return slicedTimeData.map((time: string, index: number) => ({
      index: index + 1,
      localDateTimeISO: time,
      currentTemp: rawData.weather.hourly.temperature_2m[index],
      weatherId: rawData.weather.hourly.weather_code[index],
    }));
  }
}

// Initialize when module loads
const weatherEntry = new WeatherEntry();
weatherEntry.initialize();

export { WeatherEntry };
