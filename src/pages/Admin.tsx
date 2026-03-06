import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAdminEmails, getPrimaryAdminEmail, isAdminEmail, isPrimaryAdmin, saveAdminEmails } from "@/lib/admin";
import { getCustomProblems, getFeatureFlags, isValidProblemShape, saveCustomProblems, saveFeatureFlags, type AdminFeatureFlags } from "@/lib/adminContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Problem } from "@/lib/problems/problemLibrary";
import { toast } from "sonner";

type ProblemDifficulty = Problem["difficulty"];

const defaultProblemDraft = {
  title: "",
  description: "",
  difficulty: "beginner" as ProblemDifficulty,
  category: "Custom",
  expectedSolution: "",
  exampleInput: "",
  exampleOutput: "",
  exampleExplanation: "",
  constraints: "",
  hints: "",
  tags: "",
  starterJs: "function solve(input) {\n  // TODO\n}\n",
  starterPy: "def solve(input):\n    # TODO\n    pass\n",
  starterCpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n  return 0;\n}\n",
  testInput: "",
  testExpected: "",
};

export default function Admin() {
  const { user } = useAuth();
  const [adminEmails, setAdminEmails] = useState<string[]>(() => getAdminEmails());
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [problemDraft, setProblemDraft] = useState(defaultProblemDraft);
  const [customProblems, setCustomProblems] = useState<Problem[]>(() => getCustomProblems());
  const [featureFlags, setFeatureFlags] = useState<AdminFeatureFlags>(() => getFeatureFlags());

  const currentEmail = user?.email?.toLowerCase();
  const hasAdminAccess = isAdminEmail(currentEmail);

  if (!hasAdminAccess) return <Navigate to="/dashboard" replace />;

  const canGrantAdmins = isPrimaryAdmin(currentEmail);
  const primaryAdminEmail = getPrimaryAdminEmail();

  const handleAddAdmin = () => {
    if (!canGrantAdmins) return toast.error("Only the primary admin can grant admin rights.");

    const email = newAdminEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) return toast.error("Enter a valid email address.");
    if (adminEmails.includes(email)) return toast.message("This user already has admin access.");

    const updated = [...adminEmails, email];
    setAdminEmails(updated);
    saveAdminEmails(updated);
    setNewAdminEmail("");
    toast.success("Admin rights granted.");
  };

  const handleRemoveAdmin = (email: string) => {
    if (!canGrantAdmins) return;
    if (email === primaryAdminEmail) return toast.error("Primary admin cannot be removed.");

    const updated = adminEmails.filter((adminEmail) => adminEmail !== email);
    setAdminEmails(updated);
    saveAdminEmails(updated);
    toast.success("Admin rights removed.");
  };

  const handleDeleteProblem = (problemId: string) => {
    const updated = customProblems.filter((problem) => problem.id !== problemId);
    setCustomProblems(updated);
    saveCustomProblems(updated);
    toast.success("Custom problem deleted.");
  };

  const handleAddProblem = () => {
    if (!problemDraft.title.trim() || !problemDraft.description.trim()) {
      return toast.error("Problem title and description are required.");
    }

    if (!problemDraft.expectedSolution.trim()) {
      return toast.error("Please add the expected solution/approach.");
    }

    if (!problemDraft.exampleInput.trim() || !problemDraft.exampleOutput.trim()) {
      return toast.error("Example input and output are required.");
    }

    if (!problemDraft.testInput.trim() || !problemDraft.testExpected.trim()) {
      return toast.error("Test input and expected output are required.");
    }

    const constraints = problemDraft.constraints.split("\n").map((v) => v.trim()).filter(Boolean);
    const hints = problemDraft.hints.split("\n").map((v) => v.trim()).filter(Boolean);
    const tags = problemDraft.tags.split(",").map((v) => v.trim()).filter(Boolean);

    if (!constraints.length || !hints.length || !tags.length) {
      return toast.error("Constraints, hints, and tags are required.");
    }

    const newProblem: Problem = {
      id: `custom-${Date.now()}`,
      title: problemDraft.title.trim(),
      description: `${problemDraft.description.trim()}\n\nExpected solution:\n${problemDraft.expectedSolution.trim()}`,
      difficulty: problemDraft.difficulty,
      category: problemDraft.category.trim() || "Custom",
      examples: [{
        input: problemDraft.exampleInput.trim(),
        output: problemDraft.exampleOutput.trim(),
        explanation: problemDraft.exampleExplanation.trim() || undefined,
      }],
      constraints,
      hints,
      tags,
      starterCode: {
        javascript: problemDraft.starterJs.trim(),
        python: problemDraft.starterPy.trim(),
        cpp: problemDraft.starterCpp.trim(),
      },
      testCases: [{
        input: problemDraft.testInput.trim(),
        expected: problemDraft.testExpected.trim(),
      }],
    };

    if (!isValidProblemShape(newProblem)) {
      return toast.error("Problem data does not match required problem parameters.");
    }

    const updated = [newProblem, ...customProblems];
    setCustomProblems(updated);
    saveCustomProblems(updated);
    setProblemDraft(defaultProblemDraft);
    toast.success("Practice problem added with full metadata.");
  };

  const updateFlag = (key: keyof AdminFeatureFlags, value: boolean) => {
    const next = { ...featureFlags, [key]: value };
    setFeatureFlags(next);
    saveFeatureFlags(next);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Control Center</h1>
        <p className="text-muted-foreground mt-1">Manage problems, website feature controls, and admin privileges.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Access Control</CardTitle>
          <CardDescription>Only <strong>{primaryAdminEmail}</strong> can grant/revoke admin rights.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {adminEmails.map((email) => (
              <Badge key={email} variant="secondary" className="flex items-center gap-2 py-1.5">
                {email}
                {canGrantAdmins && email !== primaryAdminEmail && <button onClick={() => handleRemoveAdmin(email)} className="text-xs underline">remove</button>}
              </Badge>
            ))}
          </div>

          <div className="flex gap-3">
            <Input value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="Grant access to user@email.com" disabled={!canGrantAdmins} />
            <Button onClick={handleAddAdmin} disabled={!canGrantAdmins}>Grant Admin</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Practice Problem</CardTitle>
          <CardDescription>Add full problem parameters to match existing `Problem` schema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Problem title</Label>
              <Input value={problemDraft.title} onChange={(e) => setProblemDraft((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Balanced Parentheses" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={problemDraft.category} onChange={(e) => setProblemDraft((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. Stack" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Difficulty</Label>
            <select
              value={problemDraft.difficulty}
              onChange={(e) => setProblemDraft((p) => ({ ...p, difficulty: e.target.value as ProblemDifficulty }))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Problem statement</Label>
            <Textarea value={problemDraft.description} onChange={(e) => setProblemDraft((p) => ({ ...p, description: e.target.value }))} rows={4} />
          </div>

          <div className="space-y-2">
            <Label>Expected solution / approach</Label>
            <Textarea value={problemDraft.expectedSolution} onChange={(e) => setProblemDraft((p) => ({ ...p, expectedSolution: e.target.value }))} rows={3} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Example input</Label>
              <Input value={problemDraft.exampleInput} onChange={(e) => setProblemDraft((p) => ({ ...p, exampleInput: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Example output</Label>
              <Input value={problemDraft.exampleOutput} onChange={(e) => setProblemDraft((p) => ({ ...p, exampleOutput: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Example explanation</Label>
            <Textarea value={problemDraft.exampleExplanation} onChange={(e) => setProblemDraft((p) => ({ ...p, exampleExplanation: e.target.value }))} rows={2} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Constraints (one per line)</Label>
              <Textarea value={problemDraft.constraints} onChange={(e) => setProblemDraft((p) => ({ ...p, constraints: e.target.value }))} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Hints (one per line)</Label>
              <Textarea value={problemDraft.hints} onChange={(e) => setProblemDraft((p) => ({ ...p, hints: e.target.value }))} rows={3} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags (comma separated)</Label>
            <Input value={problemDraft.tags} onChange={(e) => setProblemDraft((p) => ({ ...p, tags: e.target.value }))} placeholder="Array, Hash Map" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Test input</Label>
              <Input value={problemDraft.testInput} onChange={(e) => setProblemDraft((p) => ({ ...p, testInput: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Expected test output</Label>
              <Input value={problemDraft.testExpected} onChange={(e) => setProblemDraft((p) => ({ ...p, testExpected: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Starter code (JavaScript)</Label>
            <Textarea value={problemDraft.starterJs} onChange={(e) => setProblemDraft((p) => ({ ...p, starterJs: e.target.value }))} rows={4} className="font-mono text-xs" />
          </div>
          <div className="space-y-2">
            <Label>Starter code (Python)</Label>
            <Textarea value={problemDraft.starterPy} onChange={(e) => setProblemDraft((p) => ({ ...p, starterPy: e.target.value }))} rows={4} className="font-mono text-xs" />
          </div>
          <div className="space-y-2">
            <Label>Starter code (C++)</Label>
            <Textarea value={problemDraft.starterCpp} onChange={(e) => setProblemDraft((p) => ({ ...p, starterCpp: e.target.value }))} rows={4} className="font-mono text-xs" />
          </div>

          <Button onClick={handleAddProblem}>Add Problem</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Custom Problems</CardTitle>
          <CardDescription>Delete admin-created problems from the custom problem list.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {customProblems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No custom problems added yet.</p>
          ) : (
            customProblems.map((problem) => (
              <div key={problem.id} className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <p className="font-medium">{problem.title}</p>
                  <p className="text-xs text-muted-foreground">{problem.category} • {problem.difficulty}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteProblem(problem.id)}>
                  Delete
                </Button>
              </div>
            ))
          )}
          <p className="text-sm text-muted-foreground">Custom problems managed: {customProblems.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Website Controls</CardTitle>
          <CardDescription>Enable or disable website improvements and admin features.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="improveWeb">Improve web experience mode</Label>
            <Switch id="improveWeb" checked={featureFlags.improveWebExperience} onCheckedChange={(v) => updateFlag("improveWebExperience", v)} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="practiceBeta">Practice beta features</Label>
            <Switch id="practiceBeta" checked={featureFlags.practiceBetaEnabled} onCheckedChange={(v) => updateFlag("practiceBetaEnabled", v)} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="maintenance">Maintenance mode</Label>
            <Switch id="maintenance" checked={featureFlags.maintenanceMode} onCheckedChange={(v) => updateFlag("maintenanceMode", v)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
