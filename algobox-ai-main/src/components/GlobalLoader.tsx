// GlobalLoader intentionally disabled.
// Route transitions are handled by the PageTransition GSAP animation.
// A full-screen overlay on every route change blocks LCP and makes the site feel stuck.
export function GlobalLoader() {
    return null;
}
