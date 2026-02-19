interface TrenchessTextProps {
  className?: string;
}

/**
 * Renders the branded "TRENCHESS" name with the canonical logo colors:
 *   TREN → red-600
 *   CHESS → blue-600
 *
 * Usage:
 *   <TrenchessText />                      → "TRENCHESS"
 *   Play <TrenchessText />                 → "Play TRENCHESS" (white + red + blue)
 */
const TrenchessText: React.FC<TrenchessTextProps> = ({ className = "" }) => (
  <span className={className}>
    <span className="text-red-600">Tren</span>
    <span className="text-blue-600">chess</span>
  </span>
);

export default TrenchessText;
