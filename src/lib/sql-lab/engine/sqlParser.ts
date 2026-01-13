// SQL Parser - Enhanced for educational SQL visualization
// Handles basic SQL patterns with better error handling and aggregate support

export interface ParsedQuery {
    type: "SELECT" | "INSERT" | "UPDATE" | "DELETE";
    columns: ColumnSpec[];
    from: string;
    joins: JoinClause[];
    where: WhereClause | null;
    groupBy: string[];
    having: Condition[] | null;
    orderBy: OrderByClause[];
    limit: number | null;
    distinct: boolean;
}

export interface ColumnSpec {
    name: string;
    alias?: string;
    aggregate?: "COUNT" | "SUM" | "AVG" | "MIN" | "MAX";
    table?: string;
}

export interface JoinClause {
    type: "INNER" | "LEFT" | "RIGHT" | "FULL";
    table: string;
    on: {
        leftTable: string;
        leftColumn: string;
        rightTable: string;
        rightColumn: string;
    };
}

export interface WhereClause {
    conditions: Condition[];
    operator: "AND" | "OR";
}

export interface Condition {
    column: string;
    operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "IN" | "IS" | "IS NOT";
    value: string | number | string[] | null;
    table?: string;
}

export interface OrderByClause {
    column: string;
    direction: "ASC" | "DESC";
}

export interface ExecutionStep {
    index: number;
    operation: string;
    description: string;
    tables: string[];
    affectedRows: number[];
    highlights: {
        table: string;
        rows: number[];
        type: "scan" | "match" | "filter" | "result" | "aggregate";
    }[];
    intermediateResult?: Record<string, any>[];
}

// Simple SQL tokenizer - improved to handle more cases
function tokenize(sql: string): string[] {
    const tokens: string[] = [];
    let current = "";
    let inString = false;
    let stringChar = "";
    let parenDepth = 0;

    for (let i = 0; i < sql.length; i++) {
        const char = sql[i];

        if (inString) {
            current += char;
            if (char === stringChar) {
                tokens.push(current);
                current = "";
                inString = false;
            }
        } else if (char === "'" || char === '"') {
            if (current) tokens.push(current);
            current = char;
            inString = true;
            stringChar = char;
        } else if (char === "(") {
            if (current) tokens.push(current);
            tokens.push(char);
            current = "";
            parenDepth++;
        } else if (char === ")") {
            if (current) tokens.push(current);
            tokens.push(char);
            current = "";
            parenDepth--;
        } else if (/\s/.test(char)) {
            if (current) tokens.push(current);
            current = "";
        } else if (",;".includes(char)) {
            if (current) tokens.push(current);
            tokens.push(char);
            current = "";
        } else if ("=<>!".includes(char)) {
            if (current) tokens.push(current);
            current = char;
            if (i + 1 < sql.length && "=<>".includes(sql[i + 1])) {
                current += sql[++i];
            }
            tokens.push(current);
            current = "";
        } else {
            current += char;
        }
    }
    if (current) tokens.push(current);

    return tokens.filter((t) => t.trim());
}

// Parse column with possible aggregate and alias
function parseColumn(tokens: string[], startIdx: number, upperTokens: string[]): { col: ColumnSpec; endIdx: number } {
    let i = startIdx;
    const aggregates = ["COUNT", "SUM", "AVG", "MIN", "MAX"];

    // Check for aggregate function
    if (aggregates.includes(upperTokens[i])) {
        const agg = upperTokens[i] as ColumnSpec["aggregate"];
        i++; // skip aggregate name
        if (upperTokens[i] === "(") {
            i++; // skip (
            const colName = tokens[i];
            i++; // skip column name
            if (upperTokens[i] === ")") i++; // skip )

            let alias: string | undefined;
            if (upperTokens[i] === "AS") {
                i++;
                alias = tokens[i];
                i++;
            }

            return {
                col: { name: colName, aggregate: agg, alias },
                endIdx: i
            };
        }
    }

    // Regular column (might have table prefix)
    const colName = tokens[i];
    i++;

    let alias: string | undefined;
    if (upperTokens[i] === "AS") {
        i++;
        alias = tokens[i];
        i++;
    }

    // Handle table.column format
    if (colName.includes(".")) {
        const [table, name] = colName.split(".");
        return { col: { name, table, alias }, endIdx: i };
    }

    return { col: { name: colName, alias }, endIdx: i };
}

