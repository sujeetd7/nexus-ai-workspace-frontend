import { useCallback, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export interface DrawerState {
  readonly open: boolean;
  readonly openDrawer: () => void;
  readonly closeDrawer: () => void;
  readonly toggleDrawer: () => void;
}

/**
 * Drawer open/close state with accessibility announcements.
 */
export function useDrawer(): DrawerState {
  const [open, setOpen] = useState(false);

  const announce = useCallback((message: string) => {
    void AccessibilityInfo.announceForAccessibility(message);
  }, []);

  const openDrawer = useCallback(() => {
    setOpen(true);
    announce('Navigation menu opened');
  }, [announce]);

  const closeDrawer = useCallback(() => {
    setOpen(false);
    announce('Navigation menu closed');
  }, [announce]);

  const toggleDrawer = useCallback(() => {
    setOpen((previous) => {
      const next = !previous;
      announce(next ? 'Navigation menu opened' : 'Navigation menu closed');
      return next;
    });
  }, [announce]);

  return {
    open,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
}
