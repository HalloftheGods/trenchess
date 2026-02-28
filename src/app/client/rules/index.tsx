import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Target,
  Map,
  Mountain,
  TreePine,
  Waves,
  Sun,
  Users,
  Swords,
  Crown,
  Flag,
  Coins,
  Tags,
  Rabbit,
  Flashlight,
  Castle,
  VenetianMask,
  SunMoon,
  Orbit,
  ChessPawn,
  ChessBishop,
  ChessRook,
  ChessKnight,
  ChessQueen,
  ChessKing,
  type LucideIcon,
} from "lucide-react";
import PageLayout from "@/shared/components/templates/PageLayout";
import PageHeader from "@/shared/components/templates/PageHeader";
import SectionDivider from "@molecules/SectionDivider";

interface RulesPageProps {
  onBack: () => void;
  darkMode: boolean;
}

interface RuleCardProps {
  title: string;
  subtitle?: string;
  description: string;
  icon: LucideIcon;
  bgIcon?: LucideIcon;
  color: string;
  darkMode: boolean;
}

const RuleCard = ({
  title,
  subtitle,
  description,
  icon: Icon,
  bgIcon: BgIcon,
  color,
  darkMode,
}: RuleCardProps) => {
  const bgColor = darkMode ? "bg-slate-800/50" : "bg-white/50";
  const borderColor = darkMode ? "border-slate-700" : "border-slate-200";
  const textColor = darkMode ? "text-slate-100" : "text-slate-900";
  const subtextColor = darkMode ? "text-slate-400" : "text-slate-600";

  const colorMap: Record<string, { icon: string; hover: string }> = {
    blue: {
      icon: "text-brand-blue bg-brand-blue/10 border-brand-blue/20",
      hover:
        "hover:border-brand-blue/50 hover:bg-brand-blue/5 dark:hover:bg-brand-blue/10",
    },
    emerald: {
      icon: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      hover:
        "hover:border-emerald-500/50 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10",
    },
    amber: {
      icon: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      hover:
        "hover:border-amber-500/50 hover:bg-amber-500/5 dark:hover:bg-amber-500/10",
    },
    red: {
      icon: "text-brand-red bg-brand-red/10 border-brand-red/20",
      hover:
        "hover:border-brand-red/50 hover:bg-brand-red/5 dark:hover:bg-brand-red/10",
    },
    violet: {
      icon: "text-violet-500 bg-violet-500/10 border-violet-500/20",
      hover:
        "hover:border-violet-500/50 hover:bg-violet-500/5 dark:hover:bg-violet-500/10",
    },
    slate: {
      icon: "text-slate-500 bg-slate-500/10 border-slate-500/20",
      hover:
        "hover:border-slate-500/50 hover:bg-slate-500/5 dark:hover:bg-slate-500/10",
    },
    fuchsia: {
      icon: "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/20",
      hover:
        "hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5 dark:hover:bg-fuchsia-500/10",
    },
    purple: {
      icon: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      hover:
        "hover:border-purple-500/50 hover:bg-purple-500/5 dark:hover:bg-purple-500/10",
    },
    orange: {
      icon: "text-orange-500 bg-orange-500/10 border-orange-500/20",
      hover:
        "hover:border-orange-500/50 hover:bg-orange-500/5 dark:hover:bg-orange-500/10",
    },
  };

  const selectedColor = colorMap[color] || colorMap["blue"];

  return (
    <div
      className={`relative flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border ${bgColor} ${borderColor} transition-all hover:scale-[1.02] hover:shadow-xl group ${selectedColor.hover} cursor-default overflow-hidden`}
    >
      {BgIcon && (
        <div
          className={`absolute -right-4 -bottom-4 opacity-25 transition-transform group-hover:scale-110 group-hover:-rotate-6 pointer-events-none ${selectedColor.icon.split(" ")[0]}`}
        >
          <BgIcon size={120} strokeWidth={1.5} />
        </div>
      )}
      <div
        className={`relative z-10 shrink-0 flex items-center justify-center w-14 h-14 rounded-xl border ${selectedColor.icon} transition-transform group-hover:scale-110 group-hover:shadow-md`}
      >
        <Icon size={28} />
      </div>
      <div className="flex flex-col justify-center relative z-10">
        <h4
          className={`text-xl font-bold ${textColor} mb-1 tracking-wide transition-colors group-hover:${selectedColor.icon.split(" ")[0]}`}
        >
          {title}
        </h4>
        {subtitle && (
          <span
            className={`text-xs font-black uppercase tracking-widest ${selectedColor.icon.split(" ")[0]} opacity-80 mb-2`}
          >
            {subtitle}
          </span>
        )}
        <p
          className={`text-base md:text-lg font-medium ${subtextColor} leading-relaxed`}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export const RulesView: React.FC<RulesPageProps> = ({ onBack, darkMode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const textColor = darkMode ? "text-slate-100" : "text-slate-900";
  const subtextColor = darkMode ? "text-slate-300" : "text-slate-600";

  const slides = [
    {
      title: "1. The Fundamentals",
      color: "brand-blue",
      content: (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <p
            className={`${subtextColor} text-xl md:text-2xl mb-8 leading-relaxed font-medium`}
          >
            Trenchess builds upon classical chess by introducing dynamic terrain
            and expanded spatial strategy. However, the objective changes
            depending on the game mode you are playing.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <RuleCard
              darkMode={darkMode}
              title="Capture the King (1v1)"
              description="The classic objective. Checkmate the enemy King or eliminate all opposing pieces on the board to win the match."
              icon={Crown}
              bgIcon={Crown}
              color="fuchsia"
            />
            <RuleCard
              darkMode={darkMode}
              title="Capture the Army (4 Player)"
              description="Eliminate all forces of an opponent, or corner their King, to assimilate their remaining army into your own. Be the last commander standing."
              icon={Swords}
              bgIcon={Swords}
              color="red"
            />
            <RuleCard
              darkMode={darkMode}
              title="Capture the World (2v2)"
              description="A cooperative race! Team up and march your Kings across the globe. The first team to land BOTH Kings in their respective enemy's starting corners wins."
              icon={Target}
              bgIcon={Target}
              color="emerald"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2. Terrain Mechanics",
      color: "emerald-500",
      content: (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <p
            className={`${subtextColor} text-xl md:text-2xl mb-8 leading-relaxed font-medium`}
          >
            The board features diverse environments that restrict or modify
            movement. Understanding terrain is critical to tactical positioning.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RuleCard
              darkMode={darkMode}
              title="Mountains"
              description="Impassable for Rooks and Bishops. They block long-range linear attacks."
              icon={Mountain}
              bgIcon={Mountain}
              color="red"
            />
            <RuleCard
              darkMode={darkMode}
              title="Forests"
              description="Impassable for Rooks and Knights. They disrupt cavalry charges and straight-line advances."
              icon={TreePine}
              bgIcon={TreePine}
              color="emerald"
            />
            <RuleCard
              darkMode={darkMode}
              title="Swamps"
              description="Impassable for Knights and Bishops. They create logistical bottlenecks."
              icon={Waves}
              bgIcon={Waves}
              color="blue"
            />
            <RuleCard
              darkMode={darkMode}
              title="Desert"
              description="Highly hazardous. A unit entering the desert must exit on the immediate next turn, or it will be permanently lost."
              icon={Sun}
              bgIcon={Sun}
              color="amber"
            />
          </div>
        </div>
      ),
    },
    {
      title: "3. The Chessmen",
      color: "brand-red",
      content: (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <p
            className={`${subtextColor} text-xl md:text-2xl mb-8 leading-relaxed font-medium`}
          >
            Each unit retains its core identity but adapts to the new rules of
            engagement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RuleCard
              darkMode={darkMode}
              title="Nimbus Jumper"
              subtitle="The Pawns"
              description="The frontline infantry. They advance forward but also feature specialized defensive retreat capabilities."
              icon={ChessPawn}
              bgIcon={Rabbit}
              color="blue"
            />
            <RuleCard
              darkMode={darkMode}
              title="Light Seer"
              subtitle="The Bishops"
              description="Diagonal specialists, crucial for navigating between dense terrain blockades."
              icon={ChessBishop}
              bgIcon={Flashlight}
              color="emerald"
            />
            <RuleCard
              darkMode={darkMode}
              title="Twilight Fortress"
              subtitle="The Rooks"
              description="Powerful linear combatants, though severely restricted by natural obstacles."
              icon={ChessRook}
              bgIcon={Castle}
              color="amber"
            />
            <RuleCard
              darkMode={darkMode}
              title="Shadow Knight"
              subtitle="The Knights"
              description="Highly mobile infiltrators that bypass standard defenses with their L-shaped maneuvers."
              icon={ChessKnight}
              bgIcon={VenetianMask}
              color="slate"
            />
            <RuleCard
              darkMode={darkMode}
              title="Sacred Queen"
              subtitle="The Queens"
              description="The most versatile and lethal unit on the board, combining linear and diagonal mastery."
              icon={ChessQueen}
              bgIcon={SunMoon}
              color="purple"
            />
            <RuleCard
              darkMode={darkMode}
              title="Equinox King"
              subtitle="The Sovereign"
              description="The commander. Their survival is paramount to victory."
              icon={ChessKing}
              bgIcon={Orbit}
              color="red"
            />
          </div>
        </div>
      ),
    },
    {
      title: "4. Deployment Phase",
      color: "violet-500",
      content: (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <p
            className={`${subtextColor} text-xl md:text-2xl mb-8 leading-relaxed font-medium`}
          >
            Every engagement begins with a strategic deployment phase. Both
            forces must be fully committed before combat commences.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <RuleCard
              darkMode={darkMode}
              title="Unit Deployment"
              description="You must place ALL required units onto the battlefield. In Classic mode, this requires fielding all 16 pieces."
              icon={Users}
              bgIcon={Users}
              color="violet"
            />
            <RuleCard
              darkMode={darkMode}
              title="Terrain Structuring"
              description="You must also establish your defensive lines. In a 1v1 match, you are required to place exactly 16 terrain tiles. For larger engagements, the quota is 8."
              icon={Map}
              bgIcon={Map}
              color="violet"
            />
            <RuleCard
              darkMode={darkMode}
              title="Commence Hostilities"
              description="Once all players have finalized their formations and confirmed their readiness, the battle begins."
              icon={Flag}
              bgIcon={Flag}
              color="violet"
            />
          </div>
        </div>
      ),
    },
    {
      title: "5. Mercenary Mode",
      color: "amber-500",
      content: (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <p
            className={`${subtextColor} text-xl md:text-2xl mb-8 leading-relaxed font-medium`}
          >
            For advanced tacticians, Mercenary Mode removes standard army
            compositions, allowing you to draft a highly specialized force.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <RuleCard
              darkMode={darkMode}
              title="The Requisition Budget"
              description="You are granted a budget of 39 points to assemble your army from scratch."
              icon={Coins}
              bgIcon={Coins}
              color="amber"
            />
            <RuleCard
              darkMode={darkMode}
              title="Unit Costs"
              description="Pawns cost 1 pt, Knights and Bishops cost 3 pts, Rooks cost 5 pts, and Queens cost 9 pts."
              icon={Tags}
              bgIcon={Tags}
              color="amber"
            />
            <RuleCard
              darkMode={darkMode}
              title="The Commander"
              description="You must always draft exactly one King to lead your forces. The King requires no points to draft."
              icon={Crown}
              bgIcon={Crown}
              color="amber"
            />
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide((curr) => curr + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide((curr) => curr - 1);
  };

  return (
    <PageLayout darkMode={darkMode}>
      <div className="flex flex-row justify-center gap-6">
        <div className="justify-center flex flex-col">
          <PageHeader onLogoClick={onBack} />
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-3 flex items-center gap-4">
            <span className={`text-${slides[currentSlide].color}`}>
              {slides[currentSlide].title.split(".")[0]}.
            </span>
            <span className={textColor}>
              {slides[currentSlide].title.split(".")[1]}
            </span>
          </h2>
          <SectionDivider
            label="Trenchess: Base Rules & White Paper"
            color="amber"
            animate={true}
          />
          <div>
            <div className="mt-4 flex items-center justify-between shrink-0 border-slate-200/20">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest transition-all ${
                  currentSlide === 0
                    ? "opacity-50 cursor-not-allowed text-slate-400"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:scale-105 shadow-md"
                }`}
              >
                <ChevronLeft size={24} />
                <span className="hidden md:inline">Previous</span>
              </button>

              <div className="flex gap-4">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all ${
                      currentSlide === idx
                        ? "bg-brand-blue scale-150"
                        : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest transition-all ${
                  currentSlide === slides.length - 1
                    ? "opacity-50 cursor-not-allowed text-slate-400"
                    : "bg-brand-blue text-white hover:scale-105 shadow-lg shadow-brand-blue/20"
                }`}
              >
                <span className="hidden md:inline">Next</span>
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col min-h-[calc(90vh-140px)] justify-center">
          <div
            className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full"
            key={currentSlide}
          >
            {slides[currentSlide].content}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RulesView;
