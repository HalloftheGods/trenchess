import React from "react";
import { TCText } from "./ui";

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
  _variant?: "body" | "caption" | "small" | "large";
  weight?: "normal" | "medium" | "semibold" | "bold" | "black";
  as?: React.ElementType;
}

/** @deprecated Use TCText directly */
export const Text: React.FC<TextProps> = ({ ...props }) => {
  return <TCText {...(props as any)} />;
};
