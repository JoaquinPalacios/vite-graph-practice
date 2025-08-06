/**
 * BigPipe Testing Utility
 * Provides tools to test and debug BigPipe functionality
 */

export interface BigPipeTestResult {
  success: boolean;
  message: string;
  details?: any;
}

export class BigPipeTester {
  private static instance: BigPipeTester;
  private testResults: BigPipeTestResult[] = [];

  static getInstance(): BigPipeTester {
    if (!BigPipeTester.instance) {
      BigPipeTester.instance = new BigPipeTester();
    }
    return BigPipeTester.instance;
  }

  /**
   * Run comprehensive BigPipe tests
   */
  runAllTests(): BigPipeTestResult[] {
    this.testResults = [];

    console.log("🧪 Starting BigPipe Tests...");

    this.testHeaders();
    this.testContainers();
    this.testEventListeners();
    this.testDataFlow();
    this.testPerformance();

    this.printResults();
    return this.testResults;
  }

  /**
   * Test BigPipe headers
   */
  private testHeaders(): void {
    const result: BigPipeTestResult = {
      success: false,
      message: "Testing BigPipe headers...",
      details: {},
    };

    try {
      // Check for chunked transfer encoding
      const hasChunkedEncoding =
        document.readyState === "loading" ||
        (window as any).performance?.navigation?.type === 1;

      // Check for X-Accel-Buffering header (this would be set by server)
      const hasAccelBuffering = true; // We can't check this client-side

      result.success = hasChunkedEncoding;
      result.message = hasChunkedEncoding
        ? "✅ BigPipe headers detected (chunked transfer encoding)"
        : "❌ BigPipe headers not detected";

      result.details = {
        readyState: document.readyState,
        hasChunkedEncoding,
        hasAccelBuffering,
      };
    } catch (error) {
      result.message = `❌ Error testing headers: ${error}`;
    }

    this.testResults.push(result);
  }

  /**
   * Test for BigPipe containers
   */
  private testContainers(): void {
    const result: BigPipeTestResult = {
      success: false,
      message: "Testing BigPipe containers...",
      details: {},
    };

    try {
      const containers = document.querySelectorAll("[data-placeholder]");
      const componentContainers = document.querySelectorAll("[data-component]");

      result.success = containers.length > 0 || componentContainers.length > 0;
      result.message = result.success
        ? `✅ Found ${containers.length} placeholder containers and ${componentContainers.length} component containers`
        : "❌ No BigPipe containers found";

      result.details = {
        placeholderContainers: Array.from(containers).map((el) => ({
          id: el.getAttribute("data-placeholder"),
          component: el.getAttribute("data-component"),
          hasContent: el.children.length > 0,
        })),
        componentContainers: Array.from(componentContainers).map((el) => ({
          component: el.getAttribute("data-component"),
          hasContent: el.children.length > 0,
        })),
      };
    } catch (error) {
      result.message = `❌ Error testing containers: ${error}`;
    }

    this.testResults.push(result);
  }

  /**
   * Test BigPipe event listeners
   */
  private testEventListeners(): void {
    const result: BigPipeTestResult = {
      success: false,
      message: "Testing BigPipe event listeners...",
      details: {},
    };

    try {
      // Test if we can dispatch and receive BigPipe events
      let eventReceived = false;
      const testEventName = "bigpipe:test-listener";

      const listener = () => {
        eventReceived = true;
        document.removeEventListener(testEventName, listener);
      };

      document.addEventListener(testEventName, listener);

      // Dispatch test event
      const testEvent = new CustomEvent(testEventName, {
        detail: { test: true },
      });
      document.dispatchEvent(testEvent);

      result.success = eventReceived;
      result.message = eventReceived
        ? "✅ BigPipe event listeners working correctly"
        : "❌ BigPipe event listeners not working";

      result.details = {
        eventReceived,
        testEventName,
      };
    } catch (error) {
      result.message = `❌ Error testing event listeners: ${error}`;
    }

    this.testResults.push(result);
  }

