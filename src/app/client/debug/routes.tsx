import { lazy } from "react";
import type { AppRoute } from "@/app/router/helpers";
import LoadingScreen from "@/app/core/screens/LoadingScreen";
import StartScreen from "@/app/core/screens/StartScreen";
import WinScreen from "@/app/core/screens/WinScreen";
import LoseScreen from "@/app/core/screens/LoseScreen";
import WaitingScreen from "@/app/core/screens/WaitingScreen";
import ConfirmScreen from "@/app/core/screens/ConfirmScreen";
import { DebugErrorThrower } from "@/shared/components/atoms/DebugErrorThrower";

const DebugRoomScreen = lazy(() => import("./room"));

const DEBUG_ROUTES: AppRoute[] = [
  { id: "debug.room", path: "debug/room", element: <DebugRoomScreen />, name: "Debug Room" },
  { id: "debug.start", path: "debug/start", element: <StartScreen /> },
  { id: "debug.win", path: "debug/win", element: <WinScreen /> },
  { id: "debug.lose", path: "debug/lose", element: <LoseScreen /> },
  { id: "debug.loading", path: "debug/loading", element: <LoadingScreen /> },
  { id: "debug.waiting", path: "debug/waiting", element: <WaitingScreen /> },
  { id: "debug.confirm", path: "debug/confirm", element: <ConfirmScreen /> },
  { id: "debug.404", path: "debug/404", element: <DebugErrorThrower /> },
  { id: "debug.500", path: "debug/500", element: <DebugErrorThrower /> },
];

export default DEBUG_ROUTES;
