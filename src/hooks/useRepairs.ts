import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Database } from "@/integrations/supabase/types";

type Repair = Database["public"]["Tables"]["repairs"]["Row"];
type RepairInsert = Database["public"]["Tables"]["repairs"]["Insert"];
type RepairStatus = Repair["status"];

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
        .is("archived_at", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Repair[];
    },
    enabled: !!user,
  });
};

export const useRepairsStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["repairs", "stats", user?.id],
    queryFn: async () => {
      if (!user) {
        return {
          totalCount: 0,
          activeCount: 0,
          completedCount: 0,
          waitingEstimateCount: 0,
        };
      }

      const baseQuery = () =>
        supabase
          .from("repairs")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .is("archived_at", null);

      const [totalRes, activeRes, completedRes, waitingRes] = await Promise.all([
        baseQuery(),
        baseQuery().not("status", "in", "(completed,delivered)"),
        baseQuery().in("status", ["completed", "delivered"]),
        baseQuery().eq("status", "waiting_estimate"),
      ]);

      if (totalRes.error) throw totalRes.error;
      if (activeRes.error) throw activeRes.error;
      if (completedRes.error) throw completedRes.error;
      if (waitingRes.error) throw waitingRes.error;

      return {
        totalCount: totalRes.count ?? 0,
        activeCount: activeRes.count ?? 0,
        completedCount: completedRes.count ?? 0,
        waitingEstimateCount: waitingRes.count ?? 0,
      };
    },
    enabled: !!user,
  });
};

export const useRepairsPaginated = ({
  page,
  pageSize,
  searchQuery,
  statusIn,
  select = "id, device_brand, device_model, status",
  includeArchived = false,
  orderBy = "created_at",
  ascending = false,
}: {
  page: number;
  pageSize: number;
  searchQuery?: string;
  statusIn?: RepairStatus[];
  select?: string;
  includeArchived?: boolean;
  orderBy?: "created_at" | "updated_at";
  ascending?: boolean;
}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [
      "repairs",
      "paginated",
      user?.id,
      page,
      pageSize,
      searchQuery,
      statusIn,
      select,
      includeArchived,
      orderBy,
      ascending,
    ],
    queryFn: async () => {
      if (!user) return { data: [], count: 0 };

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const normalizedQuery = searchQuery?.trim();

      let query = supabase
        .from("repairs")
        .select(select, { count: "exact" })
        .eq("user_id", user.id)
        .order(orderBy, { ascending })
        .range(from, to);

      if (!includeArchived) {
        query = query.is("archived_at", null);
      }

      if (statusIn?.length) {
        query = query.in("status", statusIn);
      }

      if (normalizedQuery) {
        const like = `%${normalizedQuery}%`;
        query = query.or(
          `id.ilike.${like},device_brand.ilike.${like},device_model.ilike.${like},tracking_number_outbound.ilike.${like}`
        );
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { data: (data ?? []) as Repair[], count: count ?? 0 };
    },
    enabled: !!user,
    placeholderData: (previous) => previous ?? { data: [], count: 0 },
  });
};

export const useRepairByStatus = (status: RepairStatus | null) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["repair", "status", user?.id, status],
    queryFn: async () => {
      if (!user || !status) return null;

      const { data, error } = await supabase
        .from("repairs")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", status)
        .is("archived_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as Repair | null;
    },
    enabled: !!user && !!status,
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
        .is("archived_at", null)
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
