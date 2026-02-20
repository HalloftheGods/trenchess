import { type LucideIcon } from "lucide-react";
import { type PreviewConfig, useMenuContext } from "./menu/MenuContext";

type ColorVariant =
  | "red"
  | "orange"
  | "yellow"
  | "emerald"
  | "blue"
  | "amber"
  | "fuchsia"
  | "slate";

interface MenuCardProps {
  onClick: () => void;
  title: string;
  description: string;
  Icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  color: ColorVariant;
  badge?: string;
  hoverText?: string;
  className?: string;
  darkMode?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  /** Optional: override the title rendering with custom JSX */
  titleNode?: React.ReactNode;
  /** Optional: configuration for the board preview when this card is hovered */
  preview?: PreviewConfig;
  /** Visual variant of the card. Default is 'tinted' */
  variant?: "tinted" | "solid" | "transparent";
}

const COLOR_STYLES: Record<
  ColorVariant,
  {
    border: string;
    shadow: string;
    gradient: string;
    iconColor: string;
    tintedBg: string; // The standard transparent tinted background
    solidBg: string; // Used for "solid" variant
  }
> = {
  red: {
    border: "border-brand-red/20 hover:border-brand-red/50",
    shadow: "hover:shadow-brand-red/20",
    gradient:
      "from-brand-red/0 to-brand-red/0 group-hover:from-brand-red/5 group-hover:to-brand-red/10",
    iconColor: "text-brand-red",
    tintedBg:
      "bg-brand-red/5 hover:bg-brand-red/10 dark:bg-brand-red/10 dark:hover:bg-brand-red/20",
    solidBg:
      "bg-brand-red/10 hover:bg-brand-red/20 dark:bg-brand-red/50 dark:hover:bg-brand-red/80",
  },
  orange: {
    border: "border-orange-500/20 hover:border-orange-500/50",
    shadow: "hover:shadow-orange-500/20",
    gradient:
      "from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/10",
    iconColor: "text-orange-500",
    tintedBg:
      "bg-orange-50/50 hover:bg-orange-100/50 dark:bg-orange-900/10 dark:hover:bg-orange-900/20",
    solidBg:
      "bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-900/80",
  },
  yellow: {
    border: "border-yellow-500/20 hover:border-yellow-500/50",
    shadow: "hover:shadow-yellow-500/20",
    gradient:
      "from-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/5 group-hover:to-yellow-500/10",
    iconColor: "text-yellow-500",
    tintedBg:
      "bg-yellow-50/50 hover:bg-yellow-100/50 dark:bg-yellow-900/10 dark:hover:bg-yellow-900/20",
    solidBg:
      "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:hover:bg-yellow-900/80",
  },
  emerald: {
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    shadow: "hover:shadow-emerald-500/20",
    gradient:
      "from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10",
    iconColor: "text-emerald-500",
    tintedBg:
      "bg-emerald-50/50 hover:bg-emerald-100/50 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/20",
    solidBg:
      "bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:hover:bg-emerald-900/80",
  },
  blue: {
    border: "border-brand-blue/20 hover:border-brand-blue/50",
    shadow: "hover:shadow-brand-blue/20",
    gradient:
      "from-brand-blue/0 to-brand-blue/0 group-hover:from-brand-blue/5 group-hover:to-brand-blue/10",
    iconColor: "text-brand-blue",
    tintedBg:
      "bg-brand-blue/5 hover:bg-brand-blue/10 dark:bg-brand-blue/10 dark:hover:bg-brand-blue/20",
    solidBg:
      "bg-brand-blue/10 hover:bg-brand-blue/20 dark:bg-brand-blue/50 dark:hover:bg-brand-blue/80",
  },
  amber: {
    border: "border-amber-500/20 hover:border-amber-500/50",
    shadow: "hover:shadow-amber-500/20",
    gradient:
      "from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/10",
    iconColor: "text-amber-500",
    tintedBg:
      "bg-amber-50/50 hover:bg-amber-100/50 dark:bg-amber-900/10 dark:hover:bg-amber-900/20",
    solidBg:
      "bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 dark:hover:bg-amber-900/80",
  },
  fuchsia: {
    border: "border-fuchsia-500/20 hover:border-fuchsia-500/50",
    shadow: "hover:shadow-fuchsia-500/20",
    gradient:
      "from-fuchsia-500/0 to-fuchsia-500/0 group-hover:from-fuchsia-500/5 group-hover:to-fuchsia-500/10",
    iconColor: "text-fuchsia-500",
    tintedBg:
      "bg-fuchsia-50/50 hover:bg-fuchsia-100/50 dark:bg-fuchsia-900/10 dark:hover:bg-fuchsia-900/20",
    solidBg:
      "bg-fuchsia-100 hover:bg-fuchsia-200 dark:bg-fuchsia-900/50 dark:hover:bg-fuchsia-900/80",
  },
  slate: {
    border: "border-slate-500/20 hover:border-slate-500/50",
    shadow: "hover:shadow-slate-500/20",
    gradient:
      "from-slate-500/0 to-slate-500/0 group-hover:from-slate-500/5 group-hover:to-slate-500/10",
    iconColor: "text-slate-500",
    tintedBg:
      "bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/10 dark:hover:bg-slate-900/20",
    solidBg:
      "bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/50 dark:hover:bg-slate-900/80",
  },
};

