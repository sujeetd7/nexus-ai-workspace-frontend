import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { AccessibilityInfo } from 'react-native';

import { useDrawer } from './useDrawer';

function createDrawerHarness() {
  const state: { current: ReturnType<typeof useDrawer> | null } = {
    current: null,
  };

  function HookHost() {
    state.current = useDrawer();
    return null;
  }

  let renderer: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<HookHost />);
  });

  return {
    get drawer() {
      return state.current!;
    },
    act(callback: () => void) {
      ReactTestRenderer.act(callback);
      ReactTestRenderer.act(() => {
        renderer.update(<HookHost />);
      });
    },
  };
}

describe('useDrawer', () => {
  beforeEach(() => {
    jest
      .spyOn(AccessibilityInfo, 'announceForAccessibility')
      .mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('starts closed', () => {
    const harness = createDrawerHarness();
    expect(harness.drawer.open).toBe(false);
  });

  it('opens the drawer and announces', () => {
    const harness = createDrawerHarness();

    harness.act(() => {
      harness.drawer.openDrawer();
    });

    expect(harness.drawer.open).toBe(true);
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      'Navigation menu opened',
    );
  });

  it('closes the drawer and announces', () => {
    const harness = createDrawerHarness();

    harness.act(() => {
      harness.drawer.openDrawer();
      harness.drawer.closeDrawer();
    });

    expect(harness.drawer.open).toBe(false);
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      'Navigation menu closed',
    );
  });

  it('toggles drawer state with announcements', () => {
    const harness = createDrawerHarness();

    harness.act(() => {
      harness.drawer.toggleDrawer();
    });
    expect(harness.drawer.open).toBe(true);

    harness.act(() => {
      harness.drawer.toggleDrawer();
    });
    expect(harness.drawer.open).toBe(false);
  });
});
