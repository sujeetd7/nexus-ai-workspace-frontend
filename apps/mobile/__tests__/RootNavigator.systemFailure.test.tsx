import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { RootNavigator } from '../src/navigation/RootNavigator';

const mockSelectors = {
  initialized: true,
  loading: false,
  authenticated: false,
  authStatus: 'unauthenticated' as string,
  workspaceStatus: 'ready' as string,
  workspaceReady: true,
  selectedWorkspaceId: undefined as string | undefined,
  workspaceError: undefined as string | undefined,
};

jest.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      auth: {
        initialized: mockSelectors.initialized,
        loading: mockSelectors.loading,
        authenticated: mockSelectors.authenticated,
        status: mockSelectors.authStatus,
      },
      workspace: {
        status: mockSelectors.workspaceStatus,
        workspaceId: mockSelectors.selectedWorkspaceId,
        error: mockSelectors.workspaceError,
      },
    }),
  useDispatch: () => jest.fn(),
}));

jest.mock('@react-navigation/native-stack', () => {
  const ReactLocal = require('react');
  return {
    createNativeStackNavigator: () => {
      const Navigator = ({ children }: { children?: React.ReactNode }) =>
        ReactLocal.createElement('View', { testID: 'stack' }, children);
      const Screen = ({ name }: { name: string }) =>
        ReactLocal.createElement('View', { testID: `screen-${name}` });
      return { Navigator, Screen };
    },
  };
});

jest.mock('../src/api/services/workspace/workspaceApi', () => ({
  useListWorkspacesQuery: () => ({
    error:
      mockSelectors.workspaceStatus === 'error'
        ? { status: 503, message: 'Unavailable', code: 'HTTP_503' }
        : undefined,
    refetch: jest.fn(),
    isFetching: false,
  }),
}));

jest.mock('../src/api/services/user/userApi', () => ({
  useGetCurrentUserQuery: () => ({
    error: undefined,
    refetch: jest.fn(),
    isFetching: false,
  }),
}));

jest.mock('../src/api/client/axios', () => ({
  getMobileSession: () => ({
    logout: jest.fn(async () => undefined),
  }),
}));

jest.mock('../src/screens/system', () => {
  const ReactLocal = require('react');
  return {
    HomeScreen: () => ReactLocal.createElement('View', { testID: 'home' }),
    NotFoundScreen: () =>
      ReactLocal.createElement('View', { testID: 'not-found' }),
  };
});

jest.mock('../src/screens/auth', () => {
  const ReactLocal = require('react');
  return {
    DashboardScreen: () =>
      ReactLocal.createElement('View', { testID: 'dashboard' }),
    ForgotPasswordScreen: () => ReactLocal.createElement('View'),
    LoginScreen: () => ReactLocal.createElement('View', { testID: 'login' }),
    RegisterScreen: () => ReactLocal.createElement('View'),
    ResetPasswordScreen: () => ReactLocal.createElement('View'),
    VerifyEmailScreen: () => ReactLocal.createElement('View'),
  };
});

jest.mock('../src/screens/profile/ProfileScreen', () => {
  const ReactLocal = require('react');
  return {
    ProfileScreen: () => ReactLocal.createElement('View'),
  };
});

jest.mock('../src/screens/workspaces/WorkspaceListScreen', () => {
  const ReactLocal = require('react');
  return {
    WorkspaceListScreen: () =>
      ReactLocal.createElement('View', { testID: 'workspaces' }),
  };
});

jest.mock('@nexus/shared-ui', () => {
  const ReactLocal = require('react');
  const wrapText = (children: React.ReactNode) => {
    if (typeof children === 'string' || typeof children === 'number') {
      return ReactLocal.createElement('Text', null, children);
    }
    return children;
  };
  return {
    Loader: (props: { accessibilityLabel?: string }) =>
      ReactLocal.createElement('View', { ...props, testID: 'loader' }),
    Button: ({
      children,
      onPress,
      accessibilityLabel,
      testID,
      loading,
      disabled,
    }: {
      children?: React.ReactNode;
      onPress?: () => void;
      accessibilityLabel?: string;
      testID?: string;
      loading?: boolean;
      disabled?: boolean;
    }) =>
      ReactLocal.createElement(
        'View',
        {
          onPress,
          accessibilityLabel,
          testID,
          loading,
          disabled,
          accessible: true,
        },
        wrapText(children),
      ),
    Text: ({ children }: { children?: React.ReactNode }) =>
      ReactLocal.createElement('Text', null, children),
    InlineAlert: ({
      children,
      title,
      testID,
    }: {
      children?: React.ReactNode;
      title?: string;
      testID?: string;
    }) =>
      ReactLocal.createElement(
        'View',
        { testID },
        ReactLocal.createElement('Text', null, title),
        wrapText(children),
      ),
    EmptyState: ({
      title,
      description,
      primaryAction,
      secondaryAction,
      testID,
      accessibilityLabel,
    }: {
      title?: React.ReactNode;
      description?: React.ReactNode;
      primaryAction?: React.ReactNode;
      secondaryAction?: React.ReactNode;
      testID?: string;
      accessibilityLabel?: string;
    }) =>
      ReactLocal.createElement(
        'View',
        { testID, accessibilityLabel },
        ReactLocal.createElement('Text', null, title),
        ReactLocal.createElement('Text', null, description),
        primaryAction,
        secondaryAction,
      ),
    Stack: ({
      children,
      testID,
      accessibilityLabel,
    }: {
      children?: React.ReactNode;
      testID?: string;
      accessibilityLabel?: string;
    }) =>
      ReactLocal.createElement(
        'View',
        { testID, accessibilityLabel },
        children,
      ),
  };
});

describe('RootNavigator system failure states', () => {
  beforeEach(() => {
    mockSelectors.initialized = true;
    mockSelectors.loading = false;
    mockSelectors.authenticated = false;
    mockSelectors.authStatus = 'unauthenticated';
    mockSelectors.workspaceStatus = 'ready';
    mockSelectors.workspaceReady = true;
    mockSelectors.selectedWorkspaceId = undefined;
    mockSelectors.workspaceError = undefined;
  });

  it('shows session-expired gate and does not render protected screens', () => {
    mockSelectors.authStatus = 'session-expired';
    mockSelectors.authenticated = false;

    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<RootNavigator />);
    });

    const json = JSON.stringify(tree!.toJSON());
    expect(json.includes('Session expired')).toBe(true);
    expect(json.includes('mobile-session-expired')).toBe(true);
    expect(json.includes('screen-Dashboard')).toBe(false);
  });

  it('shows workspace bootstrap network error with retry', () => {
    mockSelectors.authenticated = true;
    mockSelectors.authStatus = 'authenticated';
    mockSelectors.workspaceStatus = 'error';
    mockSelectors.workspaceReady = false;
    mockSelectors.workspaceError = 'Unable to load workspaces.';

    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<RootNavigator />);
    });

    const json = JSON.stringify(tree!.toJSON());
    expect(json.includes('mobile-workspace-bootstrap-error')).toBe(true);
    expect(json.includes('Service unavailable') || json.includes('Retry')).toBe(
      true,
    );
  });

  it('shows unauthorized auth stack when session is cleared', () => {
    mockSelectors.authenticated = false;
    mockSelectors.authStatus = 'unauthenticated';

    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<RootNavigator />);
    });

    const json = JSON.stringify(tree!.toJSON());
    expect(json.includes('screen-Login')).toBe(true);
    expect(json.includes('screen-Dashboard')).toBe(false);
  });
});
