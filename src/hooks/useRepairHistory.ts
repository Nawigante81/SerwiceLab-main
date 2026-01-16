import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Database } from "@/integrations/supabase/types";

type RepairStatusHistory = Database["public"]["Tables"]["repair_status_history"]["Row"];

export const useRepairStatusHistory = (repairId: string | null) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["repair_status_history", repairId],
    queryFn: async () => {
      if (!user || !repairId) return [];

      const { data, error } = await supabase
        .from("repair_status_history")
        .select("*")
        .eq("repair_id", repairId)
        .order("changed_at", { ascending: true });

      if (error) throw error;
      return data as RepairStatusHistory[];
    },
    enabled: !!user && !!repairId,
  });
};
