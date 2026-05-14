import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface D3MSTVisualizationProps {
    step: any;
}

export function D3MSTVisualization({ step }: D3MSTVisualizationProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !step?.state?.nodes) return;

        const { nodes, edges, mstEdges, currentEdge } = step.state;

        const svg = d3.select(svgRef.current);
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;

        svg.selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const scaleX = chartWidth / 500;
        const scaleY = chartHeight / 500;
        const scale = Math.min(scaleX, scaleY);

        const edgesG = g.append("g").attr("class", "edges");
        const mstEdgesG = g.append("g").attr("class", "mst-edges");
        const nodesG = g.append("g").attr("class", "nodes");

        // Helper to draw edges
        const drawEdge = (edgeGroup: any, edgeData: any, isMst: boolean, isCurrent: boolean) => {
            const from = nodes.find((n: any) => n.id === edgeData[0]);
            const to = nodes.find((n: any) => n.id === edgeData[1]);
            const weight = edgeData[2];

            if (!from || !to) return;

            const edgeG = edgeGroup.append("g");

            let strokeColor = "#475569"; // default
            let strokeWidth = 3;
            let opacity = 0.3;

            if (isMst) {
                strokeColor = "#22c55e"; // green for included in MST
                strokeWidth = 5;
                opacity = 1;
            } else if (isCurrent) {
                strokeColor = "#eab308"; // yellow for currently considering
                strokeWidth = 4;
                opacity = 1;
            }

            edgeG.append("line")
                .attr("x1", from.x * scale)
                .attr("y1", from.y * scale)
                .attr("x2", to.x * scale)
                .attr("y2", to.y * scale)
                .style("stroke", strokeColor)
                .style("stroke-width", strokeWidth)
                .style("opacity", opacity);

            // Edge weight label
            const midX = (from.x + to.x) / 2 * scale;
            const midY = (from.y + to.y) / 2 * scale;

            edgeG.append("circle")
                .attr("cx", midX)
                .attr("cy", midY)
                .attr("r", 14 * scale)
                .style("fill", "#1e293b")
                .style("stroke", strokeColor)
                .style("stroke-width", 2)
                .style("opacity", opacity > 0.3 ? 1 : 0.6);

            edgeG.append("text")
                .attr("x", midX)
                .attr("y", midY)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .style("font-size", `${12 * scale}px`)
                .style("font-weight", "600")
                .style("fill", "#94a3b8")
                .text(weight);
        };

        // Draw all base edges faintly
        edges.forEach((edge: any) => {
            // Don't draw here if it's already in MST or is current
            const inMst = mstEdges.some((e: any) => e[0] === edge[0] && e[1] === edge[1]);
            const isCur = currentEdge && currentEdge[0] === edge[0] && currentEdge[1] === edge[1];

            if (!inMst && !isCur) {
                drawEdge(edgesG, edge, false, false);
            }
        });

        // Draw MST edges prominently
        mstEdges.forEach((edge: any) => {
            drawEdge(mstEdgesG, edge, true, false);
        });

        // Draw current edge
        if (currentEdge) {
            drawEdge(edgesG, currentEdge, false, true);
        }

        // Draw nodes
        nodes.forEach((node: any) => {
            const nodeG = nodesG.append("g")
                .attr("transform", `translate(${node.x * scale}, ${node.y * scale})`);

            // Determine node color implicitly based on if it's part of MST yet
            const isInMst = mstEdges.some((e: any) => e[0] === node.id || e[1] === node.id);
            const isCurrentNode = currentEdge && (currentEdge[0] === node.id || currentEdge[1] === node.id);

            let nodeColor = "#334155";
            if (isInMst) nodeColor = "#22c55e"; // Green if touched by MST
            if (isCurrentNode) nodeColor = "#eab308"; // Yellow highlight when checking

            nodeG.append("circle")
                .attr("r", 0)
                .style("fill", nodeColor)
                .style("stroke", "#ffffff")
                .style("stroke-width", 3)
                .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))")
                .transition()
                .duration(300)
                .ease(d3.easeCubicOut)
                .attr("r", 25 * scale);

            nodeG.append("text")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .style("font-size", `${16 * scale}px`)
                .style("font-weight", "700")
                .style("fill", "#ffffff")
                .style("pointer-events", "none")
                .text(node.id) // Using ID as label since we didn't add labels in generateKruskalSteps
                .style("opacity", 0)
                .transition()
                .duration(300)
                .delay(100)
                .style("opacity", 1);
        });

        // Legend
        const legend = g.append("g")
            .attr("transform", `translate(${chartWidth - 160}, 20)`);

        const legendData = [
            { label: "Considering", color: "#eab308" },
            { label: "In MST", color: "#22c55e" },
            { label: "Pending/Discarded", color: "#334155" },
        ];

        legendData.forEach((item, i) => {
            const legendItem = legend.append("g")
                .attr("transform", `translate(0, ${i * 25})`);

            legendItem.append("circle")
                .attr("r", 8)
                .style("fill", item.color);

            legendItem.append("text")
                .attr("x", 15)
                .attr("y", 0)
                .attr("dominant-baseline", "central")
                .style("fill", "#94a3b8")
                .style("font-size", "12px")
                .text(item.label);
        });

    }, [step]);

    return (
        <svg
            ref={svgRef}
            className="w-full h-full"
            style={{ minHeight: "400px" }}
        />
    );
}
