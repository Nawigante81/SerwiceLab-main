import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Database } from "@/integrations/supabase/types";

type RepairReview = Database["public"]["Tables"]["repair_reviews"]["Row"];
type RepairReviewInsert = Database["public"]["Tables"]["repair_reviews"]["Insert"];

export const useRepairReviews = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["repair_reviews", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("repair_reviews")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RepairReview[];
    },
    enabled: !!user,
  });
};

export const useCreateRepairReview = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (review: Omit<RepairReviewInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("repair_reviews")
        .insert({
          ...review,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as RepairReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repair_reviews"] });
    },
  });
};

export const useUpdateRepairReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RepairReview> & { id: string }) => {
      const { data, error } = await supabase
        .from("repair_reviews")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as RepairReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repair_reviews"] });
    },
  });
};
