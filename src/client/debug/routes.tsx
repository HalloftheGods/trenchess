import { defineRoutes } from "@/shared/utils/defineRoutes";
import LoadingScreen from "@/client/console/screens/LoadingScreen";
import StartScreen from "@/client/console/screens/StartScreen";
import WinScreen from "@/client/console/screens/WinScreen";
import LoseScreen from "@/client/console/screens/LoseScreen";
import WaitingScreen from "@/client/console/screens/WaitingScreen";
import ConfirmScreen from "@/client/console/screens/ConfirmScreen";
import { DebugErrorThrower } from "@/shared/components/atoms/DebugErrorThrower";

const DEBUG_ROUTES = defineRoutes("debug", [
  { path: "debug/start", element: <StartScreen /> },
  { path: "debug/win", element: <WinScreen /> },
  { path: "debug/lose", element: <LoseScreen /> },
  { path: "debug/loading", element: <LoadingScreen /> },
  { path: "debug/waiting", element: <WaitingScreen /> },
  { path: "debug/confirm", element: <ConfirmScreen /> },
  { path: "debug/404", element: <DebugErrorThrower /> },
  { path: "debug/500", element: <DebugErrorThrower /> },
]);

export default DEBUG_ROUTES;
