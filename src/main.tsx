import { createRoot } from "react-dom/client";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import { initSentry } from "@/lib/sentry";
import { initAnalytics } from "@/lib/analytics";
import App from "./App.tsx";
import "./index.css";

// Initialize Observability
initSentry();       // Sentry.io
initAnalytics();    // PostHog

createRoot(document.getElementById("root")!).render(<App />);
