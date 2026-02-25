import { TERRAIN_INTEL } from "@/constants/ui/terrain";
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
  const terrainKeys = Object.keys(TERRAIN_INTEL);

  return (
    <div
      className={`flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center ${
        fullScreen
          ? "fixed inset-0 z-[9999]"
          : "w-full h-full p-4 shadow-inner rounded-3xl"
      }`}
    >
      <div className="relative mb-8 flex gap-4">
        {terrainKeys.map((key, index) => {
          const terrain = TERRAIN_INTEL[key];
          const Icon = terrain.icon;
          return (
            <div
              key={key}
              className={`animate-bounce ${terrain.text}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Icon size={32} />
            </div>
          );
        })}
      </div>

      <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 animate-pulse">
        Loading <TrenchessText />
      </h2>

      <div className="mt-4 relative h-[1.5em] flex justify-center text-slate-400 font-medium h-6 overflow-hidden">
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

      <div className="mt-12 w-64 h-1 bg-slate-900 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand-red via-amber-500 to-brand-blue animate-loading-bar" />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s infinite ease-in-out;
        }
        @keyframes message-sequence {
          0%, 5% { transform: translateY(10px); opacity: 0; }
          10%, 90% { transform: translateY(0); opacity: 1; }
          95%, 100% { transform: translateY(-10px); opacity: 0; }
        }
        .animate-message-sequence {
          animation: message-sequence 2.3s infinite;
        }
      `,
        }}
      />
    </div>
  );
};
