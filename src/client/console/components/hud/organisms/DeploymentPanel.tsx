import { useLayoutActions } from "@/shared/hooks/controls/useLayoutActions";
import { useDeploymentMetrics } from "@/shared/hooks/math/useDeploymentMetrics";
import { SegmentedControl } from "@molecules/SegmentedControl";
import type {
  GameState,
  SetupMode,
  PieceType,
  TerrainType,
  ArmyUnit,
  BoardPiece,
  GameMode,
  BgioClient,
} from "@/shared/types";
import type { MultiplayerState } from "@/shared/types/multiplayer";

import { DeploymentHeader } from "./DeploymentHeader";
import { ZenPlayerTabs } from "../atoms/ZenPlayerTabs";
import { DeploymentTerrainPalette } from "../molecules/DeploymentTerrainPalette";
import { DeploymentUnitPalette } from "../molecules/DeploymentUnitPalette";
import { DeploymentActionButtons } from "../molecules/DeploymentActionButtons";
import { DeploymentFooterControls } from "../molecules/DeploymentFooterControls";
import { MultiplayerFooterControls } from "../molecules/MultiplayerFooterControls";
import { ArmyRoster } from "../molecules/ArmyRoster";
import { ZenActions } from "../molecules/ZenActions";
import { SeedLibraryList } from "../molecules/SeedLibraryList";
import { CheckAlert } from "../../board/atoms/CheckAlert";
import { ActiveFieldStrategy } from "../atoms/ActiveFieldStrategy";

interface DeploymentPanelProps {
  mode: GameMode;
  terrain: TerrainType[][];
  setTerrain?: (terrain: TerrainType[][]) => void;
  gameState: GameState;
  turn: string;
  setupMode: SetupMode;
  setSetupMode: (mode: SetupMode) => void;
  pieceStyle: string;
  inventory: Record<string, PieceType[]>;
  terrainInventory: Record<string, TerrainType[]>;
  placementPiece: PieceType | null;
  setPlacementPiece: (piece: PieceType | null) => void;
  placementTerrain: TerrainType | null;
  setPlacementTerrain: (terrain: TerrainType | null) => void;
  activePlayers: string[];
  isAllPlaced: boolean;
  isCurrentPlayerReady?: boolean;
  getIcon: (unit: ArmyUnit, className?: string) => React.ReactNode;
  getPlayerDisplayName: (pid: string) => string;
  setTurn?: (turn: string) => void;
  setGameState: (state: GameState) => void;
  setSelectedCell: (cell: null) => void;
  setValidMoves: (moves: number[][]) => void;
  randomizeTerrain: () => void;
  generateElementalTerrain?: () => void;
  randomizeUnits: () => void;
  setClassicalFormation: () => void;
  resetTerrain?: () => void;
  resetUnits?: () => void;
  mirrorBoard?: () => void;
  inCheck: boolean;
  board: (BoardPiece | null)[][];
  setBoard?: (board: (BoardPiece | null)[][]) => void;
  layoutName?: string;
  setInventory?: (inventory: Record<string, PieceType[]>) => void;
  multiplayer?: MultiplayerState;
  localPlayerId?: string;
  playerTypes: Record<string, "human" | "computer">;
  setPlayerTypes: React.Dispatch<
    React.SetStateAction<Record<string, "human" | "computer">>
  >;
  ready?: () => void;
  startGame?: () => void;
  localPlayerName?: string;
  clientRef?: React.MutableRefObject<BgioClient | undefined>;
}

