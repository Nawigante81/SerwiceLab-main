import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepairsPaginated, useRepairByStatus } from "@/hooks/useRepairs";
import { useCreateRepairReview, useRepairReviews, useUpdateRepairReview } from "@/hooks/useRepairReviews";
import { repairStatusLabels, getTrackingUrl } from "@/lib/repair-utils";
import { 
  Package, 
  Truck, 
  MapPin, 
  ExternalLink,
  CheckCircle,
  Star,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const EquipmentPickup = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const { data: repairsPage, isLoading: repairsLoading } = useRepairsPaginated({
    page: currentPage,
    pageSize,
    statusIn: ["completed", "shipped", "delivered"],
    select: "id, status, device_brand, device_model, created_at",
  });
  const { data: activeShipment, isLoading: shipmentLoading } = useRepairByStatus("shipped");
  const isLoading = repairsLoading || shipmentLoading;
  const { data: reviews = [] } = useRepairReviews();
  const createReview = useCreateRepairReview();
  const updateReview = useUpdateRepairReview();
  const { toast } = useToast();
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, { rating: number; comment: string }>>({});
  const [submittingReviewId, setSubmittingReviewId] = useState<string | null>(null);

  // Get completed/shipped repairs
  const completedRepairs = repairsPage?.data ?? [];
  const totalRepairs = repairsPage?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRepairs / pageSize));
  const reviewByRepairId = useMemo(() => {
    const map = new Map<string, (typeof reviews)[number]>();
    reviews.forEach((review) => {
      map.set(review.repair_id, review);
    });
    return map;
  }, [reviews]);

  useEffect(() => {
    setReviewDrafts((prev) => {
      const next = { ...prev };
      completedRepairs.forEach((repair) => {
        const existing = reviewByRepairId.get(repair.id);
        if (!next[repair.id] && existing) {
          next[repair.id] = {
            rating: existing.rating,
            comment: existing.comment ?? "",
          };
        }
      });
      return next;
    });
  }, [completedRepairs, reviewByRepairId]);

  // Find active shipment (shipped status)
  const trackingUrl = activeShipment?.tracking_number_return
    ? getTrackingUrl(activeShipment.tracking_number_return, activeShipment.shipping_method)
    : null;

  const handleReviewChange = (repairId: string, rating: number) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [repairId]: {
        rating,
        comment: prev[repairId]?.comment ?? "",
      },
    }));
  };

  const handleReviewCommentChange = (repairId: string, comment: string) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [repairId]: {
        rating: prev[repairId]?.rating ?? 0,
        comment,
      },
    }));
  };

  const handleReviewSubmit = async (repairId: string) => {
    const draft = reviewDrafts[repairId];
    if (!draft?.rating) {
      toast({
        title: "Wybierz ocenę",
        description: "Zaznacz liczbę gwiazdek przed wysłaniem opinii.",
        variant: "destructive",
      });
      return;
    }

    setSubmittingReviewId(repairId);
    const existing = reviewByRepairId.get(repairId);
    try {
      if (existing) {
        await updateReview.mutateAsync({
          id: existing.id,
          rating: draft.rating,
          comment: draft.comment.trim() || null,
        });
      } else {
        await createReview.mutateAsync({
          repair_id: repairId,
          rating: draft.rating,
          comment: draft.comment.trim() || null,
        });
      }
      toast({
        title: "Dziękujemy za opinię!",
        description: "Twoja ocena została zapisana.",
      });
    } catch {
      toast({
        title: "Nie udało się zapisać opinii",
        description: "Spróbuj ponownie za chwilę.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReviewId(null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>

          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="p-6 border-b border-border bg-primary/5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-52" />
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="pt-4 border-t border-border space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-5 w-40" />
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="p-4 rounded-xl bg-card border border-border space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>

          <div className="p-6 rounded-xl bg-card border border-border text-center space-y-3">
            <Skeleton className="h-8 w-8 rounded-full mx-auto" />
            <Skeleton className="h-5 w-60 mx-auto" />
            <Skeleton className="h-4 w-72 mx-auto" />
            <Skeleton className="h-9 w-40 mx-auto" />
          </div>
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
                  {(repair.status === "completed" || repair.status === "delivered") && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <p className="font-sans text-sm text-muted-foreground">
                          Oceń naprawę
                        </p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const draft = reviewDrafts[repair.id];
                            const isActive = (draft?.rating ?? 0) >= star;
                            return (
                              <button
                                key={star}
                                type="button"
                                className="p-1 hover:scale-110 transition-transform"
                                onClick={() => handleReviewChange(repair.id, star)}
                                aria-label={`Ocena ${star} gwiazdek`}
                              >
                                <Star
                                  className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive
                                      ? "text-primary fill-primary"
                                      : "text-muted-foreground hover:text-primary hover:fill-primary"
                                  )}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <Textarea
                        value={reviewDrafts[repair.id]?.comment ?? ""}
                        onChange={(event) => handleReviewCommentChange(repair.id, event.target.value)}
                        placeholder="Dodaj krótki komentarz (opcjonalnie)"
                        rows={3}
                        className="font-sans"
                      />
                      <div className="flex items-center justify-between gap-3">
                        {reviewByRepairId.get(repair.id) ? (
                          <p className="text-xs text-muted-foreground">
                            Możesz edytować swoją opinię w dowolnym momencie.
                          </p>
                        ) : (
                          <span />
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewSubmit(repair.id)}
                          disabled={submittingReviewId === repair.id}
                        >
                          {submittingReviewId === repair.id
                            ? "Zapisywanie..."
                            : reviewByRepairId.get(repair.id)
                            ? "Aktualizuj ocenę"
                            : "Zapisz ocenę"}
                        </Button>
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Poprzednia
              </Button>
              <span className="text-sm text-muted-foreground">
                Strona {currentPage} z {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
              >
                Następna
              </Button>
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
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="hero">
              <Link to="/czat-wsparcia">Czat na ¾ywo</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/kontakt">Kontakt z obsˆug¥</Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EquipmentPickup;


