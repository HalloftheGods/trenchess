import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "@organisms/ErrorBoundary";
import { MultiplayerProvider } from "@hooks/engine/useMultiplayer";
import { StrictMode } from "react";
import App from "@/app/App";
import "@/styles/index.css";

createRoot(document.getElementById("trenchess-root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <MultiplayerProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MultiplayerProvider>
    </ErrorBoundary>
  </StrictMode>,
);
