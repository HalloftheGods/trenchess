import type { GameStateHook } from "../hooks/GameStateHook";
import type { RouteContextType } from "./RouteContext";

export interface AppRoutesProps {
  game: GameStateHook;
  routeContextValue: RouteContextType;
  handleBackToMenu: () => void;
}
