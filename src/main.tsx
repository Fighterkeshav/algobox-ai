import { createRoot } from "react-dom/client";
import { initSentry } from "@/lib/sentry";
import { initAnalytics } from "@/lib/analytics";
import App from "./App.tsx";
import "./index.css";

// Initialize Observability
initSentry();       // Sentry.io
initAnalytics();    // PostHog

createRoot(document.getElementById("root")!).render(<App />);
