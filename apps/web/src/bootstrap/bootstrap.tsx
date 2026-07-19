import { AppProviders } from "../providers/AppProviders";
import { AppRouter } from "../router/AppRouter";

export function Bootstrap() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
