import { useState, useEffect } from "react";
import { Mountain, Trees, Waves } from "lucide-react";
import { DesertIcon } from "@/app/routes/game/components/atoms/UnitIcons";
import TrenchessText from "@/shared/components/atoms/TrenchessText";

export const LoadingFallback = ({
  fullScreen = false,
}: {
  fullScreen?: boolean;
}) => {
  const [activeWave, setActiveWave] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const messages = [
    "Opening Trench.",
    "Pouring the Chessmen.",
    "Cracking the Endgame.",
  ];

  useEffect(() => {
    const waveInterval = setInterval(() => {
      setActiveWave((prev) => (prev === 0 ? 3 : prev - 1));
    }, 200);
    return () => clearInterval(waveInterval);
  }, []);

  useEffect(() => {
    if (messageIndex < messages.length - 1) {
      const timeout = setTimeout(() => {
        setFade(false);
        setTimeout(() => {
          setMessageIndex((prev) => prev + 1);
          setFade(true);
        }, 300);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [messageIndex, messages.length]);

  return (
    <div
      className={`flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 ${fullScreen ? "w-full h-screen" : "w-full h-full min-h-[100vh] p-4 shadow-inner"}`}
    >
      <DesertIcon className="w-12 h-12" />
      <div className="mt-4 text-center font-black uppercase tracking-widest text-slate-400">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Mountain className="w-12 h-12 text-brand-red" />
          <Trees className="w-12 h-12 text-emerald-500" />
        </div>

        <div className="flex flex-row justify-center mt-2">
          {[0, 1, 2, 3].map((index) => (
            <Waves
              key={index}
              className={`w-12 h-12 transition-all duration-300 ${
                activeWave === index
                  ? "text-brand-blue opacity-100 scale-110"
                  : "text-brand-blue opacity-30 scale-100"
              }`}
            />
          ))}
        </div>
        <div>
          Loading <TrenchessText />
        </div>

        <div
          className={`mt-4 min-h-[1.5em] transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {messages[messageIndex]}
        </div>
      </div>
    </div>
  );
};
