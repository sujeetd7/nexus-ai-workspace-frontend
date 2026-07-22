/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { resetMobileBootstrapForTests } from '../src/bootstrap/bootstrapApp';
import {
  MOBILE_ROUTE_IDS,
  MOBILE_ROUTE_NAMES,
  navigationLinking,
} from '../src/navigation';
import { ROUTE_IDS } from '@nexus/shared-types';

jest.mock('@nexus/shared-ui', () => {
  const ReactLocal = require('react');
  return {
    SharedUIProvider: ({ children }: { children: React.ReactNode }) =>
      ReactLocal.createElement(ReactLocal.Fragment, null, children),
    Loader: () => null,
    Button: ({
      children,
      onPress,
    }: {
      children?: React.ReactNode;
      onPress?: () => void;
    }) => ReactLocal.createElement('Button', { onPress }, children),
    Text: ({ children }: { children?: React.ReactNode }) =>
      ReactLocal.createElement('Text', null, children),
    Stack: ({ children }: { children?: React.ReactNode }) =>
      ReactLocal.createElement('View', null, children),
    View: ({ children }: { children?: React.ReactNode }) =>
      ReactLocal.createElement('View', null, children),
    Divider: () => null,
    Section: ({ children }: { children?: React.ReactNode }) =>
      ReactLocal.createElement('View', null, children),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const ReactLocal = require('react');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) =>
      ReactLocal.createElement(ReactLocal.Fragment, null, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock('@react-navigation/native', () => {
  const ReactLocal = require('react');
  return {
    NavigationContainer: ({ children }: { children: React.ReactNode }) =>
      ReactLocal.createElement(
        ReactLocal.Fragment,
        null,
        children,
        ReactLocal.createElement('NavigationContainerMarker'),
      ),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const ReactLocal = require('react');

  const Screen = ({
    component: Component,
    name,
  }: {
    component?: React.ComponentType<{
      navigation: { navigate: (route: string) => void };
      route: { key: string; name: string; params?: undefined };
    }>;
    name: string;
  }) => {
    if (!Component) {
      return null;
    }

    return ReactLocal.createElement(Component, {
      navigation: { navigate: jest.fn() },
      route: { key: name, name, params: undefined },
    });
  };

  const Navigator = ({
    children,
    initialRouteName,
  }: {
    children?: React.ReactNode;
    initialRouteName?: string;
  }) => {
    const screens = ReactLocal.Children.toArray(children) as Array<{
      props: { name: string };
    }>;
    const initial =
      screens.find(child => child.props.name === initialRouteName) ??
      screens[0];

    return ReactLocal.createElement(
      'Navigator',
      { initialRouteName },
      initial ?? null,
    );
  };

  return {
    createNativeStackNavigator: () => ({
      Navigator,
      Screen,
    }),
  };
});

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

import App from '../App';

beforeEach(() => {
  resetMobileBootstrapForTests();
});

test('renders bootstrap gate with navigation without throwing', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<App />);
  });

  await ReactTestRenderer.act(async () => {
    await Promise.resolve();
  });

  const json = tree!.toJSON();
  expect(json).toBeTruthy();

  const flat = JSON.stringify(json);
  expect(flat).toContain('NavigationContainerMarker');
  // Exactly one NavigationContainer marker in the tree.
  expect(flat.split('NavigationContainerMarker').length - 1).toBe(1);
  expect(flat).toContain('Home');
});

test('exposes typed infrastructure route names and linking shape', () => {
  expect(MOBILE_ROUTE_NAMES.Home).toBe('Home');
  expect(MOBILE_ROUTE_NAMES.NotFound).toBe('NotFound');
  expect(MOBILE_ROUTE_IDS.Home).toBe(ROUTE_IDS.HOME);
  expect(MOBILE_ROUTE_IDS.NotFound).toBe(ROUTE_IDS.NOT_FOUND);

  expect(navigationLinking.prefixes).toEqual([]);
  expect(navigationLinking.config?.screens).toMatchObject({
    Home: '',
    NotFound: '*',
  });
});
