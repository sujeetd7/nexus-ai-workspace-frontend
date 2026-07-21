import { Suspense } from "react";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { Loading } from "../pages/Loading";
import { AppProviders } from "../providers/AppProviders";
import { AppRouter } from "../router/AppRouter";

export function Bootstrap() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <Suspense fallback={<Loading />}>
          <AppRouter />
        </Suspense>
      </AppProviders>
    </ErrorBoundary>
  );
}
