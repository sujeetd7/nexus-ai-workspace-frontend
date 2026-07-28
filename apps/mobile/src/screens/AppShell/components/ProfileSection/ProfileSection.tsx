import type { FC } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Avatar, IconButton, ListRow, Stack, Text } from '@nexus/shared-ui';
import { useSelector } from 'react-redux';

import type { RootStackParamList } from '../../../../navigation/types';
import { MOBILE_ROUTE_NAMES } from '../../../../navigation/types';
import { selectUser } from '../../../../store/slices/auth/selectors';
import {
  resolveProfileDisplayName,
  resolveProfileEmail,
  resolveProfileInitials,
} from '../../utils/profileDisplay';

export interface ProfileSectionProps {
  readonly compact?: boolean;
  readonly onNavigate?: () => void;
  readonly testID?: string;
}

/**
 * Profile summary — auth session only; graceful fallbacks when profile unavailable.
 */
export const ProfileSection: FC<ProfileSectionProps> = ({
  compact = false,
  onNavigate,
  testID = 'mobile-app-shell-profile-section',
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useSelector(selectUser);
  const displayName = resolveProfileDisplayName(user);
  const email = resolveProfileEmail(user);
  const initials = resolveProfileInitials(user);

  const openProfile = () => {
    onNavigate?.();
    navigation.navigate(MOBILE_ROUTE_NAMES.Profile);
  };

  if (compact) {
    return (
      <IconButton
        accessibilityLabel={`${displayName}${email ? `, ${email}` : ''}`}
        onPress={openProfile}
        testID={`${testID}-avatar-button`}
      >
        <Avatar
          initials={initials}
          size="sm"
          accessibilityLabel={displayName}
          testID={`${testID}-avatar`}
        />
      </IconButton>
    );
  }

  return (
    <Stack gap="xs" testID={testID}>
      <Text variant="sectionLabel" color="textSecondary">
        Profile
      </Text>
      <ListRow
        leading={
          <Avatar
            initials={initials}
            size="sm"
            accessibilityLabel={displayName}
            testID={`${testID}-avatar`}
          />
        }
        title={displayName}
        subtitle={email ?? 'Profile unavailable'}
        accessibilityLabel={`Profile: ${displayName}`}
        onPress={openProfile}
      />
    </Stack>
  );
};
