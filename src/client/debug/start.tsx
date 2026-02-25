import React from "react";
import { GameStartOverlay } from "@/client/console/components/atoms/GameStartOverlay";

const StartDebug: React.FC = () => {
  return (
    <div className="w-full h-screen bg-slate-900">
      <GameStartOverlay
        isOnline={false}
        isLocked={false}
        onLockIn={() => console.log("Lock In clicked")}
        onStart={() => console.log("Start clicked")}
      />
    </div>
  );
};

export default StartDebug;
