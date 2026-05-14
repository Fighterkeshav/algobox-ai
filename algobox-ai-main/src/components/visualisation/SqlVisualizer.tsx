import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SqlVisualizerProps {
    data: any[];
}

export function SqlVisualizer({ data }: SqlVisualizerProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                No data to display
            </div>
        );
    }

    const columns = Object.keys(data[0]);

    return (
        <Card className="h-full border-none shadow-none bg-transparent">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Query Results</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-auto h-[calc(100%-3rem)]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col} className="h-8 font-semibold text-xs">
                                    {col}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, i) => (
                            <TableRow key={i} className="hover:bg-muted/50">
                                {columns.map((col) => (
                                    <TableCell key={`${i}-${col}`} className="py-2 text-xs font-mono">
                                        {row[col]?.toString() ?? <span className="text-muted-foreground italic">null</span>}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
