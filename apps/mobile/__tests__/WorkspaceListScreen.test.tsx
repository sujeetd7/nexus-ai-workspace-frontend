import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { WorkspaceListScreen } from '../src/screens/workspaces/WorkspaceListScreen';

jest.mock('@nexus/shared-ui', () => {
  const ReactLocal = require('react');
  const wrapText = (children: React.ReactNode) => {
    if (typeof children === 'string' || typeof children === 'number') {
      return ReactLocal.createElement('Text', null, children);
    }
    return children;
  };
  return {
    SharedUIProvider: ({ children }: { children: React.ReactNode }) =>
      ReactLocal.createElement(ReactLocal.Fragment, null, children),
    Loader: (props: { accessibilityLabel?: string }) =>
      ReactLocal.createElement('View', { ...props, testID: 'loader' }),
    Button: ({
      children,
      onPress,
      accessibilityLabel,
      disabled,
      loading,
    }: {
      children?: React.ReactNode;
      onPress?: () => void;
      accessibilityLabel?: string;
      disabled?: boolean;
      loading?: boolean;
    }) =>
      ReactLocal.createElement(
        'View',
        {
          onPress,
          accessibilityLabel,
          disabled,
          loading,
          accessible: true,
        },
        wrapText(children),
      ),
    Text: ({ children }: { children?: React.ReactNode }) =>
      ReactLocal.createElement('Text', null, children),
    InlineAlert: ({
      children,
      title,
    }: {
      children?: React.ReactNode;
      title?: string;
    }) =>
      ReactLocal.createElement(
        'View',
        null,
        ReactLocal.createElement('Text', null, title),
        wrapText(children),
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
    View: ({
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
    Card: ({
      children,
      header,
      testID,
      accessibilityLabel,
    }: {
      children?: React.ReactNode;
      header?: React.ReactNode;
      testID?: string;
      accessibilityLabel?: string;
    }) =>
      ReactLocal.createElement(
        'View',
        { testID, accessibilityLabel },
        header,
        children,
      ),
    Badge: ({ children }: { children?: React.ReactNode }) =>
      ReactLocal.createElement('Text', null, children),
    useTheme: () => ({
      theme: {
        semantic: {
          border: '#E5E7EB',
          primary: '#2563EB',
          onPrimary: '#FFFFFF',
        },
      },
    }),
  };
});

const mockListState = {
  data: undefined as
    | Array<{
        id: string;
        name: string;
        slug: string;
        description?: string;
        ownerId: string;
        status: 'ACTIVE';
        createdAt: string;
        updatedAt: string;
      }>
    | undefined,
  error: undefined as unknown,
  isLoading: false,
  isFetching: false,
  refetch: jest.fn(),
};

jest.mock('../src/api/services/workspace/workspaceApi', () => ({
  useListWorkspacesQuery: () => mockListState,
}));

jest.mock('../src/hooks/useWorkspaceSwitch', () => ({
  useWorkspaceSwitch: () => jest.fn(async () => undefined),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      workspace: { workspaceId: undefined, status: 'ready' },
    }),
  useDispatch: () => jest.fn(),
}));

function renderTree() {
  let tree: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<WorkspaceListScreen />);
  });
  return tree!;
}

describe('WorkspaceListScreen (mobile)', () => {
  beforeEach(() => {
    mockListState.data = undefined;
    mockListState.error = undefined;
    mockListState.isLoading = false;
    mockListState.isFetching = false;
    mockListState.refetch.mockReset();
  });

  it('shows loading skeleton state', () => {
    mockListState.isLoading = true;
    const tree = renderTree();
    const json = JSON.stringify(tree.toJSON());
    expect(json.includes('Select a workspace')).toBe(true);
    expect(json.includes('Nexus')).toBe(true);
  });

  it('shows empty state', () => {
    mockListState.data = [];
    const tree = renderTree();
    const json = JSON.stringify(tree.toJSON());
    expect(json.includes('No workspaces yet')).toBe(true);
  });

  it('renders workspace rows', () => {
    mockListState.data = [
      {
        id: 'ws-1',
        name: 'Alpha',
        slug: 'alpha',
        ownerId: 'user-1',
        status: 'ACTIVE',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ];
    const tree = renderTree();
    const json = JSON.stringify(tree.toJSON());
    expect(json.includes('Alpha')).toBe(true);
    expect(json.includes('Switch to Alpha')).toBe(true);
  });

  it('shows unauthorized messaging with sign-in action', () => {
    mockListState.error = {
      status: 401,
      message: 'Unauthorized',
      code: 'HTTP_401',
    };
    const tree = renderTree();
    const json = JSON.stringify(tree.toJSON());
    expect(json.includes('Session expired')).toBe(true);
    expect(json.includes('Sign in')).toBe(true);
  });

  it('shows forbidden messaging without signing the user out', () => {
    mockListState.error = {
      status: 403,
      message: 'Forbidden',
      code: 'HTTP_403',
    };
    const tree = renderTree();
    const json = JSON.stringify(tree.toJSON());
    expect(json.includes('Permission denied')).toBe(true);
    expect(json.includes('Sign in')).toBe(false);
  });

  it('shows network retry action', () => {
    mockListState.error = {
      status: 503,
      message: 'Unavailable',
      code: 'HTTP_503',
    };
    const tree = renderTree();
    const json = JSON.stringify(tree.toJSON());
    expect(json.includes('Service unavailable') || json.includes('Retry')).toBe(
      true,
    );
  });
});
