import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockForgotPassword = jest.fn();
const mockResetPassword = jest.fn();
const mockVerifyEmail = jest.fn();
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

let mockRouteParams: { token?: string } | undefined;
let mockAuthState = {
  loading: false,
  error: null as string | null,
};

jest.mock('@nexus/shared-ui', () => {
  const ReactLocal = require('react');
  const wrapText = (children: React.ReactNode) => {
    if (typeof children === 'string' || typeof children === 'number') {
      return ReactLocal.createElement('Text', null, children);
    }
    return children;
  };
  return {
    AuthShell: ({
      children,
      brand,
      testID,
    }: {
      children?: React.ReactNode;
      brand?: React.ReactNode;
      testID?: string;
    }) =>
      ReactLocal.createElement(
        'View',
        { testID },
        brand,
        children,
      ),
    AuthCard: ({
      children,
      title,
      status,
      footer,
      testID,
    }: {
      children?: React.ReactNode;
      title?: React.ReactNode;
      status?: React.ReactNode;
      footer?: React.ReactNode;
      testID?: string;
    }) =>
      ReactLocal.createElement(
        'View',
        { testID },
        wrapText(title),
        status,
        children,
        footer,
      ),
    AuthFooter: ({
      prompt,
      link,
    }: {
      prompt?: React.ReactNode;
      link: { label: React.ReactNode; onPress?: () => void };
    }) =>
      ReactLocal.createElement(
        'View',
        null,
        wrapText(prompt),
        ReactLocal.createElement(
          'View',
          {
            accessibilityRole: 'link',
            accessibilityLabel:
              typeof link.label === 'string' ? link.label : undefined,
            onPress: link.onPress,
          },
          wrapText(link.label),
        ),
      ),
    FormField: ({
      label,
      errorText,
      testID,
      value,
      onChangeText,
    }: {
      label?: React.ReactNode;
      errorText?: React.ReactNode;
      testID?: string;
      value?: string;
      onChangeText?: (value: string) => void;
    }) =>
      ReactLocal.createElement(
        'View',
        { testID },
        wrapText(label),
        ReactLocal.createElement('TextInput', {
          testID: testID ? `${testID}-input` : undefined,
          value,
          onChangeText,
          accessibilityLabel: typeof label === 'string' ? label : undefined,
        }),
        errorText
          ? ReactLocal.createElement('Text', null, errorText)
          : null,
      ),
    Button: ({
      children,
      onPress,
      testID,
      accessibilityLabel,
      disabled,
      loading,
    }: {
      children?: React.ReactNode;
      onPress?: () => void;
      testID?: string;
      accessibilityLabel?: string;
      disabled?: boolean;
      loading?: boolean;
    }) =>
      ReactLocal.createElement(
        'View',
        {
          testID,
          onPress,
          accessibilityLabel,
          accessibilityState: { disabled: Boolean(disabled || loading) },
          accessible: true,
        },
        wrapText(children),
      ),
    Link: ({
      children,
      onPress,
      accessibilityLabel,
    }: {
      children?: React.ReactNode;
      onPress?: () => void;
      accessibilityLabel?: string;
    }) =>
      ReactLocal.createElement(
        'View',
        {
          accessibilityRole: 'link',
          accessibilityLabel,
          onPress,
        },
        wrapText(children),
      ),
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
        { testID, accessibilityRole: 'alert' },
        ReactLocal.createElement('Text', null, title),
        wrapText(children),
      ),
    Loader: (props: { accessibilityLabel?: string; testID?: string }) =>
      ReactLocal.createElement('View', {
        ...props,
        testID: props.testID ?? 'loader',
      }),
    Stack: ({
      children,
      testID,
    }: {
      children?: React.ReactNode;
      testID?: string;
    }) => ReactLocal.createElement('View', { testID }, children),
    Text: ({ children }: { children?: React.ReactNode }) =>
      ReactLocal.createElement('Text', null, children),
    View: ({
      children,
      testID,
    }: {
      children?: React.ReactNode;
      testID?: string;
    }) => ReactLocal.createElement('View', { testID }, children),
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({
    key: 'test',
    name: 'test',
    params: mockRouteParams,
  }),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      auth: {
        loading: mockAuthState.loading,
        error: mockAuthState.error,
      },
    }),
}));

jest.mock('../src/api/client/axios', () => ({
  getMobileSession: () => ({
    login: mockLogin,
    register: mockRegister,
  }),
}));

jest.mock('../src/api/auth/createMobileAuthClient', () => ({
  getMobileAuthClient: () => ({
    forgotPassword: mockForgotPassword,
    resetPassword: mockResetPassword,
    verifyEmail: mockVerifyEmail,
  }),
}));

jest.mock('../src/store/slices/auth/selectors', () => ({
  selectAuthLoading: (state: { auth: { loading: boolean } }) =>
    state.auth.loading,
  selectAuthError: (state: { auth: { error: string | null } }) =>
    state.auth.error,
}));

