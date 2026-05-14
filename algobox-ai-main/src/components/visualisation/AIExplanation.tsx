import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lightbulb, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AIExplanationProps {
  algorithm: string;
  stepIndex: number;
  state: any;
  codeLines: string[];
}

export default function AIExplanation({ algorithm, stepIndex, state, codeLines }: AIExplanationProps) {
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleExplain = async () => {
    setLoading(true);
    setError("");
    try {
      const stepDescription = state?.description || `Step ${stepIndex + 1} of the ${algorithm} algorithm`;
      const stepType = state?.type || "processing";
      const code = codeLines?.join("\n") || "";

      const { data, error: fnError } = await supabase.functions.invoke("explain-algorithm", {
        body: {
          algorithm,
          step: stepIndex,
          stepType,
          description: stepDescription,
          code,
        },
      });

      if (fnError) {
        setError("Failed to get AI explanation. Please try again.");
        return;
      }

      if (data?.error) {
        setError(data.error);
        return;
      }

      setExplanation(data?.explanation || "No explanation available.");
    } catch (err) {
      setError("Failed to connect to AI service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleExplain();
  }, [stepIndex]);

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">AI Explanation</h3>
      </div>

      <Button onClick={handleExplain} disabled={loading} className="mb-4">
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </span>
        ) : (
          "Explain This Step"
        )}
      </Button>

      {error && (
        <div className="text-sm text-red-500 mb-2">{error}</div>
      )}

      <div className="text-sm text-gray-700 leading-relaxed">
        {explanation || (!loading && "Click to get an AI explanation for this step.")}
      </div>
    </Card>
  );
}