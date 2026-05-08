import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ContentRow {
  id: string;
  owner_id: string;
  content_type: "music" | "project";
  title: string;
  description: string | null;
  audio_url: string | null;
  image_url: string | null;
  vision: string | null;
  skills: string[] | null;
  stage: string | null;
  model: string | null;
  genre: string | null;
  likes_count: number;
  created_at: string;
  profiles: { username: string; profile_type: string; avatar_url: string | null } | null;
}

export const useContents = () =>
  useQuery({
    queryKey: ["contents"],
    queryFn: async (): Promise<ContentRow[]> => {
      const { data, error } = await supabase
        .from("contents")
        .select("*, profiles:owner_id(username, profile_type, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as unknown as ContentRow[];
    },
  });

export const useUserLikes = (userId: string | undefined) =>
  useQuery({
    queryKey: ["likes", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Set<string>> => {
      const { data, error } = await supabase
        .from("likes")
        .select("content_id")
        .eq("user_id", userId!);
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.content_id as string));
    },
  });
