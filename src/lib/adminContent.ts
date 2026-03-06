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

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const isValidProblemDifficulty = (value: unknown): value is Problem["difficulty"] =>
  value === "beginner" || value === "intermediate" || value === "advanced";

export const isValidProblemShape = (problem: unknown): problem is Problem => {
  if (!problem || typeof problem !== "object") return false;
  const p = problem as Problem;

  return (
    isNonEmptyString(p.id) &&
    isNonEmptyString(p.title) &&
    isValidProblemDifficulty(p.difficulty) &&
    isNonEmptyString(p.category) &&
    isNonEmptyString(p.description) &&
    Array.isArray(p.examples) &&
    p.examples.length > 0 &&
    p.examples.every((example) => isNonEmptyString(example?.input) && isNonEmptyString(example?.output)) &&
    Array.isArray(p.constraints) &&
    p.constraints.length > 0 &&
    p.constraints.every(isNonEmptyString) &&
    Array.isArray(p.hints) &&
    p.hints.length > 0 &&
    p.hints.every(isNonEmptyString) &&
    Array.isArray(p.tags) &&
    p.tags.length > 0 &&
    p.tags.every(isNonEmptyString) &&
    !!p.starterCode &&
    isNonEmptyString(p.starterCode.javascript) &&
    isNonEmptyString(p.starterCode.python) &&
    isNonEmptyString(p.starterCode.cpp) &&
    Array.isArray(p.testCases) &&
    p.testCases.length > 0 &&
    p.testCases.every((test) => isNonEmptyString(test?.input) && isNonEmptyString(test?.expected))
  );
};

export const getCustomProblems = (): Problem[] => {
  if (typeof window === "undefined") return [];

  const parsed = safeParse<unknown[]>(localStorage.getItem(CUSTOM_PROBLEMS_KEY), []);
  if (!Array.isArray(parsed)) return [];

  const validProblems = parsed.filter(isValidProblemShape);
  return validProblems;
};

export const saveCustomProblems = (problems: Problem[]) => {
  if (typeof window === "undefined") return;

  const validProblems = problems.filter(isValidProblemShape);
  localStorage.setItem(CUSTOM_PROBLEMS_KEY, JSON.stringify(validProblems));
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
