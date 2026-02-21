import React from "react";
import PageLayout from "../layout/PageLayout";
import PageHeader from "../layout/PageHeader";
import SectionDivider from "../ui/SectionDivider";
import type { PieceStyle } from "../../constants";

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
              <span className="text-brand-blue">1.</span> The Basics
            </h2>
            <p className={subtextColor}>
              Trenchess is like normal chess, but on a super fun board with
              trees and ponds! Your goal is still the same: catch the other
              team's King!
            </p>
            <ul className={`list-none pl-4 mt-6 space-y-4 ${subtextColor}`}>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>How to Win:</strong> Catch the
                  King, catch all the pieces, or take over the board!
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>The Board:</strong> We use 32
                  special spots so you have plenty of room to play!
                </span>
              </li>
            </ul>
          </section>

          <div className="w-full h-px bg-white/10 my-8" />

          <section>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="text-emerald-500">2.</span> Fun Places on the
              Board
            </h2>
            <p className={subtextColor}>
              The board has cool places that change how you play!
            </p>
            <ul className={`list-none pl-4 mt-6 space-y-4 ${subtextColor}`}>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Mountains:</strong> Rooks and
                  Bishops can't climb them!
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Forests:</strong> Rooks and
                  Knights get lost in the trees!
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Swamps:</strong> Knights and
                  Bishops get stuck in the mud!
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span>
                  <strong className="text-amber-500">Desert:</strong> It's super
                  hot! If you step in the sand, you <strong>must</strong> move
                  out on your very next turn, or you are stuck there forever!
                </span>
              </li>
            </ul>
          </section>

          <div className="w-full h-px bg-white/10 my-8" />

          <section>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="text-brand-red">3.</span> Your Chess Team
            </h2>
            <p className={subtextColor}>Meet your awesome pieces!</p>
            <ul className={`list-none pl-4 mt-6 space-y-4 ${subtextColor}`}>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>
                    Jumping Dragoon (Pawns):
                  </strong>{" "}
                  The brave helpers in front! They march forward but can also do
                  a cool backwards jump to catch bad guys!
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Light Healer (Bishops):</strong>{" "}
                  They slide really fast on the diagonals!
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>
                    Twilight Guardian (Rooks):
                  </strong>{" "}
                  They smash in straight lines but are too big for the trees!
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>
                    Shadow Knight (Knights):
                  </strong>{" "}
                  They love to jump over things in a fun "L" shape!
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Royal Knight (Queens):</strong>{" "}
                  The most powerful piece! They can move almost any way they
                  want!
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>
                    King Juggernaught (Kings):
                  </strong>{" "}
                  The boss! You have to keep him safe, or the game is over!
                </span>
              </li>
            </ul>
          </section>

          <div className="w-full h-px bg-white/10 my-8" />

          <section>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="text-violet-500">4.</span> Getting Ready
            </h2>
            <p className={subtextColor}>
              Every game has its checks! Before you can start the game, you MUST
              make sure everyone is ready.
            </p>
            <ul className={`list-none pl-4 mt-6 space-y-4 ${subtextColor}`}>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Team Check:</strong> You must
                  place <strong className={textColor}>ALL 16</strong> of your
                  chess pieces on the board. No one can stay behind!
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Terrain Check:</strong> You must
                  also build your trenches! In 1v1, you must lay down exactly
                  <strong className={textColor}> 16 pieces</strong> of terrain.
                  In bigger games, you lay down 8.
                </span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                <span>
                  <strong className={textColor}>Commence War!</strong> Once
                  everyone has finished their checks, the game will begin!
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
