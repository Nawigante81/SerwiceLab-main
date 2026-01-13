import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Database } from "@/integrations/supabase/types";

type Repair = Database["public"]["Tables"]["repairs"]["Row"];
type RepairInsert = Database["public"]["Tables"]["repairs"]["Insert"];

export const useRepairs = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["repairs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("repairs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Repair[];
    },
    enabled: !!user,
  });
};

export const useRepairById = (repairId: string | null) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["repair", repairId],
    queryFn: async () => {
      if (!repairId || !user) return null;
      
      const { data, error } = await supabase
        .from("repairs")
        .select("*")
        .eq("id", repairId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Repair | null;
    },
    enabled: !!repairId && !!user,
  });
};

export const useCreateRepair = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (repair: Omit<RepairInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("repairs")
        .insert({
          ...repair,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairs"] });
    },
  });
};

export const useUpdateRepair = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Repair> & { id: string }) => {
      const { data, error } = await supabase
        .from("repairs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairs"] });
    },
  });
};
