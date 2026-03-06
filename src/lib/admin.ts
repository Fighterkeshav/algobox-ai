const PRIMARY_ADMIN_EMAIL = "fighterkeshav7@gmail.com";
const ADMIN_STORAGE_KEY = "algobox_admin_emails_v2"; // Changed key to invalidate old insecure lists
const ADMIN_SECRET_SALT = "algobox_secure_v1"; // Simple salt to prevent trivial JSON injection

const normalize = (email: string) => email.trim().toLowerCase();

export const getPrimaryAdminEmail = () => PRIMARY_ADMIN_EMAIL;

/**
 * Generates a simple verification hash for an email to prevent easy localStorage spoofing.
 * Note: Still client-side, but raises the bar significantly over plain strings.
 */
const generateHmac = (email: string) => {
  const str = `${normalize(email)}:${ADMIN_SECRET_SALT}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
};

export const getAdminEmails = (): string[] => {
  if (typeof window === "undefined") {
    return [PRIMARY_ADMIN_EMAIL];
  }

  const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
  if (!raw) {
    return [PRIMARY_ADMIN_EMAIL];
  }

  try {
    const parsed = JSON.parse(raw) as { email: string; v: string }[];
    if (!Array.isArray(parsed)) {
      return [PRIMARY_ADMIN_EMAIL];
    }

    const validAdmins = parsed
      .filter(item => {
        if (typeof item !== "object" || !item.email || !item.v) return false;
        return item.v === generateHmac(item.email);
      })
      .map(item => normalize(item.email));

    return Array.from(new Set([PRIMARY_ADMIN_EMAIL, ...validAdmins]));
  } catch {
    return [PRIMARY_ADMIN_EMAIL];
  }
};

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = normalize(email);
  if (normalized === PRIMARY_ADMIN_EMAIL) return true;

  return getAdminEmails().includes(normalized);
};

export const saveAdminEmails = (emails: string[]) => {
  if (typeof window === "undefined") return;

  const uniqueEmails = Array.from(new Set(emails.map(normalize).filter(e => e !== PRIMARY_ADMIN_EMAIL)));
  const secureList = uniqueEmails.map(email => ({
    email,
    v: generateHmac(email)
  }));

  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(secureList));
};

export const isPrimaryAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return normalize(email) === PRIMARY_ADMIN_EMAIL;
};

