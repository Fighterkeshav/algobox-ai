import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Image, Link, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface ExportButtonProps {
    targetId: string; // ID of the element to capture
    algorithm: string;
    currentStep: number;
    totalSteps: number;
    extraParams?: Record<string, string>;
}

export function ExportButton({
    targetId,
    algorithm,
    currentStep,
    totalSteps,
    extraParams = {},
}: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleExportPNG = async () => {
        const element = document.getElementById(targetId);
        if (!element) {
            toast.error("Could not find visualization to capture.");
            return;
        }

        setIsExporting(true);
        try {
            const canvas = await html2canvas(element, {
                backgroundColor: "#0f172a",
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
            });

            const link = document.createElement("a");
            link.download = `algobox-${algorithm}-step${currentStep + 1}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            toast.success("PNG exported successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to export PNG.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleCopyLink = () => {
        try {
            const url = new URL(window.location.href);
            url.searchParams.set("algo", algorithm);
            url.searchParams.set("step", String(currentStep));
            for (const [k, v] of Object.entries(extraParams)) {
                url.searchParams.set(k, v);
            }

            navigator.clipboard.writeText(url.toString()).then(() => {
                setCopied(true);
                toast.success("Shareable link copied to clipboard!");
                setTimeout(() => setCopied(false), 2000);
            });
        } catch {
            toast.error("Failed to generate shareable link.");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-primary/20 hover:bg-primary/10"
                    disabled={isExporting}
                >
                    {isExporting ? (
                        <Download className="h-4 w-4 animate-bounce" />
                    ) : (
                        <Share2 className="h-4 w-4 text-primary" />
                    )}
                    Export
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    Export Options
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    onClick={handleExportPNG}
                    disabled={isExporting}
                >
                    <Image className="h-4 w-4 text-blue-400" />
                    <div>
                        <div className="text-sm font-medium">Export as PNG</div>
                        <div className="text-xs text-muted-foreground">
                            Capture current frame
                        </div>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    onClick={handleCopyLink}
                >
                    {copied ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                        <Link className="h-4 w-4 text-purple-400" />
                    )}
                    <div>
                        <div className="text-sm font-medium">
                            {copied ? "Copied!" : "Copy Share Link"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Step {currentStep + 1} of {totalSteps}
                        </div>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