// Parse SELECT query - enhanced with better error handling
export function parseSQL(sql: string): ParsedQuery {
    const tokens = tokenize(sql);
    const upperTokens = tokens.map(t => t.toUpperCase());

    const query: ParsedQuery = {
        type: "SELECT",
        columns: [],
        from: "",
        joins: [],
        where: null,
        groupBy: [],
        having: null,
        orderBy: [],
        limit: null,
        distinct: false,
    };

    let i = 0;

    // Parse SELECT
    if (upperTokens[i] !== "SELECT") {
        throw new Error("Query must start with SELECT");
    }
    i++;

    // Check for DISTINCT
    if (upperTokens[i] === "DISTINCT") {
        query.distinct = true;
        i++;
    }

    // Parse columns
    while (i < tokens.length && upperTokens[i] !== "FROM") {
        if (upperTokens[i] === ",") {
            i++;
            continue;
        }

        try {
            const { col, endIdx } = parseColumn(tokens, i, upperTokens);
            query.columns.push(col);
            i = endIdx;
        } catch {
            // Fallback: just grab the token
            if (!["FROM", ","].includes(upperTokens[i])) {
                query.columns.push({ name: tokens[i] });
            }
            i++;
        }
    }

    // Parse FROM
    if (upperTokens[i] === "FROM") {
        i++;
        query.from = tokens[i];
        i++;
    } else {
        throw new Error("Query must have FROM clause");
    }

    // Parse remaining clauses
    while (i < tokens.length) {
        const token = upperTokens[i];

        // JOINs
        if (token === "JOIN" || token === "INNER" || token === "LEFT" || token === "RIGHT" || token === "FULL") {
            const joinType = token === "JOIN" ? "INNER" : token;
            if (token !== "JOIN") {
                i++; // Skip to JOIN if we have LEFT/RIGHT/INNER
                if (upperTokens[i] === "OUTER") i++; // Skip OUTER if present
                if (upperTokens[i] !== "JOIN") {
                    i++;
                    continue;
                }
            }
            i++; // Skip JOIN

            const joinTable = tokens[i];
            i++;

            if (upperTokens[i] === "ON") {
                i++;
                const leftPart = tokens[i].split(".");
                i++;
                i++; // Skip = 
                const rightPart = tokens[i].split(".");
                i++;

                query.joins.push({
                    type: joinType as "INNER" | "LEFT" | "RIGHT",
                    table: joinTable,
                    on: {
                        leftTable: leftPart[0] || query.from,
                        leftColumn: leftPart[1] || leftPart[0],
                        rightTable: rightPart[0] || joinTable,
                        rightColumn: rightPart[1] || rightPart[0],
                    },
                });
            }
        }
        // WHERE
        else if (token === "WHERE") {
            i++;
            const conditions: Condition[] = [];

            while (i < tokens.length && !["GROUP", "ORDER", "LIMIT", "HAVING"].includes(upperTokens[i])) {
                if (upperTokens[i] === "AND" || upperTokens[i] === "OR") {
                    i++;
                    continue;
                }

                const columnParts = tokens[i].split(".");
                const column = columnParts.length > 1 ? columnParts[1] : columnParts[0];
                const table = columnParts.length > 1 ? columnParts[0] : undefined;
                i++;

                // Handle IS NULL / IS NOT NULL
                if (upperTokens[i] === "IS") {
                    i++;
                    const isNot = upperTokens[i] === "NOT";
                    if (isNot) i++;
                    if (upperTokens[i] === "NULL") {
                        conditions.push({ column, operator: isNot ? "IS NOT" : "IS", value: null, table });
                        i++;
                        continue;
                    }
                }

                const operator = upperTokens[i] as Condition["operator"];
                i++;

                let value: string | number = tokens[i];
                if (value?.startsWith("'") || value?.startsWith('"')) {
                    value = value.slice(1, -1);
                } else if (!isNaN(Number(value))) {
                    value = Number(value);
                }
                i++;

                conditions.push({ column, operator, value, table });
            }

            query.where = { conditions, operator: "AND" };
        }
        // GROUP BY
        else if (token === "GROUP") {
            i++; // Skip GROUP
            if (upperTokens[i] === "BY") i++; // Skip BY

            while (i < tokens.length && !["ORDER", "LIMIT", "HAVING"].includes(upperTokens[i])) {
                if (upperTokens[i] !== ",") {
                    query.groupBy.push(tokens[i]);
                }
                i++;
            }
        }
        // HAVING (simple support)
        else if (token === "HAVING") {
            i++;
            // For now, skip HAVING clause (visualization will still work)
            while (i < tokens.length && !["ORDER", "LIMIT"].includes(upperTokens[i])) {
                i++;
            }
        }
        // ORDER BY
        else if (token === "ORDER") {
            i++; // Skip ORDER
            if (upperTokens[i] === "BY") i++; // Skip BY

            while (i < tokens.length && upperTokens[i] !== "LIMIT") {
                if (upperTokens[i] !== ",") {
                    const col = tokens[i];
                    i++;
                    const dir = upperTokens[i] === "DESC" ? "DESC" : "ASC";
                    if (upperTokens[i] === "ASC" || upperTokens[i] === "DESC") i++;
                    query.orderBy.push({ column: col, direction: dir });
                } else {
                    i++;
                }
            }
        }
        // LIMIT
        else if (token === "LIMIT") {
            i++;
            query.limit = parseInt(tokens[i]) || null;
            i++;
        }
        else {
            i++;
        }
    }

    return query;
}

