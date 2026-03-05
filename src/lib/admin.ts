const PRIMARY_ADMIN_EMAIL = "fighterkeshav7@gmail.com";
const ADMIN_STORAGE_KEY = "algobox_admin_emails";

const normalize = (email: string) => email.trim().toLowerCase();

export const getPrimaryAdminEmail = () => PRIMARY_ADMIN_EMAIL;

export const getAdminEmails = (): string[] => {
  if (typeof window === "undefined") {
    return [PRIMARY_ADMIN_EMAIL];
  }

  const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
  if (!raw) {
    return [PRIMARY_ADMIN_EMAIL];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [PRIMARY_ADMIN_EMAIL];
    }

    const sanitized = parsed
      .filter((email): email is string => typeof email === "string")
      .map(normalize)
      .filter(Boolean);

    return Array.from(new Set([PRIMARY_ADMIN_EMAIL, ...sanitized]));
  } catch {
    return [PRIMARY_ADMIN_EMAIL];
  }
};

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return getAdminEmails().includes(normalize(email));
};

export const saveAdminEmails = (emails: string[]) => {
  if (typeof window === "undefined") return;
  const unique = Array.from(new Set([PRIMARY_ADMIN_EMAIL, ...emails.map(normalize).filter(Boolean)]));
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(unique));
};

export const isPrimaryAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return normalize(email) === PRIMARY_ADMIN_EMAIL;
};
