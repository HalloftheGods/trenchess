import React from "react";
import {
  ChessKing,
  EyeOff,
  LayoutGrid,
  ShieldAlert,
  Swords,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import InteractiveGuide, { type Slide } from "./InteractiveGuide";

interface CtkGuideProps {
  onBack: () => void;
  // Others are ignored as we get them from MenuContext inside InteractiveGuide/MenuLayout.
}

const CtkGuide: React.FC<CtkGuideProps> = ({ onBack }) => {
  const slides: Slide[] = [
    {
      id: "board",
      title: "A Larger Scale",
      subtitle: "12x12 Grid vs 8x8",
      color: "red",
      topLabel: "The Battlefield",
      icon: LayoutGrid,
      previewConfig: {
        mode: null,
        hideUnits: true,
        highlightOuterSquares: true,
        label: "Capture the King",
      },
      description: (
        <ul className="space-y-2">
          <li className=" font-bold text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-brand-red/60 mt-2.5 shrink-0" />
            Trenchess is played on a 12x12 grid vs classic 8x8.
          </li>
          <li className=" font-bold text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-brand-red/60 mt-2.5 shrink-0" />
            This provides more room for tactical maneuvering, unit deployments,
            and terrain integration.
          </li>
        </ul>
      ),
      // sideContent: (
      //   <div className="w-full aspect-square bg-slate-900/40 rounded-[2.5rem] border-2 border-brand-red/20 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-red/5 to-transparent">
      //     <div className="grid grid-cols-12 gap-[1px] w-full h-full opacity-20 pointer-events-none p-4">
      //       {Array.from({ length: 144 }).map((_, i) => (
      //         <div
      //           key={i}
      //           className={`aspect-square rounded-sm ${(Math.floor(i / 12) + (i % 12)) % 2 === 0 ? "bg-white/10" : "bg-black/10"}`}
      //         />
      //       ))}
      //     </div>
      //     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      //       <span className="text-5xl font-black text-brand-red/80 drop-shadow-2xl scale-125 rotate-[-5deg] tracking-tighter">
      //         12x12
      //       </span>
      //     </div>
      //     <span className="mt-auto text-[10px] font-black uppercase text-brand-red/60 tracking-[0.3em] pt-4">
      //       Extended Battleground
      //     </span>
      //   </div>
      // ),
    },
    {
      id: "deployment",
      title: "Hidden Setup",
      subtitle: "The Static Formation is Lifted",
      color: "slate",
      topLabel: "Deployment Phase",
      icon: EyeOff,
      previewConfig: {
        mode: null,
        protocol: "classic",
        hideUnits: false,
        label: "Capture the King",
      },
      description: (
        <ul className="space-y-6">
          <li className="flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-slate-500/60 mt-2.5 shrink-0" />
            <div>
              <strong className="text-slate-800 dark:text-slate-100 block mb-1 uppercase tracking-widest text-xs font-black">
                Custom Formations
              </strong>
              <p className="text-lg font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                Classic formation is encouraged for beginners, but advanced
                players can set up their board however they like pregame.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-slate-500/60 mt-2.5 shrink-0" />
            <div>
              <strong className="text-slate-800 dark:text-slate-100 block mb-1 uppercase tracking-widest text-xs font-black">
                Fog of War Prep
              </strong>
              <p className="text-lg font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                Similar to Battleship, you cannot see the opposing player's
                strategy or deployment before the game officially commences.
              </p>
            </div>
          </li>
        </ul>
      ),
    },
    {
      id: "win",
      title: "Checkmate",
      subtitle: "The King Must Fall",
      color: "amber",
      topLabel: "Base Win Condition",
      icon: ShieldAlert,
      previewConfig: {
        mode: null,
        protocol: "classic",
        hideUnits: false,
        label: "Capture the King",
      },
      description: (
        <ul className="space-y-2">
          <li className="font-bold text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-amber-500/60 mt-2.5 shrink-0" />
            At its core, all games of 'Capture the King' rely on the base rules
            of Checkmate.
          </li>
          <li className="font-bold text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-amber-500/60 mt-2.5 shrink-0" />
            Trap the opposing player's King so that it has no valid moves left
            to escape an attack.
          </li>
        </ul>
      ),
    },
  ];

  const navigate = useNavigate();

  return (
    <InteractiveGuide
      title="Capture the King"
      slides={slides}
      onBack={onBack}
      labelColor="red"
      footerForward={{
        label: "Enter The Trenchess",
        onClick: () => navigate("/play"),
        icon: Swords,
      }}
    />
  );
};

export default CtkGuide;
