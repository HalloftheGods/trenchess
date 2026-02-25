import React from "react";

interface CheckAlertProps {
  inCheck: boolean;
}

export const CheckAlert: React.FC<CheckAlertProps> = ({ inCheck }) => {
  if (!inCheck) return null;

  return (
    <div className="bg-brand-red/10 border-2 border-brand-red rounded-2xl p-4 text-center animate-pulse">
      <h3 className="text-2xl font-black text-brand-red uppercase tracking-tighter">
        ⚠️ CHECK DETECTED ⚠️
      </h3>
      <p className="text-brand-red font-bold text-xs uppercase tracking-widest mt-1">
        Commander Under Threat
      </p>
    </div>
  );
};
