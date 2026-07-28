import type { ComponentType } from 'react';

import { MobileAppShell } from './MobileAppShell';

/**
 * Wraps an authenticated screen with production mobile shell chrome.
 */
export function createShellScreen<P extends object>(
  Screen: ComponentType<P>,
): ComponentType<P> {
  function ShellWrappedScreen(props: P) {
    return (
      <MobileAppShell>
        <Screen {...props} />
      </MobileAppShell>
    );
  }

  ShellWrappedScreen.displayName = `Shell(${Screen.displayName ?? Screen.name ?? 'Screen'})`;
  return ShellWrappedScreen;
}
