import { Database } from "@/integrations/supabase/types";

export type RepairStatus = Database["public"]["Enums"]["repair_status"];
export type ShippingMethod = Database["public"]["Enums"]["shipping_method"];

export const repairStatusLabels: Record<RepairStatus, string> = {
  pending: "Oczekuje",
  received: "Odebrano w serwisie",
  diagnosing: "W diagnozie",
  waiting_estimate: "Oczekuje na akceptację",
  in_repair: "W naprawie",
  completed: "Naprawa zakończona",
  shipped: "Wysłano do klienta",
  delivered: "Dostarczono",
};

export const allStatuses: RepairStatus[] = [
  "pending",
  "received",
  "diagnosing",
  "waiting_estimate",
  "in_repair",
  "completed",
  "shipped",
  "delivered",
];

export const statusColors: Record<RepairStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-500",
  received: "bg-blue-500/20 text-blue-500",
  diagnosing: "bg-purple-500/20 text-purple-500",
  waiting_estimate: "bg-orange-500/20 text-orange-500",
  in_repair: "bg-primary/20 text-primary",
  completed: "bg-green-500/20 text-green-500",
  shipped: "bg-blue-500/20 text-blue-500",
  delivered: "bg-green-500/20 text-green-500",
};

export const getTrackingUrl = (
  trackingNumber: string,
  shippingMethod?: ShippingMethod | null,
) => {
  const number = encodeURIComponent(trackingNumber);
  if (shippingMethod === "dpd") {
    return `https://tracktrace.dpd.com.pl/parcelDetails?query=${number}`;
  }
  return `https://inpost.pl/sledzenie-przesylek?number=${number}`;
};
