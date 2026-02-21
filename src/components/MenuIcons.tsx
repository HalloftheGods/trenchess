interface MenuIconProps {
  size?: number;
  className?: string; // Additional classes for the container
}

export const DualToneNS = ({ size = 24, className = "" }: MenuIconProps) => (
  // Mimicking Lucide 'Users' but Red/Blue
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Front User - Red */}
    <g className="text-brand-red">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </g>
    {/* Back User - Blue */}
    <g className="text-brand-blue">
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </g>
  </svg>
);

export const DualToneEW = ({ size = 24, className = "" }: MenuIconProps) => (
  // Mimicking Lucide 'Users' but Green/Yellow
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Front User - Yellow (West) */}
    <g className="text-yellow-500">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </g>
    {/* Back User - Green (East) */}
    <g className="text-green-500">
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </g>
  </svg>
);

export const QuadTone = ({ size = 24, className = "" }: MenuIconProps) => (
  // Mimicking Lucide 'LayoutGrid'
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* NW - Red */}
    <rect width="7" height="7" x="3" y="3" rx="1" className="text-brand-red" />
    {/* NE - Yellow */}
    <rect
      width="7"
      height="7"
      x="14"
      y="3"
      rx="1"
      className="text-yellow-500"
    />
    {/* SW - Green */}
    <rect width="7" height="7" x="3" y="14" rx="1" className="text-green-500" />
    {/* SE - Blue */}
    <rect
      width="7"
      height="7"
      x="14"
      y="14"
      rx="1"
      className="text-brand-blue"
    />
  </svg>
);
export const AllianceTone = ({ size = 24, className = "" }: MenuIconProps) => (
  // Mimicking the center 2x2 black/white squares
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* NW - White outline */}
    <rect
      width="7"
      height="7"
      x="3"
      y="3"
      rx="1.5"
      className="stroke-slate-400 dark:stroke-white"
    />
    {/* NE - Grey outline */}
    <rect
      width="7"
      height="7"
      x="14"
      y="3"
      rx="1.5"
      className="stroke-slate-300 dark:stroke-slate-600"
    />
    {/* SW - Grey outline */}
    <rect
      width="7"
      height="7"
      x="3"
      y="14"
      rx="1.5"
      className="stroke-slate-300 dark:stroke-slate-600"
    />
    {/* SE - White outline */}
    <rect
      width="7"
      height="7"
      x="14"
      y="14"
      rx="1.5"
      className="stroke-slate-400 dark:stroke-white"
    />
  </svg>
);

export const DualToneSwords = ({
  size = 24,
  className = "",
}: MenuIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" stroke="#2563eb" />
    <line x1="13" x2="19" y1="19" y2="13" stroke="#2563eb" />
    <line x1="16" x2="20" y1="16" y2="20" stroke="#2563eb" />
    <line x1="19" x2="21" y1="21" y2="19" stroke="#2563eb" />
    <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" stroke="#dc2626" />
    <line x1="5" x2="9" y1="14" y2="18" stroke="#dc2626" />
    <line x1="7" x2="4" y1="17" y2="20" stroke="#dc2626" />
    <line x1="3" x2="5" y1="19" y2="21" stroke="#dc2626" />
  </svg>
);
