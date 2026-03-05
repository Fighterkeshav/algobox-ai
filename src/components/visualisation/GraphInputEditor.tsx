import { useState, useRef, useEffect } from "react";
import { Plus, Minus, MousePointer2, Move, Link as LinkIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Node {
    id: number;
    x: number;
    y: number;
}

export interface Edge {
    u: number;
    v: number;
    w: number;
}

export interface GraphData {
    nodes: Node[];
    edges: Edge[];
}

interface GraphInputEditorProps {
    onGraphChange: (graph: GraphData) => void;
    initialGraph?: GraphData;
}

type EditorMode = "select" | "add-node" | "add-edge" | "delete";

export function GraphInputEditor({ onGraphChange, initialGraph }: GraphInputEditorProps) {
    const [nodes, setNodes] = useState<Node[]>(initialGraph?.nodes || []);
    const [edges, setEdges] = useState<Edge[]>(initialGraph?.edges || []);
    const [mode, setMode] = useState<EditorMode>("add-node");

    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
    const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);

    const [dragStartNodeId, setDragStartNodeId] = useState<number | null>(null);
    const [dragCurrentPos, setDragCurrentPos] = useState<{ x: number, y: number } | null>(null);

    const svgRef = useRef<SVGSVGElement>(null);

    // Notify parent of changes
    useEffect(() => {
        onGraphChange({ nodes, edges });
    }, [nodes, edges, onGraphChange]);

    const getSvgCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const CTM = svgRef.current.getScreenCTM();
        if (!CTM) return { x: 0, y: 0 };

        let clientX, clientY;
        if ('touches' in e) {
            const touchEvent = e as React.TouchEvent;
            clientX = touchEvent.touches[0].clientX;
            clientY = touchEvent.touches[0].clientY;
        } else {
            const mouseEvent = e as React.MouseEvent;
            clientX = mouseEvent.clientX;
            clientY = mouseEvent.clientY;
        }

        return {
            x: (clientX - CTM.e) / CTM.a,
            y: (clientY - CTM.f) / CTM.d
        };
    };

    const handleSvgClick = (e: React.MouseEvent) => {
        if (mode === "add-node") {
            const coords = getSvgCoordinates(e);
            const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
            setNodes([...nodes, { id: newId, ...coords }]);
        }
    };

    const handleNodeMouseDown = (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Prevent Svg click

        if (mode === "delete") {
            setNodes(nodes.filter(n => n.id !== id));
            setEdges(edges.filter(edge => edge.u !== id && edge.v !== id));
        } else if (mode === "add-edge") {
            setDragStartNodeId(id);
            setDragCurrentPos(getSvgCoordinates(e));
        } else if (mode === "select") {
            setSelectedNodeId(id === selectedNodeId ? null : id);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (mode === "add-edge" && dragStartNodeId !== null) {
            setDragCurrentPos(getSvgCoordinates(e));
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (mode === "add-edge" && dragStartNodeId !== null) {
            if (hoveredNodeId !== null && hoveredNodeId !== dragStartNodeId) {
                // Prevent duplicate edges, though undirected they might be (u,v) or (v,u)
                const exists = edges.some(edge =>
                    (edge.u === dragStartNodeId && edge.v === hoveredNodeId) ||
                    (edge.v === dragStartNodeId && edge.u === hoveredNodeId)
                );

                if (!exists) {
                    // Default weight 1
                    setEdges([...edges, { u: dragStartNodeId, v: hoveredNodeId, w: 1 }]);
                }
            }
            setDragStartNodeId(null);
            setDragCurrentPos(null);
        }
    };

    const handleEdgeClick = (e: React.MouseEvent, u: number, v: number) => {
        e.stopPropagation();
        if (mode === "delete") {
            setEdges(edges.filter(edge => !(edge.u === u && edge.v === v)));
        }
    };

    const updateEdgeWeight = (u: number, v: number, newWeight: number) => {
        setEdges(edges.map(edge =>
            (edge.u === u && edge.v === v) ? { ...edge, w: newWeight } : edge
        ));
    };

    const clearGraph = () => {
        setNodes([]);
        setEdges([]);
        setSelectedNodeId(null);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center gap-2 bg-secondary/20 p-2 rounded-md">
                <Button
                    variant={mode === "select" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMode("select")}
                    className="h-8"
                >
                    <MousePointer2 className="w-4 h-4 mr-2" />
                    Select
                </Button>
                <Button
                    variant={mode === "add-node" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMode("add-node")}
                    className="h-8"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Node
                </Button>
                <Button
                    variant={mode === "add-edge" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMode("add-edge")}
                    className="h-8"
                >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Add Edge
                </Button>
                <Button
                    variant={mode === "delete" ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => setMode("delete")}
                    className={cn("h-8", mode !== "delete" && "text-destructive hover:bg-destructive/10")}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                </Button>

                <div className="flex-1" />

                <Button variant="ghost" size="sm" onClick={clearGraph} className="h-8 text-muted-foreground hover:text-foreground">
                    Clear
                </Button>
            </div>

            {/* Canvas */}
            <div
                className="relative w-full h-[400px] bg-[#0f172a] rounded-lg overflow-hidden border border-border/50 cursor-crosshair"
            >
                <svg
                    ref={svgRef}
                    className="w-full h-full"
                    onClick={handleSvgClick}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {/* Edges */}
                    {edges.map((edge, i) => {
                        const nodeU = nodes.find(n => n.id === edge.u);
                        const nodeV = nodes.find(n => n.id === edge.v);
                        if (!nodeU || !nodeV) return null;

                        return (
                            <g key={`edge-${edge.u}-${edge.v}-${i}`} className={cn(mode === "delete" && "hover:cursor-pointer")}>
                                {/* Thicker invisible line for easier clicking */}
                                <line
                                    x1={nodeU.x} y1={nodeU.y}
                                    x2={nodeV.x} y2={nodeV.y}
                                    stroke="transparent"
                                    strokeWidth={20}
                                    onClick={(e) => handleEdgeClick(e, edge.u, edge.v)}
                                />

                                {/* Visible Edge */}
                                <line
                                    x1={nodeU.x} y1={nodeU.y}
                                    x2={nodeV.x} y2={nodeV.y}
                                    stroke="#475569"
                                    strokeWidth={3}
                                    className="pointer-events-none"
                                />

                                {/* Weight Label Background & Text */}
                                <circle
                                    cx={(nodeU.x + nodeV.x) / 2}
                                    cy={(nodeU.y + nodeV.y) / 2}
                                    r={12}
                                    fill="#1e293b"
                                    stroke="#475569"
                                    className="pointer-events-none"
                                />
                                <text
                                    x={(nodeU.x + nodeV.x) / 2}
                                    y={(nodeU.y + nodeV.y) / 2}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill="#94a3b8"
                                    fontSize={12}
                                    fontWeight="bold"
                                    className="pointer-events-none select-none"
                                >
                                    {edge.w}
                                </text>
                            </g>
                        );
                    })}

                    {/* Dragging Edge Line */}
                    {mode === "add-edge" && dragStartNodeId !== null && dragCurrentPos && (
                        <line
                            x1={nodes.find(n => n.id === dragStartNodeId)?.x || 0}
                            y1={nodes.find(n => n.id === dragStartNodeId)?.y || 0}
                            x2={dragCurrentPos.x}
                            y2={dragCurrentPos.y}
                            stroke="#6366f1"
                            strokeWidth={2}
                            strokeDasharray="5,5"
                            className="pointer-events-none"
                        />
                    )}

                    {/* Nodes */}
                    {nodes.map(node => (
                        <g
                            key={`node-${node.id}`}
                            transform={`translate(${node.x},${node.y})`}
                            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                            onMouseEnter={() => setHoveredNodeId(node.id)}
                            onMouseLeave={() => setHoveredNodeId(null)}
                            className={cn(
                                "cursor-pointer",
                                mode === "add-edge" && "hover:cursor-crosshair",
                                mode === "delete" && "hover:cursor-pointer"
                            )}
                        >
                            <circle
                                r={20}
                                fill={
                                    selectedNodeId === node.id ? "#818cf8" :
                                        hoveredNodeId === node.id && mode === "add-edge" && dragStartNodeId !== node.id ? "#34d399" :
                                            "#334155"
                                }
                                stroke={selectedNodeId === node.id ? "#ffffff" : "#475569"}
                                strokeWidth={2}
                                className="transition-colors duration-200"
                            />
                            <text
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill="#ffffff"
                                fontSize={14}
                                fontWeight="bold"
                                className="pointer-events-none select-none"
                            >
                                {node.id}
                            </text>
                        </g>
                    ))}
                </svg>

                {/* Floating panel for Selected Node/Edge */}
                {selectedNodeId !== null && mode === "select" && (
                    <Card className="absolute top-4 right-4 w-48 p-3 shadow-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-primary/20">
                        <h4 className="text-sm font-semibold mb-2 text-primary">Node {selectedNodeId} Selected</h4>
                        <div className="text-xs text-muted-foreground mb-3">
                            Position: {Math.round(nodes.find(n => n.id === selectedNodeId)?.x || 0)}, {Math.round(nodes.find(n => n.id === selectedNodeId)?.y || 0)}
                        </div>

                        {/* Show connected edges weights */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Edges</span>
                            {edges.filter(e => e.u === selectedNodeId || e.v === selectedNodeId).map((edge, idx) => {
                                const neighbor = edge.u === selectedNodeId ? edge.v : edge.u;
                                return (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground w-12 shrink-0">to {neighbor}</span>
                                        <Input
                                            type="number"
                                            value={edge.w}
                                            onChange={(e) => updateEdgeWeight(edge.u, edge.v, parseInt(e.target.value) || 0)}
                                            className="h-6 text-xs"
                                        />
                                    </div>
                                )
                            })}
                            {edges.filter(e => e.u === selectedNodeId || e.v === selectedNodeId).length === 0 && (
                                <span className="text-xs text-muted-foreground">No edges</span>
                            )}
                        </div>
                    </Card>
                )}
            </div>

            {/* Help Text */}
            <div className="text-sm text-muted-foreground">
                {mode === "select" && "Click a node to edit edge weights."}
                {mode === "add-node" && "Click anywhere on the canvas to add a node."}
                {mode === "add-edge" && "Drag from one node to another to connect them."}
                {mode === "delete" && "Click a node or an edge to remove it."}
            </div>
        </div>
    );
}
