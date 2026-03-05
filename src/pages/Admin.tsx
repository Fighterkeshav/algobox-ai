import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAdminEmails, getPrimaryAdminEmail, isAdminEmail, isPrimaryAdmin, saveAdminEmails } from "@/lib/admin";
import { getCustomProblems, getFeatureFlags, saveCustomProblems, saveFeatureFlags, type AdminFeatureFlags } from "@/lib/adminContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Problem } from "@/lib/problems/problemLibrary";
import { toast } from "sonner";

export default function Admin() {
  const { user } = useAuth();
  const [adminEmails, setAdminEmails] = useState<string[]>(() => getAdminEmails());
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newProblemTitle, setNewProblemTitle] = useState("");
  const [newProblemDescription, setNewProblemDescription] = useState("");
  const [customProblems, setCustomProblems] = useState<Problem[]>(() => getCustomProblems());
  const [featureFlags, setFeatureFlags] = useState<AdminFeatureFlags>(() => getFeatureFlags());

  const currentEmail = user?.email?.toLowerCase();
  const hasAdminAccess = isAdminEmail(currentEmail);

  if (!hasAdminAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  const canGrantAdmins = isPrimaryAdmin(currentEmail);
  const primaryAdminEmail = getPrimaryAdminEmail();

  const totalProblemsManaged = customProblems.length;

  const handleAddAdmin = () => {
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

    const updated = [...adminEmails, email];
    setAdminEmails(updated);
    saveAdminEmails(updated);
    setNewAdminEmail("");
    toast.success("Admin rights granted.");
  };

  const handleRemoveAdmin = (email: string) => {
    if (!canGrantAdmins) return;
    if (email === primaryAdminEmail) {
      toast.error("Primary admin cannot be removed.");
      return;
    }

    const updated = adminEmails.filter((adminEmail) => adminEmail !== email);
    setAdminEmails(updated);
    saveAdminEmails(updated);
    toast.success("Admin rights removed.");
  };

  const handleAddProblem = () => {
    if (!newProblemTitle.trim() || !newProblemDescription.trim()) {
      toast.error("Add both title and description.");
      return;
    }

    const id = `custom-${Date.now()}`;
    const newProblem: Problem = {
      id,
      title: newProblemTitle.trim(),
      description: newProblemDescription.trim(),
      difficulty: "beginner",
      category: "Custom",
      examples: [{ input: "", output: "" }],
      constraints: ["Define constraints"],
      hints: ["Add hints"],
      tags: ["Custom"],
      starterCode: {
        javascript: "function solve(input) {\n  // TODO\n}\n",
        python: "def solve(input):\n    # TODO\n    pass\n",
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n  return 0;\n}\n",
      },
      testCases: [{ input: "", expected: "" }],
    };

    const updated = [newProblem, ...customProblems];
    setCustomProblems(updated);
    saveCustomProblems(updated);
    setNewProblemTitle("");
    setNewProblemDescription("");
    toast.success("Practice problem added.");
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
          <CardDescription>
            Only <strong>{primaryAdminEmail}</strong> can grant/revoke admin rights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {adminEmails.map((email) => (
              <Badge key={email} variant="secondary" className="flex items-center gap-2 py-1.5">
                {email}
                {canGrantAdmins && email !== primaryAdminEmail && (
                  <button onClick={() => handleRemoveAdmin(email)} className="text-xs underline">remove</button>
                )}
              </Badge>
            ))}
          </div>

          <div className="flex gap-3">
            <Input
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="Grant access to user@email.com"
              disabled={!canGrantAdmins}
            />
            <Button onClick={handleAddAdmin} disabled={!canGrantAdmins}>Grant Admin</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Practice Problem</CardTitle>
          <CardDescription>Create new practice challenges from admin panel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="problemTitle">Problem title</Label>
          <Input id="problemTitle" value={newProblemTitle} onChange={(e) => setNewProblemTitle(e.target.value)} placeholder="e.g. Balanced Parentheses" />
          <Label htmlFor="problemDescription">Problem description</Label>
          <Input id="problemDescription" value={newProblemDescription} onChange={(e) => setNewProblemDescription(e.target.value)} placeholder="Describe the challenge" />
          <Button onClick={handleAddProblem}>Add Problem</Button>
          <p className="text-sm text-muted-foreground">Custom problems managed: {totalProblemsManaged}</p>
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
