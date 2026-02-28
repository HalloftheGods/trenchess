import React from "react";
import type { s, n, b, v } from "./Primitives.d.ts";

export type Node = React.ReactNode;
export type CSS = React.CSSProperties;
export type Event = React.MouseEvent;

export type ClickHandler = (e: Event) => v;
export type KeyHandler = (e: React.KeyboardEvent) => v;
export type FocusHandler = (e: React.FocusEvent) => v;
export type BlurHandler = (e: React.FocusEvent) => v;
export type ChangeHandler = (e: React.ChangeEvent) => v;
export type SubmitHandler = (e: React.FormEvent) => v;

export interface BaseProps {
  className?: s;
  children?: Node;
  style?: CSS;
}

export type Component<P = object> = React.FC<P & BaseProps>;
export type Icon = React.FC<{ className?: s; size?: n | s }>;

export interface IconProps extends BaseProps {
  size?: n | s;
  filled?: b;
  color?: s;
}

export interface ClickableProps extends BaseProps {
  onClick?: ClickHandler;
  disabled?: b;
}
