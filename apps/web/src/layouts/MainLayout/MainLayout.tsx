import { ApplicationShell } from "../../shell/ApplicationShell";

/**
 * Legacy layout entry — delegates to the application shell.
 * Nested route trees render through the shell Outlet.
 */
export function MainLayout() {
  return <ApplicationShell />;
}
