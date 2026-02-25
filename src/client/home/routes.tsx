import { ROUTES } from "@constants/routes";
import type { RouteConfig } from "@/shared/types/route";

const HomeIndexLazy = ROUTES.HOME.component(() => import("./index"));
const NotFoundLazy = ROUTES.HOME.component(() => import("./components/views/NotFoundView"));

export const getHomeRoutes = (): RouteConfig[] => [
  // Using the new helper
  ROUTES.HOME.define(<HomeIndexLazy />, { index: true }),
  
  // Custom catch-all
  { 
    path: "*", 
    element: <NotFoundLazy />
  },
];
