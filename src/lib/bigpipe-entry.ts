import { createRoot, Root } from "react-dom/client";

/**
 * Base class for BigPipe entry points
 * Provides common functionality for progressive loading and component mounting
 */
export abstract class BigPipeEntry {
  protected roots: Map<string, Root> = new Map();
  protected initialized = false;
  protected debugMode = true; // Enable debug logging

  /**
   * Initialize the entry point
   * Should be called when the module loads
   */
  initialize(): void {
    if (this.initialized) return;

    this.initialized = true;
    this.logDebug(`Initializing ${this.constructor.name}`);

    this.setupEventListeners();
    this.mountExistingContainers();

    // Log entry initialization for debugging
    console.log(`[GRAPH] BigPipe Entry initialized: ${this.constructor.name}`);

    // Test BigPipe functionality
    this.testBigPipeFunctionality();
  }

  /**
   * Setup BigPipe event listeners
   * Override in child classes to add specific event handlers
   */
  protected abstract setupEventListeners(): void;

  /**
   * Mount existing containers that are already in the DOM
   * Override in child classes to handle initial container mounting
   */
  protected mountExistingContainers(): void {
    // Default implementation - can be overridden
  }

  /**
   * Mount a React component in a container
   */
  protected mountComponent(
    container: Element,
    component: React.ReactElement,
    containerId?: string
  ): void {
    const id =
      containerId ||
      container.id ||
      `bigpipe-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    this.logDebug(`Mounting component with ID: ${id}`);

    if (!this.roots.has(id)) {
      const root = createRoot(container);
      this.roots.set(id, root);
      root.render(component);
      this.logDebug(`Component mounted successfully: ${id}`);
    } else {
      this.logDebug(`Component already mounted: ${id}`);
    }
  }

  /**
   * Unmount and cleanup a container
   */
  protected unmountComponent(containerId: string): void {
    const root = this.roots.get(containerId);
    if (root) {
      root.unmount();
      this.roots.delete(containerId);
      this.logDebug(`Component unmounted: ${containerId}`);
    }
  }

  /**
   * Handle BigPipe data events
   */
  protected handleBigPipeEvent(event: Event): void {
    const customEvent = event as CustomEvent;
    const { placeholderId, data, componentType } = customEvent.detail;

    this.logDebug(`BigPipe event received:`, {
      eventType: event.type,
      placeholderId,
      componentType,
      dataKeys: data ? Object.keys(data) : "no data",
    });

    const container = document.querySelector(
      `[data-placeholder="${placeholderId}"]`
    );

    if (!container) {
      console.warn(`BigPipe container not found: ${placeholderId}`);
      this.logDebug(
        `Available placeholders:`,
        Array.from(document.querySelectorAll("[data-placeholder]")).map((el) =>
          el.getAttribute("data-placeholder")
        )
      );
      return;
    }

    this.logDebug(`Container found for placeholder: ${placeholderId}`);
    this.handleDataEvent(container, data, componentType, placeholderId);
  }

  /**
   * Handle specific data events - override in child classes
   */
  protected abstract handleDataEvent(
    container: Element,
    data: any,
    componentType?: string,
    placeholderId?: string
  ): void;

  /**
   * Cleanup all roots when entry is destroyed
   */
  destroy(): void {
    this.roots.forEach((root) => root.unmount());
    this.roots.clear();
    this.initialized = false;
    this.logDebug(`${this.constructor.name} destroyed`);
  }

  /**
   * Debug logging utility
   */
  protected logDebug(message: string, data?: any): void {
    if (this.debugMode) {
      const timestamp = new Date().toISOString();
      const prefix = `[BigPipe:${this.constructor.name}]`;

      if (data) {
        console.log(`[GRAPH] ${prefix} ${timestamp} - ${message}`, data);
      } else {
        console.log(`[GRAPH] ${prefix} ${timestamp} - ${message}`);
      }
    }
  }

  /**
   * Test BigPipe functionality by dispatching test events
   */
  protected testBigPipeFunctionality(): void {
    this.logDebug("Testing BigPipe functionality...");

    // Test 1: Check if containers exist
    const containers = document.querySelectorAll("[data-placeholder]");
    this.logDebug(
      `Found ${containers.length} placeholder containers:`,
      Array.from(containers).map((el) => ({
        id: el.getAttribute("data-placeholder"),
        component: el.getAttribute("data-component"),
        className: el.className,
      }))
    );

    // Test 2: Check if event listeners are working
    setTimeout(() => {
      this.dispatchTestEvent();
    }, 1000);
  }

  /**
   * Dispatch a test BigPipe event
   */
  protected dispatchTestEvent(): void {
    const testEvent = new CustomEvent("bigpipe:test", {
      detail: {
        placeholderId: "test-placeholder",
        data: { test: true, timestamp: Date.now() },
        componentType: "test-component",
      },
    });

    this.logDebug("Dispatching test BigPipe event");
    document.dispatchEvent(testEvent);
  }

  /**
   * Get BigPipe status information
   */
  getStatus(): any {
    return {
      entryName: this.constructor.name,
      initialized: this.initialized,
      activeRoots: this.roots.size,
      debugMode: this.debugMode,
      containers: Array.from(
        document.querySelectorAll("[data-placeholder]")
      ).map((el) => ({
        placeholderId: el.getAttribute("data-placeholder"),
        component: el.getAttribute("data-component"),
        hasContent: el.children.length > 0,
      })),
    };
  }
}
