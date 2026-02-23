import { Crown, Earth, Skull } from "lucide-react";

export const CornerStartingPositionsGraphic = () => (
  <div className="w-full aspect-square bg-slate-900/40 rounded-[2.5rem] border-2 border-amber-500/20 flex flex-col items-center justify-center p-4 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 to-transparent overflow-hidden">
    <div className="grid grid-cols-8 gap-1 w-full opacity-20 pointer-events-none">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className={`aspect-square rounded-sm ${(Math.floor(i / 8) + (i % 8)) % 2 === 0 ? "bg-white/10" : "bg-black/10"}`}
        />
      ))}
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="grid grid-cols-3 grid-rows-3 gap-16">
        <div className="p-3 bg-brand-red/70 rounded-xl shadow-lg -rotate-3 border-2 border-amber-400/50">
          <Crown className="text-white" size={24} />
        </div>
        <div />
        <div className="p-3 bg-brand-red/70 rounded-xl shadow-lg rotate-3 border-2 border-amber-400/50">
          <Crown className="text-white" size={24} />
        </div>
        <div /> <div /> <div />
        <div className="p-3 bg-brand-blue/70 rounded-xl shadow-lg rotate-6 border-2 border-amber-400/50">
          <Crown className="text-white" size={24} />
        </div>
        <div />
        <div className="p-3 bg-brand-blue/70 rounded-xl shadow-lg -rotate-6 border-2 border-amber-400/50">
          <Crown className="text-white" size={24} />
        </div>
      </div>
    </div>
    <span className="mt-auto text-[10px] font-black uppercase text-amber-500/60 tracking-[0.3em] pt-4 z-10">
      Corner Starting Positions
    </span>
  </div>
);

export const TransContinentalGraphic = () => (
  <div className="w-full aspect-square bg-slate-900/40 rounded-[2.5rem] border-2 border-emerald-500/20 flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 flex items-center justify-center scale-150">
      <Earth className="text-emerald-500" size={200} />
    </div>
    <div className="relative z-10 flex flex-col items-center gap-4">
      <div className="w-48 h-48 border-2 border-emerald-500/30 rounded-2xl relative overflow-hidden bg-slate-800/80 shadow-2xl">
        <div className="absolute top-2 left-2 w-8 h-8 bg-brand-red/20 border border-brand-red/40 rounded-lg" />
        <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500/20 border border-emerald-500/40 rounded-lg" />
        <svg className="absolute inset-0 w-full h-full">
          <path
            d="M 20 20 L 172 172"
            stroke="rgba(16, 185, 129, 0.5)"
            strokeWidth="4"
            strokeDasharray="8 8"
            fill="transparent"
          />
        </svg>
        <Crown className="text-white absolute bottom-3 right-3 w-6 h-6 drop-shadow-md" />
      </div>
    </div>
    <span className="mt-auto text-[10px] font-black uppercase text-emerald-500/60 tracking-[0.3em] pt-4 relative z-10">
      Trans-continental traversal
    </span>
  </div>
);

export const TroopConversionGraphic = () => (
  <div className="w-full aspect-square bg-slate-900/40 rounded-[2.5rem] border-2 border-indigo-500/20 flex flex-col items-center justify-center p-8 relative overflow-hidden">
    <div className="absolute inset-0 bg-indigo-950/20 animate-pulse" />
    <div className="relative z-10 flex gap-4 w-full justify-center">
      <div className="flex flex-col gap-2 items-center w-1/2">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center border-2 border-emerald-400 shadow-xl">
          <Crown className="text-white" size={32} />
        </div>
        <div className="text-3xl font-black text-indigo-500/80 my-2">→</div>
        <div className="flex gap-2 flex-wrap justify-center mt-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500/60 shadow-lg" />
          <div className="w-5 h-5 rounded-full bg-emerald-500/60 shadow-lg" />
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center w-1/2 opacity-30 grayscale">
        <div className="w-16 h-16 rounded-2xl bg-brand-red/70 flex items-center justify-center border-2 border-brand-red/40">
          <Skull className="text-white" size={32} />
        </div>
        <div className="text-3xl font-black text-transparent my-2">→</div>
        <div className="flex gap-2 flex-wrap justify-center mt-2">
          <div className="w-5 h-5 rounded-full bg-brand-red/60" />
          <div className="w-5 h-5 rounded-full bg-brand-red/60" />
        </div>
      </div>
    </div>
    <span className="mt-auto text-[10px] font-black uppercase text-indigo-500/60 tracking-[0.3em] text-center z-20">
      Troop Conversion
    </span>
  </div>
);
