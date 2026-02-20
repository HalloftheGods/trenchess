import React from "react";
import PageLayout from "./PageLayout";
import PageHeader from "./PageHeader";
import SectionDivider from "./ui/SectionDivider";
import type { PieceStyle } from "../constants";

interface RulesPageProps {
  onBack: () => void;
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme?: () => void;
  togglePieceStyle?: () => void;
  onTutorial?: () => void;
}

const RulesPage: React.FC<RulesPageProps> = ({
  onBack,
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
  onTutorial,
}) => {
  const textColor = darkMode ? "text-slate-100" : "text-slate-900";
  const subtextColor = darkMode ? "text-slate-300" : "text-slate-600";
  const cardBg = darkMode ? "bg-slate-900/50" : "bg-white/70";
  const borderColor = darkMode ? "border-white/10" : "border-slate-200";

  return (
    <PageLayout
      darkMode={darkMode}
      header={
        <PageHeader
          darkMode={darkMode}
          pieceStyle={pieceStyle}
          toggleTheme={toggleTheme || (() => {})}
          togglePieceStyle={togglePieceStyle || (() => {})}
          onTutorial={onTutorial}
          onLogoClick={onBack}
          onBack={onBack}
        />
      }
    >
      <div
        className={`max-w-4xl mx-auto w-full p-10 rounded-3xl border ${cardBg} ${borderColor} backdrop-blur-xl shadow-2xl mb-20`}
      >
        <div className="flex flex-col items-center mb-12">
          <SectionDivider
            label="Trenchess: Base Rules & White Paper"
            color="amber"
            animate={true}
          />
        </div>

        <div className={`space-y-10 ${textColor} font-medium leading-relaxed`}>
          <section>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="text-brand-blue">I.</span> The Foundation
              (Classic Game)
            </h2>
            <p className={subtextColor}>
              In its purest form, Trenchess honors the ancestral rules of
              Classic Chess. The main different is the battlefield has been
              changed from a barren terrain into many differnt playable
              layouts.. The objective remains absolute: capture the opponent's
              Commander (King).
            </p>
            <p className={`mt-4 ${subtextColor}`}>
              Support for a legacy chess game is not supportted ATM&gt;
            </p>
            <p className={`mt-4 ${subtextColor}`}>
              There's enough Chess games out there. We're here to build
              Trenchess.
            </p>
            <ul className={`list-none pl-4 mt-6 space-y-4 ${subtextColor}`}>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Grid Integrity:</strong> A
                  strick 32 Terrain elements at play (trees, ponds, rubble, or
                  desert). Houserules can ignore this limit, the game will
                  become much much harder to move around.
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>New Movements:</strong> Standard
                  moves apply. There has been explicitly modified advanced unit
                  augments in Trenchess.
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Victory:</strong>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Classic Checkmate</li>
                    <li>Capture the Armies</li>
                    <li>Capture the World</li>
                  </ul>
                </span>
              </li>
            </ul>
          </section>

          <div className="w-full h-px bg-white/10 my-8" />

          <section>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="text-emerald-500">II.</span> The Trenches
              (Elemental Terrain)
            </h2>
            <p className={subtextColor}>
              When Elemental Terrain is active (e.g., in flow or chaos modes),
              the board comes alive, altering the fundamental laws of
              engagement. Terrain modifiers require meticulous tactical
              responses.
            </p>
            <ul className={`list-none pl-4 mt-6 space-y-4 ${subtextColor}`}>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Mountains:</strong> Impassable
                  for Rooks, and Bishops.
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Forests:</strong> Impassable for
                  Rooks, and Knights.
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Swamps:</strong> Impassable for
                  Knights and Bishops.
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span>
                  <strong className="text-amber-500">Desert:</strong> A dead-end
                  trap. A unit entering a desert immediately exhausts its
                  momentum. It <strong>must</strong> exit the desert on its very
                  next turn, or it is consumed by the sands permanently.
                </span>
              </li>
            </ul>
          </section>

          <div className="w-full h-px bg-white/10 my-8" />

          <section>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="text-brand-red">III.</span> The Armies
            </h2>
            <p className={subtextColor}>
              The standard ranks have evolved to meet the harrowing demands of
              the Trenches, wielding modernized arsenals.
            </p>
            <ul className={`list-none pl-4 mt-6 space-y-4 ${subtextColor}`}>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>
                    Jumping Dragoon (Pawns):
                  </strong>{" "}
                  The front line. They march forward but have mastered the
                  &quot;En-Voltige&quot;—a diagonal backward capture mechanism.
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Light Healer (Bishops):</strong>{" "}
                  Commanding the long-range diagonals. Their sightlines dictate
                  open warfare.
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>
                    Twilight Guardian (Rooks):
                  </strong>{" "}
                  The vanguard of straight lines. Unmatched in sheer destructive
                  force but crippled by dense wilderness.
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>
                    Shadow Knight (Knights):
                  </strong>{" "}
                  Agile disruptors. They vault over barricades and enemy lines
                  with unpredictable L-shaped maneuvers.
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Royal Knight (Queens):</strong>{" "}
                  The absolute pinnacle of offensive versatility and mobility.
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>
                    King Juggernaught (Kings):
                  </strong>{" "}
                  The heartbeat of the operation. If the King falls, the war is
                  lost.
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default RulesPage;
