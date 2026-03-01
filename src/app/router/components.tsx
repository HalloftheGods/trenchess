import React, { Suspense, lazy } from "react";
import { LoadingFallback } from "@shared";

const LazyConsoleView = lazy(() => import("@client/console/index"));

export const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback fullScreen={true} />}>
    {children}
  </Suspense>
);

export const ConsoleLayoutWrapper = () => (
  <SuspenseWrapper>
    <LazyConsoleView />
  </SuspenseWrapper>
);

export const LazyRouteLayout = lazy(
  () => import("@/shared/components/templates/RouteLayout"),
);

export const LazyLearnManualScreen = lazy(() => import("@client/learn/manual"));
