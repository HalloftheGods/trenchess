import React from "react";

interface TCHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | "hero";
  variant?: "brand" | "plain" | "none";
  className?: string;
  as?: React.ElementType;
}

export const TCHeading: React.FC<TCHeadingProps> = ({
  children,
  level = 2,
  variant = "brand",
  className = "",
  as,
  ...props
}) => {
  const baseStyles = "font-black uppercase tracking-tighter";

  const levels = {
    hero: "text-6xl md:text-8xl",
    1: "text-4xl lg:text-6xl",
    2: "text-2xl lg:text-3xl",
    3: "text-xl",
    4: "text-lg",
  };

  const variants = {
    brand: "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]",
    plain: "text-slate-400",
    none: "",
  };

  const Tag = (as ||
    (level === "hero" ? "h1" : `h${level}`)) as React.ElementType;
  const currentLevel = levels[level];
  const currentVariant = variants[variant];
  const combinedClassName = `${baseStyles} ${currentLevel} ${currentVariant} ${className}`;

  return (
    <Tag className={combinedClassName} {...props}>
      {children}
    </Tag>
  );
};

export const TCH1: React.FC<TCHeadingProps> = (props) => (
  <TCHeading level={1} {...props} />
);

export const TCHero: React.FC<TCHeadingProps> = (props) => (
  <TCHeading level="hero" {...props} />
);

interface TCTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "body" | "small" | "muted" | "lead" | "none";
  className?: string;
  as?: React.ElementType;
}

export const TCText: React.FC<TCTextProps> = ({
  children,
  variant = "body",
  className = "",
  as,
  ...props
}) => {
  const baseStyles = variant === "none" ? "" : "font-medium leading-relaxed";

  const variants = {
    body: "text-slate-300 text-base",
    small: "text-slate-400 text-sm",
    muted: "text-slate-500 text-sm",
    lead: "text-slate-200 text-lg",
    none: "",
  };

  const Tag = as || "span";
  const currentVariant = variants[variant];
  const combinedClassName = `${baseStyles} ${currentVariant} ${className}`;

  return (
    <Tag className={combinedClassName} {...props}>
      {children}
    </Tag>
  );
};
