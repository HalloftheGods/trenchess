import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "@/shared/components/organisms/ErrorBoundary.tsx";
import { MultiplayerProvider } from "@/shared/hooks/engine/useMultiplayer";
import { StrictMode } from "react";
import App from "./App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
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
