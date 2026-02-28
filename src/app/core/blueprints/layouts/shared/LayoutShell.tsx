import React from "react";
import type { ReactNode } from "react";
import CopyrightFooter from "@molecules/CopyrightFooter";
import { TCFlex } from "@atoms/ui";

interface LayoutShellProps {
  children: ReactNode;
  header: ReactNode;
  darkMode?: boolean;
}

export const LayoutShell: React.FC<LayoutShellProps> = ({
  children,
  header,
  darkMode = true,
}) => (
  <TCFlex
    direction="col"
    align="center"
    className={`min-h-screen ${
      darkMode ? "bg-[#02030f]" : "bg-stone-100"
    } text-slate-800 dark:text-slate-100 p-4 md:p-8 overflow-x-hidden transition-colors`}
  >
    {header}
    {children}
    <CopyrightFooter />
  </TCFlex>
);
