import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import LandingPage from "@/pages/landing";
import OnboardingPage from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard";
import CareerPage from "@/pages/career";
import RealitySimulatorPage from "@/pages/reality-simulator";
import ProbabilityPage from "@/pages/probability";
import SkillsPage from "@/pages/skills";
import WeeklyPlanPage from "@/pages/weekly-plan";
import ChatPage from "@/pages/chat";
import WellnessPage from "@/pages/wellness";
import JobsPage from "@/pages/jobs";
import { FocusPage, ProcrastinationPage, MythsPage, MentalHealthPage } from "@/pages/mini-tools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/career" component={CareerPage} />
      <Route path="/reality-simulator/:id" component={RealitySimulatorPage} />
      <Route path="/probability/:id" component={ProbabilityPage} />
      <Route path="/skills" component={SkillsPage} />
      <Route path="/weekly-plan" component={WeeklyPlanPage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/wellness" component={WellnessPage} />
      <Route path="/jobs" component={JobsPage} />
      <Route path="/focus" component={FocusPage} />
      <Route path="/procrastination" component={ProcrastinationPage} />
      <Route path="/myths" component={MythsPage} />
      <Route path="/mental-health" component={MentalHealthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
