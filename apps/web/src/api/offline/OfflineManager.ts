import type { NetworkStatus } from "./NetworkStatus";

class OfflineManager {
  getStatus(): NetworkStatus {
    return {
      online: navigator.onLine,
    };
  }
}

export const offlineManager = new OfflineManager();
