import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const InfoTooltip = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent/10 transition-all duration-300">
          <Info className="w-4 h-4" />
          What is Booth's Algorithm?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-card border-accent/30">
        <DialogHeader>
          <DialogTitle className="text-2xl text-accent">Booth's Multiplication Algorithm</DialogTitle>
          <DialogDescription className="text-base space-y-4 pt-4">
            <p>
              Booth's algorithm is an efficient method for multiplying binary numbers in two's complement notation.
              It reduces the number of additions and subtractions needed compared to traditional methods.
            </p>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">How it works:</h4>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Initialize accumulator (A) to 0, set multiplier (Q) and multiplicand (M)</li>
                <li>Add an extra bit (Q₋₁) set to 0 next to the multiplier</li>
                <li>For each bit position (n iterations):
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>If Q₀Q₋₁ = 01: Add M to A</li>
                    <li>If Q₀Q₋₁ = 10: Subtract M from A (add -M)</li>
                    <li>If Q₀Q₋₁ = 00 or 11: No operation</li>
                    <li>Perform arithmetic shift right on A, Q, Q₋₁</li>
                  </ul>
                </li>
                <li>The final result is the concatenation of A and Q</li>
              </ol>
            </div>

            <div className="bg-secondary/50 p-4 rounded-lg border border-accent/20">
              <h4 className="font-semibold text-foreground mb-2">Key Benefits:</h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Handles signed numbers naturally using two's complement</li>
                <li>Reduces the number of operations for sequences of 1s or 0s</li>
                <li>More efficient than traditional shift-and-add multiplication</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InfoTooltip;
