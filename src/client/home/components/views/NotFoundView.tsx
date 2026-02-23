import { Skull } from "lucide-react";
import { DesertIcon } from "@/client/game/components/atoms/UnitIcons";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes";

const NotFoundView = ({ fullScreen = true }: { fullScreen?: boolean }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-[100vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 ${
        fullScreen
          ? "w-full h-full"
          : "w-full h-full p-4 shadow-inner rounded-3xl"
      }`}
    >
      <DesertIcon className="w-12 h-12 text-slate-400 opacity-50" />
      <div className="mt-8 text-center font-black uppercase tracking-widest text-slate-400">
        <div className="flex justify-center items-center mb-6">
          <Skull className="w-16 h-16 text-brand-red opacity-80" />
        </div>

        <div className="text-2xl mb-2 text-slate-600 dark:text-slate-300">
          404 - Lost in the Trench
        </div>

        <div className="text-sm opacity-60 mb-8 max-w-md mx-auto normal-case tracking-normal px-4">
          The coordinates you specified don't exist in our current battle plans.
        </div>

        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="px-6 py-3 bg-brand-red text-white rounded-xl font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
        >
          Return to HQ
        </button>
      </div>
    </div>
  );
};

export default NotFoundView;
