import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ConversationRow {
  id: string;
  user_a: string;
  user_b: string;
  content_id: string | null;
  created_at: string;
  other?: { id: string; username: string } | null;
  content?: { title: string } | null;
  last_message?: string | null;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export const useConversations = (userId: string | undefined) =>
  useQuery({
    queryKey: ["conversations", userId],
    enabled: !!userId,
    queryFn: async (): Promise<ConversationRow[]> => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`user_a.eq.${userId},user_b.eq.${userId}`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = data ?? [];
      if (rows.length === 0) return [];
      const otherIds = Array.from(
        new Set(rows.map((r) => (r.user_a === userId ? r.user_b : r.user_a)))
      );
      const contentIds = Array.from(
        new Set(rows.map((r) => r.content_id).filter((x): x is string => !!x))
      );
      const [{ data: profiles }, { data: contents }] = await Promise.all([
        supabase.from("profiles").select("id, username").in("id", otherIds),
        contentIds.length
          ? supabase.from("contents").select("id, title").in("id", contentIds)
          : Promise.resolve({ data: [] as { id: string; title: string }[] }),
      ]);
      const pMap = new Map((profiles ?? []).map((p) => [p.id, p]));
      const cMap = new Map((contents ?? []).map((c) => [c.id, c]));
      return rows.map((r) => ({
        ...r,
        other: pMap.get(r.user_a === userId ? r.user_b : r.user_a) ?? null,
        content: r.content_id ? cMap.get(r.content_id) ?? null : null,
      }));
    },
  });

export const useMessages = (conversationId: string | undefined) => {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["messages", conversationId],
    enabled: !!conversationId,
    queryFn: async (): Promise<MessageRow[]> => {
      const { data, error } = await supabase
        .from("conversation_messages")
        .select("*")
        .eq("conversation_id", conversationId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversation_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          qc.setQueryData<MessageRow[]>(["messages", conversationId], (prev) => {
            const next = prev ?? [];
            if (next.some((m) => m.id === (payload.new as MessageRow).id)) return next;
            return [...next, payload.new as MessageRow];
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, qc]);

  return query;
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async ({
      conversationId,
      senderId,
      body,
    }: {
      conversationId: string;
      senderId: string;
      body: string;
    }) => {
      const { error } = await supabase
        .from("conversation_messages")
        .insert({ conversation_id: conversationId, sender_id: senderId, body });
      if (error) throw error;
    },
  });
};
