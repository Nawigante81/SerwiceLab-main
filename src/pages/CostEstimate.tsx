import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepairs } from "@/hooks/useRepairs";
import { useCostEstimateByRepairId, useAcceptEstimate, useRejectEstimate } from "@/hooks/useCostEstimates";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { 
  FileText, 
  CheckCircle, 
  X, 
  MessageCircle,
  Shield,
  Clock,
  CreditCard,
  Loader2,
  Package
} from "lucide-react";
import { toast } from "sonner";

interface EstimateItem {
  name: string;
  price: number;
  quantity: number;
}

const CostEstimate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const repairId = searchParams.get("repair");
  
  const { data: repairs, isLoading: repairsLoading } = useRepairs();
  const { data: estimate, isLoading: estimateLoading } = useCostEstimateByRepairId(repairId);
  const acceptMutation = useAcceptEstimate();
  const rejectMutation = useRejectEstimate();

  // Find repair awaiting approval if no specific repair is selected
  const repair = repairId 
    ? repairs?.find(r => r.id === repairId)
    : repairs?.find(r => r.status === "waiting_estimate");

  const { data: selectedEstimate } = useCostEstimateByRepairId(repair?.id ?? null);
  const displayEstimate = estimate ?? selectedEstimate;

  const handleAccept = async () => {
    if (!displayEstimate) return;
    
    try {
      await acceptMutation.mutateAsync(displayEstimate.id);
      toast.success("Kosztorys został zaakceptowany");
      navigate("/dashboard");
    } catch {
      toast.error("Nie udało się zaakceptować kosztorysu. Spróbuj ponownie.");
    }
  };

  const handleReject = async () => {
    if (!displayEstimate) return;
    
    try {
      await rejectMutation.mutateAsync(displayEstimate.id);
      toast.success("Kosztorys został odrzucony");
      navigate("/dashboard");
    } catch {
      toast.error("Nie udało się odrzucić kosztorysu. Spróbuj ponownie.");
    }
  };

  if (repairsLoading || estimateLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>

          <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-6 w-36 rounded-full" />
          </div>

          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center gap-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="divide-y divide-border">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
            <div className="p-6 bg-secondary/30 border-t border-border flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-7 w-24" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 rounded-xl bg-card border border-border space-y-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-11 flex-1" />
            <Skeleton className="h-11 sm:w-40" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!repair || !displayEstimate) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto p-8 rounded-xl bg-card border border-border text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-sans text-foreground font-medium">
            Brak kosztorysów do akceptacji
          </p>
          <p className="font-sans text-sm text-muted-foreground mt-1">
            Gdy otrzymamy Twój sprzęt i wykonamy diagnozę, pojawi się tutaj kosztorys do akceptacji
          </p>
          <Link to="/dashboard">
            <Button variant="hero" className="mt-4">
              Wróć do panelu
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const items = (displayEstimate.items as unknown as EstimateItem[]) || [];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Akceptacja kosztorysu
          </h1>
          <p className="font-sans text-muted-foreground mt-1">
            Przejrzyj i zaakceptuj kosztorys naprawy
          </p>
        </div>

        {/* Repair Info */}
        <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between">
          <div>
            <p className="font-mono text-sm text-muted-foreground">
              {repair.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="font-sans font-medium text-foreground mt-1">
              {repair.device_brand} {repair.device_model}
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-orange-500/20 text-orange-500">
            Oczekuje na akceptację
          </span>
        </div>

        {/* Cost Breakdown */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Szczegóły kosztorysu
            </h2>
          </div>
          
          <div className="divide-y divide-border">
            {items.map((item, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-sans font-medium text-foreground">{item.name}</p>
                  <p className="font-sans text-sm text-muted-foreground">
                    Ilość: {item.quantity}
                  </p>
                </div>
                <p className="font-mono text-foreground">{item.price} zł</p>
              </div>
            ))}
            {displayEstimate.labor_cost > 0 && (
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-sans font-medium text-foreground">Robocizna</p>
                </div>
                <p className="font-mono text-foreground">{displayEstimate.labor_cost} zł</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-secondary/30 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-semibold text-foreground">
                Suma całkowita
              </p>
              <p className="font-display text-2xl font-bold text-primary">
                {displayEstimate.total_cost} zł
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border">
            <Shield className="w-6 h-6 text-primary mb-2" />
            <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Gwarancja
            </p>
            <p className="font-sans font-medium text-foreground">12 miesięcy</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <Clock className="w-6 h-6 text-primary mb-2" />
            <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Szacowany czas
            </p>
            <p className="font-sans font-medium text-foreground">2-3 dni robocze</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <CreditCard className="w-6 h-6 text-primary mb-2" />
            <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Metody płatności
            </p>
            <p className="font-sans font-medium text-foreground">Karta, BLIK, Przelew</p>
          </div>
        </div>

        {/* Note */}
        {displayEstimate.notes && (
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-sans font-medium text-foreground">
                  Uwagi od serwisu
                </p>
                <p className="font-sans text-sm text-muted-foreground">
                  {displayEstimate.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Binding Note */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-sans font-medium text-foreground">
                Kosztorys jest wiążący
              </p>
              <p className="font-sans text-sm text-muted-foreground">
                Po akceptacji kosztorysu cena naprawy nie ulegnie zmianie, chyba że odkryjemy dodatkowe uszkodzenia.
                W takim przypadku skontaktujemy się z Tobą przed wykonaniem dodatkowych prac.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="hero" 
            className="flex-1"
            onClick={handleAccept}
            disabled={acceptMutation.isPending}
          >
            {acceptMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Akceptuję i płacę {displayEstimate.total_cost} zł
          </Button>
          <Button 
            variant="outline" 
            className="sm:w-auto"
            onClick={handleReject}
            disabled={rejectMutation.isPending}
          >
            {rejectMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
            Odrzuć
          </Button>
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="font-sans text-muted-foreground">
            Masz pytania dotyczące kosztorysu?
          </p>
          <Button asChild variant="link" className="mt-2">
            <Link to="/kontakt">
              <MessageCircle className="w-4 h-4" />
              Skontaktuj się z nami
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CostEstimate;
