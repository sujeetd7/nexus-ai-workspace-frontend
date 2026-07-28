import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { DashboardScreen } from '../src/screens/auth/DashboardScreen';

const mockDispatch = jest.fn();
const mockLogout = jest.fn(async () => undefined);

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      auth: {
        user: {
          id: 'user-1',
          email: 'alex@example.com',
        },
      },
      workspace: {
        workspaceId: 'ws-1',
      },
    }),
}));

jest.mock('../src/api/client/axios', () => ({
  getMobileSession: () => ({
    logout: mockLogout,
  }),
}));

jest.mock('../src/store/slices/auth/authSlice', () => ({
  logoutCompleted: () => ({ type: 'auth/logoutCompleted' }),
}));

jest.mock('@nexus/shared-ui', () => {
  const ReactLocal = require('react');
  return {
    Button: ({
      children,
      onPress,
      testID,
      accessibilityLabel,
    }: {
      children?: React.ReactNode;
      onPress?: () => void;
      testID?: string;
      accessibilityLabel?: string;
    }) =>
      ReactLocal.createElement(
        'View',
        { onPress, testID, accessibilityLabel, accessible: true },
        ReactLocal.createElement('Text', null, children),
      ),
    Stack: ({
      children,
      testID,
    }: {
      children?: React.ReactNode;
      testID?: string;
    }) => ReactLocal.createElement('View', { testID }, children),
    Text: ({ children }: { children?: React.ReactNode }) =>
      ReactLocal.createElement('Text', null, children),
  };
});

function findByTestId(
  root: ReactTestRenderer.ReactTestRenderer,
  testID: string,
) {
  return root.root.find(
    node =>
      node.props.testID === testID || node.props['data-testid'] === testID,
  );
}

describe('DashboardScreen (mobile)', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    mockLogout.mockClear();
  });

  it('renders the authenticated logout action', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<DashboardScreen />);
    });

    expect(findByTestId(tree!, 'mobile-logout-button')).toBeTruthy();
    expect(JSON.stringify(tree!.toJSON()).includes('Sign out')).toBe(true);
  });

  it('logs out through the session manager and clears auth state', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<DashboardScreen />);
    });

    await ReactTestRenderer.act(async () => {
      findByTestId(tree!, 'mobile-logout-button').props.onPress();
      await Promise.resolve();
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/logoutCompleted' });
  });
});
