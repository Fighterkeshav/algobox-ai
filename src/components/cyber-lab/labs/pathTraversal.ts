import { LabScenario, CyberState, CyberNode, NodeStatus } from "../types";

const baseTopology = {
    nodes: [
        { id: "client", type: "client" as const, label: "User", x: 20, y: 50 },
        { id: "server", type: "server" as const, label: "Image Server", x: 55, y: 50 },
        { id: "fs", type: "database" as const, label: "File System", x: 85, y: 50 },
    ],
    links: [
        { source: "client", target: "server" },
        { source: "server", target: "fs" },
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

export const pathTraversalLab: LabScenario = {
    id: "path-traversal",
    title: "Path Traversal: From Images to Config Files",
    description: "Explore how `../` sequences in a file parameter allow attackers to read sensitive files like config and password stores.",
    difficulty: "Beginner",
    topology: baseTopology,
    steps: [
        {
            id: 1,
            phase: "Normal Request",
            description: "User requests a product image using a `file` query parameter.",
            state: getLabState(
                [
                    { id: "client", status: "active", data: "GET /image?file=logo.png" },
                    { id: "server", status: "active" }
                ],
                [{ id: "p1", source: "client", target: "server", type: "data", content: "file=logo.png", progress: 0.5 }]
            ),
            explanation: {
                title: "Static File Endpoint",
                content: "The app maps `file` directly to a disk path and reads the file to stream it back.",
                type: "info"
            }
        },
        {
            id: 2,
            phase: "Unsafe Path Join",
            description: "The server concatenates the base directory and user input with no normalization.",
            state: getLabState([
                {
                    id: "server",
                    status: "active",
                    data: 'baseDir + "/" + req.query.file'
                }
            ]),
            explanation: {
                title: "Trusting User Paths",
                content: "Because the path is not sanitized, `../` segments are allowed to influence where on disk the server reads from.",
                type: "warning"
            }
        },
        {
            id: 3,
            phase: "Traversal Payload",
            description: "Attacker swaps the filename for a traversal payload targeting a config file.",
            state: getLabState([
                {
                    id: "client",
                    status: "compromised",
                    label: "Attacker",
                    data: "GET /image?file=../../config.json"
                }
            ]),
            explanation: {
                title: "Escaping the Images Folder",
                content: "The `../../` segments attempt to move the read pointer up out of the `images/` directory into the application root.",
                type: "info"
            }
        },
        {
            id: 4,
            phase: "Sensitive File Read",
            description: "Server follows the traversal path and opens `config.json` from outside the intended directory.",
            state: getLabState(
                [
                    { id: "server", status: "compromised", data: "Reading: ../../config.json" },
                    { id: "fs", status: "compromised", data: "DB_PASSWORD=secret" }
                ],
                [{ id: "p2", source: "server", target: "fs", type: "query", content: "../../config.json", progress: 0.5 }]
            ),
            explanation: {
                title: "Server Internal Access",
                content: "The app is now using a user-controlled path to read configuration meant only for server-side use.",
                type: "error"
            }
        },
        {
            id: 5,
            phase: "Leak to Attacker",
            description: "The contents of `config.json` are streamed back to the attacker as if it were an image.",
            state: getLabState(
                [
                    { id: "client", status: "compromised", label: "Attacker (Has config.json)" }
                ],
                [{ id: "p3", source: "server", target: "client", type: "response", content: "config.json contents...", progress: 0.5 }]
            ),
            explanation: {
                title: "Configuration Disclosure",
                content: "Database credentials, API keys, and secrets are now exposed, enabling further compromise.",
                type: "error"
            }
        }
    ],
    fixSteps: [
        {
            id: 1,
            phase: "Canonicalization",
            description: "Server normalizes the path and forces it to stay under a fixed `public/images` directory.",
            state: getLabState([
                {
                    id: "server",
                    status: "secure",
                    hasShield: true,
                    data: "safePath = join(IMAGES_DIR, file).normalize()"
                }
            ]),
            explanation: {
                title: "Locking Directory Scope",
                content: "If the normalized path escapes `IMAGES_DIR`, the request is rejected instead of reading arbitrary files.",
                type: "success"
            }
        },
        {
            id: 2,
            phase: "Allowlist Filenames",
            description: "Application only serves known image names or extensions.",
            state: getLabState(
                [
                    {
                        id: "server",
                        status: "secure",
                        hasShield: true,
                        data: "if (!ALLOWED_FILES.includes(file)) reject();"
                    }
                ],
                [{ id: "p4", source: "client", target: "server", type: "data", content: "file=../../config.json", progress: 0.5 }]
            ),
            explanation: {
                title: "Input Constraints",
                content: "Requests like `../../config.json` are blocked by validation before any disk access occurs.",
                type: "success"
            }
        }
    ]
};


