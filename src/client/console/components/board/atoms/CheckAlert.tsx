import React from "react";
import { TCHeading, TCText } from "@/shared/components/atoms/ui";

interface CheckAlertProps {
  inCheck: boolean;
}

export const CheckAlert: React.FC<CheckAlertProps> = ({ inCheck }) => {
  if (!inCheck) return null;

  return (
    <div className="bg-brand-red/10 border-2 border-brand-red rounded-2xl p-4 text-center animate-pulse">
      <TCHeading level={3} className="text-brand-red">
        ⚠️ CHECK DETECTED ⚠️
      </TCHeading>
      <TCText className="text-brand-red font-bold text-xs uppercase tracking-widest mt-1">
        Commander Under Threat
      </TCText>
    </div>
  );
};
