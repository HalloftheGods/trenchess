import { lazy } from "react";

export const DevCliScreen = lazy(() => import("@/app/client/dev/cli"));
export const DevRuleSetScreen = lazy(() => import("@/app/client/dev/ruleset"));
