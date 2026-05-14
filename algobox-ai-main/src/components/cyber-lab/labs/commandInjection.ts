import { LabScenario, CyberState, CyberNode, NodeStatus } from "../types";

const baseTopology = {
    nodes: [
        { id: "client", type: "client" as const, label: "User", x: 15, y: 50 },
        { id: "firewall", type: "firewall" as const, label: "WAF", x: 40, y: 50 },
        { id: "server", type: "server" as const, label: "Web App (Ping Tool)", x: 70, y: 50 },
    ],
    links: [
        { source: "client", target: "firewall" },
        { source: "firewall", target: "server" },
    ]
};

interface NodeUpdate {
    id: string;
    status?: NodeStatus;
    data?: string;
    label?: string;
    isCompromised?: boolean;
    hasShield?: boolean;
}

const getLabState = (nodeUpdates: NodeUpdate[], packetUpdates: any[] = []): CyberState => {
    const finalNodes: CyberNode[] = baseTopology.nodes.map(n => ({
        ...n,
        status: "idle" as NodeStatus,
        data: undefined
    }));

    nodeUpdates.forEach(update => {
        const index = finalNodes.findIndex(n => n.id === update.id);
        if (index !== -1) {
            finalNodes[index] = { ...finalNodes[index], ...update } as CyberNode;
        }
    });

    return { nodes: finalNodes, links: baseTopology.links, packets: packetUpdates };
};

export const commandInjectionLab: LabScenario = {
    id: "command-injection",
    title: "Command Injection: Abusing a Ping Tool",
    description: "See how chaining shell commands (e.g., `; cat /etc/passwd`) turns a simple ping feature into remote code execution.",
    difficulty: "Intermediate",
    topology: baseTopology,
    steps: [
        {
            id: 1,
            phase: "Legitimate Use",
            description: "User uses the ping diagnostic tool to check connectivity to google.com.",
            state: getLabState(
                [
                    { id: "client", status: "active", data: "host=google.com" },
                    { id: "server", status: "active" }
                ],
                [{ id: "p1", source: "client", target: "server", type: "data", content: "ping google.com", progress: 0.5 }]
            ),
            explanation: {
                title: "Normal Input",
                content: "The web app exposes a convenience feature that runs `ping` on the server using user-controlled input.",
                type: "info"
            }
        },
        {
            id: 2,
            phase: "Unsafe Construction",
            description: "The server naively concatenates the user input into a shell command string.",
            state: getLabState([
                {
                    id: "server",
                    status: "active",
                    data: 'exec("ping " + userInput)'
                }
            ]),
            explanation: {
                title: "Shell Wrapping",
                content: "Instead of calling a safe library, the code builds a full shell command string and passes it to `/bin/sh`.",
                type: "warning"
            }
        },
        {
            id: 3,
            phase: "Injection Payload",
            description: "Attacker submits a payload that chains another command with `; cat /etc/passwd`.",
            state: getLabState([
                { id: "client", status: "compromised", label: "Attacker", data: "google.com; cat /etc/passwd" }
            ]),
            explanation: {
                title: "Command Chaining",
                content: "In most shells, `;` means \"run the next command\", so anything after it is treated as a new, separate command.",
                type: "info"
            }
        },
        {
            id: 4,
            phase: "Execution on Server",
            description: "The shell interprets both commands: it pings google.com and then reads `/etc/passwd`.",
            state: getLabState(
                [
                    {
                        id: "server",
                        status: "compromised",
                        data: 'ping google.com; cat /etc/passwd'
                    }
                ],
                [{ id: "p2", source: "client", target: "server", type: "exploit", content: "ping google.com; cat /etc/passwd", progress: 0.5 }]
            ),
            explanation: {
                title: "Remote Code Execution",
                content: "Because the input is passed directly to a shell, the attacker is effectively running arbitrary OS commands.",
                type: "error"
            }
        },
        {
            id: 5,
            phase: "Data Exfiltration",
            description: "The sensitive contents of `/etc/passwd` are sent back in the HTTP response.",
            state: getLabState(
                [
                    { id: "client", status: "compromised", label: "Attacker (Has /etc/passwd)" }
                ],
                [{ id: "p3", source: "server", target: "client", type: "response", content: "/etc/passwd contents...", progress: 0.5 }]
            ),
            explanation: {
                title: "Server Internal Data Leak",
                content: "Files that should only be readable on the server are now exposed over the network to the attacker.",
                type: "error"
            }
        }
    ],
    fixSteps: [
        {
            id: 1,
            phase: "Input Validation",
            description: "The application restricts the host to a strict allowlist and disallows shell metacharacters.",
            state: getLabState([
                {
                    id: "server",
                    status: "secure",
                    hasShield: true,
                    data: "AllowedHosts = ['example.com', 'internal-api']"
                }
            ]),
            explanation: {
                title: "Validation Layer",
                content: "Server-side validation blocks dangerous characters like `;`, `&`, `|`, and only allows known-safe hosts.",
                type: "success"
            }
        },
        {
            id: 2,
            phase: "Safe Execution",
            description: "The server calls a library function (no shell) and treats user input as data, not code.",
            state: getLabState(
                [
                    {
                        id: "server",
                        status: "secure",
                        hasShield: true,
                        data: "ping(host: string)  // no shell"
                    }
                ],
                [{ id: "p4", source: "client", target: "server", type: "data", content: "host=google.com", progress: 0.5 }]
            ),
            explanation: {
                title: "No Shell Involved",
                content: "By avoiding shell execution APIs, even a payload like `google.com; cat /etc/passwd` is treated as a literal string and fails validation.",
                type: "success"
            }
        }
    ]
};


