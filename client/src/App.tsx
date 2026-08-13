import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "./components/ErrorBoundary";
import LabShell from "./components/LabShell";

function App() {
  return (
    <ErrorBoundary>
      <LabShell />
    </ErrorBoundary>
  );
}

export default App;