const MenuCard = ({
  onClick,
  title,
  description,
  Icon,
  color,
  badge,
  hoverText,
  className = "",
  isSelected,
  isDisabled,
  darkMode,
  onMouseEnter,
  onMouseLeave,
  titleNode,
  preview,
  variant = "tinted",
}: MenuCardProps & { isSelected?: boolean; isDisabled?: boolean }) => {
  const styles = COLOR_STYLES[color];
  const { setPreviewConfig, selectedBoard } = useMenuContext();

  const handleMouseEnter = () => {
    if (onMouseEnter) onMouseEnter();
    if (preview) {
      setPreviewConfig(preview);
    }
  };

  const handleMouseLeave = () => {
    if (onMouseLeave) onMouseLeave();
    if (preview) {
      // Revert to selected board if one is active, otherwise clear
      setPreviewConfig({
        mode: selectedBoard || null,
      });
    }
  };

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group border-2 p-8 rounded-[2.5rem] transition-all flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden cursor-pointer ${
        isDisabled
          ? "opacity-50 cursor-not-allowed grayscale"
          : "hover:-translate-y-2"
      } ${
        isSelected
          ? "ring-4 ring-inset ring-brand-red border-transparent [--card-bg:#ffffff] dark:[--card-bg:#0f172a]"
          : styles.border
      } ${
        variant === "tinted"
          ? styles.tintedBg
          : variant === "solid"
            ? styles.solidBg
            : "bg-white dark:bg-slate-900 border-slate-200/30 dark:border-white/5"
      } ${styles.shadow} ${className}`}
      style={
        isSelected && className.includes("custom-border")
          ? ({
              backgroundImage:
                "linear-gradient(var(--card-bg, white), var(--card-bg, white)), " +
                (className.match(/custom-border-\[(.*?)\]/)?.[1] || ""),
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              borderColor: "transparent",
              "--card-bg": darkMode ? "#0f172a" : "#ffffff",
            } as any)
          : undefined
      }
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${
          isSelected
            ? styles.gradient.replaceAll("group-hover:", "")
            : styles.gradient
        }`}
      />

      {badge && (
        <div
          className={`absolute top-0 right-0 p-3 rounded-bl-2xl text-[10px] font-black uppercase tracking-[0.15em] z-20 bg-slate-100 dark:bg-slate-800 ${styles.iconColor}`}
        >
          <div className={`absolute inset-0 opacity-10 bg-current`} />
          <span className="relative z-10">{badge}</span>
        </div>
      )}

      {/* Render Icon with conditional size/class if it's a component, or just size/class if it's a LucideIcon */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <Icon
          size={64}
          className={`transition-all duration-500 absolute z-10 ${
            hoverText
              ? "group-hover:opacity-0 group-hover:scale-50"
              : isSelected
                ? "scale-110"
                : "group-hover:scale-110"
          } ${styles.iconColor}`}
        />
        {hoverText && (
          <div
            className={`transition-all duration-500 absolute flex items-center justify-center z-10 text-6xl opacity-0 scale-50 font-serif group-hover:opacity-100 group-hover:scale-110 ${styles.iconColor}`}
          >
            {hoverText}
          </div>
        )}
      </div>

      <div className="text-center relative z-10">
        <h3 className="text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white">
          {titleNode ? (
            titleNode
          ) : title.includes(" ") ? (
            <>
              {title.split(" ")[0]}{" "}
              <span className={styles.iconColor}>
                {title.split(" ").slice(1).join(" ")}
              </span>
            </>
          ) : (
            title
          )}
        </h3>
        <p className="text-slate-400 dark:text-slate-500 mt-2 font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
};

export default MenuCard;
