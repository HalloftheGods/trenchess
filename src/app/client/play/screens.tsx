import { lazy } from "react";

export const PlayScreen = lazy(() => import("./play"));
export const PlayLocalScreen = lazy(() => import("./local"));
export const PlayLobbyScreen = lazy(() => import("./lobby"));
export const PlaySetupScreen = lazy(() => import("./setup"));
