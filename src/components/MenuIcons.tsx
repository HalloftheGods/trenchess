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
    <g className="text-red-500">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </g>
    {/* Back User - Blue */}
    <g className="text-blue-500">
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
    <rect width="7" height="7" x="3" y="3" rx="1" className="text-red-500" />
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
    <rect width="7" height="7" x="14" y="14" rx="1" className="text-blue-500" />
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
    {/* NE - Black outline */}
    <rect
      width="7"
      height="7"
      x="14"
      y="3"
      rx="1.5"
      className="stroke-slate-900 dark:stroke-slate-500"
    />
    {/* SW - Black outline */}
    <rect
      width="7"
      height="7"
      x="3"
      y="14"
      rx="1.5"
      className="stroke-slate-900 dark:stroke-slate-500"
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
