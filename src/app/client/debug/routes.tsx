import { defineRoutes } from "@/shared/utilities/defineRoutes";
import LoadingScreen from "@/app/core/screens/LoadingScreen";
import StartScreen from "@/app/core/screens/StartScreen";
import WinScreen from "@/app/core/screens/WinScreen";
import LoseScreen from "@/app/core/screens/LoseScreen";
import WaitingScreen from "@/app/core/screens/WaitingScreen";
import ConfirmScreen from "@/app/core/screens/ConfirmScreen";
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
