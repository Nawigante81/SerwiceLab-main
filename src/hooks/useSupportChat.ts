import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Database } from "@/integrations/supabase/types";

type SupportThread = Database["public"]["Tables"]["support_threads"]["Row"];
type SupportMessage = Database["public"]["Tables"]["support_messages"]["Row"];
type SupportMessageInsert = Database["public"]["Tables"]["support_messages"]["Insert"];

export const useSupportThread = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["support_thread", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("support_threads")
        .upsert(
          { user_id: user.id },
          { onConflict: "user_id", ignoreDuplicates: false }
        )
        .select()
        .single();

      if (error) throw error;
      return data as SupportThread;
    },
    enabled: !!user,
    staleTime: 30 * 1000,
  });
};

export const useSupportMessages = (threadId: string | null) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["support_messages", threadId],
    queryFn: async () => {
      if (!user || !threadId) return [];

      const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as SupportMessage[];
    },
    enabled: !!user && !!threadId,
  });
};

export const useCreateSupportMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: SupportMessageInsert) => {
      const { data, error } = await supabase
        .from("support_messages")
        .insert(message)
        .select()
        .single();

      if (error) throw error;
      return data as SupportMessage;
    },
    onSuccess: (message) => {
      queryClient.setQueryData<SupportMessage[]>(
        ["support_messages", message.thread_id],
        (prev) => (prev ? [...prev, message] : [message])
      );
      queryClient.invalidateQueries({ queryKey: ["support_thread"] });
    },
  });
};
