const LOGIN_RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const MAX_FAILED_LOGINS = 5;

interface LoginRateLimitState {
  failedAttempts: number;
  blockedUntil?: number;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const isValidEmail = (email: string) => emailRegex.test(normalizeEmail(email));

export const sanitizeUsername = (username?: string) => {
  if (!username) {
    return undefined;
  }

  const sanitized = username.trim().replace(/\s+/g, " ");
  if (!sanitized) {
    return undefined;
  }

  return sanitized.slice(0, 30);
};

export const validatePasswordStrength = (password: string) => {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };

  return {
    valid: Object.values(checks).every(Boolean),
    checks,
  };
};

const loginRateLimitKey = (email: string) => `login_rate_limit_${normalizeEmail(email)}`;

const getRateLimitState = (email: string): LoginRateLimitState => {
  const key = loginRateLimitKey(email);
  const raw = localStorage.getItem(key);
  if (!raw) {
    return { failedAttempts: 0 };
  }

  try {
    return JSON.parse(raw) as LoginRateLimitState;
  } catch {
    return { failedAttempts: 0 };
  }
};

const setRateLimitState = (email: string, state: LoginRateLimitState) => {
  localStorage.setItem(loginRateLimitKey(email), JSON.stringify(state));
};

export const getLoginBlockRemainingMs = (email: string) => {
  if (!email) {
    return 0;
  }

  const state = getRateLimitState(email);
  if (!state.blockedUntil) {
    return 0;
  }

  return Math.max(0, state.blockedUntil - Date.now());
};

export const recordFailedLoginAttempt = (email: string) => {
  const state = getRateLimitState(email);
  const failedAttempts = state.failedAttempts + 1;
  const nextState: LoginRateLimitState = { failedAttempts };

  if (failedAttempts >= MAX_FAILED_LOGINS) {
    nextState.blockedUntil = Date.now() + LOGIN_RATE_LIMIT_WINDOW_MS;
  }

  setRateLimitState(email, nextState);
  return nextState;
};

export const resetLoginRateLimit = (email: string) => {
  if (!email) {
    return;
  }
  localStorage.removeItem(loginRateLimitKey(email));
};

export const mapAuthErrorMessage = (message?: string) => {
  if (!message) {
    return "Authentication failed. Please try again.";
  }

  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please verify your email before signing in.";
  }

  if (normalized.includes("already registered")) {
    return "An account with this email already exists.";
  }

  return "Authentication request failed. Please try again.";
};

export const formatBlockTime = (remainingMs: number) => {
  const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
  return `${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}`;
};
