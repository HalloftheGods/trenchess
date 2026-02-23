import { lazy } from "react";

export const LazyGameScreen = lazy(() => import("."));
export const LazyMmoView = lazy(() => import("./mmo"));
export const LazySeedLibrary = lazy(
  () => import("./components/organisms/SeedLibrary"),
);