// Generate execution steps from parsed query
export function generateExecutionSteps(
    query: ParsedQuery,
    database: any
): ExecutionStep[] {
    const steps: ExecutionStep[] = [];
    let stepIndex = 0;

    // Find table (case-insensitive)
    const findTable = (name: string) => {
        const key = Object.keys(database.tables).find(k => k.toLowerCase() === name.toLowerCase());
        return key ? database.tables[key] : null;
    };

    // Step 1: Scan FROM table
    const fromTable = findTable(query.from);
    if (!fromTable) {
        throw new Error(`Table "${query.from}" not found in database`);
    }

    steps.push({
        index: stepIndex++,
        operation: "TABLE_SCAN",
        description: `📊 Scanning table "${query.from}" - ${fromTable.data.length} rows found`,
        tables: [query.from],
        affectedRows: fromTable.data.map((_: any, i: number) => i),
        highlights: [
            {
                table: query.from,
                rows: fromTable.data.map((_: any, i: number) => i),
                type: "scan",
            },
        ],
        intermediateResult: [...fromTable.data],
    });

    // Step 2-N: Process JOINs
    let currentResult = [...fromTable.data];

    for (const join of query.joins) {
        const joinTable = findTable(join.table);
        if (!joinTable) {
            throw new Error(`Join table "${join.table}" not found`);
        }

        // Scan join table
        steps.push({
            index: stepIndex++,
            operation: "TABLE_SCAN",
            description: `📊 Scanning table "${join.table}" for JOIN - ${joinTable.data.length} rows`,
            tables: [join.table],
            affectedRows: joinTable.data.map((_: any, i: number) => i),
            highlights: [
                {
                    table: join.table,
                    rows: joinTable.data.map((_: any, i: number) => i),
                    type: "scan",
                },
            ],
        });

        // Perform JOIN
        const newResult: any[] = [];
        const matchedFromRows: number[] = [];
        const matchedJoinRows: number[] = [];

        currentResult.forEach((row, fromIdx) => {
            joinTable.data.forEach((joinRow: any, joinIdx: number) => {
                // Try multiple column name formats
                const leftVal = row[join.on.leftColumn] ??
                    row[`${join.on.leftTable}.${join.on.leftColumn}`] ??
                    row[join.on.leftColumn.toLowerCase()];
                const rightVal = joinRow[join.on.rightColumn] ??
                    joinRow[join.on.rightColumn.toLowerCase()];

                if (leftVal === rightVal) {
                    matchedFromRows.push(fromIdx);
                    matchedJoinRows.push(joinIdx);
                    // Prefix columns to avoid conflicts
                    const combined: any = {};
                    Object.entries(row).forEach(([k, v]) => {
                        combined[k] = v;
                        combined[`${query.from}.${k}`] = v;
                    });
                    Object.entries(joinRow).forEach(([k, v]) => {
                        combined[k] = v;
                        combined[`${join.table}.${k}`] = v;
                    });
                    newResult.push(combined);
                }
            });
        });

        steps.push({
            index: stepIndex++,
            operation: "JOIN",
            description: `🔗 Joining on ${join.on.leftColumn} = ${join.on.rightColumn} - ${newResult.length} matches`,
            tables: [query.from, join.table],
            affectedRows: matchedFromRows,
            highlights: [
                { table: query.from, rows: [...new Set(matchedFromRows)], type: "match" },
                { table: join.table, rows: [...new Set(matchedJoinRows)], type: "match" },
            ],
            intermediateResult: newResult,
        });

        currentResult = newResult;
    }

    // Step: Apply WHERE filter
    if (query.where && query.where.conditions.length > 0) {
        const beforeCount = currentResult.length;
        const filteredRows: number[] = [];

        currentResult = currentResult.filter((row, idx) => {
            const passes = query.where!.conditions.every((cond) => {
                // Try multiple column name formats
                const val = row[cond.column] ??
                    row[cond.column.toLowerCase()] ??
                    row[`${cond.table}.${cond.column}`];

                if (cond.value === null) {
                    if (cond.operator === "IS") return val === null || val === undefined;
                    if (cond.operator === "IS NOT") return val !== null && val !== undefined;
                }

                switch (cond.operator) {
                    case "=": return val == cond.value;
                    case "!=": return val != cond.value;
                    case ">": return val > cond.value;
                    case "<": return val < cond.value;
                    case ">=": return val >= cond.value;
                    case "<=": return val <= cond.value;
                    case "LIKE": return typeof val === 'string' && typeof cond.value === 'string' &&
                        val.toLowerCase().includes(cond.value.replace(/%/g, '').toLowerCase());
                    default: return true;
                }
            });
            if (passes) filteredRows.push(idx);
            return passes;
        });

        const condStr = query.where.conditions
            .map((c) => `${c.column} ${c.operator} ${c.value}`)
            .join(" AND ");

        steps.push({
            index: stepIndex++,
            operation: "FILTER",
            description: `🔍 Applying WHERE: ${condStr} - ${beforeCount - currentResult.length} rows filtered out`,
            tables: [query.from],
            affectedRows: filteredRows,
            highlights: [
                { table: query.from, rows: filteredRows, type: "filter" },
            ],
            intermediateResult: currentResult,
        });
    }

    // Step: GROUP BY and Aggregations
    if (query.groupBy.length > 0 || query.columns.some(c => c.aggregate)) {
        const groups = new Map<string, any[]>();

        currentResult.forEach(row => {
            const key = query.groupBy.map(col => row[col] ?? row[col.toLowerCase()]).join("|");
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key)!.push(row);
        });

        const aggregatedResult: any[] = [];
        groups.forEach((rows, _key) => {
            const newRow: any = {};

            query.columns.forEach(col => {
                if (col.aggregate) {
                    const values = rows.map(r => r[col.name] ?? r[col.name.toLowerCase()]).filter(v => v !== undefined);
                    let result: number;

                    switch (col.aggregate) {
                        case "COUNT": result = col.name === "*" ? rows.length : values.length; break;
                        case "SUM": result = values.reduce((a, b) => a + (Number(b) || 0), 0); break;
                        case "AVG": result = values.length ? values.reduce((a, b) => a + (Number(b) || 0), 0) / values.length : 0; break;
                        case "MIN": result = Math.min(...values.map(Number)); break;
                        case "MAX": result = Math.max(...values.map(Number)); break;
                        default: result = 0;
                    }

                    newRow[col.alias || `${col.aggregate}(${col.name})`] = result;
                } else if (query.groupBy.includes(col.name)) {
                    newRow[col.name] = rows[0][col.name] ?? rows[0][col.name.toLowerCase()];
                } else {
                    newRow[col.name] = rows[0][col.name] ?? rows[0][col.name.toLowerCase()];
                }
            });

            aggregatedResult.push(newRow);
        });

        steps.push({
            index: stepIndex++,
            operation: "AGGREGATE",
            description: `📈 Grouping by ${query.groupBy.join(", ")} and computing aggregates - ${aggregatedResult.length} groups`,
            tables: [query.from],
            affectedRows: aggregatedResult.map((_, i) => i),
            highlights: [
                { table: "result", rows: aggregatedResult.map((_, i) => i), type: "aggregate" },
            ],
            intermediateResult: aggregatedResult,
        });

        currentResult = aggregatedResult;
    }

    // Step: ORDER BY
    if (query.orderBy.length > 0) {
        currentResult.sort((a, b) => {
            for (const order of query.orderBy) {
                const aVal = a[order.column] ?? a[order.column.toLowerCase()];
                const bVal = b[order.column] ?? b[order.column.toLowerCase()];
                const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                if (cmp !== 0) return order.direction === "DESC" ? -cmp : cmp;
            }
            return 0;
        });

        steps.push({
            index: stepIndex++,
            operation: "SORT",
            description: `🔢 Ordering by ${query.orderBy.map(o => `${o.column} ${o.direction}`).join(", ")}`,
            tables: [query.from],
            affectedRows: currentResult.map((_, i) => i),
            highlights: [],
            intermediateResult: [...currentResult],
        });
    }

    // Step: LIMIT
    if (query.limit) {
        currentResult = currentResult.slice(0, query.limit);
        steps.push({
            index: stepIndex++,
            operation: "LIMIT",
            description: `✂️ Limiting to ${query.limit} rows`,
            tables: [query.from],
            affectedRows: currentResult.map((_, i) => i),
            highlights: [],
            intermediateResult: [...currentResult],
        });
    }

    // Step: Projection (SELECT columns)
    const projectedResult = currentResult.map((row) => {
        if (query.columns.length === 1 && query.columns[0].name === "*") return row;

        const newRow: any = {};
        query.columns.forEach((col) => {
            const colName = col.name.includes(".") ? col.name.split(".")[1] : col.name;
            const outputName = col.alias || (col.aggregate ? `${col.aggregate}(${col.name})` : colName);

            if (row[outputName] !== undefined) {
                newRow[outputName] = row[outputName];
            } else if (row[colName] !== undefined) {
                newRow[outputName] = row[colName];
            } else if (row[colName.toLowerCase()] !== undefined) {
                newRow[outputName] = row[colName.toLowerCase()];
            }
        });
        return newRow;
    });

    const colNames = query.columns.map(c => c.alias || (c.aggregate ? `${c.aggregate}(${c.name})` : c.name)).join(", ");

    steps.push({
        index: stepIndex++,
        operation: "PROJECTION",
        description: `✅ Final result: ${projectedResult.length} rows with columns: ${colNames}`,
        tables: [query.from],
        affectedRows: projectedResult.map((_, i) => i),
        highlights: [
            { table: "result", rows: projectedResult.map((_, i) => i), type: "result" },
        ],
        intermediateResult: projectedResult,
    });

    return steps;
}
