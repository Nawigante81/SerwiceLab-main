import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useSupportMessages, useSupportThread, useCreateSupportMessage } from "@/hooks/useSupportChat";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { MessageCircle, Send } from "lucide-react";

type SupportMessage = Database["public"]["Tables"]["support_messages"]["Row"];

const SupportChat = () => {
  const { data: thread, isLoading: threadLoading } = useSupportThread();
  const { data: messages = [], isLoading: messagesLoading } = useSupportMessages(thread?.id ?? null);
  const createMessage = useCreateSupportMessage();
  const [draft, setDraft] = useState("");
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const isSending = createMessage.isPending;
  const isLoading = threadLoading || messagesLoading;
  const sortedMessages = useMemo(() => messages, [messages]);

  useEffect(() => {
    if (!thread?.id) return;

    const channel = supabase
      .channel(`support_messages_${thread.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `thread_id=eq.${thread.id}`,
        },
        (payload) => {
          const incoming = payload.new as SupportMessage;
          queryClient.setQueryData<SupportMessage[]>(
            ["support_messages", thread.id],
            (prev) => {
              if (!prev) return [incoming];
              if (prev.some((message) => message.id === incoming.id)) return prev;
              return [...prev, incoming];
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, thread?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages.length]);

  const handleSend = async () => {
    if (!thread?.id) return;
    const trimmed = draft.trim();
    if (!trimmed) return;

    try {
      await createMessage.mutateAsync({
        thread_id: thread.id,
        sender_role: "user",
        body: trimmed,
      });
      setDraft("");
    } catch {
      // Handled by toast in hooks/UI if needed.
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Czat wsparcia
          </h1>
          <p className="font-sans text-muted-foreground mt-1">
            Jesteśmy online i gotowi pomóc w Twojej sprawie.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground">Zespół ServiceLab</p>
              <p className="text-xs text-muted-foreground">Odpowiadamy najszybciej jak to możliwe</p>
            </div>
          </div>

          <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
            {isLoading && (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            )}

            {!isLoading && sortedMessages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground">
                Napisz pierwszą wiadomość, aby rozpocząć rozmowę.
              </div>
            )}

            {!isLoading && sortedMessages.map((message) => {
              const isUser = message.sender_role === "user";
              return (
                <div
                  key={message.id}
                  className={cn("flex", isUser ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.body}</p>
                    <p className={cn(
                      "text-[10px] mt-2",
                      isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {new Date(message.created_at).toLocaleTimeString("pl-PL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Opisz problem lub zadaj pytanie..."
                rows={3}
                className="font-sans"
              />
              <Button
                variant="hero"
                onClick={handleSend}
                disabled={isSending || !draft.trim() || !thread?.id}
                className="sm:self-end"
              >
                {isSending ? "Wysyłanie..." : (
                  <>
                    <Send className="w-4 h-4" />
                    Wyślij
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupportChat;
