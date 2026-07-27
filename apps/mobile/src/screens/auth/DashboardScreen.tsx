import type { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Stack, Text } from "@nexus/shared-ui";

import { logoutCompleted } from "../../store/slices/auth/authSlice";
import { selectUser } from "../../store/slices/auth/selectors";
import { getMobileSession } from "../../api/client/axios";
import type { AppDispatch } from "../../store/createAppStore";

export const DashboardScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  return (
    <Stack gap="md" padding="md" testID="mobile-dashboard-screen">
      <Text variant="h2">Welcome</Text>
      <Text>{user?.email}</Text>
      <Button
        onPress={async () => {
          await getMobileSession().logout();
          dispatch(logoutCompleted());
        }}
      >
        Sign out
      </Button>
    </Stack>
  );
};
