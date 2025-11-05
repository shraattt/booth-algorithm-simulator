import { binaryToDecimal } from "@/lib/boothAlgorithm";
import { Card } from "@/components/ui/card";
import { useEffect, useRef } from "react";

interface ResultDisplayProps {
  result: string;
  multiplicand: string;
  multiplier: string;
  autoScroll?: boolean;
}

const ResultDisplay = ({ result, multiplicand, multiplier, autoScroll = false }: ResultDisplayProps) => {
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [autoScroll]);
  const decimalResult = binaryToDecimal(result);
  const decimalMultiplicand = binaryToDecimal(multiplicand);
  const decimalMultiplier = binaryToDecimal(multiplier);

  return (
    <div className="space-y-4" ref={resultRef}>
      <h3 className="text-xl font-semibold title-fancy">Final Result</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 bg-secondary border-accent/30 hover-glow transition-all">
          <p className="text-sm text-muted-foreground mb-2">Binary Result</p>
          <p className="text-2xl font-mono accent-glow break-all hover-glow">{result}</p>
        </Card>

        <Card className="p-4 bg-secondary border-accent/30">
          <p className="text-sm text-muted-foreground mb-2">Decimal Result</p>
          <p className="text-2xl font-mono text-accent">{decimalResult}</p>
        </Card>
      </div>

      <Card className="p-4 bg-secondary/50 border-border">
        <p className="text-sm text-muted-foreground mb-2">Verification</p>
        <p className="font-mono">
          {multiplicand} ({decimalMultiplicand}) × {multiplier} ({decimalMultiplier}) = {result} ({decimalResult})
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Check: {decimalMultiplicand} × {decimalMultiplier} = {decimalMultiplicand * decimalMultiplier}
        </p>
      </Card>
    </div>
  );
};

export default ResultDisplay;
