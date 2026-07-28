import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { MobileAppShell } from './MobileAppShell';

jest.mock('react-native-safe-area-context', () => {
  const ReactLocal = require('react');
  return {
    SafeAreaView: ({
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

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ name: 'Dashboard' }),
  useNavigation: () => ({ navigate: jest.fn() }),
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
    Avatar: (props: { initials?: string; accessibilityLabel?: string }) =>
      ReactLocal.createElement('Text', props, props.initials),
    Badge: ({ children }: { children?: React.ReactNode }) =>
      ReactLocal.createElement('Text', null, children),
    Divider: () => ReactLocal.createElement('View', { testID: 'divider' }),
    EmptyState: ({
      title,
      testID,
    }: {
      title?: string;
      testID?: string;
    }) => ReactLocal.createElement('View', { testID }, title),
    IconButton: ({
      children,
      onPress,
      accessibilityLabel,
      testID,
      disabled,
    }: {
      children?: React.ReactNode;
      onPress?: () => void;
      accessibilityLabel?: string;
      testID?: string;
      disabled?: boolean;
    }) =>
      ReactLocal.createElement(
        'View',
        { onPress, accessibilityLabel, testID, disabled, accessible: true },
        children,
      ),
    ListRow: ({
      title,
      onPress,
      testID,
      accessibilityLabel,
    }: {
      title?: string;
      onPress?: () => void;
      testID?: string;
      accessibilityLabel?: string;
    }) =>
      ReactLocal.createElement(
        'View',
        { onPress, testID, accessibilityLabel, accessible: true },
        title,
      ),
    Loader: (props: { accessibilityLabel?: string }) =>
      ReactLocal.createElement('View', { ...props, testID: 'loader' }),
    SearchField: (props: { placeholder?: string; testID?: string }) =>
      ReactLocal.createElement('View', {
        ...props,
        testID: props.testID ?? 'search-field',
      }),
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
    Surface: ({ children }: { children?: React.ReactNode }) =>
      ReactLocal.createElement('View', null, children),
    Text: ({
      children,
      accessibilityRole,
    }: {
      children?: React.ReactNode;
      accessibilityRole?: string;
    }) =>
      ReactLocal.createElement(
        'Text',
        { accessibilityRole },
        wrapText(children),
      ),
    View: ({
      children,
      testID,
      accessibilityLabel,
      style,
    }: {
      children?: React.ReactNode;
      testID?: string;
      accessibilityLabel?: string;
      style?: object;
    }) =>
      ReactLocal.createElement(
        'View',
        { testID, accessibilityLabel, style },
        children,
      ),
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

jest.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      auth: {
        user: {
          id: 'user-1',
          email: 'alex@example.com',
          firstName: 'Alex',
          lastName: 'Rivera',
        },
      },
      workspace: { workspaceId: 'ws-1', status: 'ready' },
    }),
  useDispatch: () => jest.fn(),
}));

jest.mock('../../api/services/workspace/workspaceApi', () => ({
  useListWorkspacesQuery: () => ({
    data: [{ id: 'ws-1', name: 'Alpha Labs', ownerId: 'user-1' }],
    isLoading: false,
    isFetching: false,
    error: undefined,
    refetch: jest.fn(),
  }),
}));

jest.mock('../../hooks/useWorkspaceSwitch', () => ({
  useWorkspaceSwitch: () => jest.fn(async () => undefined),
}));

function renderTree(contentState?: 'loading' | 'empty' | 'error' | 'protected') {
  let tree: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <MobileAppShell contentState={contentState}>
        <React.Fragment>
          {React.createElement('Text', { testID: 'shell-child' }, 'Child')}
        </React.Fragment>
      </MobileAppShell>,
    );
  });
  return tree!;
}

describe('MobileAppShell', () => {
  it('renders authenticated chrome with header and main content', () => {
    const tree = renderTree();
    const json = JSON.stringify(tree.toJSON());
    expect(json.includes('mobile-application-shell')).toBe(true);
    expect(json.includes('mobile-application-shell-header')).toBe(true);
    expect(json.includes('mobile-app-shell-content-area')).toBe(true);
    expect(json.includes('shell-child')).toBe(true);
  });

  it('supports loading content state', () => {
    const tree = renderTree('loading');
    const json = JSON.stringify(tree.toJSON());
    expect(json.includes('mobile-app-shell-content-area-loading')).toBe(true);
  });

  it('supports empty content state', () => {
    const tree = renderTree('empty');
    const json = JSON.stringify(tree.toJSON());
    expect(json.includes('mobile-app-shell-content-area-empty')).toBe(true);
  });

  it('supports error content state', () => {
    const tree = renderTree('error');
    const json = JSON.stringify(tree.toJSON());
    expect(json.includes('mobile-app-shell-content-area-error')).toBe(true);
  });

  it('supports protected content state', () => {
    const tree = renderTree('protected');
    const json = JSON.stringify(tree.toJSON());
    expect(json.includes('mobile-app-shell-content-area-protected')).toBe(true);
  });

  it('opens drawer when menu is pressed', () => {
    const tree = renderTree();
    const menuButton = tree.root.findByProps({
      testID: 'mobile-application-shell-header-menu',
    });

    ReactTestRenderer.act(() => {
      menuButton.props.onPress();
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json.includes('mobile-app-shell-drawer')).toBe(true);
    expect(json.includes('mobile-app-shell-drawer-backdrop')).toBe(true);
  });

  it('shows workspace summary and navigation in drawer', () => {
    const tree = renderTree();
    const menuButton = tree.root.findByProps({
      testID: 'mobile-application-shell-header-menu',
    });

    ReactTestRenderer.act(() => {
      menuButton.props.onPress();
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json.includes('mobile-app-shell-workspace-switcher')).toBe(true);
    expect(json.includes('mobile-app-shell-navigation')).toBe(true);
    expect(json.includes('Alpha Labs')).toBe(true);
  });
});
