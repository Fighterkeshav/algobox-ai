import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/hooks/useProgress";

interface Profile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    score: number;
}

export default function Leaderboard() {
    // Trigger sync of local progress to DB when visiting this page
    useProgress();

    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async () => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("score", { ascending: false })
            .limit(50);

        if (error) {
            console.error("Error fetching leaderboard:", error);
        } else {
            setUsers((data as Profile[]) || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLeaderboard();

        // Realtime Subscription
        const channel = supabase
            .channel("public:profiles")
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "profiles" },
                (payload) => {
                    console.log("Realtime update:", payload);
                    // Optimistic update or refetch? Refetch is safer for order changes.
                    fetchLeaderboard();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Crown className="h-6 w-6 text-yellow-500 fill-yellow-500" />;
            case 1:
                return <Medal className="h-6 w-6 text-gray-400 fill-gray-400" />;
            case 2:
                return <Medal className="h-6 w-6 text-amber-700 fill-amber-700" />;
            default:
                return <span className="font-bold text-muted-foreground w-6 text-center">{index + 1}</span>;
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl animate-in fade-in duration-500">
            <div className="flex flex-col items-center mb-10 text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                    <Trophy className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Global Leaderboard</h1>
                <p className="text-muted-foreground max-w-lg">
                    Top problem solvers from around the world. Compete, climb the ranks, and earn your spot at the top.
                </p>
            </div>

            <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Top Solvers</CardTitle>
                    <CardDescription>Rankings update in real-time</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[80px] text-center">Rank</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Score</TableHead>
                                <TableHead className="text-right hidden md:table-cell">Level</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                // Skeleton loading state
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="h-12 animate-pulse bg-muted/20" colSpan={4} />
                                    </TableRow>
                                ))
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        No data available yet. Start solving problems!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user, index) => (
                                    <TableRow key={user.id} className="group hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium text-center flex justify-center items-center py-4">
                                            {getRankIcon(index)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-border">
                                                    <AvatarImage src={user.avatar_url} />
                                                    <AvatarFallback className="text-xs font-bold">
                                                        {user.username?.slice(0, 2).toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                                                        {user.username || user.full_name || "Anonymous User"}
                                                    </span>
                                                    {user.username && user.full_name && (
                                                        <span className="text-xs text-muted-foreground hidden sm:inline-block">
                                                            {user.full_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-bold text-primary">
                                            {user.score?.toLocaleString() || 0} XP
                                        </TableCell>
                                        <TableCell className="text-right hidden md:table-cell">
                                            <Badge variant="secondary" className="font-normal text-xs">
                                                Lvl {Math.floor((user.score || 0) / 1000) + 1}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
