import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, History, Brain } from "lucide-react";
import SimulatorInput from "@/components/booth/SimulatorInput";
import StepTable from "@/components/booth/StepTable";
import ResultDisplay from "@/components/booth/ResultDisplay";
import HistoryViewer from "@/components/booth/HistoryViewer";
import QuizMode from "@/components/booth/QuizMode";
import InfoTooltip from "@/components/booth/InfoTooltip";
import { boothMultiplication, type BoothStep } from "@/lib/boothAlgorithm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [multiplicand, setMultiplicand] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [steps, setSteps] = useState<BoothStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string>("");
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleRun = async () => {
    if (!multiplicand || !multiplier) {
      toast.error("Please enter both numbers");
      return;
    }

    try {
      const calculatedSteps = boothMultiplication(multiplicand, multiplier);
      setSteps(calculatedSteps);
      setCurrentStep(calculatedSteps.length);
      setIsRunning(true);

      const finalStep = calculatedSteps[calculatedSteps.length - 1];
      setResult(finalStep.accumulator + finalStep.multiplier.slice(0, -1));

      // Save to database
      await supabase.from("booth_history").insert({
        multiplicand,
        multiplier,
        result: finalStep.accumulator + finalStep.multiplier.slice(0, -1),
        steps: calculatedSteps as any,
      });

      setRefreshHistory((prev) => prev + 1);
      toast.success("Calculation completed!");
    } catch (error) {
      toast.error("Invalid input. Please enter valid binary numbers.");
    }
  };

  const handleStep = () => {
    if (!multiplicand || !multiplier) {
      toast.error("Please enter both numbers");
      return;
    }

    if (currentStep === 0) {
      try {
        const calculatedSteps = boothMultiplication(multiplicand, multiplier);
        setSteps(calculatedSteps);
        setIsRunning(true);
      } catch (error) {
        toast.error("Invalid input. Please enter valid binary numbers.");
        return;
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
      
      if (currentStep === steps.length - 1) {
        const finalStep = steps[steps.length - 1];
        setResult(finalStep.accumulator + finalStep.multiplier.slice(0, -1));
        
        // Save to database when finished
        supabase.from("booth_history").insert({
          multiplicand,
          multiplier,
          result: finalStep.accumulator + finalStep.multiplier.slice(0, -1),
          steps: steps as any,
        });
        
        setRefreshHistory((prev) => prev + 1);
      }
    }
  };

  const handleReset = () => {
    setMultiplicand("");
    setMultiplier("");
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    setResult("");
  };

  const handleLoadFromHistory = (
    histMultiplicand: string,
    histMultiplier: string,
    histSteps: BoothStep[],
    histResult: string
  ) => {
    setMultiplicand(histMultiplicand);
    setMultiplier(histMultiplier);
    setSteps(histSteps);
    setCurrentStep(histSteps.length);
    setIsRunning(true);
    setResult(histResult);
    toast.success("Loaded from history");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold accent-glow">
            Booth Algorithm Simulator
          </h1>
          <p className="text-muted-foreground text-lg">
            Interactive step-by-step binary multiplication using Booth's algorithm
          </p>
          <InfoTooltip />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="simulator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card">
            <TabsTrigger value="simulator" className="gap-2">
              <Calculator className="w-4 h-4" />
              Simulator
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="quiz" className="gap-2">
              <Brain className="w-4 h-4" />
              Quiz Mode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulator" className="space-y-6 mt-6">
            <Card className="p-6 card-glow flow-border animate-slide-in">
              <SimulatorInput
                multiplicand={multiplicand}
                multiplier={multiplier}
                onMultiplicandChange={setMultiplicand}
                onMultiplierChange={setMultiplier}
                isRunning={isRunning}
              />

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleRun}
                  className="flex-1 btn-gradient"
                  disabled={isRunning}
                >
                  Run All Steps
                </Button>
                <Button
                  onClick={handleStep}
                  variant="secondary"
                  className="flex-1 hover:bg-accent/20 transition-all duration-300"
                  disabled={currentStep >= steps.length && isRunning}
                >
                  Step ({currentStep}/{steps.length || 0})
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 hover:border-accent transition-all duration-300"
                >
                  Reset
                </Button>
              </div>
            </Card>

            {steps.length > 0 && (
              <Card className="p-6 card-glow animate-slide-in">
                <StepTable steps={steps} currentStep={currentStep} />
              </Card>
            )}

            {result && (
              <Card className="p-6 card-glow animate-slide-in">
                <ResultDisplay
                  result={result}
                  multiplicand={multiplicand}
                  multiplier={multiplier}
                />
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <HistoryViewer
              onLoad={handleLoadFromHistory}
              refresh={refreshHistory}
            />
          </TabsContent>

          <TabsContent value="quiz" className="mt-6">
            <QuizMode />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
