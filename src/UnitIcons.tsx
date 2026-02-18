export const CommanderIcon = ({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number | string;
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Crown/Commander Helmet */}
    <path d="M20 70 L20 40 L35 55 L50 30 L65 55 L80 40 L80 70 Z" />
    <path d="M15 70 H85 V85 H15 Z" fill="currentColor" fillOpacity="0.2" />
    <circle cx="50" cy="20" r="6" fill="currentColor" />
  </svg>
);

export const BattleKnightIcon = ({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number | string;
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Sword and Halo */}
    <path d="M50 20 L50 85" strokeWidth="8" />
    <path d="M30 40 L70 40" strokeWidth="8" />
    <path d="M50 20 L35 15 L50 5 L65 15 Z" fill="currentColor" />
    <path d="M20 30 Q50 5 80 30" strokeWidth="4" className="opacity-50" />
    <path d="M20 85 Q50 100 80 85" strokeWidth="4" className="opacity-50" />
  </svg>
);

export const TankIcon = ({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number | string;
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Heavy Armor/Turret */}
    <rect
      x="20"
      y="55"
      width="60"
      height="30"
      rx="4"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path d="M30 55 L40 35 H60 L70 55" />
    <path d="M60 45 H90" strokeWidth="8" />
    <circle cx="30" cy="85" r="5" />
    <circle cx="50" cy="85" r="5" />
    <circle cx="70" cy="85" r="5" />
  </svg>
);

export const SniperIcon = ({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number | string;
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Crosshair/Target */}
    <circle cx="50" cy="50" r="35" />
    <line x1="50" y1="15" x2="50" y2="35" />
    <line x1="50" y1="65" x2="50" y2="85" />
    <line x1="15" y1="50" x2="35" y2="50" />
    <line x1="65" y1="50" x2="85" y2="50" />
    <circle cx="50" cy="50" r="4" fill="currentColor" />
  </svg>
);

export const HorsemanIcon = ({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number | string;
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Abstract Knight/Horse Head */}
    <path d="M20 85 L30 85 L40 45 L65 25 L80 30 L70 60 L60 60" />
    <path d="M40 45 Q30 30 50 15 L60 18" />
    <circle cx="60" cy="35" r="3" fill="currentColor" />
    <path d="M20 85 L80 85" className="opacity-50" />
  </svg>
);

export const BotIcon = ({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number | string;
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Robot Head */}
    <rect
      x="30"
      y="35"
      width="40"
      height="40"
      rx="6"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <line x1="20" y1="55" x2="30" y2="55" />
    <line x1="70" y1="55" x2="80" y2="55" />
    <path d="M40 35 V25 L50 15 L60 25 V35" />
    <circle cx="42" cy="50" r="3" fill="currentColor" />
    <circle cx="58" cy="50" r="3" fill="currentColor" />
    <path d="M40 65 H60" />
  </svg>
);

export const DesertIcon = ({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number | string;
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Sun and Snow split */}
    {/* Sun Top-Left */}
    <circle
      cx="35"
      cy="35"
      r="15"
      className="text-amber-500"
      stroke="currentColor"
    />
    <path d="M35 10 L35 15" className="text-amber-500" stroke="currentColor" />
    <path d="M35 55 L35 60" className="text-amber-500" stroke="currentColor" />
    <path d="M10 35 L15 35" className="text-amber-500" stroke="currentColor" />
    <path d="M55 35 L60 35" className="text-amber-500" stroke="currentColor" />
    <path d="M17 17 L21 21" className="text-amber-500" stroke="currentColor" />
    <path d="M53 53 L49 49" className="text-amber-500" stroke="currentColor" />
    <path d="M17 53 L21 49" className="text-amber-500" stroke="currentColor" />
    <path d="M53 17 L49 21" className="text-amber-500" stroke="currentColor" />

    {/* Snowflake Bottom-Right */}
    <g transform="translate(50, 50) scale(0.8)">
      <path d="M10 10 L40 40" className="text-sky-400" stroke="currentColor" />
      <path d="M40 10 L10 40" className="text-sky-400" stroke="currentColor" />
      <path d="M25 5 L25 45" className="text-sky-400" stroke="currentColor" />
      <path d="M5 25 L45 25" className="text-sky-400" stroke="currentColor" />
    </g>
  </svg>
);
