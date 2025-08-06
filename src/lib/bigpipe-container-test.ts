/**
 * BigPipe Container Test Utility
 * Helps identify what containers should exist and diagnose server-side issues
 */

export class BigPipeContainerTester {
  /**
   * Check what containers should exist based on your app structure
   */
  static analyzeExpectedContainers(): void {
    console.log("🔍 Analyzing expected BigPipe containers...");

    // Check for common container patterns
    const expectedContainers = [
      { selector: "#swell-graph-container", description: "Main app container" },
      {
        selector: '[data-component="weather-chart"]',
        description: "Weather chart component",
      },
      {
        selector: '[data-component="swell-chart"]',
        description: "Swell chart component",
      },
      {
        selector: '[data-component="tide-chart"]',
        description: "Tide chart component",
      },
      {
        selector: '[data-component="surf-report"]',
        description: "Surf report component",
      },
      {
        selector: '[data-chart-type="weather"]',
        description: "Weather chart by type",
      },
      {
        selector: '[data-chart-type="swell"]',
        description: "Swell chart by type",
      },
      {
        selector: '[data-chart-type="tide"]',
        description: "Tide chart by type",
      },
      {
        selector: ".weather-container",
        description: "Weather container class",
      },
      { selector: ".chart-container", description: "Chart container class" },
      { selector: ".tide-container", description: "Tide container class" },
    ];

    const foundContainers: Array<{
      selector: string;
      found: boolean;
      element?: Element;
    }> = [];

    expectedContainers.forEach(({ selector, description }) => {
      const element = document.querySelector(selector);
      foundContainers.push({
        selector,
        found: !!element,
        element: element || undefined,
      });
    });

    console.log("📋 Container Analysis Results:");
    console.log("=".repeat(50));

    foundContainers.forEach(({ selector, found, element }) => {
      const status = found ? "✅" : "❌";
      console.log(`${status} ${selector}`);

      if (found && element) {
        console.log(
          `   Found: ${element.tagName}${element.id ? `#${element.id}` : ""}${
            element.className ? `.${element.className}` : ""
          }`
        );
        console.log(`   Has children: ${element.children.length}`);
        console.log(`   Inner HTML length: ${element.innerHTML.length}`);
      }
    });

    console.log("=".repeat(50));

    const foundCount = foundContainers.filter((c) => c.found).length;
    console.log(
      `Found ${foundCount}/${expectedContainers.length} expected containers`
    );

    if (foundCount === 0) {
      console.log(
        "🚨 No expected containers found! This indicates a server-side issue."
      );
      console.log(
        "💡 Your Drupal server needs to generate placeholder containers."
      );
    }
  }

  /**
   * Check for any elements that could be BigPipe containers
   */
  static findPotentialContainers(): void {
    console.log("🔍 Searching for potential BigPipe containers...");

    // Look for any elements that might be containers
    const potentialSelectors = [
      "[data-placeholder]",
      "[data-component]",
      "[data-chart-type]",
      '[id*="container"]',
      '[id*="chart"]',
      '[id*="weather"]',
      '[id*="tide"]',
      '[id*="swell"]',
      '[class*="container"]',
      '[class*="chart"]',
      '[class*="weather"]',
      '[class*="tide"]',
      '[class*="swell"]',
    ];

    const foundElements: Array<{
      selector: string;
      count: number;
      elements: Element[];
    }> = [];

    potentialSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        foundElements.push({
          selector,
          count: elements.length,
          elements: Array.from(elements),
        });
      }
    });

    console.log("📋 Potential BigPipe Containers:");
    console.log("=".repeat(50));

    foundElements.forEach(({ selector, count, elements }) => {
      console.log(`🔍 ${selector}: ${count} elements`);
      elements.forEach((element, index) => {
        console.log(
          `   ${index + 1}. ${element.tagName}${
            element.id ? `#${element.id}` : ""
          }${element.className ? `.${element.className}` : ""}`
        );
        console.log(
          `      Attributes: ${Array.from(element.attributes)
            .map((attr) => `${attr.name}="${attr.value}"`)
            .join(" ")}`
        );
      });
    });

    if (foundElements.length === 0) {
      console.log("❌ No potential containers found");
    }
  }

  /**
   * Generate example HTML for server-side implementation
   */
  static generateExampleHTML(): void {
    console.log("📝 Example HTML for server-side BigPipe implementation:");
    console.log("=".repeat(50));

    const examples = [
      {
        name: "Weather Chart Container",
        html: `<div data-placeholder="weather-chart-1" data-component="weather-chart" class="weather-container">
  <div class="loading">Loading weather data...</div>
</div>`,
      },
      {
        name: "Swell Chart Container",
        html: `<div data-placeholder="swell-chart-1" data-component="swell-chart" data-chart-type="swell" class="chart-container">
  <div class="loading">Loading forecast data...</div>
</div>`,
      },
      {
        name: "Tide Chart Container",
        html: `<div data-placeholder="tide-chart-1" data-component="tide-chart" data-chart-type="tide" class="tide-container">
  <div class="loading">Loading tide data...</div>
</div>`,
      },
      {
        name: "Surf Report Container",
        html: `<div data-placeholder="surf-report-1" data-component="surf-report" class="surf-report-container">
  <div class="loading">Loading surf report...</div>
</div>`,
      },
    ];

    examples.forEach(({ name, html }) => {
      console.log(`\n${name}:`);
      console.log(html);
    });

    console.log("\n" + "=".repeat(50));
    console.log(
      "💡 Add these containers to your Drupal templates for BigPipe to work visually."
    );
  }

  /**
   * Run all container tests
   */
  static runAllTests(): void {
    console.log("🧪 Running BigPipe Container Tests...");
    console.log("=".repeat(50));

    this.analyzeExpectedContainers();
    console.log("\n");
    this.findPotentialContainers();
    console.log("\n");
    this.generateExampleHTML();
  }
}

// Make available globally
(window as any).BigPipeContainerTester = BigPipeContainerTester;
