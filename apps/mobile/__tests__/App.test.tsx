/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { resetMobileBootstrapForTests } from '../src/bootstrap/bootstrapApp';

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
  };
});

jest.mock('@react-native/new-app-screen', () => ({
  NewAppScreen: () => null,
}));

import App from '../App';

beforeEach(() => {
  resetMobileBootstrapForTests();
});

test('renders bootstrap gate without throwing', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<App />);
  });

  await ReactTestRenderer.act(async () => {
    await Promise.resolve();
  });

  expect(tree!.toJSON()).toBeTruthy();
});
