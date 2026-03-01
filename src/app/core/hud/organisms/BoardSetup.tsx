import React from "react";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";
import { TCDivider } from "@/shared/components/atoms/ui/TCDivider";
import { ModeSelection, PreconfigSelection } from "../molecules";
import type { GameMode } from "@tc.types/game";

interface BoardSetupProps {
  mode?: GameMode;
  setMode: (mode: GameMode) => void;
  activeStyle?: string;
  chessLocked: boolean;
  trenchLocked: boolean;
  bothLocked: boolean;
  handleOmega: () => void;
  handleClassic: () => void;
  handleAlpha: () => void;
  handleChi: () => void;
  handleRandomize: () => void;
  showMirror?: boolean;
  mirrorBoard?: () => void;

  hidePreconfigs?: boolean;
}

export const BoardSetup: React.FC<BoardSetupProps> = ({
  mode,
  setMode,
  activeStyle,
  chessLocked,
  trenchLocked,
  bothLocked,
  handleOmega,
  handleClassic,
  handleAlpha,
  handleChi,
  handleRandomize,
  showMirror,
  mirrorBoard,

  hidePreconfigs,
}) => {
  return (
    <TCFlex align="center" gap={2} className="transition-all duration-500">
      <ModeSelection mode={mode} setMode={setMode} />
      {/* {showDivider && <TCDivider className="h-10 mx-2 opacity-10" />} */}
      <TCDivider className="h-10 mx-2 opacity-100" />
      {!hidePreconfigs && (
        <PreconfigSelection
          activeStyle={activeStyle}
          chessLocked={chessLocked}
          trenchLocked={trenchLocked}
          bothLocked={bothLocked}
          handleOmega={handleOmega}
          handleClassic={handleClassic}
          handleAlpha={handleAlpha}
          handleChi={handleChi}
          handleRandomize={handleRandomize}
          showMirror={showMirror}
          mirrorBoard={mirrorBoard}
        />
      )}
    </TCFlex>
  );
};
