import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Cpu } from "lucide-react";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const About = lazy(() => import("./pages/About"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Settings = lazy(() => import("./pages/Settings"));
const RepairRequest = lazy(() => import("./pages/RepairRequest"));
const RepairTracking = lazy(() => import("./pages/RepairTracking"));
const CostEstimate = lazy(() => import("./pages/CostEstimate"));
const EquipmentPickup = lazy(() => import("./pages/EquipmentPickup"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 animate-pulse" />
                    <div className="absolute inset-0 w-14 h-14 rounded-2xl bg-primary/30 blur-lg" />
                    <div className="absolute inset-0 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground">
                      <Cpu className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-lg">
                      {"Service".split("").map((char, index) => (
                        <span
                          key={`service-${index}`}
                          className="inline-block animate-pulse"
                          style={{ animationDelay: `${index * 120}ms` }}
                        >
                          {char}
                        </span>
                      ))}
                      {"Lab".split("").map((char, index) => (
                        <span
                          key={`lab-${index}`}
                          className="inline-block animate-pulse text-primary"
                          style={{ animationDelay: `${(index + 7) * 120}ms` }}
                        >
                          {char}
                        </span>
                      ))}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Uruchamiamy Twój panel serwisowy. Jeszcze chwila.
                    </p>
                  </div>
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cennik" element={<Pricing />} />
              <Route path="/kontakt" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/o-nas" element={<About />} />
              <Route path="/regulamin" element={<Terms />} />
              <Route path="/polityka-prywatnosci" element={<Privacy />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/zgloszenie-naprawy-i-wysylka-sprzetu" element={
                <ProtectedRoute>
                  <RepairRequest />
                </ProtectedRoute>
              } />
              <Route path="/sledzenie-statusu-naprawy" element={
                <ProtectedRoute>
                  <RepairTracking />
                </ProtectedRoute>
              } />
              <Route path="/akceptacja-kosztorysu-i-platnosc" element={
                <ProtectedRoute>
                  <CostEstimate />
                </ProtectedRoute>
              } />
              <Route path="/odbior-sprzetu-po-naprawie" element={
                <ProtectedRoute>
                  <EquipmentPickup />
                </ProtectedRoute>
              } />
              <Route
                path="/zg-oszenie-naprawy-i-wysy-ka-sprz-tu"
                element={<Navigate to="/zgloszenie-naprawy-i-wysylka-sprzetu" replace />}
              />
              <Route
                path="/-ledzenie-statusu-naprawy"
                element={<Navigate to="/sledzenie-statusu-naprawy" replace />}
              />
              <Route
                path="/akceptacja-kosztorysu-i-p-atno-"
                element={<Navigate to="/akceptacja-kosztorysu-i-platnosc" replace />}
              />
              <Route
                path="/odbi-r-sprz-tu-po-naprawie"
                element={<Navigate to="/odbior-sprzetu-po-naprawie" replace />}
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
