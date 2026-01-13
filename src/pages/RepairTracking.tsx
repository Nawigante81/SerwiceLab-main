import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRepairs } from "@/hooks/useRepairs";
import { repairStatusLabels, statusColors, allStatuses, RepairStatus, getTrackingUrl } from "@/lib/repair-utils";
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  Wrench,
  FileText,
  ArrowRight,
  ExternalLink,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const statusIcons: Record<RepairStatus, React.ElementType> = {
  pending: Clock,
  received: CheckCircle,
  diagnosing: Search,
  waiting_estimate: FileText,
  in_repair: Wrench,
  completed: CheckCircle,
  shipped: Truck,
  delivered: CheckCircle,
};

const RepairTracking = () => {
  const { data: repairs, isLoading } = useRepairs();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);

  // Set first repair as selected when data loads
  useEffect(() => {
    if (repairs && repairs.length > 0 && !selectedRepairId) {
      setSelectedRepairId(repairs[0].id);
    }
  }, [repairs, selectedRepairId]);

  const selectedRepair = repairs?.find(r => r.id === selectedRepairId);
  const filteredRepairs = repairs?.filter(r => 
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.device_brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.device_model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.tracking_number_outbound?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentStatusIndex = selectedRepair 
    ? allStatuses.indexOf(selectedRepair.status as RepairStatus)
    : -1;
  const trackingUrl = selectedRepair?.tracking_number_outbound
    ? getTrackingUrl(selectedRepair.tracking_number_outbound, selectedRepair.shipping_method)
    : null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Śledzenie naprawy
          </h1>
          <p className="font-sans text-muted-foreground mt-1">
            Sprawdź status swoich napraw w czasie rzeczywistym
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-4 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Wpisz numer zgłoszenia lub numer śledzenia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-sans"
            />
          </div>
        </div>

        {(!repairs || repairs.length === 0) ? (
          <div className="p-8 rounded-xl bg-card border border-border text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-sans text-foreground font-medium">
              Brak napraw do śledzenia
            </p>
            <p className="font-sans text-sm text-muted-foreground mt-1">
              Zgłoś pierwszą naprawę, aby rozpocząć śledzenie
            </p>
            <Link to="/zgloszenie-naprawy-i-wysylka-sprzetu">
              <Button variant="hero" className="mt-4">
                Zgłoś naprawę
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Repairs List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Twoje naprawy
              </h2>
              <div className="space-y-3">
                {filteredRepairs?.map((repair) => {
                  const Icon = statusIcons[repair.status as RepairStatus];
                  return (
                    <button
                      key={repair.id}
                      onClick={() => setSelectedRepairId(repair.id)}
                      className={cn(
                        "w-full p-4 rounded-xl border text-left transition-all",
                        selectedRepairId === repair.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm text-muted-foreground">
                            {repair.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="font-sans font-medium text-foreground mt-1 truncate">
                            {repair.device_brand} {repair.device_model}
                          </p>
                        </div>
                        <div className={cn(
                          "p-2 rounded-lg",
                          statusColors[repair.status as RepairStatus]
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="font-sans text-xs text-muted-foreground mt-2">
                        {repairStatusLabels[repair.status as RepairStatus]}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Repair Details */}
            {selectedRepair && (
              <div className="lg:col-span-2 space-y-6">
                {/* Status Card */}
                <div className="rounded-xl bg-card border border-border overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-sm text-muted-foreground">
                          {selectedRepair.id.slice(0, 8).toUpperCase()}
                        </p>
                        <h2 className="font-display text-xl font-semibold text-foreground mt-1">
                          {selectedRepair.device_brand} {selectedRepair.device_model}
                        </h2>
                      </div>
                      <span className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium",
                        statusColors[selectedRepair.status as RepairStatus]
                      )}>
                        {repairStatusLabels[selectedRepair.status as RepairStatus]}
                      </span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="p-6">
                    <h3 className="font-display font-semibold text-foreground mb-6">
                      Historia statusów
                    </h3>
                    <div className="relative">
                      {allStatuses.slice(0, currentStatusIndex + 1).map((status, index) => {
                        const Icon = statusIcons[status];
                        const isLast = index === currentStatusIndex;
                        
                        return (
                          <div key={status} className="flex gap-4 pb-6 last:pb-0">
                            <div className="relative">
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                isLast
                                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(82_100%_46%_/_0.3)]"
                                  : "bg-primary/20 text-primary"
                              )}>
                                <Icon className="w-5 h-5" />
                              </div>
                              {!isLast && (
                                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-primary/30" />
                              )}
                            </div>
                            <div className="pt-2">
                              <p className="font-sans font-medium text-foreground">
                                {repairStatusLabels[status]}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedRepair.tracking_number_outbound && trackingUrl && (
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Numer śledzenia
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-foreground">
                          {selectedRepair.tracking_number_outbound}
                        </p>
                        <a
                          href={trackingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Data zgłoszenia
                    </p>
                    <p className="font-sans text-foreground">
                      {new Date(selectedRepair.created_at).toLocaleDateString("pl-PL")}
                    </p>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Opis problemu
                  </p>
                  <p className="font-sans text-foreground">
                    {selectedRepair.problem_description}
                  </p>
                </div>

                {/* Action Button */}
                {selectedRepair.status === "waiting_estimate" && (
                  <Link to={`/akceptacja-kosztorysu-i-platnosc?repair=${selectedRepair.id}`}>
                    <Button variant="hero" className="w-full">
                      Przejdź do akceptacji kosztorysu
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RepairTracking;
