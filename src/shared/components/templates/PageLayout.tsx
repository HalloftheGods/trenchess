/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * Reusable full-page layout with header, content area, and footer.
 */
import React from "react";
import CopyrightFooter from "@/shared/components/molecules/CopyrightFooter";

interface PageLayoutProps {
  darkMode: boolean;
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  darkMode,
  header,
  children,
  footer,
}) => {
  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-[#050b15]" : "bg-stone-100"} text-slate-900 dark:text-slate-100 flex flex-col items-center p-8 transition-colors overflow-y-auto w-full`}
    >
      {header}
      {children}
      {footer !== undefined ? footer : <CopyrightFooter />}
    </div>
  );
};

export default PageLayout;
