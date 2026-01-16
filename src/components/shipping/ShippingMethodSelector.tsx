import { InpostMethod } from "@/lib/inpost-types";
import { cn } from "@/lib/utils";
import inpostLogo from "@/assets/inpost-logo.svg";
import { Package, Truck, CalendarDays } from "lucide-react";

interface ShippingMethodSelectorProps {
  methods: InpostMethod[];
  selected?: InpostMethod | null;
  onSelect: (method: InpostMethod) => void;
}

const getIcon = (method: InpostMethod) => {
  if (method.code.includes("weekend")) return CalendarDays;
  if (method.type === "courier") return Truck;
  return Package;
};

const formatPrice = (price: number) => `${price.toFixed(2)} zł`;

const ShippingMethodSelector = ({ methods, selected, onSelect }: ShippingMethodSelectorProps) => {
  const ordered = [...methods].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
  );

  return (
    <div className="space-y-3">
      {ordered.map((method) => {
        const Icon = getIcon(method);
        const isSelected = selected?.code === method.code;
        return (
          <button
            key={method.code}
            type="button"
            onClick={() => onSelect(method)}
            className={cn(
              "w-full flex items-center gap-4 rounded-xl border px-4 py-3 text-left transition-all",
              isSelected
                ? "border-primary bg-primary/5 shadow-[0_0_18px_hsl(82_100%_46%_/_0.2)]"
                : "border-border hover:border-primary/40 bg-card"
            )}
          >
            <img src={inpostLogo} alt="InPost" className="h-8 w-auto shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-sans font-medium text-foreground">{method.name}</p>
              <p className="font-sans text-xs text-muted-foreground mt-0.5">
                {method.eta}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-primary" />
              <span className="font-sans text-sm font-semibold text-foreground">
                {formatPrice(method.price_pln)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ShippingMethodSelector;
