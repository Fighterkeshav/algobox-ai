import { motion } from "framer-motion";
import { ExecutionStep } from "@/lib/sql-lab/engine/sqlParser";
import { Table, Database, Filter, GitMerge, LayoutGrid, ArrowDownWideNarrow, Scissors, Calculator } from "lucide-react";

interface QueryExecutionVisualizerProps {
    step: ExecutionStep | null;
    database: any;
}

const OPERATION_CONFIG: Record<string, { icon: any; color: string; bgColor: string }> = {
    TABLE_SCAN: { icon: Table, color: "text-blue-400", bgColor: "bg-blue-500/20" },
    JOIN: { icon: GitMerge, color: "text-green-400", bgColor: "bg-green-500/20" },
    FILTER: { icon: Filter, color: "text-amber-400", bgColor: "bg-amber-500/20" },
    PROJECTION: { icon: LayoutGrid, color: "text-purple-400", bgColor: "bg-purple-500/20" },
    AGGREGATE: { icon: Calculator, color: "text-pink-400", bgColor: "bg-pink-500/20" },
    SORT: { icon: ArrowDownWideNarrow, color: "text-cyan-400", bgColor: "bg-cyan-500/20" },
    LIMIT: { icon: Scissors, color: "text-orange-400", bgColor: "bg-orange-500/20" },
};

const HIGHLIGHT_COLORS = {
    scan: "bg-blue-500/15 border-l-4 border-l-blue-500",
    match: "bg-green-500/15 border-l-4 border-l-green-500",
    filter: "bg-amber-500/15 border-l-4 border-l-amber-500",
    result: "bg-purple-500/15 border-l-4 border-l-purple-500",
    aggregate: "bg-pink-500/15 border-l-4 border-l-pink-500",
};

