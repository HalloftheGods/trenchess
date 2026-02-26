import { TCText } from "./ui";

interface TrenchessTextProps {
  className?: string;
}

const TrenchessText: React.FC<TrenchessTextProps> = ({ className = "" }) => (
  <TCText
    variant="none"
    className={`font-black uppercase tracking-tighter inline-flex ${className}`}
  >
    <TCText variant="none" className="text-brand-red">
      Tren
    </TCText>
    <TCText variant="none" className="text-brand-blue">
      chess
    </TCText>
  </TCText>
);

export default TrenchessText;
