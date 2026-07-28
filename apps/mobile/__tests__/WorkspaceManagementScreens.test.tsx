import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import {
  WorkspaceDetailScreen,
  WorkspaceMembersScreen,
} from '../src/screens/workspaces';

const mockRefetch = jest.fn();
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockUpdateWorkspace = jest.fn(() => ({ unwrap: jest.fn() }));
const mockRemoveMember = jest.fn(() => ({ unwrap: jest.fn() }));
const mockUpdateMemberRole = jest.fn(() => ({ unwrap: jest.fn() }));

const workspaceFixture = {
  id: 'ws-1',
  name: 'Nexus Labs',
  slug: 'nexus-labs',
  description: 'Primary workspace',
  ownerId: 'owner-1',
  status: 'ACTIVE' as const,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
};

const membersFixture = [
  {
    id: 'mem-1',
    workspaceId: 'ws-1',
    userId: 'user-1',
    role: 'DEVELOPER' as const,
    joinedAt: '2026-01-01T00:00:00.000Z',
  },
];

const mockWorkspaceQuery = {
  data: undefined as typeof workspaceFixture | undefined,
  error: undefined as unknown,
  isLoading: false,
  isFetching: false,
  refetch: mockRefetch,
};

const mockMembersQuery = {
  data: undefined as typeof membersFixture | undefined,
  error: undefined as unknown,
  isLoading: false,
  isFetching: false,
  refetch: mockRefetch,
};

jest.mock('../src/api/services/workspace/workspaceApi', () => ({
  useGetWorkspaceQuery: () => mockWorkspaceQuery,
  useListMembersQuery: () => mockMembersQuery,
  useUpdateWorkspaceMutation: () => [
    mockUpdateWorkspace,
    { isLoading: false, error: undefined, isSuccess: false },
  ],
  useRemoveMemberMutation: () => [
    mockRemoveMember,
    { isLoading: false, error: undefined },
  ],
  useUpdateMemberRoleMutation: () => [
    mockUpdateMemberRole,
    { isLoading: false, error: undefined },
  ],
  useListInvitationsQuery: () => ({
    data: [],
    error: undefined,
    isLoading: false,
    isFetching: false,
    refetch: mockRefetch,
  }),
  useDeleteInvitationMutation: () => [
    jest.fn(),
    { isLoading: false, error: undefined },
  ],
  useCreateInvitationMutation: () => [
    jest.fn(),
    { isLoading: false, error: undefined, isSuccess: false },
  ],
  useAcceptInvitationMutation: () => [
    jest.fn(),
    { isLoading: false, error: undefined, isSuccess: false },
  ],
  useRejectInvitationMutation: () => [
    jest.fn(),
    { isLoading: false, error: undefined },
  ],
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: { workspaceId: 'ws-1' } }),
}));

jest.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      auth: {
        user: {
          id: 'user-1',
          email: 'user@example.com',
          role: 'DEVELOPER',
          firstName: 'Ada',
          lastName: 'Lovelace',
          emailVerified: true,
          isActive: true,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      },
      workspace: {
        workspaceId: 'ws-1',
        status: 'ready',
      },
    }),
  useDispatch: () => mockDispatch,
}));

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
    }: {
      children?: React.ReactNode;
      onPress?: () => void;
      accessibilityLabel?: string;
    }) =>
      ReactLocal.createElement(
        'Button',
        { onPress, accessibilityLabel },
        wrapText(children),
      ),
    Text: ({ children }: { children?: React.ReactNode }) =>
      ReactLocal.createElement('Text', null, wrapText(children)),
    Stack: ({
      children,
      testID,
    }: {
      children?: React.ReactNode;
      testID?: string;
    }) => ReactLocal.createElement('View', { testID }, children),
    InlineAlert: ({
      title,
      children,
    }: {
      title?: React.ReactNode;
      children?: React.ReactNode;
    }) =>
      ReactLocal.createElement(
        'View',
        { testID: 'inline-alert' },
        wrapText(title),
        wrapText(children),
      ),
    EmptyState: ({
      title,
      description,
    }: {
      title?: React.ReactNode;
      description?: React.ReactNode;
    }) =>
      ReactLocal.createElement(
        'View',
        { testID: 'empty-state' },
        wrapText(title),
        wrapText(description),
      ),
    FormField: ({
      label,
      value,
    }: {
      label?: string;
      value?: string;
    }) =>
      ReactLocal.createElement('View', {
        accessibilityLabel: label,
        value,
      }),
  };
});

describe('Mobile workspace management screens', () => {
  beforeEach(() => {
    mockWorkspaceQuery.data = undefined;
    mockWorkspaceQuery.error = undefined;
    mockWorkspaceQuery.isLoading = false;
    mockMembersQuery.data = undefined;
    mockMembersQuery.error = undefined;
    mockMembersQuery.isLoading = false;
    mockRefetch.mockReset();
    mockNavigate.mockReset();
    mockDispatch.mockReset();
  });

  it('renders workspace detail metadata', () => {
    mockWorkspaceQuery.data = workspaceFixture;
    mockMembersQuery.data = membersFixture;

    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<WorkspaceDetailScreen />);
    });

    const root = tree!.root;
    expect(
      root.findByProps({ testID: 'mobile-workspace-detail-screen' }),
    ).toBeTruthy();
    expect(root.findByProps({ children: 'Nexus Labs' })).toBeTruthy();
    expect(
      root.findByProps({ accessibilityLabel: 'Leave workspace' }),
    ).toBeTruthy();
  });

  it('renders workspace detail failure with retry', () => {
    mockWorkspaceQuery.error = {
      status: 500,
      message: 'boom',
      code: 'HTTP_500',
    };

    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<WorkspaceDetailScreen />);
    });

    const root = tree!.root;
    expect(
      root.findByProps({ testID: 'mobile-workspace-detail-error' }),
    ).toBeTruthy();
    expect(
      root.findByProps({ accessibilityLabel: 'Retry loading workspace' }),
    ).toBeTruthy();
  });

  it('renders members screen with leave action', () => {
    mockWorkspaceQuery.data = workspaceFixture;
    mockMembersQuery.data = membersFixture;

    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<WorkspaceMembersScreen />);
    });

    const root = tree!.root;
    expect(
      root.findByProps({ testID: 'mobile-workspace-members-screen' }),
    ).toBeTruthy();
    expect(
      root.findByProps({ accessibilityLabel: 'Leave workspace' }),
    ).toBeTruthy();
  });
});
