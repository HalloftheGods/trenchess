import { lazy } from "react";

export const ScoreboardScreen = lazy(() => import("@/app/client/scoreboard"));
export const RulesScreen = lazy(() => import("@/app/client/rules"));
export const StatsScreen = lazy(() => import("@/app/client/stats"));
export const TutorialScreen = lazy(() => import("@/app/client/tutorial"));
