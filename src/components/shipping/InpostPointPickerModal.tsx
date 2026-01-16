import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { InpostPoint } from "@/lib/inpost-types";
import { useIsMobile } from "@/hooks/use-mobile";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "@/lib/leaflet";

interface InpostPointPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  points: InpostPoint[];
  isLoading: boolean;
  selectedPoint?: InpostPoint | null;
  onSelectPoint: (point: InpostPoint) => void;
  onSearch: (query: string) => void;
  onFilterType: (type: "locker" | "partner" | "all") => void;
  activeType: "locker" | "partner" | "all";
  userLocation?: { lat: number; lng: number } | null;
}

const InpostPointPickerModal = ({
  open,
  onOpenChange,
  points,
  isLoading,
  selectedPoint,
  onSelectPoint,
  onSearch,
  onFilterType,
  activeType,
  userLocation,
}: InpostPointPickerModalProps) => {
  const isMobile = useIsMobile();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    const handler = setTimeout(() => {
      onSearch(query.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [query, onSearch, open]);

  const mapCenter = useMemo(() => {
    if (selectedPoint) return [selectedPoint.lat, selectedPoint.lng] as [number, number];
    if (userLocation) return [userLocation.lat, userLocation.lng] as [number, number];
    return points[0] ? ([points[0].lat, points[0].lng] as [number, number]) : ([52.2297, 21.0122] as [number, number]);
  }, [points, selectedPoint, userLocation]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden",
          isMobile && "w-screen h-screen max-w-none rounded-none"
        )}
      >
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="font-display text-xl">Wybierz punkt odbioru InPost</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-border p-4 space-y-4 overflow-y-auto">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Miasto, ulica, kod lub nazwa paczkomatu"
              className="font-sans"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={activeType === "all" ? "hero" : "outline"}
                size="sm"
                onClick={() => onFilterType("all")}
              >
                Wszystkie
              </Button>
              <Button
                type="button"
                variant={activeType === "locker" ? "hero" : "outline"}
                size="sm"
                onClick={() => onFilterType("locker")}
              >
                Paczkomat®
              </Button>
              <Button
                type="button"
                variant={activeType === "partner" ? "hero" : "outline"}
                size="sm"
                onClick={() => onFilterType("partner")}
              >
                PaczkoPunkt
              </Button>
            </div>

            {isLoading ? (
              <p className="text-sm text-muted-foreground">Wczytywanie punktów…</p>
            ) : (
              <div className="space-y-3">
                {points.map((point) => (
                  <button
                    key={point.point_id}
                    type="button"
                    onClick={() => onSelectPoint(point)}
                    className={cn(
                      "w-full text-left rounded-lg border p-3 transition-colors",
                      selectedPoint?.point_id === point.point_id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-sans font-medium text-foreground">{point.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{point.address}</p>
                      </div>
                      <Badge variant="outline">
                        {point.type === "locker" ? "Paczkomat®" : "PaczkoPunkt"}
                      </Badge>
                    </div>
                    {point.hours && (
                      <p className="text-xs text-muted-foreground mt-2">Godziny: {point.hours}</p>
                    )}
                  </button>
                ))}
                {points.length === 0 && (
                  <p className="text-sm text-muted-foreground">Brak punktów w tej lokalizacji.</p>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 h-full">
            <MapContainer center={mapCenter} zoom={13} className="h-full w-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {points.map((point) => (
                <Marker key={point.point_id} position={[point.lat, point.lng]}>
                  <Popup>
                    <div className="space-y-1">
                      <p className="font-sans font-medium">{point.name}</p>
                      <p className="text-xs text-muted-foreground">{point.address}</p>
                      <Button
                        type="button"
                        size="sm"
                        variant="hero"
                        className="mt-2"
                        onClick={() => onSelectPoint(point)}
                      >
                        Wybierz punkt
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InpostPointPickerModal;