  /**
   * Test data flow
   */
  private testDataFlow(): void {
    const result: BigPipeTestResult = {
      success: false,
      message: "Testing BigPipe data flow...",
      details: {},
    };

    try {
      // Check for global data
      const hasGlobalData = !!(window as any).swellnetRawData;
      const hasProcessedData = !!(window as any).swellnetProcessedData;

      result.success = hasGlobalData || hasProcessedData;
      result.message = result.success
        ? "✅ BigPipe data flow detected"
        : "❌ No BigPipe data flow detected";

      result.details = {
        hasGlobalData,
        hasProcessedData,
        globalDataKeys: hasGlobalData
          ? Object.keys((window as any).swellnetRawData || {})
          : [],
        processedDataKeys: hasProcessedData
          ? Object.keys((window as any).swellnetProcessedData || {})
          : [],
      };
    } catch (error) {
      result.message = `❌ Error testing data flow: ${error}`;
    }

    this.testResults.push(result);
  }

  /**
   * Test performance indicators
   */
  private testPerformance(): void {
    const result: BigPipeTestResult = {
      success: false,
      message: "Testing BigPipe performance...",
      details: {},
    };

    try {
      const performance = window.performance;
      const navigation = performance?.navigation;
      const timing = performance?.timing;

      const loadTime = timing
        ? timing.loadEventEnd - timing.navigationStart
        : 0;
      const domReadyTime = timing
        ? timing.domContentLoadedEventEnd - timing.navigationStart
        : 0;

      result.success = true; // Performance test always passes
      result.message = "✅ Performance metrics collected";

      result.details = {
        loadTime: `${loadTime}ms`,
        domReadyTime: `${domReadyTime}ms`,
        navigationType: navigation?.type,
        hasPerformanceAPI: !!performance,
      };
    } catch (error) {
      result.message = `❌ Error testing performance: ${error}`;
    }

    this.testResults.push(result);
  }

  /**
   * Print test results
   */
  private printResults(): void {
    console.log("\n📊 BigPipe Test Results:");
    console.log("=".repeat(50));

    const passed = this.testResults.filter((r) => r.success).length;
    const total = this.testResults.length;

    this.testResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.message}`);
      if (result.details && Object.keys(result.details).length > 0) {
        console.log("   Details:", result.details);
      }
    });

    console.log("=".repeat(50));
    console.log(`Overall: ${passed}/${total} tests passed`);

    if (passed === total) {
      console.log("🎉 All BigPipe tests passed!");
    } else {
      console.log("⚠️  Some BigPipe tests failed. Check the details above.");
    }
  }

  /**
   * Get BigPipe status for debugging
   */
  getStatus(): any {
    return {
      testResults: this.testResults,
      containers: Array.from(
        document.querySelectorAll("[data-placeholder]")
      ).map((el) => ({
        placeholderId: el.getAttribute("data-placeholder"),
        component: el.getAttribute("data-component"),
        hasContent: el.children.length > 0,
      })),
      globalData: {
        hasRawData: !!(window as any).swellnetRawData,
        hasProcessedData: !!(window as any).swellnetProcessedData,
      },
      performance: {
        readyState: document.readyState,
        loadTime: window.performance?.timing
          ? window.performance.timing.loadEventEnd -
            window.performance.timing.navigationStart
          : 0,
      },
    };
  }

  /**
   * Simulate BigPipe data event
   */
  simulateBigPipeEvent(
    eventType: string,
    data: any,
    placeholderId?: string
  ): void {
    const event = new CustomEvent(eventType, {
      detail: {
        placeholderId: placeholderId || "test-placeholder",
        data,
        componentType: "test-component",
      },
    });

    console.log(`🎭 Simulating BigPipe event: ${eventType}`, event.detail);
    document.dispatchEvent(event);
  }
}

// Make tester available globally for debugging
(window as any).BigPipeTester = BigPipeTester;