export const DeploymentPanel: React.FC<DeploymentPanelProps> = ({
  mode,
  terrain,
  setTerrain,
  gameState,
  turn,
  setupMode,
  setSetupMode,
  pieceStyle,
  inventory,
  terrainInventory,
  placementPiece,
  setPlacementPiece,
  placementTerrain,
  setPlacementTerrain,
  activePlayers,
  isAllPlaced,
  isCurrentPlayerReady,
  getIcon,
  getPlayerDisplayName,
  setTurn,
  setGameState,
  setSelectedCell,
  setValidMoves,
  randomizeTerrain,
  generateElementalTerrain,
  randomizeUnits,
  setClassicalFormation,
  resetTerrain,
  resetUnits,
  mirrorBoard,
  inCheck,
  board,
  setBoard,
  layoutName,
  multiplayer,
  playerTypes,
  setPlayerTypes,
  ready,
  startGame,
  localPlayerName,
  clientRef,
}) => {
  const perspectiveTurn =
    gameState === "setup" ? localPlayerName || turn : turn;

  const { maxPlacement, placedCount } = useDeploymentMetrics({
    mode,
    terrain,
    inventory,
    activePlayers,
    perspectivePlayerId: perspectiveTurn,
  });

  const { copied, librarySeeds, handleSave, handleClearBoard } =
    useLayoutActions(
      mode,
      board,
      terrain,
      layoutName || "Zen Garden Layout",
      clientRef,
    );

  const isZen = gameState === "zen-garden" || gameState === "gamemaster";

  const isStateInitialized = terrain && terrain.length && board && board.length;

  if (!isStateInitialized) {
    return null;
  }

  return (
    <div className="xl:col-span-3 max-w-[375px] space-y-6 order-2 xl:order-1 sticky top-24">
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/5 shadow-2xl flex flex-col overflow-y-auto custom-scrollbar">
        <DeploymentHeader
          isZen={isZen}
          gameState={gameState}
          multiplayer={multiplayer}
          turn={turn}
          localPlayerName={localPlayerName}
          playerTypes={playerTypes}
          setPlayerTypes={setPlayerTypes}
        />

        <ZenPlayerTabs
          isZen={isZen}
          activePlayers={activePlayers}
          turn={turn}
          setTurn={setTurn || (() => {})}
        />

        {(gameState === "setup" || isZen) && (
          <div className="mb-6">
            <SegmentedControl
              options={[
                {
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">Trench</span>
                      <small className="opacity-60 text-[10px] font-bold">
                        {placedCount}/{maxPlacement}
                      </small>
                    </div>
                  ),
                  value: "terrain",
                  activeColor: "bg-slate-600 dark:bg-slate-700",
                },
                {
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">Chess</span>
                      <small className="opacity-60 text-[10px] font-bold">
                        {16 - (inventory[turn] || []).length}/16
                      </small>
                    </div>
                  ),
                  value: "pieces",
                  activeColor: "bg-slate-600 dark:bg-slate-700",
                },
              ]}
              value={setupMode}
              onChange={(val) => setSetupMode(val as SetupMode)}
              className="w-full"
            />
          </div>
        )}

        {(gameState === "setup" || isZen) && (
          <>
            <div className={setupMode === "terrain" ? "mb-5 block" : "hidden"}>
              <DeploymentTerrainPalette
                turn={turn}
                terrainInventory={terrainInventory}
                placementTerrain={placementTerrain}
                setPlacementTerrain={setPlacementTerrain}
                setPlacementPiece={setPlacementPiece}
                setSetupMode={setSetupMode}
                isZen={isZen}
                placedCount={placedCount}
                maxPlacement={maxPlacement}
              />
            </div>

            <div className={setupMode === "pieces" ? "block" : "hidden"}>
              <DeploymentUnitPalette
                turn={turn}
                inventory={inventory}
                placementPiece={placementPiece}
                setPlacementPiece={setPlacementPiece}
                setPlacementTerrain={setPlacementTerrain}
                setSetupMode={setSetupMode}
                pieceStyle={pieceStyle}
                getIcon={getIcon}
              />
            </div>

            {!isZen && (
              <DeploymentActionButtons
                setupMode={setupMode}
                randomizeTerrain={randomizeTerrain}
                generateElementalTerrain={generateElementalTerrain}
                resetTerrain={resetTerrain}
                randomizeUnits={randomizeUnits}
                setClassicalFormation={setClassicalFormation}
                resetUnits={resetUnits}
              />
            )}
          </>
        )}

        {(gameState === "setup" || isZen) && (
          <div className="mt-auto space-y-3 pt-6">
            <DeploymentFooterControls
              isZen={isZen}
              multiplayer={multiplayer}
              activePlayers={activePlayers}
              turn={turn}
              setTurn={setTurn || (() => {})}
              setPlacementPiece={setPlacementPiece}
              setPlacementTerrain={setPlacementTerrain}
              isAllPlaced={isAllPlaced}
              isCurrentPlayerReady={isCurrentPlayerReady}
              setSelectedCell={setSelectedCell}
              setValidMoves={setValidMoves}
              startGame={startGame}
              ready={ready}
            />

            <MultiplayerFooterControls
              isZen={isZen}
              multiplayer={multiplayer}
              startGame={startGame}
              setSelectedCell={setSelectedCell}
              setValidMoves={setValidMoves}
              ready={ready}
              isCurrentPlayerReady={isCurrentPlayerReady}
              isAllPlaced={isAllPlaced}
            />
          </div>
        )}

        {gameState === "play" && (
          <div className="space-y-6">
            <CheckAlert inCheck={inCheck} />

            <ActiveFieldStrategy
              turn={turn}
              getPlayerDisplayName={getPlayerDisplayName}
            />

            <ArmyRoster
              turn={turn}
              board={board}
              pieceStyle={pieceStyle}
              getIcon={getIcon}
            />
          </div>
        )}
      </div>

      {isZen && (
        <>
          <ZenActions
            mirrorBoard={mirrorBoard}
            handleSave={handleSave}
            copied={copied}
            setGameState={setGameState}
            handleClearBoard={handleClearBoard}
          />
          <SeedLibraryList
            librarySeeds={librarySeeds}
            setBoard={setBoard}
            setTerrain={setTerrain}
            setPlacementPiece={setPlacementPiece}
            setPlacementTerrain={setPlacementTerrain}
          />
        </>
      )}
    </div>
  );
};
