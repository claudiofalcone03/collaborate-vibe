import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserLikes } from "@/hooks/useContents";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useLikes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: likedSet } = useUserLikes(user?.id);

  const isLiked = (id: string) => likedSet?.has(id) ?? false;

  const mutation = useMutation({
    mutationFn: async (contentId: string) => {
      if (!user) throw new Error("not-authenticated");
      const liked = likedSet?.has(contentId);
      if (liked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("content_id", contentId);
        if (error) throw error;
        return { liked: false };
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ user_id: user.id, content_id: contentId });
        if (error) throw error;
        return { liked: true };
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["likes", user?.id] });
      qc.invalidateQueries({ queryKey: ["contents"] });
    },
    onError: (e: Error) => {
      if (e.message === "not-authenticated") {
        toast({ title: "Sign in to like content", variant: "destructive" });
        navigate("/auth");
      } else {
        toast({ title: "Could not update like", description: e.message, variant: "destructive" });
      }
    },
  });

  const toggleLike = (id: string) => {
    if (!user) {
      toast({ title: "Sign in to like content", variant: "destructive" });
      navigate("/auth");
      return;
    }
    mutation.mutate(id);
  };

  return { isLiked, toggleLike };
};
