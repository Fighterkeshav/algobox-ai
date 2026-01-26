import { D3SortingVisualization } from "@/components/visualisation/D3SortingVisualization";
import { D3BinarySearchVisualization } from "@/components/visualisation/D3BinarySearchVisualization";
import { D3GraphVisualization } from "@/components/visualisation/D3GraphVisualization";
import { D3GridVisualization } from "@/components/visualisation/D3GridVisualization";
import { D3NQueenVisualization } from "@/components/visualisation/D3NQueenVisualization";
import { D3PrimesVisualization } from "@/components/visualisation/D3PrimesVisualization";
import type { AlgorithmId } from "@/lib/algorithms/algorithmCode";

interface VisualizationCanvasProps {
    algorithm: AlgorithmId;
    currentStepData: any;
    height?: string;
}

export function VisualizationCanvas({ algorithm, currentStepData, height = "500px" }: VisualizationCanvasProps) {
    if (!currentStepData) return null;

    const isSortingAlgo = ["bubble-sort", "quick-sort", "merge-sort", "insertion-sort", "selection-sort"].includes(algorithm);
    const isSearchAlgo = algorithm === "binary-search";

    return (
        <div className={`relative w-full rounded-lg overflow-hidden bg-[#0f172a]`} style={{ height }}>
            {isSortingAlgo && (
                <D3SortingVisualization step={currentStepData} algorithm={algorithm} />
            )}
            {isSearchAlgo && (
                <D3BinarySearchVisualization step={currentStepData} />
            )}
            {algorithm === "dijkstra" && (
                <D3GraphVisualization step={currentStepData} />
            )}
            {(algorithm === "a-star" || algorithm === "bfs") && (
                <D3GridVisualization step={currentStepData} />
            )}
            {algorithm === "n-queen" && (
                <D3NQueenVisualization step={currentStepData} />
            )}
            {algorithm === "sieve" && (
                <D3PrimesVisualization step={currentStepData} />
            )}
        </div>
    );
}
