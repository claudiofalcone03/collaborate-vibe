import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Status = Database["public"]["Enums"]["request_status"];
type Role = Database["public"]["Enums"]["collaboration_role"];

export interface CollabRequestRow {
  id: string;
  sender_id: string;
  receiver_id: string;
  content_id: string;
  message: string;
  role: Role;
  portfolio_url: string | null;
  status: Status;
  created_at: string;
  sender?: { username: string } | null;
  receiver?: { username: string } | null;
  content?: { title: string; content_type: "music" | "project" } | null;
}

export const useIncomingRequests = (userId: string | undefined) =>
  useQuery({
    queryKey: ["collab-incoming", userId],
    enabled: !!userId,
    queryFn: async (): Promise<CollabRequestRow[]> => {
      const { data, error } = await supabase
        .from("collaboration_requests")
        .select(
          "*, sender:profiles!collaboration_requests_sender_id_fkey(username), content:contents!collaboration_requests_content_id_fkey(title, content_type)"
        )
        .eq("receiver_id", userId!)
        .order("created_at", { ascending: false });
      // Foreign key embed names above may not exist; fall back to two queries if needed.
      if (error) {
        const fallback = await supabase
          .from("collaboration_requests")
          .select("*")
          .eq("receiver_id", userId!)
          .order("created_at", { ascending: false });
        if (fallback.error) throw fallback.error;
        return await enrich(fallback.data ?? []);
      }
      return (data ?? []) as unknown as CollabRequestRow[];
    },
  });

export const useOutgoingRequests = (userId: string | undefined) =>
  useQuery({
    queryKey: ["collab-outgoing", userId],
    enabled: !!userId,
    queryFn: async (): Promise<CollabRequestRow[]> => {
      const { data, error } = await supabase
        .from("collaboration_requests")
        .select("*")
        .eq("sender_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return await enrich(data ?? [], "receiver");
    },
  });

async function enrich(rows: any[], side: "sender" | "receiver" = "sender"): Promise<CollabRequestRow[]> {
  if (rows.length === 0) return [];
  const userIds = Array.from(new Set(rows.map((r) => (side === "sender" ? r.sender_id : r.receiver_id))));
  const contentIds = Array.from(new Set(rows.map((r) => r.content_id)));
  const [{ data: profiles }, { data: contents }] = await Promise.all([
    supabase.from("profiles").select("id, username").in("id", userIds),
    supabase.from("contents").select("id, title, content_type").in("id", contentIds),
  ]);
  const pMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const cMap = new Map((contents ?? []).map((c) => [c.id, c]));
  return rows.map((r) => ({
    ...r,
    [side]: pMap.get(side === "sender" ? r.sender_id : r.receiver_id) ?? null,
    content: cMap.get(r.content_id) ?? null,
  })) as CollabRequestRow[];
}

export const useUpdateRequestStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase
        .from("collaboration_requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["collab-incoming"] });
      qc.invalidateQueries({ queryKey: ["collab-outgoing"] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
