import React from "react";

interface MathOperatorProps {
  operator: "+" | "=";
  className?: string;
}

export const MathOperator: React.FC<MathOperatorProps> = ({
  operator,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-center self-center h-full min-h-[4rem] ${className}`}
    >
      <span className="text-4xl sm:text-6xl font-black text-slate-400/50 dark:text-white/20 select-none font-mono">
        {operator}
      </span>
    </div>
  );
};

export default MathOperator;
