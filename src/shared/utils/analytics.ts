import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-XGG1SJZ6HX";
const isProduction = import.meta.env.PROD;

export const analytics = {
  init: () => {
    if (isProduction) {
      ReactGA.initialize(GA_MEASUREMENT_ID);
    }
  },

  trackPageView: (path: string) => {
    if (isProduction) {
      ReactGA.send({ hitType: "pageview", page: path });
    }
  },

  trackEvent: (category: string, action: string, label?: string) => {
    if (isProduction) {
      ReactGA.event({
        category,
        action,
        label,
      });
    }
  },
};
