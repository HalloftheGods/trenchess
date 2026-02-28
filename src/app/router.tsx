/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ROUTES } from "@/app/routes";
import { LoadingFallback } from "@shared";
import { useGameState } from "@hooks/engine/useGameState";
import { useTheme } from "@shared/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { PHASES } from "@constants/game";
import AppLayout from "@/app/AppLayout";
import {
  GameMmoScreen,
  GameConsoleScreen,
  GamemasterScreen,
  GameScreen,
  LibraryScreen,
} from "@client/console/screens";
import { DevCliScreen, DevRuleSetScreen } from "@client/dev/screens";
import {
  PlayScreen,
  PlayLocalScreen,
  PlayLobbyScreen,
  PlaySetupScreen,
} from "@client/play/screens";
import { HomeScreen, NotFoundScreen } from "@client/home/screens";
import {
  ScoreboardScreen,
  RulesScreen,
  StatsScreen,
  TutorialScreen,
} from "@client/other/screens";
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
  TrenchGuideWrapper,
  ChessGuideWrapper,
} from "@client/learn/components/RouteWrappers";

const LazyRouteLayout = lazy(
  () => import("@/shared/components/templates/RouteLayout"),
);
const LazyLearnManualScreen = lazy(() => import("@client/learn/manual"));
const LazyConsoleView = lazy(() => import("@client/console/index"));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback fullScreen={true} />}>
    {children}
  </Suspense>
);

const GameRouteWrapper = ({
  screen: Screen,
}: {
  screen: React.ComponentType<{ game: ReturnType<typeof useGameState> }>;
}) => {
  const game = useGameState();
  return <Screen game={game} />;
};

const GameScreenWrapper = () => {
  const game = useGameState();
  const navigate = useNavigate();
  return (
    <GameScreen
      game={game}
      onMenuClick={() => {
        game.setPhase(PHASES.GAMEMASTER);
        navigate(ROUTES.home);
      }}
      onHowToPlayClick={() => navigate(ROUTES.learn.manual)}
      onLibraryClick={() => navigate(ROUTES.library)}
    />
  );
};

const LibraryScreenWrapper = () => {
  const game = useGameState();
  const navigate = useNavigate();
  return (
    <LibraryScreen
      onBack={() => {
        game.setPhase(PHASES.GAMEMASTER);
        navigate(ROUTES.home);
      }}
      onLoadSeed={(seed: string) => game.initFromSeed(seed)}
      onEditInZen={(seed: string) => game.initFromSeed(seed, PHASES.ZEN_GARDEN)}
      activeMode={game.mode}
    />
  );
};

const LearnManualWrapper = () => {
  const { darkMode, pieceStyle } = useTheme();
  const navigate = useNavigate();
  return (
    <SuspenseWrapper>
      <LazyLearnManualScreen
        onBack={() => navigate(-1)}
        darkMode={darkMode}
        pieceStyle={pieceStyle}
      />
    </SuspenseWrapper>
  );
};

const NavigateBackWrapper = ({
  screen: Screen,
  backTo,
}: {
  screen: React.ComponentType<{ onBack: () => void }>;
  backTo: string;
}) => {
  const navigate = useNavigate();
  return <Screen onBack={() => navigate(backTo)} />;
};

const DarkModeScreenWrapper = ({
  screen: Screen,
}: {
  screen: React.ComponentType<{ darkMode: boolean }>;
}) => {
  const { darkMode } = useTheme();
  return <Screen darkMode={darkMode} />;
};

const RulesScreenWrapper = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  return <RulesScreen onBack={() => navigate(-1)} darkMode={darkMode} />;
};

const TutorialScreenWrapper = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  return (
    <TutorialScreen
      onBack={() => {
        navigate(ROUTES.home);
      }}
      darkMode={darkMode}
    />
  );
};

