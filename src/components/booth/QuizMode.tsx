import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { boothMultiplication, type BoothStep } from "@/lib/boothAlgorithm";
import { toast } from "sonner";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";

const QuizMode = () => {
  const [question, setQuestion] = useState<{
    multiplicand: string;
    multiplier: string;
    steps: BoothStep[];
    currentStepIndex: number;
  } | null>(null);
  
  const [answer, setAnswer] = useState("");
  const [operationAnswer, setOperationAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const generateQuestion = () => {
    // Generate random 4-bit binary numbers
    const mult1 = Math.floor(Math.random() * 8) - 4; // -4 to 3
    const mult2 = Math.floor(Math.random() * 8) - 4;
    
    const toBinary = (num: number): string => {
      if (num >= 0) {
        return num.toString(2).padStart(4, "0");
      } else {
        // Two's complement for negative numbers
        const positive = Math.abs(num);
        const binary = positive.toString(2).padStart(4, "0");
        let inverted = binary.split("").map(b => (b === "0" ? "1" : "0")).join("");
        let carry = 1;
        let result = "";
        
        for (let i = inverted.length - 1; i >= 0; i--) {
          const sum = parseInt(inverted[i]) + carry;
          result = (sum % 2) + result;
          carry = Math.floor(sum / 2);
        }
        
        return result;
      }
    };

    const multiplicand = toBinary(mult1);
    const multiplier = toBinary(mult2);
    const steps = boothMultiplication(multiplicand, multiplier);
    
    // Pick a random step (not the first one)
    const stepIndex = Math.floor(Math.random() * (steps.length - 1)) + 1;

    setQuestion({
      multiplicand,
      multiplier,
      steps,
      currentStepIndex: stepIndex,
    });
    setAnswer("");
    setOperationAnswer("");
    setShowResult(false);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const checkAnswer = () => {
    if (!question) return;

    const currentStep = question.steps[question.currentStepIndex];
    const correctAcc = currentStep.accumulator;
    
    // Check accumulator value
    const accCorrect = answer === correctAcc;
    
    // Check operation (simplified check)
    let opCorrect = false;
    if (operationAnswer === "add" && currentStep.operation.includes("A + M")) {
      opCorrect = true;
    } else if (operationAnswer === "subtract" && currentStep.operation.includes("A - M")) {
      opCorrect = true;
    } else if (operationAnswer === "none" && currentStep.operation === "No operation → ASR") {
      opCorrect = true;
    }

    const correct = accCorrect && opCorrect;
    setIsCorrect(correct);
    setShowResult(true);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    if (correct) {
      toast.success("Correct! Great job! 🎉");
    } else {
      toast.error("Not quite right. Try again!");
    }
  };

  const nextQuestion = () => {
    generateQuestion();
  };

  if (!question) {
    return <Card className="p-8 text-center"><p>Loading quiz...</p></Card>;
  }

  const currentStep = question.steps[question.currentStepIndex];
  const previousStep = question.steps[question.currentStepIndex - 1];

  return (
    <div className="space-y-6">
      <Card className="p-6 card-glow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-accent">Quiz Mode</h3>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-lg font-mono text-accent">
              {score.correct} / {score.total}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary/50 p-4 rounded-lg border border-accent/20">
            <h4 className="font-semibold text-foreground mb-3">Given Information:</h4>
            <div className="space-y-2 font-mono text-sm">
              <p>Multiplicand (M): <span className="text-accent">{question.multiplicand}</span></p>
              <p>Multiplier (Q): <span className="text-accent">{question.multiplier}</span></p>
              <p>Step: <span className="text-accent">{currentStep.step}</span></p>
              <p>Previous Accumulator: <span className="text-accent">{previousStep.accumulator}</span></p>
              <p>Previous Q: <span className="text-accent">{previousStep.multiplier.slice(0, -1)}</span></p>
              <p>Previous Q₋₁: <span className="text-accent">{previousStep.qPrev}</span></p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>What operation should be performed in this step?</Label>
              <RadioGroup value={operationAnswer} onValueChange={setOperationAnswer}>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/5 transition-all duration-300">
                  <RadioGroupItem value="add" id="add" />
                  <Label htmlFor="add" className="cursor-pointer flex-1">Add M (A = A + M)</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/5 transition-all duration-300">
                  <RadioGroupItem value="subtract" id="subtract" />
                  <Label htmlFor="subtract" className="cursor-pointer flex-1">Subtract M (A = A - M)</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/5 transition-all duration-300">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="cursor-pointer flex-1">No operation</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accumulator">
                What is the Accumulator value AFTER the operation and arithmetic shift right?
              </Label>
              <Input
                id="accumulator"
                value={answer}
                onChange={(e) => {
                  const filtered = e.target.value.replace(/[^01]/g, "");
                  setAnswer(filtered);
                }}
                placeholder="Enter binary value (e.g., 0010)"
                className="font-mono bg-secondary border-border hover:border-accent transition-all duration-300 focus:border-accent"
              />
            </div>
          </div>

          {showResult && (
            <Card className={`p-4 ${isCorrect ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                  {!isCorrect && (
                    <div className="mt-2 text-sm space-y-1">
                      <p>Correct operation: <span className="font-mono">{currentStep.operation}</span></p>
                      <p>Correct accumulator: <span className="font-mono text-accent">{currentStep.accumulator}</span></p>
                      <p className="text-xs text-muted-foreground mt-2">{currentStep.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          <div className="flex gap-3">
            {!showResult ? (
              <Button
                onClick={checkAnswer}
                disabled={!answer || !operationAnswer}
                className="flex-1 btn-gradient"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                className="flex-1 btn-gradient gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Next Question
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuizMode;
