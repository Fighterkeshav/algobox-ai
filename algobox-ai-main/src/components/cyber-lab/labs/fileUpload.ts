import { LabScenario, CyberState, CyberNode, NodeStatus } from "../types";

const baseTopology = {
    nodes: [
        { id: "client", type: "client" as const, label: "User", x: 15, y: 55 },
        { id: "server", type: "server" as const, label: "Web App (Profile Upload)", x: 55, y: 55 },
        { id: "storage", type: "database" as const, label: "Uploads Directory", x: 85, y: 55 },
    ],
    links: [
        { source: "client", target: "server" },
        { source: "server", target: "storage" },
        { source: "storage", target: "server", dashed: true, label: "Served Back" }
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

export const fileUploadLab: LabScenario = {
    id: "file-upload",
    title: "File Upload: Web Shell via Profile Picture",
    description: "Learn how weak file upload validation enables attackers to upload a web shell and execute server-side code.",
    difficulty: "Advanced",
    topology: baseTopology,
    steps: [
        {
            id: 1,
            phase: "Feature",
            description: "User uploads a new profile picture using a multipart/form-data form.",
            state: getLabState(
                [
                    { id: "client", status: "active", data: "POST /upload (avatar.png)" },
                    { id: "server", status: "active" }
                ],
                [{ id: "p1", source: "client", target: "server", type: "data", content: "avatar.png", progress: 0.5 }]
            ),
            explanation: {
                title: "Common Functionality",
                content: "Upload endpoints are everywhere—and they're risky if the server trusts the filename, content-type, or extension.",
                type: "info"
            }
        },
        {
            id: 2,
            phase: "Malicious Upload",
            description: "Attacker uploads `shell.php` disguised as an image.",
            state: getLabState(
                [
                    { id: "client", status: "compromised", label: "Attacker", data: "POST /upload (shell.php)" }
                ],
                [{ id: "p2", source: "client", target: "server", type: "exploit", content: "shell.php", progress: 0.5 }]
            ),
            explanation: {
                title: "Polyglots & Spoofing",
                content: "Attackers can spoof `Content-Type: image/png` or rename a script to bypass naive extension checks.",
                type: "warning"
            }
        },
        {
            id: 3,
            phase: "Unsafe Storage",
            description: "Server saves the file into a web-accessible `/uploads/` directory without filtering.",
            state: getLabState(
                [
                    { id: "server", status: "compromised", data: "saveTo(/var/www/uploads/shell.php)" },
                    { id: "storage", status: "compromised", data: "shell.php stored" }
                ],
                [{ id: "p3", source: "server", target: "storage", type: "exploit", content: "Write: shell.php", progress: 0.5 }]
            ),
            explanation: {
                title: "Web-Accessible Writes",
                content: "If uploads are placed under the web root and executable by the server, it's often game over.",
                type: "error"
            }
        },
        {
            id: 4,
            phase: "Trigger Execution",
            description: "Attacker visits `/uploads/shell.php` to execute the uploaded code.",
            state: getLabState(
                [
                    { id: "client", status: "compromised", label: "Attacker", data: "GET /uploads/shell.php?cmd=id" },
                    { id: "server", status: "compromised" }
                ],
                [{ id: "p4", source: "client", target: "server", type: "exploit", content: "/uploads/shell.php", progress: 0.5 }]
            ),
            explanation: {
                title: "Web Shell",
                content: "A web shell is a tiny script that executes OS commands via HTTP parameters.",
                type: "error"
            }
        },
        {
            id: 5,
            phase: "RCE Achieved",
            description: "The server executes the command and returns output to the attacker.",
            state: getLabState(
                [
                    { id: "server", status: "compromised", data: "exec(cmd) => uid=33(www-data)" },
                    { id: "client", status: "compromised", label: "Attacker (RCE)" }
                ],
                [{ id: "p5", source: "server", target: "client", type: "response", content: "uid=33(www-data)", progress: 0.5 }]
            ),
            explanation: {
                title: "Remote Code Execution",
                content: "This is full server-side compromise. Attackers can pivot to secrets, databases, and internal services.",
                type: "error"
            }
        }
    ],
    fixSteps: [
        {
            id: 1,
            phase: "Restrict & Verify",
            description: "Server verifies the file is a real image (magic bytes), enforces size limits, and renames it.",
            state: getLabState([
                {
                    id: "server",
                    status: "secure",
                    hasShield: true,
                    data: "verifyMagicBytes(); renameTo(UUID).png"
                }
            ]),
            explanation: {
                title: "Strong Validation",
                content: "Validate by content (not name), strip metadata, and generate a safe server-side filename.",
                type: "success"
            }
        },
        {
            id: 2,
            phase: "Non-Executable Storage",
            description: "Uploads are stored outside the web root, and served via a safe handler (no direct execution).",
            state: getLabState(
                [
                    { id: "storage", status: "secure", hasShield: true, data: "/srv/uploads (not web)" },
                    { id: "server", status: "secure", hasShield: true, data: "GET /media/:id (stream bytes)" }
                ],
                [{ id: "p6", source: "client", target: "server", type: "data", content: "GET /media/123", progress: 0.5 }]
            ),
            explanation: {
                title: "Execution Prevented",
                content: "Even if a script is uploaded, it can't be executed because it isn't reachable as runnable code under the web server.",
                type: "success"
            }
        }
    ]
};


