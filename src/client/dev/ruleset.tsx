import React from "react";
import { ProtocolEditor } from "./components/ProtocolEditor";
import type { GameStateHook } from "@/shared/types";

interface RulesetEditorProps {
  game: GameStateHook;
}

export default function RulesetEditor({ game }: RulesetEditorProps) {
  return (
    <div className="min-h-screen bg-slate-950 overflow-y-auto custom-scrollbar">
      {/* Background FX */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-brand-blue/5 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full animate-pulse delay-1000" />
      </div>

      <ProtocolEditor game={game} />
    </div>
  );
}
