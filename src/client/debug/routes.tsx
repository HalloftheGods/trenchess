import { defineRoutes } from "@/shared/utils/defineRoutes";
import { LoadingFallback } from "@/shared/components/molecules/LoadingFallback";
import { DebugErrorThrower } from "@/shared/components/atoms/DebugErrorThrower";

const DEBUG_ROUTES = defineRoutes("debug", [
  "start",
  "win",
  "lose",
  { path: "debug/loading", element: <LoadingFallback /> },
  { path: "debug/404", element: <DebugErrorThrower /> },
  { path: "debug/500", element: <DebugErrorThrower /> },
]);

export default DEBUG_ROUTES;
