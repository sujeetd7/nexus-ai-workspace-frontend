import type { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Stack, Text } from "@nexus/shared-ui";

import { selectUser } from "../../../store/slices/auth/selectors";
import { createLogoutAction } from "../../../store/sagas/auth/authSaga";
import type { AppDispatch } from "../../../store/createAppStore";

export const DashboardScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  return (
    <Stack gap="md" testID="dashboard-screen">
      <Text variant="h2">Welcome{user?.firstName ? `, ${user.firstName}` : ""}</Text>
      <Text color="textSecondary">{user?.email}</Text>
      <Button
        testID="logout-button"
        onPress={() => dispatch(createLogoutAction())}
      >
        Sign out
      </Button>
    </Stack>
  );
};
