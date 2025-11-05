import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BoothStep } from "@/lib/boothAlgorithm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HistoryItem {
  id: string;
  multiplicand: string;
  multiplier: string;
  result: string;
  steps: BoothStep[];
  created_at: string;
}

interface HistoryViewerProps {
  onLoad: (
    multiplicand: string,
    multiplier: string,
    steps: BoothStep[],
    result: string
  ) => void;
  refresh: number;
}

const HistoryViewer = ({ onLoad, refresh }: HistoryViewerProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("booth_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      toast.error("Failed to load history");
      console.error(error);
    } else {
      setHistory((data || []) as unknown as HistoryItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("booth_history").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete item");
    } else {
      toast.success("Item deleted");
      fetchHistory();
    }
  };

  const handleClearAll = async () => {
    const { error } = await supabase.from("booth_history").delete().neq("id", "");

    if (error) {
      toast.error("Failed to clear history");
    } else {
      toast.success("History cleared");
      fetchHistory();
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent" />
        <p className="mt-4 text-muted-foreground">Loading history...</p>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="p-8 text-center card-glow">
        <p className="text-muted-foreground">No history yet. Run some calculations!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-accent">Operation History</h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-card border-accent/30">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all history?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all calculation history. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearAll} className="bg-destructive hover:bg-destructive/90">
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-4">
        {history.map((item) => (
          <Card key={item.id} className="p-4 card-glow hover:border-accent transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Multiplicand</p>
                    <p className="font-mono text-accent">{item.multiplicand}</p>
                  </div>
                  <span className="text-muted-foreground">×</span>
                  <div>
                    <p className="text-sm text-muted-foreground">Multiplier</p>
                    <p className="font-mono text-accent">{item.multiplier}</p>
                  </div>
                  <span className="text-muted-foreground">=</span>
                  <div>
                    <p className="text-sm text-muted-foreground">Result</p>
                    <p className="font-mono accent-glow">{item.result}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <Button
                  onClick={() =>
                    onLoad(item.multiplicand, item.multiplier, item.steps, item.result)
                  }
                  variant="secondary"
                  size="sm"
                  className="gap-2 hover:bg-accent/20 transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  Load
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 hover:bg-destructive/20 hover:text-destructive transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-accent/30">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this calculation?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this calculation from your history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryViewer;
