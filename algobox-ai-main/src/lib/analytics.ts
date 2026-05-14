import posthog from 'posthog-js';

// Initialize PostHog
export const initAnalytics = () => {
    if (typeof window !== 'undefined') {
        const shouldInit = import.meta.env.PROD || import.meta.env.VITE_ENABLE_ANALYTICS_DEV === 'true';

        if (shouldInit) {
            posthog.init(import.meta.env.VITE_POSTHOG_KEY || 'phc_placeholder', {
                api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
                capture_pageview: false, // We will handle this manually for SPA
                persistence: 'localStorage',
            });
        } else {
            console.log("PostHog analytics skipped in development (set VITE_ENABLE_ANALYTICS_DEV=true to enable).");
        }
    }
};

// Custom hook-like structure related to analytics helper
export const analytics = {
    identify: (userId: string, traits?: Record<string, any>) => {
        posthog.identify(userId, traits);
    },
    reset: () => {
        posthog.reset();
    },
    track: (eventName: string, properties?: Record<string, any>) => {
        posthog.capture(eventName, properties);
    },
    page: (path?: string) => {
        posthog.capture('$pageview', { path });
    }
};
