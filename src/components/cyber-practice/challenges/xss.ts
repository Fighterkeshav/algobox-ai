import { SecurityChallenge, TestResult } from "../types";

const vulnerableCode = `
import express from 'express';
const app = express();

app.get('/search', (req, res) => {
    const query = req.query.q;
    // TODO: Fix the vulnerability below
    const html = "<h1>Search Results for: " + query + "</h1>";
    res.send(html);
});
`;

export const xssChallenge: SecurityChallenge = {
    id: "fix-xss",
    title: "Prevent Reflected XSS",
    description: "The search endpoint directly reflects user input into the HTML response, allowing attackers to inject scripts.",
    difficulty: "Beginner",
    vulnerableCode,
    language: "javascript",
    instructions: `
1. The code currently concatenates \`req.query.q\` directly into the HTML string.
2. An attacker could send \`?q=<script>alert(1)</script>\` to execute code.
3. Your Task: Sanitize the input using an escaping function (mocked as \`escapeHTML()\`) or similar logic to prevent script execution.
    `,
    hints: [
        "Never trust user input.",
        "HTML special characters like < and > must be converted to entities.",
        "Use the hypothetical escapeHTML() function."
    ],
    verify: (code: string): TestResult[] => {
        const tests: TestResult[] = [];

        // Check 1: Is the input still being concatenated directly?
        const directConcat = /html\s*=\s*['"`].*['"`]\s*\+\s*query/.test(code) || /html\s*=\s*`.*\{query\}.*`/.test(code);
        tests.push({
            name: "Direct Concatenation Removed",
            passed: !directConcat,
            message: directConcat ? "Vulnerable string concatenation detected." : "Direct concatenation removed."
        });

        // Check 2: Is an escaping function used?
        const usesEscape = /escapeHTML\(\s*query\s*\)/.test(code) || /sanitize\(\s*query\s*\)/.test(code);
        tests.push({
            name: "Output Escaping Implemented",
            passed: usesEscape,
            message: usesEscape ? "Escaping function validation found." : "Look for a function like escapeHTML(query)."
        });

        return tests;
    }
};
