import React, { lazy } from "react";
import PageLayout from "@/shared/components/templates/PageLayout";
import PageHeader from "@/shared/components/templates/PageHeader";
import SectionDivider from "@molecules/SectionDivider";
import { GuideListItem } from "@/app/routes/guides/components/molecules/GuideListItem";

interface RulesPageProps {
  onBack: () => void;
  darkMode: boolean;
}

const RulesPage: React.FC<RulesPageProps> = ({ onBack, darkMode }) => {
  const textColor = darkMode ? "text-slate-100" : "text-slate-900";
  const subtextColor = darkMode ? "text-slate-300" : "text-slate-600";
  const cardBg = darkMode ? "bg-slate-900/50" : "bg-white/70";
  const borderColor = darkMode ? "border-white/10" : "border-slate-200";

  return (
    <PageLayout
      darkMode={darkMode}
      header={<PageHeader onLogoClick={onBack} />}
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
            <ul
              className={`list-none pl-4 mt-6 space-y-4 ${subtextColor} !font-medium`}
            >
              <GuideListItem color="blue" size="sm">
                <span>
                  <strong className={textColor}>How to Win:</strong> Catch the
                  King, catch all the pieces, or take over the board!
                </span>
              </GuideListItem>
              <GuideListItem color="blue" size="sm">
                <span>
                  <strong className={textColor}>The Board:</strong> We use 32
                  special spots so you have plenty of room to play!
                </span>
              </GuideListItem>
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
            <ul
              className={`list-none pl-4 mt-6 space-y-4 ${subtextColor} !font-medium`}
            >
              <GuideListItem color="emerald" size="sm">
                <span>
                  <strong className={textColor}>Mountains:</strong> Rooks and
                  Bishops can't climb them!
                </span>
              </GuideListItem>
              <GuideListItem color="emerald" size="sm">
                <span>
                  <strong className={textColor}>Forests:</strong> Rooks and
                  Knights get lost in the trees!
                </span>
              </GuideListItem>
              <GuideListItem color="emerald" size="sm">
                <span>
                  <strong className={textColor}>Swamps:</strong> Knights and
                  Bishops get stuck in the mud!
                </span>
              </GuideListItem>
              <GuideListItem color="amber" size="sm">
                <span>
                  <strong className="text-amber-500">Desert:</strong> It's super
                  hot! If you step in the sand, you <strong>must</strong> move
                  out on your very next turn, or you are stuck there forever!
                </span>
              </GuideListItem>
            </ul>
          </section>

          <div className="w-full h-px bg-white/10 my-8" />

          <section>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="text-brand-red">3.</span> Your Chess Team
            </h2>
            <p className={subtextColor}>Meet your awesome pieces!</p>
            <ul
              className={`list-none pl-4 mt-6 space-y-4 ${subtextColor} !font-medium`}
            >
              <GuideListItem color="red" size="sm">
                <span>
                  <strong className={textColor}>Nimbus Pawn (Pawns):</strong>{" "}
                  The brave helpers in front! They march forward but can also do
                  a cool backwards jump to catch bad guys!
                </span>
              </GuideListItem>
              <GuideListItem color="red" size="sm">
                <span>
                  <strong className={textColor}>Light Healer (Bishops):</strong>{" "}
                  They slide really fast on the diagonals!
                </span>
              </GuideListItem>
              <GuideListItem color="red" size="sm">
                <span>
                  <strong className={textColor}>
                    Twilight Fortress (Rooks):
                  </strong>{" "}
                  They smash in straight lines but are too big for the trees!
                </span>
              </GuideListItem>
              <GuideListItem color="red" size="sm">
                <span>
                  <strong className={textColor}>
                    Shadow Knight (Knights):
                  </strong>{" "}
                  They love to jump over things in a fun "L" shape!
                </span>
              </GuideListItem>
              <GuideListItem color="red" size="sm">
                <span>
                  <strong className={textColor}>Royal Knight (Queens):</strong>{" "}
                  The most powerful piece! They can move almost any way they
                  want!
                </span>
              </GuideListItem>
              <GuideListItem color="red" size="sm">
                <span>
                  <strong className={textColor}>
                    King Juggernaught (Kings):
                  </strong>{" "}
                  The boss! You have to keep him safe, or the game is over!
                </span>
              </GuideListItem>
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
            <ul
              className={`list-none pl-4 mt-6 space-y-4 ${subtextColor} !font-medium`}
            >
              <GuideListItem color="violet" size="sm">
                <span>
                  <strong className={textColor}>Team Check:</strong> You must
                  place <strong className={textColor}>ALL 16</strong> of your
                  chess pieces on the board. No one can stay behind!
                </span>
              </GuideListItem>
              <GuideListItem color="violet" size="sm">
                <span>
                  <strong className={textColor}>Terrain Check:</strong> You must
                  also build your trenches! In 1v1, you must lay down exactly
                  <strong className={textColor}> 16 pieces</strong> of terrain.
                  In bigger games, you lay down 8.
                </span>
              </GuideListItem>
              <GuideListItem color="violet" size="sm">
                <span>
                  <strong className={textColor}>Commence War!</strong> Once
                  everyone has finished their checks, the game will begin!
                </span>
              </GuideListItem>
            </ul>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default RulesPage;
export const LazyRulesPage = lazy(() => import("./RulesPage"));
