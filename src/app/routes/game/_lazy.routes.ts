import { lazy } from "react";

export const LazyGameScreen = lazy(() => import("."));
export const LazyMmoView = lazy(() => import("./components/views/MmoView"));
export const LazySeedLibrary = lazy(
  () => import("./components/organisms/SeedLibrary"),
);
