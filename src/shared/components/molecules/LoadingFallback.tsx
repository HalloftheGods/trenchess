import { Mountain, Trees, Waves } from "lucide-react";
import { DesertIcon } from "@/client/game/components/atoms/UnitIcons";
import TrenchessText from "@/shared/components/atoms/TrenchessText";

const LOADING_MESSAGES = [
  "Opening Trench.",
  "Pouring the Chessmen.",
  "Cracking the Endgame.",
];

export const LoadingFallback = ({
  fullScreen = false,
}: {
  fullScreen?: boolean;
}) => {
  return (
    <div
      className={`min-h-[100vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 ${
        fullScreen
          ? "w-full h-full"
          : "w-full h-full p-4 shadow-inner rounded-3xl"
      }`}
    >
      <DesertIcon className="w-12 h-12" />
      <div className="mt-4 text-center font-black uppercase tracking-widest text-slate-400">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Mountain className="w-12 h-12 text-brand-red" />
          <Trees className="w-12 h-12 text-emerald-500" />
        </div>

        <div className="flex flex-row justify-center mt-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <Waves
              key={index}
              className="w-12 h-12 text-brand-blue animate-wave-pulse"
              style={{ animationDelay: `${index * 200}ms` }}
            />
          ))}
        </div>

        <div>
          Loading <TrenchessText />
        </div>

        <div className="mt-4 relative h-[1.5em] flex justify-center">
          {LOADING_MESSAGES.map((message, index) => (
            <div
              key={index}
              className="absolute animate-message-sequence opacity-0"
              style={{ animationDelay: `${index * 2.3}s` }}
            >
              {message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
