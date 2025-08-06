/**
 * BigPipe Debug Utility
 * Provides real-time monitoring and manual testing capabilities
 */

export class BigPipeDebugger {
  private static instance: BigPipeDebugger;
  private isMonitoring = false;
  private eventLog: Array<{ timestamp: string; type: string; data: any }> = [];

  static getInstance(): BigPipeDebugger {
    if (!BigPipeDebugger.instance) {
      BigPipeDebugger.instance = new BigPipeDebugger();
    }
    return BigPipeDebugger.instance;
  }

  /**
   * Start monitoring BigPipe events
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.eventLog = [];

    console.log("🔍 Starting BigPipe event monitoring...");

    // Monitor all BigPipe events
    const eventTypes = [
      "bigpipe:initial-data",
      "bigpipe:app-update",
      "bigpipe:weather-data",
      "bigpipe:current-weather",
      "bigpipe:forecast-data",
      "bigpipe:chart-preferences",
      "bigpipe:tide-data",
      "bigpipe:surf-report",
      "bigpipe:surfcam-data",
      "bigpipe:advanced-data",
      "bigpipe:swell-analysis",
      "bigpipe:subscription-data",
      "bigpipe:user-access",
    ];

    eventTypes.forEach((eventType) => {
      document.addEventListener(eventType, (event) => {
        this.logEvent(eventType, event);
      });
    });

    // Monitor DOM changes for BigPipe containers
    this.observeDOMChanges();
  }

  /**
   * Stop monitoring BigPipe events
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log("🔍 Stopped BigPipe event monitoring");
  }

  /**
   * Log a BigPipe event
   */
  private logEvent(eventType: string, event: Event): void {
    const customEvent = event as CustomEvent;
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: eventType,
      data: customEvent.detail,
    };

    this.eventLog.push(logEntry);

    console.log(`📡 BigPipe Event: ${eventType}`, {
      timestamp: logEntry.timestamp,
      placeholderId: customEvent.detail?.placeholderId,
      componentType: customEvent.detail?.componentType,
      dataKeys: customEvent.detail?.data
        ? Object.keys(customEvent.detail.data)
        : [],
    });
  }

  /**
   * Observe DOM changes for BigPipe containers
   */
  private observeDOMChanges(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const placeholderId = element.getAttribute("data-placeholder");
              const componentType = element.getAttribute("data-component");

              if (placeholderId || componentType) {
                console.log("🏗️ BigPipe container added:", {
                  placeholderId,
                  componentType,
                  element: element.tagName,
                  hasContent: element.children.length > 0,
                });
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Get event log
   */
  getEventLog(): Array<{ timestamp: string; type: string; data: any }> {
    return [...this.eventLog];
  }

  /**
   * Clear event log
   */
  clearEventLog(): void {
    this.eventLog = [];
    console.log("🗑️ BigPipe event log cleared");
  }

  /**
   * Get current BigPipe status
   */
  getStatus(): any {
    const containers = document.querySelectorAll(
      "[data-placeholder], [data-component]"
    );
    const containerStatus = Array.from(containers).map((el) => ({
      placeholderId: el.getAttribute("data-placeholder"),
      componentType: el.getAttribute("data-component"),
      hasContent: el.children.length > 0,
      className: el.className,
    }));

    return {
      isMonitoring: this.isMonitoring,
      eventCount: this.eventLog.length,
      containerCount: containers.length,
      containers: containerStatus,
      recentEvents: this.eventLog.slice(-5), // Last 5 events
    };
  }

  /**
   * Create a visual debug panel
   */
  createDebugPanel(): void {
    const panel = document.createElement("div");
    panel.id = "bigpipe-debug-panel";
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 300px;
      max-height: 400px;
      background: #1a1a1a;
      color: #fff;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 10px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      overflow-y: auto;
    `;

    const title = document.createElement("div");
    title.textContent = "🔍 BigPipe Debug";
    title.style.cssText =
      "font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;";
    panel.appendChild(title);

    const status = this.getStatus();
    const statusText = document.createElement("div");
    statusText.innerHTML = `
      <div>Monitoring: ${status.isMonitoring ? "✅" : "❌"}</div>
      <div>Events: ${status.eventCount}</div>
      <div>Containers: ${status.containerCount}</div>
    `;
    panel.appendChild(statusText);

    // Add controls
    const controls = document.createElement("div");
    controls.style.cssText = "margin-top: 10px; display: flex; gap: 5px;";

    const runTestsBtn = document.createElement("button");
    runTestsBtn.textContent = "Run Tests";
    runTestsBtn.onclick = () => (window as any).runBigPipeTests();
    runTestsBtn.style.cssText = "padding: 5px; font-size: 10px;";

    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear Log";
    clearBtn.onclick = () => this.clearEventLog();
    clearBtn.style.cssText = "padding: 5px; font-size: 10px;";

    controls.appendChild(runTestsBtn);
    controls.appendChild(clearBtn);
    panel.appendChild(controls);

    document.body.appendChild(panel);
  }

  /**
   * Remove debug panel
   */
  removeDebugPanel(): void {
    const panel = document.getElementById("bigpipe-debug-panel");
    if (panel) {
      panel.remove();
    }
  }
}

// Make debugger available globally
(window as any).BigPipeDebugger = BigPipeDebugger;
