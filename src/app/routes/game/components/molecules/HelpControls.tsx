import React from "react";
import { Calculator, FileText, Trophy } from "lucide-react";
import { IconButton } from "@/shared/components/atoms";
import { useNavigate } from "react-router-dom";

interface HelpControlsProps {
  onTutorial?: () => void;
  className?: string;
}

const HelpControls: React.FC<HelpControlsProps> = ({
  onTutorial,
  className = "",
}) => {
  const navigate = useNavigate();
  return (
    <div className={`flex flex-row items-center gap-2 ${className}`}>
      <IconButton
        onClick={() => navigate("/scoreboard")}
        icon={<Trophy size={20} className="text-amber-500" />}
        label="Scoreboard"
      />
      {onTutorial && (
        <IconButton
          icon={<Calculator size={20} />}
          label="Interactive Guide"
          onClick={onTutorial}
        />
      )}
      <IconButton
        onClick={() => navigate("/rules")}
        icon={
          <FileText size={20} className="text-slate-600 dark:text-slate-300" />
        }
        label="Rules"
      />
    </div>
  );
};

export default HelpControls;
