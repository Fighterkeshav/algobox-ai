import * as Sentry from "@sentry/react";

// Initialize Sentry.io
export const initSentry = () => {
    if (import.meta.env.VITE_SENTRY_DSN) {
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
        console.warn("Sentry DSN not found, skipping Sentry.io initialization.");
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
