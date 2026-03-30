import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getPrimaryAdminEmail } from "@/lib/admin";
import { supabase } from "@/integrations/supabase/client";
import {
  getCustomProblems,
  getFeatureFlags,
  saveCustomProblem,
  deleteCustomProblem,
  saveFeatureFlags,
  type AdminFeatureFlags,
  DEFAULT_ADMIN_FEATURE_FLAGS,
} from "@/lib/adminContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Problem } from "@/lib/problems/problemLibrary";
import { toast } from "sonner";
import {
  Shield,
  Users,
  BookOpen,
  Sliders,
  Plus,
  Trash2,
  Crown,
  FlaskConical,
  Wrench,
  Layers,
  Sparkles,
  ChevronRight,
  ToggleRight,
} from "lucide-react";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
type Tab = "access" | "problems" | "features";

// ──────────────────────────────────────────────
// Stat mini-card
// ──────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "primary" | "accent" | "warning" | "success";
}) {
  const colors: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  return (
    <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md p-4 flex items-center gap-4 hover:border-primary/40 hover:bg-card/60 transition-all duration-500 group shadow-lg shadow-black/20">
      <div className={`rounded-xl p-2.5 border transition-all duration-500 group-hover:scale-110 ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-xl font-bold tracking-tight">{value}</p>
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Tab button
// ──────────────────────────────────────────────
function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${active
        ? "bg-primary/20 text-primary border border-primary/40 shadow-lg shadow-primary/10 scale-105"
        : "text-muted-foreground border border-white/5 hover:text-foreground hover:bg-white/5 hover:border-white/10"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ──────────────────────────────────────────────
// Feature flag row
// ──────────────────────────────────────────────
function FeatureRow({
  id,
  icon,
  title,
  description,
  checked,
  onToggle,
  danger,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onToggle: (v: boolean) => void;
  danger?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${checked
        ? danger
          ? "bg-red-500/5 border-red-500/20"
          : "bg-primary/5 border-primary/20"
        : "bg-background/30 border-white/5 hover:border-white/10"
        }`}
    >
      <div
        className={`rounded-lg p-2 ${checked
          ? danger
            ? "bg-red-500/10 text-red-400"
            : "bg-primary/10 text-primary"
          : "bg-white/5 text-muted-foreground"
          }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onToggle} />
    </div>
  );
}

// ──────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────
export default function Admin() {
  const { user, isAdmin, isPrimaryAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("access");
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newProblemTitle, setNewProblemTitle] = useState("");
  const [newProblemDescription, setNewProblemDescription] = useState("");
  const [newProblemDifficulty, setNewProblemDifficulty] = useState<Problem["difficulty"]>("beginner");
  const [newProblemCategory, setNewProblemCategory] = useState("");
  const [newProblemConstraints, setNewProblemConstraints] = useState("");
  const [newProblemHints, setNewProblemHints] = useState("");
  const [newProblemTags, setNewProblemTags] = useState("");
  const [newProblemSolutionStructure, setNewProblemSolutionStructure] = useState("");
  const [newProblemStarterJS, setNewProblemStarterJS] = useState("function solution() {\n  // Write your code here\n}");
  const [newProblemStarterPython, setNewProblemStarterPython] = useState("def solution():\n    # Write your code here\n    pass");
  const [newProblemStarterCPP, setNewProblemStarterCPP] = useState("#include <iostream>\n\nint main() {\n    // Write your code here\n    return 0;\n}");
  const [newProblemTestInput, setNewProblemTestInput] = useState("");
  const [newProblemTestExpected, setNewProblemTestExpected] = useState("");
  const [editingProblemId, setEditingProblemId] = useState<string | null>(null);

  const [customProblems, setCustomProblems] = useState<Problem[]>([]);
  const [featureFlags, setFeatureFlags] = useState<AdminFeatureFlags>(DEFAULT_ADMIN_FEATURE_FLAGS);
  const [isLoading, setIsLoading] = useState(true);

  const currentEmail = user?.email?.toLowerCase();
  const primaryAdminEmail = getPrimaryAdminEmail();

  useEffect(() => {
    if (!isAdmin) return;
    
    const loadData = async () => {
      try {
        const [emailsRes, problems, flags] = await Promise.all([
          (supabase as any).from('admin_users').select('email'),
          getCustomProblems(),
          getFeatureFlags()
        ]);
        
        const emails = emailsRes.data ? emailsRes.data.map((d: any) => d.email) : [];
        setAdminEmails(Array.from(new Set([primaryAdminEmail, ...emails])));
        setCustomProblems(problems);
        setFeatureFlags(flags);
      } catch (err) {
        console.error("Error loading admin data:", err);
        toast.error("Failed to load admin data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAdmin, primaryAdminEmail]);

  if (user === undefined) return null; // Wait for auth init
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const canGrantAdmins = isPrimaryAdmin;

  // ── Handlers ──────────────────────────────
  const handleAddAdmin = async () => {
    if (!canGrantAdmins) {
      toast.error("Only the primary admin can grant admin rights.");
      return;
    }
    const email = newAdminEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (adminEmails.includes(email)) {
      toast.message("This user already has admin access.");
      return;
    }
    
    try {
      const { error } = await (supabase as any).from('admin_users').insert({ email });
      if (error) throw error;
      
      setAdminEmails([...adminEmails, email]);
      setNewAdminEmail("");
      toast.success("Admin rights granted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to grant admin rights.");
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (!canGrantAdmins) return;
    if (email === primaryAdminEmail) {
      toast.error("Primary admin cannot be removed.");
      return;
    }
    
    try {
      const { error } = await (supabase as any).from('admin_users').delete().eq('email', email);
      if (error) throw error;
      
      setAdminEmails(adminEmails.filter((e) => e !== email));
      toast.success("Admin rights removed.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove admin rights.");
    }
  };

  const handleEditProblem = (problem: Problem) => {
    setEditingProblemId(problem.id);
    setNewProblemTitle(problem.title);
    setNewProblemDescription(problem.description);
    setNewProblemCategory(problem.category);
    setNewProblemDifficulty(problem.difficulty);
    setNewProblemConstraints(problem.constraints?.join("\n") || "");
    setNewProblemHints(problem.hints?.join("\n") || "");
    setNewProblemTags(problem.tags?.join(", ") || "");
    setNewProblemSolutionStructure(problem.solutionStructure || "");
    setNewProblemStarterJS(problem.starterCode?.javascript || "");
    setNewProblemStarterPython(problem.starterCode?.python || "");
    setNewProblemStarterCPP(problem.starterCode?.cpp || "");
    setNewProblemTestInput(problem.testCases?.[0]?.input || "");
    setNewProblemTestExpected(problem.testCases?.[0]?.expected || "");

    // Scroll to form
    const formElement = document.getElementById("add-problem-form");
    formElement?.scrollIntoView({ behavior: "smooth" });
    toast.message(`Editing: ${problem.title}`);
  };

  const handleDeleteProblem = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteCustomProblem(id);
        setCustomProblems(customProblems.filter((p) => p.id !== id));
        toast.success("Problem deleted.");
        if (editingProblemId === id) handleCancelEdit();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete problem.");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProblemId(null);
    setNewProblemTitle("");
    setNewProblemDescription("");
    setNewProblemCategory("");
    setNewProblemDifficulty("beginner");
    setNewProblemConstraints("");
    setNewProblemHints("");
    setNewProblemTags("");
    setNewProblemSolutionStructure("");
    setNewProblemStarterJS("function solution() {\n  // Write your code here\n}");
    setNewProblemStarterPython("def solution():\n    # Write your code here\n    pass");
    setNewProblemStarterCPP("#include <iostream>\n\nint main() {\n    // Write your code here\n    return 0;\n}");
    setNewProblemTestInput("");
    setNewProblemTestExpected("");
  };

  const handleAddProblem = async () => {
    if (!newProblemTitle.trim() || !newProblemDescription.trim()) {
      toast.error("Add both title and description.");
      return;
    }

    const newProblem: Omit<Problem, "id"> & { id?: string } = {
      ...(editingProblemId ? { id: editingProblemId } : {}),
      title: newProblemTitle.trim(),
      description: newProblemDescription.trim(),
      solutionStructure: newProblemSolutionStructure.trim() || undefined,
      difficulty: newProblemDifficulty,
      category: newProblemCategory.trim() || "Custom",
      examples: [
        {
          input: newProblemTestInput.split("\n")[0] || "",
          output: newProblemTestExpected.split("\n")[0] || "",
        },
      ],
      constraints: newProblemConstraints
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      hints: newProblemHints
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: newProblemTags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      starterCode: {
        javascript: newProblemStarterJS.trim() || "function solution() {\n  // Write your code here\n}",
        python: newProblemStarterPython.trim() || "def solution():\n    # Write your code here\n    pass",
        cpp: newProblemStarterCPP.trim() || "#include <iostream>\n\nint main() {\n    // Write your code here\n    return 0;\n}",
      },
      testCases: [
        {
          input: newProblemTestInput.trim(),
          expected: newProblemTestExpected.trim(),
        },
      ],
    };

    try {
      const saved = await saveCustomProblem(newProblem);
      
      // Update local state without fetching again
      const mappedSaved: Problem = {
        ...newProblem,
        id: saved.id
      } as Problem;

      if (editingProblemId) {
        setCustomProblems(customProblems.map((p) => p.id === editingProblemId ? mappedSaved : p));
        toast.success("Problem updated.");
      } else {
        setCustomProblems([mappedSaved, ...customProblems]);
        toast.success("Practice problem added.");
      }

      handleCancelEdit();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save problem to database");
    }
  };


  const updateFlag = async (key: keyof AdminFeatureFlags, value: boolean) => {
    const next = { ...featureFlags, [key]: value };
    try {
      await saveFeatureFlags(next);
      setFeatureFlags(next);
      toast.success("Flag updated.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update feature flag.");
    }
  };

  const activeFlags = Object.values(featureFlags).filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in">
      {/* ── Header ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-0 sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-2">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <Badge
              variant="secondary"
              className="text-[10px] tracking-widest uppercase font-semibold bg-primary/10 text-primary border-primary/20"
            >
              Restricted Access
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Admin Control Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage problems, feature controls, and admin privileges.
          </p>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
          <Crown className="h-3.5 w-3.5 text-amber-400" />
          <span className="truncate max-w-[200px]">{currentEmail}</span>
        </div>
      </div>

      {/* ── Stats row ────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Admin Users"
          value={adminEmails.length}
          color="primary"
        />
        <StatCard
          icon={<BookOpen className="h-4 w-4" />}
          label="Custom Problems"
          value={customProblems.length}
          color="accent"
        />
        <StatCard
          icon={<ToggleRight className="h-4 w-4" />}
          label="Active Flags"
          value={activeFlags}
          color="warning"
        />
        <StatCard
          icon={<Layers className="h-4 w-4" />}
          label="Platform Mode"
          value={featureFlags.maintenanceMode ? "Maintenance" : "Live"}
          color={featureFlags.maintenanceMode ? "warning" : "success"}
        />
      </div>

      {/* ── Tab navigation ───────────────────── */}
      <div className="flex flex-wrap gap-2">
        <TabButton
          active={activeTab === "access"}
          onClick={() => setActiveTab("access")}
          icon={<Users className="h-3.5 w-3.5" />}
          label="Access Control"
        />
        <TabButton
          active={activeTab === "problems"}
          onClick={() => setActiveTab("problems")}
          icon={<BookOpen className="h-3.5 w-3.5" />}
          label="Problems"
        />
        <TabButton
          active={activeTab === "features"}
          onClick={() => setActiveTab("features")}
          icon={<Sliders className="h-3.5 w-3.5" />}
          label="Feature Flags"
        />
      </div>

      {/* ── ACCESS CONTROL TAB ───────────────── */}
      {activeTab === "access" && (
        <div className="rounded-2xl border border-white/5 bg-card/50 backdrop-blur-sm p-6 space-y-6 animate-up">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Admin Access Control
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Only{" "}
                <span className="text-foreground font-medium">{primaryAdminEmail}</span>{" "}
                can grant or revoke admin rights.
              </p>
            </div>
            {!canGrantAdmins && (
              <Badge variant="secondary" className="text-[10px] shrink-0">
                Read Only
              </Badge>
            )}
          </div>

          {/* Admin list */}
          <div className="space-y-2">
            {adminEmails.map((email) => {
              const isPrimary = email === primaryAdminEmail;
              return (
                <div
                  key={email}
                  className="flex items-center justify-between gap-3 rounded-xl bg-background/40 border border-white/5 px-4 py-3 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`rounded-lg p-1.5 ${isPrimary
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-primary/10 text-primary"
                        }`}
                    >
                      {isPrimary ? (
                        <Crown className="h-3.5 w-3.5" />
                      ) : (
                        <Users className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{email}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {isPrimary ? "Primary Admin" : "Admin"}
                      </p>
                    </div>
                  </div>
                  {canGrantAdmins && !isPrimary && (
                    <button
                      onClick={() => handleRemoveAdmin(email)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 shrink-0"
                      title="Remove admin"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grant admin */}
          {canGrantAdmins && (
            <div className="rounded-xl border border-dashed border-white/10 p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Grant admin access
              </p>
              <div className="flex gap-2">
                <Input
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="bg-background/50 border-white/10 focus:border-primary/40"
                  onKeyDown={(e) => e.key === "Enter" && handleAddAdmin()}
                />
                <Button onClick={handleAddAdmin} className="shrink-0 gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Grant
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── PROBLEMS TAB ─────────────────────── */}
      {activeTab === "problems" && (
        <div className="space-y-4 animate-up">
          {/* Add problem form */}
          <div id="add-problem-form" className="rounded-2xl border border-white/5 bg-card/50 backdrop-blur-sm p-6 space-y-5 scroll-mt-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {editingProblemId ? "Edit Practice Problem" : "Add Practice Problem"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {editingProblemId
                    ? "Update the details of your existing custom challenge."
                    : "Create custom challenges that appear in the practice section."}
                </p>
              </div>
              {editingProblemId && (
                <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-muted-foreground hover:text-foreground">
                  Cancel Edit
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="problemTitle"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Problem Title
                  </Label>
                  <Input
                    id="problemTitle"
                    value={newProblemTitle}
                    onChange={(e) => setNewProblemTitle(e.target.value)}
                    placeholder="e.g. Balanced Parentheses"
                    className="bg-background/50 border-white/10 focus:border-primary/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="problemCategory"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Category
                  </Label>
                  <Input
                    id="problemCategory"
                    value={newProblemCategory}
                    onChange={(e) => setNewProblemCategory(e.target.value)}
                    placeholder="e.g. Arrays, Recursion"
                    className="bg-background/50 border-white/10 focus:border-primary/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="problemDifficulty"
                  className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Difficulty
                </Label>
                <div className="flex gap-2">
                  {(["beginner", "intermediate", "advanced"] as const).map(
                    (d) => (
                      <button
                        key={d}
                        onClick={() => setNewProblemDifficulty(d)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${newProblemDifficulty === d
                          ? d === "beginner"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : d === "intermediate"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-red-500/10 text-red-400 border-red-500/30"
                          : "bg-white/5 text-muted-foreground border-transparent hover:bg-white/10"
                          }`}
                      >
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="problemDescription"
                  className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Description (Markdown supported)
                </Label>
                <textarea
                  id="problemDescription"
                  value={newProblemDescription}
                  onChange={(e) => setNewProblemDescription(e.target.value)}
                  placeholder="Describe the challenge in detail..."
                  className="w-full h-24 rounded-lg bg-background/50 border border-white/10 focus:border-primary/40 p-3 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="problemConstraints"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Constraints (one per line)
                  </Label>
                  <textarea
                    id="problemConstraints"
                    value={newProblemConstraints}
                    onChange={(e) => setNewProblemConstraints(e.target.value)}
                    placeholder="2 <= nums.length <= 10^4"
                    className="w-full h-20 rounded-lg bg-background/50 border border-white/10 focus:border-primary/40 p-3 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="problemHints"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Hints (one per line)
                  </Label>
                  <textarea
                    id="problemHints"
                    value={newProblemHints}
                    onChange={(e) => setNewProblemHints(e.target.value)}
                    placeholder="Try using a hash map..."
                    className="w-full h-20 rounded-lg bg-background/50 border border-white/10 focus:border-primary/40 p-3 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="problemTags"
                  className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Tags (comma separated)
                </Label>
                <Input
                  id="problemTags"
                  value={newProblemTags}
                  onChange={(e) => setNewProblemTags(e.target.value)}
                  placeholder="Array, Two Pointers, Hash Table"
                  className="bg-background/50 border-white/10 focus:border-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="problemSolutionStructure"
                  className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Solution Structure / Expected Logic
                </Label>
                <textarea
                  id="problemSolutionStructure"
                  value={newProblemSolutionStructure}
                  onChange={(e) => setNewProblemSolutionStructure(e.target.value)}
                  placeholder="Describe how the return value should be structured or the core logic..."
                  className="w-full h-24 rounded-lg bg-background/50 border border-white/10 focus:border-primary/40 p-3 text-sm"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Starter Code Templates
                </Label>
                <Tabs defaultValue="javascript" className="w-full">
                  <TabsList className="bg-white/5 border border-white/10 w-full justify-start h-9 rounded-lg p-1">
                    <TabsTrigger value="javascript" className="text-xs data-[state=active]:bg-primary/20">JavaScript</TabsTrigger>
                    <TabsTrigger value="python" className="text-xs data-[state=active]:bg-primary/20">Python</TabsTrigger>
                    <TabsTrigger value="cpp" className="text-xs data-[state=active]:bg-primary/20">C++</TabsTrigger>
                  </TabsList>
                  <TabsContent value="javascript" className="mt-2">
                    <textarea
                      value={newProblemStarterJS}
                      onChange={(e) => setNewProblemStarterJS(e.target.value)}
                      placeholder="function solution() { ... }"
                      className="w-full h-32 rounded-lg bg-background/50 border border-white/10 focus:border-primary/40 p-3 text-xs font-mono"
                    />
                  </TabsContent>
                  <TabsContent value="python" className="mt-2">
                    <textarea
                      value={newProblemStarterPython}
                      onChange={(e) => setNewProblemStarterPython(e.target.value)}
                      placeholder="def solution(): ..."
                      className="w-full h-32 rounded-lg bg-background/50 border border-white/10 focus:border-primary/40 p-3 text-xs font-mono"
                    />
                  </TabsContent>
                  <TabsContent value="cpp" className="mt-2">
                    <textarea
                      value={newProblemStarterCPP}
                      onChange={(e) => setNewProblemStarterCPP(e.target.value)}
                      placeholder="#include <iostream> ..."
                      className="w-full h-32 rounded-lg bg-background/50 border border-white/10 focus:border-primary/40 p-3 text-xs font-mono"
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="rounded-xl border border-white/5 bg-background/20 p-4 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Test Case #1</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="testInput"
                      className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Input
                    </Label>
                    <textarea
                      id="testInput"
                      value={newProblemTestInput}
                      onChange={(e) => setNewProblemTestInput(e.target.value)}
                      placeholder="[2, 7, 11, 15]\n9"
                      className="w-full h-16 rounded-lg bg-background/50 border border-white/10 focus:border-primary/40 p-3 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="testExpected"
                      className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Expected Output
                    </Label>
                    <textarea
                      id="testExpected"
                      value={newProblemTestExpected}
                      onChange={(e) => setNewProblemTestExpected(e.target.value)}
                      placeholder="[0, 1]"
                      className="w-full h-16 rounded-lg bg-background/50 border border-white/10 focus:border-primary/40 p-3 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddProblem}
                className="w-full gap-1.5"
                disabled={!newProblemTitle.trim() || !newProblemDescription.trim() || !newProblemTestExpected.trim()}
              >
                {editingProblemId ? <ToggleRight className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingProblemId ? "Update Problem" : "Add Problem to Library"}
              </Button>
            </div>
          </div>


          {/* Existing custom problems list */}
          {customProblems.length > 0 && (
            <div className="rounded-2xl border border-white/5 bg-card/50 backdrop-blur-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Custom Problems
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {customProblems.length} total
                </Badge>
              </div>
              <div className="space-y-2">
                {customProblems.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl bg-background/40 border border-white/5 px-4 py-3 group/row transition-all hover:bg-background/60"
                  >
                    <div className="rounded-lg p-1.5 bg-accent/10 text-accent">
                      <BookOpen className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {p.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditProblem(p)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                        title="Edit problem"
                      >
                        <Wrench className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProblem(p.id, p.title)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        title="Delete problem"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customProblems.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/5 p-10 text-center text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No custom problems yet.</p>
              <p className="text-xs mt-1 opacity-70">Add your first problem above.</p>
            </div>
          )}
        </div>
      )}

      {/* ── FEATURE FLAGS TAB ────────────────── */}
      {activeTab === "features" && (
        <div className="rounded-2xl border border-white/5 bg-card/50 backdrop-blur-sm p-6 space-y-5 animate-up">
          <div>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              Website Feature Controls
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enable or disable platform improvements and admin features.
            </p>
          </div>

          <div className="space-y-3">
            <FeatureRow
              id="improveWeb"
              icon={<Sparkles className="h-4 w-4" />}
              title="Improve Web Experience"
              description="Enables enhanced UI and performance optimizations across the platform."
              checked={featureFlags.improveWebExperience}
              onToggle={(v) => updateFlag("improveWebExperience", v)}
            />
            <FeatureRow
              id="practiceBeta"
              icon={<FlaskConical className="h-4 w-4" />}
              title="Practice Beta Features"
              description="Unlocks experimental features in the practice section for testing."
              checked={featureFlags.practiceBetaEnabled}
              onToggle={(v) => updateFlag("practiceBetaEnabled", v)}
            />
            <FeatureRow
              id="maintenance"
              icon={<Wrench className="h-4 w-4" />}
              title="Maintenance Mode"
              description="Displays a maintenance notice to users. Use only during planned downtime."
              checked={featureFlags.maintenanceMode}
              onToggle={(v) => updateFlag("maintenanceMode", v)}
              danger
            />
          </div>

          {activeFlags > 0 && (
            <div className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3">
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-semibold">{activeFlags}</span>{" "}
                {activeFlags === 1 ? "flag is" : "flags are"} currently active. Changes are
                applied instantly across the platform.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
