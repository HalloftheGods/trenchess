import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { analytics } from "@/shared/utils/analytics";

export const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    analytics.init();
  }, []);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    analytics.trackPageView(currentPath);
  }, [location]);

  return null;
};
