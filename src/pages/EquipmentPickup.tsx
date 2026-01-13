import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useRepairs } from "@/hooks/useRepairs";
import { repairStatusLabels, getTrackingUrl } from "@/lib/repair-utils";
import { 
  Package, 
  Truck, 
  MapPin, 
  ExternalLink,
  CheckCircle,
  Star,
  MessageCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const EquipmentPickup = () => {
  const { data: repairs, isLoading } = useRepairs();

  // Get completed/shipped repairs
  const completedRepairs = repairs?.filter(
    r => r.status === "completed" || r.status === "shipped" || r.status === "delivered"
  ) ?? [];

  // Find active shipment (shipped status)
  const activeShipment = repairs?.find(r => r.status === "shipped");
  const trackingUrl = activeShipment?.tracking_number_return
    ? getTrackingUrl(activeShipment.tracking_number_return, activeShipment.shipping_method)
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
            Odbiór sprzętu
          </h1>
          <p className="font-sans text-muted-foreground mt-1">
            Śledź dostawę naprawionego sprzętu
          </p>
        </div>

        {/* Active Shipment */}
        {activeShipment ? (
          <div className="rounded-xl bg-card border border-primary/30 overflow-hidden">
            <div className="p-6 border-b border-border bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">
                    Przesyłka w drodze!
                  </p>
                  <p className="font-sans text-sm text-muted-foreground">
                    Twój sprzęt jest już w drodze do Ciebie
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Shipment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeShipment.tracking_number_return && trackingUrl && (
                  <div>
                    <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Numer przesyłki
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-foreground">
                        {activeShipment.tracking_number_return}
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
                <div>
                  <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Data wysyłki
                  </p>
                  <p className="font-sans font-medium text-foreground">
                    {new Date(activeShipment.updated_at).toLocaleDateString("pl-PL")}
                  </p>
                </div>
              </div>

              {/* Paczkomat Location */}
              {activeShipment.paczkomat_id && (
                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-sans font-medium text-foreground">
                        Paczkomat {activeShipment.paczkomat_id}
                      </p>
                      <p className="font-sans text-sm text-muted-foreground">
                        Odbiór w wybranym paczkomacie
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Repair Info */}
              <div className="pt-4 border-t border-border">
                <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Naprawione urządzenie
                </p>
                <p className="font-sans font-medium text-foreground">
                  {activeShipment.device_brand} {activeShipment.device_model}
                </p>
                <p className="font-sans text-sm text-muted-foreground mt-1">
                  {activeShipment.problem_description}
                </p>
              </div>

              {/* Track Button */}
              {trackingUrl && (
                <Button asChild variant="hero" className="w-full">
                  <a href={trackingUrl} target="_blank" rel="noreferrer">
                    <Package className="w-4 h-4" />
                    Śledź przesyłkę
                  </a>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-card border border-border text-center">
            <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-sans text-foreground font-medium">
              Brak aktywnych przesyłek
            </p>
            <p className="font-sans text-sm text-muted-foreground mt-1">
              Gdy Twój sprzęt zostanie wysłany, tutaj pojawi się informacja o przesyłce
            </p>
          </div>
        )}

        {/* Past Deliveries */}
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Historia dostaw
          </h2>
          
          {completedRepairs.length > 0 ? (
            <div className="space-y-4">
              {completedRepairs.map((repair) => (
                <div
                  key={repair.id}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-sm text-muted-foreground">
                          {repair.id.slice(0, 8).toUpperCase()}
                        </p>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          repair.status === "delivered" 
                            ? "bg-green-500/20 text-green-500"
                            : "bg-blue-500/20 text-blue-500"
                        )}>
                          {repair.status === "delivered" ? (
                            <>
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              Dostarczono
                            </>
                          ) : (
                            repairStatusLabels[repair.status as keyof typeof repairStatusLabels]
                          )}
                        </span>
                      </div>
                      <p className="font-sans font-medium text-foreground mt-1">
                        {repair.device_brand} {repair.device_model}
                      </p>
                      <p className="font-sans text-sm text-muted-foreground mt-1">
                        Utworzono: {new Date(repair.created_at).toLocaleDateString("pl-PL")}
                      </p>
                    </div>
                  </div>
                  
                  {/* Review Prompt */}
                  {repair.status === "delivered" && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <p className="font-sans text-sm text-muted-foreground">
                          Oceń naprawę
                        </p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              className="p-1 hover:scale-110 transition-transform"
                            >
                              <Star className="w-5 h-5 text-muted-foreground hover:text-primary hover:fill-primary transition-colors" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-card border border-border text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-sans text-foreground font-medium">
                Brak zakończonych dostaw
              </p>
              <p className="font-sans text-sm text-muted-foreground mt-1">
                Tutaj pojawią się informacje o dostarczonych naprawach
              </p>
            </div>
          )}
        </div>

        {/* Support */}
        <div className="p-6 rounded-xl bg-card border border-border text-center">
          <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-display font-semibold text-foreground">
            Potrzebujesz pomocy z dostawą?
          </h3>
          <p className="font-sans text-sm text-muted-foreground mt-1 mb-4">
            Skontaktuj się z nami, jeśli masz problem z odbiorem paczki
          </p>
          <Button asChild variant="outline">
            <Link to="/kontakt">Kontakt z obsługą</Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EquipmentPickup;
