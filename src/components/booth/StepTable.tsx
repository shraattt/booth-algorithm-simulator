import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BoothStep } from "@/lib/boothAlgorithm";
import { cn } from "@/lib/utils";

interface StepTableProps {
  steps: BoothStep[];
  currentStep: number;
}

const StepTable = ({ steps, currentStep }: StepTableProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-accent">Step-by-Step Process</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-accent font-semibold">Step</TableHead>
              <TableHead className="text-accent font-semibold">Operation</TableHead>
              <TableHead className="text-accent font-semibold">Accumulator (A)</TableHead>
              <TableHead className="text-accent font-semibold">Multiplier (Q)</TableHead>
              <TableHead className="text-accent font-semibold">Q₋₁</TableHead>
              <TableHead className="text-accent font-semibold">Multiplicand (M)</TableHead>
              <TableHead className="text-accent font-semibold">Explanation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {steps.slice(0, currentStep).map((step, index) => (
              <TableRow
                key={index}
                className={cn(
                  "border-border transition-all duration-300",
                  index === currentStep - 1
                    ? "bg-accent/20 animate-glow-pulse"
                    : "hover:bg-accent/5"
                )}
              >
                <TableCell className="font-mono">{step.step}</TableCell>
                <TableCell className="font-mono text-sm">{step.operation}</TableCell>
                <TableCell className="font-mono text-accent-glow">{step.accumulator}</TableCell>
                <TableCell className="font-mono">
                  {step.multiplier.slice(0, -1)}
                </TableCell>
                <TableCell className="font-mono">{step.qPrev}</TableCell>
                <TableCell className="font-mono">{step.multiplicand}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-md">
                  {step.explanation}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StepTable;
