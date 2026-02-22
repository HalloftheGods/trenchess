import { lazy } from "react";
export const LazyPlayView = lazy(() => import("./play"));
export const LazyPlayLocalView = lazy(() => import("./local"));
export const LazyPlayLobbyView = lazy(() => import("./lobby"));
export const LazyPlaySetupView = lazy(() => import("./setup"));
