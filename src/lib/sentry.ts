import * as Sentry from "@sentry/react";

// Initialize Sentry.io
export const initSentry = () => {
    // Only initialize in production or if explicitly enabled to avoid ad-blocker noise in dev
    if (import.meta.env.VITE_SENTRY_DSN && (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY_DEV === 'true')) {
        Sentry.init({
            dsn: import.meta.env.VITE_SENTRY_DSN,
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration({
                    maskAllText: false,
                    blockAllMedia: false,
                }),
            ],
            tracesSampleRate: 1.0,
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
            environment: import.meta.env.MODE,
        });
        console.log("Sentry.io initialized.");
    } else {
        if (import.meta.env.DEV) {
            console.log("Sentry.io skipped in development (set VITE_ENABLE_SENTRY_DEV=true to enable).");
        } else {
            console.warn("Sentry DSN not found, skipping Sentry.io initialization.");
        }
    }
};

export const captureError = (error: any, context?: Record<string, any>) => {
    console.error("Capturing error:", error);
    Sentry.captureException(error, { extra: context });
};

export const captureMessage = (message: string) => {
    console.log("Capturing message:", message);
    Sentry.captureMessage(message);
};
