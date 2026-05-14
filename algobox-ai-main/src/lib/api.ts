// API configuration for different environments
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Helper to construct full API URLs
export function apiUrl(path: string): string {
    // In production, use the full backend URL
    // In development, uses Vite proxy (empty string defaults to same origin)
    return `${API_BASE_URL}${path}`;
}
