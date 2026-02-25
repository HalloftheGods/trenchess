import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-XGG1SJZ6HX";
const isProduction = import.meta.env.PROD;

export const analytics = {
  init: () => {
    if (isProduction) {
      ReactGA.initialize(GA_MEASUREMENT_ID);
    } else {
      console.log("[Analytics] Initializing in development mode");
    }
  },

  trackPageView: (path: string) => {
    if (isProduction) {
      ReactGA.send({ hitType: "pageview", page: path });
    } else {
      console.log(`[Analytics] Page View: ${path}`);
    }
  },

  trackEvent: (category: string, action: string, label?: string) => {
    if (isProduction) {
      ReactGA.event({
        category,
        action,
        label,
      });
    } else {
      console.log(`[Analytics] Event: ${category} - ${action}${label ? ` (${label})` : ""}`);
    }
  },
};
