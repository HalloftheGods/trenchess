import { lazy } from "react";
export const LazyHomeView = lazy(() => import("./index"));
export const LazyNotFoundView = lazy(
  () => import("./components/views/NotFoundView"),
);
