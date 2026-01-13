import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Database } from "@/integrations/supabase/types";

type CostEstimate = Database["public"]["Tables"]["cost_estimates"]["Row"];

export const useCostEstimates = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["cost_estimates", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("cost_estimates")
        .select(`
          *,
          repairs!inner(user_id)
        `)
        .eq("repairs.user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as (CostEstimate & { repairs: { user_id: string } })[];
    },
    enabled: !!user,
  });
};

export const useCostEstimateByRepairId = (repairId: string | null) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["cost_estimate", repairId],
    queryFn: async () => {
      if (!repairId || !user) return null;
      
      const { data, error } = await supabase
        .from("cost_estimates")
        .select("*")
        .eq("repair_id", repairId)
        .maybeSingle();

      if (error) throw error;
      return data as CostEstimate | null;
    },
    enabled: !!repairId && !!user,
  });
};

export const useAcceptEstimate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (estimateId: string) => {
      const { data, error } = await supabase
        .from("cost_estimates")
        .update({
          status: "accepted" as const,
          accepted_at: new Date().toISOString(),
        })
        .eq("id", estimateId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cost_estimates"] });
      queryClient.invalidateQueries({ queryKey: ["repairs"] });
    },
  });
};

export const useRejectEstimate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (estimateId: string) => {
      const { data, error } = await supabase
        .from("cost_estimates")
        .update({
          status: "rejected" as const,
        })
        .eq("id", estimateId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cost_estimates"] });
      queryClient.invalidateQueries({ queryKey: ["repairs"] });
    },
  });
};
