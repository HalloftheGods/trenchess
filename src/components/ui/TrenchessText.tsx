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
    <span className="text-brand-red">Tren</span>
    <span className="text-brand-blue">chess</span>
  </span>
);

export default TrenchessText;
