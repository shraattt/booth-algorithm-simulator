import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SimulatorInputProps {
  multiplicand: string;
  multiplier: string;
  onMultiplicandChange: (value: string) => void;
  onMultiplierChange: (value: string) => void;
  isRunning: boolean;
}

const SimulatorInput = ({
  multiplicand,
  multiplier,
  onMultiplicandChange,
  onMultiplierChange,
  isRunning,
}: SimulatorInputProps) => {
  const handleBinaryInput = (value: string, onChange: (value: string) => void) => {
    // Only allow 0, 1, and spaces
    const filtered = value.replace(/[^01\s]/g, "");
    onChange(filtered);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="multiplicand" className="text-foreground">
          Multiplicand (Binary)
        </Label>
        <Input
          id="multiplicand"
          value={multiplicand}
          onChange={(e) => handleBinaryInput(e.target.value, onMultiplicandChange)}
          placeholder="e.g., 0011 or 1101"
          disabled={isRunning}
          className="bg-secondary border-border hover:border-accent transition-all duration-300 focus:border-accent focus:ring-accent"
        />
        <p className="text-sm text-muted-foreground">
          Enter a binary number (e.g., 0011 for +3, 1101 for -3)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="multiplier" className="text-foreground">
          Multiplier (Binary)
        </Label>
        <Input
          id="multiplier"
          value={multiplier}
          onChange={(e) => handleBinaryInput(e.target.value, onMultiplierChange)}
          placeholder="e.g., 0010 or 1110"
          disabled={isRunning}
          className="bg-secondary border-border hover:border-accent transition-all duration-300 focus:border-accent focus:ring-accent"
        />
        <p className="text-sm text-muted-foreground">
          Enter a binary number (e.g., 0010 for +2, 1110 for -2)
        </p>
      </div>
    </div>
  );
};

export default SimulatorInput;
