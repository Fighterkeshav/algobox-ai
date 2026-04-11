const PRIMARY_ADMIN_EMAIL = "fighterkeshav7@gmail.com";

export const getPrimaryAdminEmail = () => PRIMARY_ADMIN_EMAIL;

export const isPrimaryAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return email.trim().toLowerCase() === PRIMARY_ADMIN_EMAIL;
};
