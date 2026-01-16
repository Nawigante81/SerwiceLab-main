import DashboardLayout from "@/components/layouts/DashboardLayout";
import { 
  Wrench, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Plus,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useRepairs } from "@/hooks/useRepairs";
import { useProfile } from "@/hooks/useProfile";
import { useCostEstimates } from "@/hooks/useCostEstimates";
import { repairStatusLabels, statusColors, RepairStatus } from "@/lib/repair-utils";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { data: repairs, isLoading: repairsLoading } = useRepairs();
  const { data: profile } = useProfile();
  const { data: estimates } = useCostEstimates();

  // Calculate stats from real data
  const activeRepairs = repairs?.filter(r => 
    !["completed", "delivered"].includes(r.status)
  ).length ?? 0;
  
  const completedRepairs = repairs?.filter(r => 
    ["completed", "delivered"].includes(r.status)
  ).length ?? 0;
  
  const pendingApproval = repairs?.filter(r => 
    r.status === "waiting_estimate"
  ).length ?? 0;

  const totalSpent = estimates
    ?.filter(e => e.status === "accepted")
    .reduce((sum, e) => sum + Number(e.total_cost), 0) ?? 0;

  const stats = [
    { label: "Aktywne naprawy", value: activeRepairs, icon: Wrench },
    { label: "Zakończone", value: completedRepairs, icon: CheckCircle },
    { label: "Oczekujące", value: pendingApproval, icon: Clock },
    { label: "Wydatki (PLN)", value: totalSpent, icon: CreditCard },
  ];

  const recentRepairs = repairs?.slice(0, 5) ?? [];
  const firstName = profile?.first_name || "użytkowniku";

  const getNextStep = () => {
    if (!repairs || repairs.length === 0) {
      return {
        title: "Zacznij od zgłoszenia naprawy",
        description: "Wypełnij krótki formularz i nadaj sprzęt w paczkomacie.",
        cta: "Zgłoś naprawę",
        href: "/zgloszenie-naprawy-i-wysylka-sprzetu",
      };
    }

    const waitingEstimate = repairs.find(r => r.status === "waiting_estimate");
    if (waitingEstimate) {
      return {
        title: "Czekamy na akceptację kosztorysu",
        description: "Zaakceptuj kosztorys, abyśmy mogli rozpocząć naprawę.",
        cta: "Przejdź do kosztorysu",
        href: `/akceptacja-kosztorysu-i-platnosc?repair=${waitingEstimate.id}`,
      };
    }

    const shipped = repairs.find(r => r.status === "shipped");
    if (shipped) {
      return {
        title: "Sprzęt jest w drodze",
        description: "Sprawdź status przesyłki i przygotuj się na odbiór.",
        cta: "Odbiór sprzętu",
        href: "/odbior-sprzetu-po-naprawie",
      };
    }

    const active = repairs.find(r => !["completed", "delivered"].includes(r.status));
    if (active) {
      return {
        title: "Naprawa w toku",
        description: "Sprawdź szczegóły i aktualny status naprawy.",
        cta: "Sprawdź status",
        href: "/sledzenie-statusu-naprawy",
      };
    }

    return {
      title: "Wszystkie naprawy zakończone",
      description: "Dodaj nową naprawę lub sprawdź historię.",
      cta: "Zgłoś naprawę",
      href: "/zgloszenie-naprawy-i-wysylka-sprzetu",
    };
  };

  const nextStep = getNextStep();
  const recentUpdates = [...(repairs ?? [])]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);

  if (repairsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="p-6 rounded-xl bg-card border border-border">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-8 w-20 mt-4" />
                <Skeleton className="h-4 w-24 mt-2" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-card border border-border space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-60" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-10 w-36" />
            </div>
            <div className="p-6 rounded-xl bg-card border border-border space-y-3">
              <Skeleton className="h-3 w-32" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-card border border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="divide-y divide-border">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-6 space-y-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-full max-w-md" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-6 rounded-xl bg-card border border-border space-y-3">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Panel główny
            </h1>
            <p className="font-sans text-muted-foreground mt-1">
              Witaj ponownie, {firstName}! Sprawdź status swoich napraw.
            </p>
          </div>
          <Link to="/zgloszenie-naprawy-i-wysylka-sprzetu">
            <Button variant="hero" className="w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Zgłoś naprawę
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            
            return (
              <div
                key={stat.label}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="font-display text-2xl font-bold text-foreground mt-4">
                  {stat.label === "Wydatki (PLN)" ? `${stat.value} zł` : stat.value}
                </p>
                <p className="font-sans text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Next Step + Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div
            className="p-6 rounded-xl bg-card border border-border"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
              Następny krok
            </p>
            <h2 className="font-display text-lg font-semibold text-foreground mt-2">
              {nextStep.title}
            </h2>
            <p className="font-sans text-sm text-muted-foreground mt-2">
              {nextStep.description}
            </p>
            <Link to={nextStep.href}>
              <Button variant="hero" className="mt-4">
                {nextStep.cta}
              </Button>
            </Link>
          </motion.div>
          <motion.div
            className="p-6 rounded-xl bg-card border border-border"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
              Ostatnie aktualizacje
            </p>
            {recentUpdates.length > 0 ? (
              <div className="space-y-3 mt-4">
                {recentUpdates.map((repair) => (
                  <div key={repair.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-sans text-sm text-foreground truncate">
                        {repair.device_brand} {repair.device_model}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {new Date(repair.updated_at).toLocaleDateString("pl-PL")}
                      </p>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      statusColors[repair.status as RepairStatus]
                    )}>
                      {repairStatusLabels[repair.status as RepairStatus]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-sans text-sm text-muted-foreground mt-3">
                Brak ostatnich aktualizacji.
              </p>
            )}
          </motion.div>
        </div>

        {/* Recent Repairs */}
        <div className="rounded-xl bg-card border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Ostatnie naprawy
            </h2>
            <Link 
              to="/sledzenie-statusu-naprawy"
              className="font-sans text-sm text-primary hover:underline flex items-center gap-1"
            >
              Zobacz wszystkie
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {recentRepairs.length > 0 ? (
            <div className="divide-y divide-border">
              {recentRepairs.map((repair) => (
                <div
                  key={repair.id}
                  className="p-6 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-sm text-muted-foreground">
                          {repair.id.slice(0, 8).toUpperCase()}
                        </p>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          statusColors[repair.status as RepairStatus]
                        )}>
                          {repairStatusLabels[repair.status as RepairStatus]}
                        </span>
                      </div>
                      <p className="font-sans text-foreground font-medium mt-1">
                        {repair.device_brand} {repair.device_model}
                      </p>
                      <p className="font-sans text-sm text-muted-foreground mt-1 line-clamp-1">
                        {repair.problem_description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="font-sans text-muted-foreground">
                Nie masz jeszcze żadnych napraw.
              </p>
              <Link to="/zgloszenie-naprawy-i-wysylka-sprzetu">
                <Button variant="link" className="mt-2">
                  Zgłoś pierwszą naprawę
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link 
            to="/zgloszenie-naprawy-i-wysylka-sprzetu"
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-[0_0_30px_hsl(82_100%_46%_/_0.08)] group"
          >
            <Plus className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              Nowe zgłoszenie
            </h3>
            <p className="font-sans text-sm text-muted-foreground mt-1">
              Zgłoś nowy sprzęt do naprawy
            </p>
          </Link>
          <Link 
            to="/sledzenie-statusu-naprawy"
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-[0_0_30px_hsl(82_100%_46%_/_0.08)] group"
          >
            <Clock className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              Sprawdź status
            </h3>
            <p className="font-sans text-sm text-muted-foreground mt-1">
              Zobacz postęp napraw
            </p>
          </Link>
          <Link 
            to="/akceptacja-kosztorysu-i-platnosc"
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-[0_0_30px_hsl(82_100%_46%_/_0.08)] group"
          >
            <CreditCard className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              Płatności
            </h3>
            <p className="font-sans text-sm text-muted-foreground mt-1">
              Zarządzaj kosztorysami
            </p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
