import { Heart } from "lucide-react";
import { useLikes } from "@/hooks/useLikes";
import { cn } from "@/lib/utils";

interface Props {
  contentId: string;
  count: number;
  className?: string;
}

export const LikeButton = ({ contentId, count, className }: Props) => {
  const { isLiked, toggleLike } = useLikes();
  const liked = isLiked(contentId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLike(contentId);
      }}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium transition-colors",
        liked
          ? "border-primary/40 bg-primary/10 text-primary"
          : "text-muted-foreground hover:border-primary/40 hover:text-primary",
        className,
      )}
    >
      <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
      <span>{count}</span>
    </button>
  );
};