export function QueryExecutionVisualizer({ step, database }: QueryExecutionVisualizerProps) {
    if (!step) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
                <Database className="w-12 h-12 opacity-30" />
                <p className="text-sm">Run a query to see step-by-step execution</p>
                <p className="text-xs text-slate-600">Each operation will be visualized with row highlights</p>
            </div>
        );
    }

    const config = OPERATION_CONFIG[step.operation] || OPERATION_CONFIG.TABLE_SCAN;
    const Icon = config.icon;

    // Get all tables involved in this step
    const tablesToShow = step.highlights.length > 0
        ? step.highlights
        : [{ table: step.tables[0], rows: step.affectedRows, type: "scan" as const }];

    // Always show intermediate result if available
    const hasResult = step.intermediateResult && step.intermediateResult.length > 0;

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Operation Header */}
            <motion.div
                key={step.index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-slate-800/80 to-slate-900/80 border-b border-slate-700"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${config.color}`}>
                                {step.operation.replace("_", " ")}
                            </span>
                            <span className="text-xs text-slate-500">Step {step.index + 1}</span>
                        </div>
                        <p className="text-slate-300 text-sm mt-0.5">{step.description}</p>
                    </div>
                </div>
            </motion.div>

            {/* Main Visualization Area */}
            <div className="flex-1 p-4 overflow-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Source Tables */}
                    {tablesToShow.map((highlight, idx) => {
                        const tableName = highlight.table.toLowerCase();
                        const tableData = tableName === "result"
                            ? step.intermediateResult
                            : database.tables[tableName]?.data;

                        if (!tableData || tableData.length === 0) return null;

                        const columns = Object.keys(tableData[0] || {}).filter(col => !col.includes('.'));
                        const highlightType = highlight.type || "scan";

                        return (
                            <motion.div
                                key={`${highlight.table}-${idx}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden"
                            >
                                {/* Table Header */}
                                <div className="px-4 py-3 bg-slate-800/70 border-b border-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Table className="w-4 h-4 text-slate-400" />
                                        <span className="font-semibold text-slate-200">{highlight.table}</span>
                                    </div>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                                        {tableData.length} rows
                                    </span>
                                </div>

                                {/* Table Content */}
                                <div className="overflow-x-auto max-h-60">
                                    <table className="w-full text-xs">
                                        <thead className="bg-slate-800/50 sticky top-0">
                                            <tr>
                                                <th className="px-3 py-2 text-slate-500 font-medium text-left w-8">#</th>
                                                {columns.slice(0, 5).map((col) => (
                                                    <th key={col} className="px-3 py-2 text-slate-400 font-medium text-left">
                                                        {col}
                                                    </th>
                                                ))}
                                                {columns.length > 5 && (
                                                    <th className="px-3 py-2 text-slate-500 text-left">...</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.slice(0, 15).map((row: any, rowIdx: number) => {
                                                const isHighlighted = highlight.rows.includes(rowIdx) || highlight.rows.length === 0;
                                                const rowColor = isHighlighted ? HIGHLIGHT_COLORS[highlightType] : "opacity-30";

                                                return (
                                                    <motion.tr
                                                        key={rowIdx}
                                                        initial={{ opacity: 0, x: -5 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: rowIdx * 0.02 }}
                                                        className={`border-t border-slate-800/50 ${rowColor} transition-all`}
                                                    >
                                                        <td className="px-3 py-2 text-slate-500">{rowIdx}</td>
                                                        {columns.slice(0, 5).map((col) => (
                                                            <td key={col} className="px-3 py-2 text-slate-200">
                                                                {formatValue(row[col])}
                                                            </td>
                                                        ))}
                                                        {columns.length > 5 && (
                                                            <td className="px-3 py-2 text-slate-500">...</td>
                                                        )}
                                                    </motion.tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {tableData.length > 15 && (
                                    <div className="px-4 py-2 text-xs text-slate-500 bg-slate-800/30 text-center">
                                        Showing 15 of {tableData.length} rows
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Result Preview */}
            {hasResult && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t border-slate-700 bg-gradient-to-r from-purple-900/20 to-slate-900/50"
                >
                    <div className="px-4 py-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        <span className="text-xs font-medium text-purple-400">
                            Result: {step.intermediateResult!.length} rows
                        </span>
                    </div>
                    <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
                        {step.intermediateResult!.slice(0, 6).map((row, idx) => (
                            <div
                                key={idx}
                                className="flex-shrink-0 px-3 py-2 bg-slate-800/60 rounded-lg text-xs text-slate-300 min-w-[120px]"
                            >
                                {Object.entries(row).slice(0, 3).map(([k, v]) => (
                                    <div key={k} className="flex gap-1">
                                        <span className="text-slate-500">{k}:</span>
                                        <span className="text-slate-200 font-medium">{formatValue(v)}</span>
                                    </div>
                                ))}
                                {Object.keys(row).length > 3 && (
                                    <div className="text-slate-500 mt-1">+{Object.keys(row).length - 3} fields</div>
                                )}
                            </div>
                        ))}
                        {step.intermediateResult!.length > 6 && (
                            <div className="flex-shrink-0 px-3 py-2 bg-slate-800/30 rounded-lg text-xs text-slate-500 flex items-center">
                                +{step.intermediateResult!.length - 6} more
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Empty Result Warning */}
            {step.intermediateResult && step.intermediateResult.length === 0 && (
                <div className="border-t border-slate-700 bg-amber-900/10 px-4 py-3">
                    <div className="flex items-center gap-2 text-amber-400 text-sm">
                        <span>⚠️</span>
                        <span>This step produced 0 rows. Check your query conditions.</span>
                    </div>
                </div>
            )}
        </div>
    );
}

function formatValue(val: any): string {
    if (val === null || val === undefined) return "NULL";
    if (typeof val === "number") return val.toLocaleString();
    if (typeof val === "boolean") return val ? "true" : "false";
    if (typeof val === "string" && val.length > 20) return val.slice(0, 17) + "...";
    return String(val);
}
