import type { ReactNode } from "react";
import CopyrightFooter from "@molecules/CopyrightFooter";
import { DebugSheet } from "../molecules/DebugSheet";

interface GameLayoutProps {
  children: ReactNode;
  header: ReactNode;
  debugPanel?: ReactNode;
}

export const GameLayout = ({ children, header, debugPanel }: GameLayoutProps) => {
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#050b15] text-slate-800 dark:text-slate-100 p-4 md:p-8 flex flex-col items-center overflow-x-hidden transition-colors">
      {header}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {children}
      </div>
      <CopyrightFooter />
      <DebugSheet debugPanel={debugPanel} />
    </div>
  );
};
