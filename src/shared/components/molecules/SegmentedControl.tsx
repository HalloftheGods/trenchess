interface Option {
  label: React.ReactNode;
  value: unknown;
  activeColor: string; // e.g. "bg-red-600"
  inactiveColor?: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: unknown;
  onChange: (value: unknown) => void;
  className?: string;
}

export const SegmentedControl = ({
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps) => {
  return (
    <div
      className={`flex items-center gap-1 bg-white/50 dark:bg-black/20 p-1 rounded-2xl border border-slate-200 dark:border-white/5 backdrop-blur-sm ${className}`}
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            className={`flex-1 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              isActive
                ? `${option.activeColor} text-white shadow-lg`
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isActive ? "bg-white" : option.activeColor.replace("bg-", "bg-") // slight hack, but usually we want the dot to be the active color dimmed or just colored
              }`}
              style={{
                backgroundColor: isActive ? "white" : undefined,
                opacity: isActive ? 1 : 0.5,
              }}
            />
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
