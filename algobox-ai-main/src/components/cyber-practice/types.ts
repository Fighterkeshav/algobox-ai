export interface TestResult {
    name: string;
    passed: boolean;
    message?: string;
}

export interface SecurityChallenge {
    id: string;
    title: string;
    description: string;
    type?: "fix" | "exploit" | "analyze";
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    vulnerableCode: string;
    instructions: string;
    language: "javascript" | "python";
    hints: string[];
    // A function that takes the user's code and returns test results
    // In a real app, this would run in a sandbox. For now, we'll use regex/string checks on the client.
    verify: (code: string) => TestResult[];
}
