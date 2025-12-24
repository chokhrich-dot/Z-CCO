import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { WalletProvider } from "./contexts/WalletContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import LenderPortal from "./pages/LenderPortal";
import TransactionHistory from "./pages/TransactionHistory";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Rewards from "./pages/Rewards";
import Roadmap from "./pages/Roadmap";
import WhyZamaCCO from "./pages/WhyZamaCCO";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/why-zama" element={<WhyZamaCCO />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lender" element={<LenderPortal />} />
              <Route path="/history" element={<TransactionHistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
