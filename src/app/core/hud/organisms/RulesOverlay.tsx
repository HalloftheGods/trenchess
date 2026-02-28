import React from "react";
import { TCOverlay } from "@/shared/components/atoms/ui";
import { ProtocolEditor } from "@/app/client/dev/components/ProtocolEditor";
import type { GameStateHook } from "@tc.types";

interface RulesOverlayProps {
  game: GameStateHook;
}

export const RulesOverlay: React.FC<RulesOverlayProps> = ({ game }) => {
  if (!game.showRules) return null;

  return (
    <TCOverlay
      isOpen={game.showRules}
      onClose={() => game.setShowRules(false)}
      blur="xl"
      opacity="medium"
      fullHeight
    >
      <div className="w-full h-full max-w-[90vw] flex flex-col pointer-events-auto">
        <ProtocolEditor game={game} onClose={() => game.setShowRules(false)} />
      </div>
    </TCOverlay>
  );
};