import { ForgotPasswordScreen } from '../src/screens/auth/ForgotPasswordScreen';
import { LoginScreen } from '../src/screens/auth/LoginScreen';
import { ResetPasswordScreen } from '../src/screens/auth/ResetPasswordScreen';
import { VerifyEmailScreen } from '../src/screens/auth/VerifyEmailScreen';

function findByTestId(
  root: ReactTestRenderer.ReactTestRenderer,
  testID: string,
) {
  return root.root.findAll(
    (node) =>
      node.props.testID === testID ||
      node.props['data-testid'] === testID,
  )[0];
}

function renderScreen(element: React.ReactElement) {
  let tree: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(element);
  });
  return tree!;
}

describe('LoginScreen (mobile)', () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockNavigate.mockReset();
    mockDispatch.mockReset();
    mockAuthState = { loading: false, error: null };
    mockRouteParams = undefined;
  });

  it('renders brand, form, and submit with accessibility labels', () => {
    const tree = renderScreen(<LoginScreen />);
    expect(findByTestId(tree, 'login-card')).toBeTruthy();
    expect(findByTestId(tree, 'login-submit')).toBeTruthy();
    expect(JSON.stringify(tree.toJSON()).includes('Nexus AI Workspace')).toBe(
      true,
    );
    expect(JSON.stringify(tree.toJSON()).includes('Forgot password?')).toBe(
      true,
    );
    expect(findByTestId(tree, 'login-submit').props.accessibilityLabel).toBe(
      'Sign in',
    );
  });

  it('shows field validation errors on empty submit', () => {
    const tree = renderScreen(<LoginScreen />);
    ReactTestRenderer.act(() => {
      findByTestId(tree, 'login-submit').props.onPress();
    });
    const json = JSON.stringify(tree.toJSON());
    expect(json.includes('email') || json.includes('Email')).toBe(true);
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('disables submit while loading', () => {
    mockAuthState = { loading: true, error: null };
    const tree = renderScreen(<LoginScreen />);
    const submit = findByTestId(tree, 'login-submit');
    expect(submit).toBeTruthy();
    expect(submit.props.disabled || submit.props.accessibilityState?.disabled).toBe(
      true,
    );
  });

  it('shows API error alert', () => {
    mockAuthState = { loading: false, error: 'Invalid credentials' };
    const tree = renderScreen(<LoginScreen />);
    expect(findByTestId(tree, 'login-api-error')).toBeTruthy();
  });
});

describe('ForgotPasswordScreen (mobile)', () => {
  beforeEach(() => {
    mockForgotPassword.mockReset();
    mockNavigate.mockReset();
  });

  it('renders form and brand', () => {
    const tree = renderScreen(<ForgotPasswordScreen />);
    expect(findByTestId(tree, 'forgot-card')).toBeTruthy();
    expect(findByTestId(tree, 'forgot-submit')).toBeTruthy();
    expect(JSON.stringify(tree.toJSON()).includes('Nexus AI Workspace')).toBe(
      true,
    );
  });

  it('shows success after forgot password', async () => {
    mockForgotPassword.mockResolvedValue({ message: 'ok' });
    const tree = renderScreen(<ForgotPasswordScreen />);

    ReactTestRenderer.act(() => {
      findByTestId(tree, 'forgot-email-input').props.onChangeText(
        'user@example.com',
      );
    });

    await ReactTestRenderer.act(async () => {
      findByTestId(tree, 'forgot-submit').props.onPress();
      await Promise.resolve();
    });

    expect(findByTestId(tree, 'forgot-success')).toBeTruthy();
  });
});

describe('ResetPasswordScreen (mobile)', () => {
  beforeEach(() => {
    mockResetPassword.mockReset();
    mockNavigate.mockReset();
  });

  it('shows invalid link when token is missing', () => {
    mockRouteParams = undefined;
    const tree = renderScreen(<ResetPasswordScreen />);
    expect(findByTestId(tree, 'reset-invalid-token')).toBeTruthy();
    expect(findByTestId(tree, 'reset-submit')).toBeUndefined();
  });

  it('renders password confirmation fields when token present', () => {
    mockRouteParams = { token: 'abc' };
    const tree = renderScreen(<ResetPasswordScreen />);
    expect(findByTestId(tree, 'reset-password-input')).toBeTruthy();
    expect(findByTestId(tree, 'reset-confirmPassword-input')).toBeTruthy();
  });
});

describe('VerifyEmailScreen (mobile)', () => {
  beforeEach(() => {
    mockVerifyEmail.mockReset();
    mockNavigate.mockReset();
  });

  it('shows invalid link when token is missing', () => {
    mockRouteParams = undefined;
    const tree = renderScreen(<VerifyEmailScreen />);
    expect(findByTestId(tree, 'verify-invalid-token')).toBeTruthy();
  });

  it('shows success after verification', async () => {
    mockRouteParams = { token: 'ok' };
    mockVerifyEmail.mockResolvedValue({});
    let tree: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<VerifyEmailScreen />);
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(findByTestId(tree!, 'verify-success')).toBeTruthy();
  });
});
