import { Problem } from "@/lib/problems/problemLibrary";

const CUSTOM_PROBLEMS_KEY = "algobox_custom_problems";

export interface AdminFeatureFlags {
  improveWebExperience: boolean;
  practiceBetaEnabled: boolean;
  maintenanceMode: boolean;
}

export const DEFAULT_ADMIN_FEATURE_FLAGS: AdminFeatureFlags = {
  improveWebExperience: true,
  practiceBetaEnabled: true,
  maintenanceMode: false,
};

const FEATURE_FLAGS_KEY = "algobox_feature_flags";

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const getCustomProblems = (): Problem[] => {
  if (typeof window === "undefined") return [];
  return safeParse<Problem[]>(localStorage.getItem(CUSTOM_PROBLEMS_KEY), []);
};

export const saveCustomProblems = (problems: Problem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_PROBLEMS_KEY, JSON.stringify(problems));
};

export const getFeatureFlags = (): AdminFeatureFlags => {
  if (typeof window === "undefined") return DEFAULT_ADMIN_FEATURE_FLAGS;
  const stored = safeParse<Partial<AdminFeatureFlags>>(localStorage.getItem(FEATURE_FLAGS_KEY), {});
  return {
    ...DEFAULT_ADMIN_FEATURE_FLAGS,
    ...stored,
  };
};

export const saveFeatureFlags = (flags: AdminFeatureFlags) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(FEATURE_FLAGS_KEY, JSON.stringify(flags));
};
