/* eslint-disable react-refresh/only-export-components */
import AppLayout from "@/shared/components/templates/AppLayout";
import { type AppRoute } from "./helpers";
import {
  SuspenseWrapper,
  ConsoleLayoutWrapper,
  LazyRouteLayout,
  LazyLearnManualScreen,
} from "./components";

/**
 * Screen Imports (Feature-Based)
 */
import { HomeScreen, NotFoundScreen } from "@client/home/screens";
import {
  PlayScreen,
  PlayLocalScreen,
  PlayLobbyScreen,
  PlaySetupScreen,
} from "@client/play/screens";
import {
  LearnIndexScreen,
  LearnEndgameIndexScreen,
  LearnEndgameWorldScreen,
  LearnEndgameKingScreen,
  LearnEndgameArmyScreen,
  LearnTrenchIndexScreen,
  LearnChessIndexScreen,
  LearnChessmenIndexScreen,
  LearnMathIndexScreen,
} from "@client/learn/screens";
import {
  GameMmoScreen,
  GameConsoleScreen,
  GameModeScreen,
  GamemasterScreen,
  GameScreen,
  LibraryScreen,
} from "@client/console/screens";
import { DevCliScreen, DevRuleSetScreen } from "@client/dev/screens";
import DEBUG_ROUTES from "@client/debug/routes";
import { lazy } from "react";

const ScoreboardScreen = lazy(() => import("@client/scoreboard"));
const RulesScreen = lazy(() => import("@client/rules"));
const StatsScreen = lazy(() => import("@client/stats"));
const TutorialScreen = lazy(() => import("@client/tutorial"));
import {
  TrenchGuideWrapper,
  ChessGuideWrapper,
} from "@client/learn/components/RouteWrappers";

/**
 * THE SOURCE OF TRUTH: APP_ROUTES
 * Standard react-router definitions with added 'id' and 'name' for automation.
 */
export const APP_ROUTES: AppRoute[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: (
          <SuspenseWrapper>
            <LazyRouteLayout />
          </SuspenseWrapper>
        ),
        children: [
          { id: "home", path: "", element: <HomeScreen />, name: "Home" },
          {
            id: "play",
            path: "play",
            name: "Battle",
            children: [
              { id: "play.index", index: true, element: <PlayScreen /> },
              { id: "play.local", path: "local", element: <PlayLocalScreen /> },
              { id: "play.lobby", path: "lobby", element: <PlayLobbyScreen /> },
              {
                id: "play.setup",
                path: ":playMode/:players/setup/:step?",
                element: <PlaySetupScreen />,
              },
            ],
          },
          {
            id: "learn",
            path: "learn",
            name: "The Prophecy",
            children: [
              { id: "learn.index", index: true, element: <LearnIndexScreen /> },
              {
                id: "learn.manual",
                path: "manual",
                element: <LazyLearnManualScreen />,
              },
              {
                id: "learn.math",
                path: "math",
                element: <LearnMathIndexScreen />,
              },
              {
                id: "learn.endgame",
                path: "endgame",
                name: "The Endgame",
                children: [
                  {
                    id: "learn.endgame.index",
                    index: true,
                    element: <LearnEndgameIndexScreen />,
                  },
                  {
                    id: "learn.endgame.captureTheWorld",
                    path: "capture-the-world",
                    element: <LearnEndgameWorldScreen />,
                  },
                  {
                    id: "learn.endgame.captureTheKing",
                    path: "capture-the-king",
                    element: <LearnEndgameKingScreen />,
                  },
                  {
                    id: "learn.endgame.captureTheArmy",
                    path: "capture-the-army",
                    element: <LearnEndgameArmyScreen />,
                  },
                ],
              },
              {
                id: "learn.trench",
                path: "trench",
                name: "The Trench",
                children: [
                  {
                    id: "learn.trench.index",
                    index: true,
                    element: <LearnTrenchIndexScreen />,
                  },
                  {
                    id: "learn.trench.detail",
                    path: ":terrain",
                    element: <TrenchGuideWrapper />,
                  },
                ],
              },
              {
                id: "learn.chess",
                path: "chess",
                name: "The Chess",
                children: [
                  {
                    id: "learn.chess.index",
                    index: true,
                    element: <LearnChessIndexScreen />,
                  },
                  {
                    id: "learn.chess.chessmen",
                    path: "chessmen",
                    name: "The Chessmen",
                    children: [
                      {
                        id: "learn.chess.chessmen.index",
                        index: true,
                        element: <LearnChessmenIndexScreen />,
                      },
                      {
                        id: "learn.chess.chessmenDetail",
                        path: ":unitType",
                        element: <ChessGuideWrapper />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "scoreboard",
            path: "scoreboard",
            element: <ScoreboardScreen />,
            name: "Leaderboard",
          },
          {
            id: "rules",
            path: "rules",
            element: <RulesScreen />,
            name: "Rulebook",
          },
          {
            id: "stats",
            path: "stats",
            element: <StatsScreen />,
            name: "Hall of Fame",
          },
          {
            id: "tutorial",
            path: "tutorial",
            element: <TutorialScreen />,
            name: "Training Grounds",
          },
          { id: "zen", path: "zen", element: <div /> },
          { id: "notFound", path: "*", element: <NotFoundScreen /> },
        ],
      },
      {
        id: "console",
        path: "console",
        name: "Console",
        element: <ConsoleLayoutWrapper />,
        children: [
          { id: "console.index", index: true, element: <GameScreen /> },
          { id: "console.mmo", path: "mmo", element: <GameMmoScreen /> },
          {
            id: "console.game",
            path: "game/:style",
            element: <GameConsoleScreen />,
          },
          {
            id: "console.mode",
            path: "board/:mode",
            element: <GameModeScreen />,
          },
          {
            id: "console.library",
            path: "library",
            element: <LibraryScreen />,
          },
          { id: "console.detail", path: ":roomId", element: <GameScreen /> },
          {
            id: "console.gamemaster",
            path: "gamemaster",
            element: <GamemasterScreen />,
            name: "Game Master",
          },
        ],
      },
      {
        id: "dev",
        path: "dev",
        element: (
          <SuspenseWrapper>
            <LazyRouteLayout />
          </SuspenseWrapper>
        ),
        children: [
          { id: "dev.cli", path: "cli", element: <DevCliScreen /> },
          { id: "dev.rules", path: "rules", element: <DevRuleSetScreen /> },
        ],
      },
      ...DEBUG_ROUTES,
    ],
  },
];
