import { createRoot } from "react-dom/client";
import { initSentry, initBetterStack } from "@/lib/sentry";
import { initAnalytics } from "@/lib/analytics";
import App from "./App.tsx";
import "./index.css";

// Initialize Observability
initSentry();       // Sentry.io
initBetterStack();  // Better Stack
initAnalytics();    // PostHog

createRoot(document.getElementById("root")!).render(<App />);
