import React from "react";

export interface RouteConfig {
  path?: string;
  index?: boolean;
  element: React.ReactNode;
  children?: RouteConfig[];
}
