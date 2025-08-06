// Entry point for subscription overlay (conditional loading)
import { SubscriptionOverlay } from "@/components/SubscriptionOverlay";
import "@/index.css";
import { BigPipeEntry } from "@/lib/bigpipe-entry";

class SubscriptionEntry extends BigPipeEntry {
  protected setupEventListeners(): void {
    // Listen for subscription status updates from BigPipe
    document.addEventListener(
      "bigpipe:subscription-data",
      this.handleBigPipeEvent.bind(this)
    );

    // Listen for user access status changes
    document.addEventListener(
      "bigpipe:user-access",
      this.handleBigPipeEvent.bind(this)
    );
  }

  protected mountExistingContainers(): void {
    // Only mount subscription overlay for users without full access
    const hasFullAccess = this.checkUserAccess();

    if (hasFullAccess) {
      console.log(
        "Subscription overlay: User has full access, not showing overlay"
      );
      return;
    }

    // Mount existing subscription overlay containers
    const subscriptionContainers = document.querySelectorAll(
      '[data-component="subscription-overlay"], [data-component="subscription"]'
    );

    subscriptionContainers.forEach((container) => {
      this.mountSubscriptionOverlay(container as HTMLElement);
    });
  }

  protected handleDataEvent(
    container: Element,
    data: any,
    // componentType?: string,
    placeholderId?: string
  ): void {
    this.mountSubscriptionOverlay(
      container as HTMLElement,
      data,
      placeholderId
    );
  }

  private checkUserAccess(): boolean {
    // Check modern Drupal 11 format first
    const modernSettings = (window as any).drupalSettings?.swellnetGraph;
    if (modernSettings?.user?.hasFullAccess) return true;

    // Fallback to legacy format
    const legacySettings = (window as any).Drupal?.settings?.swellnetGraph;
    if (legacySettings?.user?.hasFullAccess) return true;

    // Check global raw data
    const rawData = (window as any).swellnetRawData;
    if (rawData?.user?.hasFullAccess) return true;

    return false;
  }

  private mountSubscriptionOverlay(
    container: HTMLElement,
    data?: any,
    placeholderId?: string | null
  ): void {
    // Get subscription status from data or window object
    let subscriptionStatus = data?.subscriptionStatus;

    if (!subscriptionStatus) {
      const rawData = (window as any).swellnetRawData;
      subscriptionStatus = rawData?.user?.subscriptionStatus;
    }

    const component = (
      <SubscriptionOverlay
        subscriptionStatus={subscriptionStatus}
        className="subscription-overlay"
      />
    );

    this.mountComponent(container, component, placeholderId || undefined);
  }
}

// Initialize when module loads - but only if user doesn't have full access
const hasFullAccess = (() => {
  const modernSettings = (window as any).drupalSettings?.swellnetGraph;
  const legacySettings = (window as any).Drupal?.settings?.swellnetGraph;
  const rawData = (window as any).swellnetRawData;

  return (
    modernSettings?.user?.hasFullAccess ||
    legacySettings?.user?.hasFullAccess ||
    rawData?.user?.hasFullAccess
  );
})();

if (!hasFullAccess) {
  const subscriptionEntry = new SubscriptionEntry();
  subscriptionEntry.initialize();
} else {
  console.log(
    "Subscription overlay entry not initialized - user has full access"
  );
}

export { SubscriptionEntry };