const ConsoleLayoutWrapper = () => {
  const game = useGameState();
  return (
    <SuspenseWrapper>
      <LazyConsoleView game={game} />
    </SuspenseWrapper>
  );
};

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: ROUTES.home,
        element: (
          <SuspenseWrapper>
            <LazyRouteLayout />
          </SuspenseWrapper>
        ),
        children: [
          { index: true, element: <HomeScreen /> },
          { path: ROUTES.play.index, element: <PlayScreen /> },
          { path: ROUTES.play.local, element: <PlayLocalScreen /> },
          { path: ROUTES.play.lobby, element: <PlayLobbyScreen /> },
          { path: ROUTES.play.setup, element: <PlaySetupScreen /> },
          { path: ROUTES.learn.index, element: <LearnIndexScreen /> },
          {
            path: ROUTES.learn.endgame.index,
            element: <LearnEndgameIndexScreen />,
          },
          {
            path: ROUTES.learn.endgame.captureTheWorld,
            element: (
              <NavigateBackWrapper
                screen={LearnEndgameWorldScreen}
                backTo={ROUTES.learn.endgame.index}
              />
            ),
          },
          {
            path: ROUTES.learn.endgame.captureTheKing,
            element: (
              <NavigateBackWrapper
                screen={LearnEndgameKingScreen}
                backTo={ROUTES.learn.endgame.index}
              />
            ),
          },
          {
            path: ROUTES.learn.endgame.captureTheArmy,
            element: (
              <NavigateBackWrapper
                screen={LearnEndgameArmyScreen}
                backTo={ROUTES.learn.endgame.index}
              />
            ),
          },
          {
            path: ROUTES.learn.trench.index,
            element: <LearnTrenchIndexScreen />,
          },
          {
            path: ROUTES.learn.trench.detail,
            element: (
              <NavigateBackWrapper
                screen={TrenchGuideWrapper}
                backTo={ROUTES.learn.trench.index}
              />
            ),
          },
          {
            path: ROUTES.learn.chess.index,
            element: <LearnChessIndexScreen />,
          },
          {
            path: ROUTES.learn.chess.chessmen,
            element: <LearnChessmenIndexScreen />,
          },
          {
            path: ROUTES.learn.chess.chessmenDetail,
            element: (
              <NavigateBackWrapper
                screen={ChessGuideWrapper}
                backTo={ROUTES.learn.chess.chessmen}
              />
            ),
          },
          { path: ROUTES.learn.math, element: <LearnMathIndexScreen /> },
          {
            path: ROUTES.scoreboard,
            element: <DarkModeScreenWrapper screen={ScoreboardScreen} />,
          },
          {
            path: ROUTES.rules,
            element: <RulesScreenWrapper />,
          },
          { path: ROUTES.stats, element: <StatsScreen /> },
          { path: ROUTES.zen, element: <div /> },
          { path: "*", element: <NotFoundScreen /> },
        ],
      },
      {
        element: <ConsoleLayoutWrapper />,
        children: [
          {
            path: ROUTES.game.mmo,
            element: <GameRouteWrapper screen={GameMmoScreen} />,
          },
          {
            path: ROUTES.game.console,
            element: <GameRouteWrapper screen={GameConsoleScreen} />,
          },
          {
            path: "/console/game",
            element: <GameScreenWrapper />,
          },
          {
            path: ROUTES.game.mode,
            element: <GameScreenWrapper />,
          },
          {
            path: ROUTES.game.gamemaster,
            element: <GameRouteWrapper screen={GamemasterScreen} />,
          },
          {
            path: ROUTES.game.index,
            element: <GameScreenWrapper />,
          },
          {
            path: ROUTES.game.detail,
            element: <GameScreenWrapper />,
          },
          {
            path: ROUTES.game.library,
            element: <LibraryScreenWrapper />,
          },
        ],
      },
      {
        path: ROUTES.tutorial,
        element: <TutorialScreenWrapper />,
      },
      {
        path: ROUTES.learn.manual,
        element: <LearnManualWrapper />,
      },
      {
        path: ROUTES.dev.cli,
        element: <GameRouteWrapper screen={DevCliScreen} />,
      },
      {
        path: ROUTES.dev.ruleset,
        element: <GameRouteWrapper screen={DevRuleSetScreen} />,
      },
    ],
  },
]);
