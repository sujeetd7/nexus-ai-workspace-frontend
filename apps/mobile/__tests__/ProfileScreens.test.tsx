import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import {
  EditProfileScreen,
  PreferencesScreen,
  ProfileScreen,
} from '../src/screens/profile';

const mockRefetch = jest.fn();
const mockUpdateCurrentUser = jest.fn(() => ({ unwrap: jest.fn() }));
const mockCreateUserProfile = jest.fn(() => ({ unwrap: jest.fn() }));
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

const profileFixture = {
  id: 'profile-1',
  authUserId: 'user-1',
  email: 'user@example.com',
  firstName: 'Ada',
  lastName: 'Lovelace',
  avatar: 'https://cdn.example.com/ada.png',
  status: 'ACTIVE' as const,
  preferences: { theme: 'light' },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
};

const mockQueryState = {
  data: undefined as typeof profileFixture | undefined,
  error: undefined as unknown,
  isLoading: false,
  isFetching: false,
  refetch: mockRefetch,
};

const mockCreateState = {
  data: undefined as typeof profileFixture | undefined,
  error: undefined as unknown,
  isLoading: false,
  isError: false,
};

jest.mock('../src/api/services/user/userApi', () => ({
  useGetCurrentUserQuery: () => mockQueryState,
  useUpdateCurrentUserMutation: () => [
    mockUpdateCurrentUser,
    { isLoading: false, error: undefined },
  ],
  useCreateUserProfileMutation: () => [mockCreateUserProfile, mockCreateState],
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
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
    EmptyState: ({
      title,
      description,
    }: {
      title?: React.ReactNode;
      description?: React.ReactNode;
    }) =>
      ReactLocal.createElement(
        'View',
        null,
        ReactLocal.createElement('Text', null, title),
        ReactLocal.createElement('Text', null, description),
      ),
    Avatar: (props: { testID?: string; accessibilityLabel?: string }) =>
      ReactLocal.createElement('View', {
        testID: props.testID,
        accessibilityLabel: props.accessibilityLabel,
      }),
    FormField: ({
      label,
      value,
      accessibilityLabel,
      errorText,
    }: {
      label?: React.ReactNode;
      value?: string;
      accessibilityLabel?: string;
      errorText?: React.ReactNode;
    }) =>
      ReactLocal.createElement(
        'View',
        { accessibilityLabel },
        ReactLocal.createElement('Text', null, label),
        ReactLocal.createElement('Text', null, value),
        errorText
          ? ReactLocal.createElement('Text', null, errorText)
          : null,
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

function renderScreen(ui: React.ReactElement) {
  let tree: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(ui);
  });
  return tree!;
}

describe('Mobile profile screens', () => {
  beforeEach(() => {
    mockQueryState.data = undefined;
    mockQueryState.error = undefined;
    mockQueryState.isLoading = false;
    mockQueryState.isFetching = false;
    mockCreateState.data = undefined;
    mockCreateState.error = undefined;
    mockCreateState.isLoading = false;
    mockCreateState.isError = false;
    mockRefetch.mockReset();
    mockUpdateCurrentUser.mockClear();
    mockCreateUserProfile.mockClear();
    mockNavigate.mockClear();
    mockDispatch.mockClear();
  });

  it('renders profile details with navigation actions', () => {
    mockQueryState.data = profileFixture;
    const tree = renderScreen(<ProfileScreen />);
    expect(
      tree.root.findByProps({ testID: 'mobile-profile-screen' }),
    ).toBeTruthy();
    expect(
      tree.root.findByProps({ testID: 'mobile-profile-avatar' }),
    ).toBeTruthy();
    expect(
      tree.root.findByProps({ accessibilityLabel: 'Edit profile' }),
    ).toBeTruthy();
    expect(
      tree.root.findByProps({ accessibilityLabel: 'Preferences' }),
    ).toBeTruthy();
  });

  it('shows loading state', () => {
    mockQueryState.isLoading = true;
    const tree = renderScreen(<ProfileScreen />);
    expect(
      tree.root.findByProps({ testID: 'mobile-profile-screen-loading' }),
    ).toBeTruthy();
  });

  it('shows session expired sign-in on 401', () => {
    mockQueryState.error = {
      status: 401,
      message: 'Unauthorized',
      code: 'UNAUTHORIZED',
    };
    const tree = renderScreen(<ProfileScreen />);
    expect(
      tree.root.findByProps({ testID: 'mobile-profile-screen-error' }),
    ).toBeTruthy();
    expect(
      tree.root.findByProps({ accessibilityLabel: 'Sign in' }),
    ).toBeTruthy();
  });

  it('renders edit profile form', () => {
    mockQueryState.data = profileFixture;
    const tree = renderScreen(<EditProfileScreen />);
    expect(
      tree.root.findByProps({ testID: 'mobile-edit-profile-screen' }),
    ).toBeTruthy();
    expect(
      tree.root.findByProps({ accessibilityLabel: 'Save profile changes' }),
    ).toBeTruthy();
  });

  it('renders preferences form', () => {
    mockQueryState.data = profileFixture;
    const tree = renderScreen(<PreferencesScreen />);
    expect(
      tree.root.findByProps({ testID: 'mobile-preferences-screen' }),
    ).toBeTruthy();
    expect(
      tree.root.findByProps({ accessibilityLabel: 'Save preferences' }),
    ).toBeTruthy();
  });

  it('shows preferences retry on retryable failure', () => {
    mockQueryState.error = {
      status: 500,
      message: 'Unavailable',
      code: 'INTERNAL',
    };
    const tree = renderScreen(<PreferencesScreen />);
    expect(
      tree.root.findByProps({ testID: 'mobile-preferences-error' }),
    ).toBeTruthy();
    expect(
      tree.root.findByProps({ accessibilityLabel: 'Retry loading preferences' }),
    ).toBeTruthy();
  });
});
