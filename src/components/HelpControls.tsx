import React from "react";
import { Calculator, FileText } from "lucide-react";
import { IconButton } from "./ui/IconButton";
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
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 ${className}`}
    >
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
