import { Problem } from "@/lib/problems/problemLibrary";
import { supabase } from "@/integrations/supabase/client";

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

export const getCustomProblems = async (): Promise<Problem[]> => {
  const { data, error } = await (supabase as any)
    .from('custom_problems')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  
  // Map snake_case to camelCase
  return data.map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    category: row.category,
    tags: row.tags || [],
    starterCode: row.starter_code || {},
    solutionStructure: row.solution_structure || '',
    testCases: row.test_cases || [],
    hints: row.hints || [],
    constraints: row.constraints || ''
  })) as Problem[];
};

export const saveCustomProblem = async (problem: Omit<Problem, "id"> & { id?: string }) => {
  const payload: any = {
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    category: problem.category,
    tags: problem.tags,
    starter_code: problem.starterCode,
    solution_structure: problem.solutionStructure,
    test_cases: problem.testCases,
    hints: problem.hints,
    constraints: problem.constraints
  };

  // If a valid UUID exists, use it for updating
  if (problem.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(problem.id)) {
    payload.id = problem.id;
  }

  const { data, error } = await (supabase as any)
    .from('custom_problems')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCustomProblem = async (id: string) => {
  const { error } = await (supabase as any).from('custom_problems').delete().eq('id', id);
  if (error) throw error;
};

export const getFeatureFlags = async (): Promise<AdminFeatureFlags> => {
  const { data, error } = await (supabase as any).from('feature_flags').select('*');
  if (error || !data) return DEFAULT_ADMIN_FEATURE_FLAGS;

  const flags = { ...DEFAULT_ADMIN_FEATURE_FLAGS };
  data.forEach((row: any) => {
    if (row.id in flags) {
      (flags as any)[row.id] = row.value;
    }
  });
  return flags;
};

export const saveFeatureFlags = async (flags: AdminFeatureFlags) => {
  const updates = Object.entries(flags).map(([id, value]) => ({ id, value }));
  const { error } = await (supabase as any).from('feature_flags').upsert(updates);
  if (error) throw error;
};
