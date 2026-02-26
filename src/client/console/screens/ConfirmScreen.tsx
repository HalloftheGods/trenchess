import React from "react";
import { AlertCircle } from "lucide-react";
import {
  TCButton,
  TCCard,
  TCOverlay,
  TCHeading,
  TCText,
} from "@/shared/components/atoms/ui";

interface ConfirmScreenProps {
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmScreen: React.FC<ConfirmScreenProps> = ({
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this operation?",
  onConfirm = () => console.log("Confirmed"),
  onCancel = () => console.log("Cancelled"),
  confirmLabel = "Confirm",
  cancelLabel = "Abort",
}) => {
  return (
    <TCOverlay>
      <TCCard
        variant="solid"
        padding="lg"
        className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-300"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <AlertCircle size={32} />
          </div>

          <div className="space-y-2">
            <TCHeading level={2} variant="brand">
              {title}
            </TCHeading>
            <TCText variant="small">{message}</TCText>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <TCButton
            variant="danger"
            size="lg"
            onClick={onConfirm}
            className="w-full"
          >
            {confirmLabel}
          </TCButton>

          <TCButton
            variant="secondary"
            size="lg"
            onClick={onCancel}
            className="w-full"
          >
            {cancelLabel}
          </TCButton>
        </div>
      </TCCard>
    </TCOverlay>
  );
};

export default ConfirmScreen;
