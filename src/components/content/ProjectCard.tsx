import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LikeButton } from "@/components/LikeButton";
import type { ContentRow } from "@/hooks/useContents";

const stageColors: Record<string, string> = {
  Idea: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  MVP: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Growth: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Scaling: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const initials = (s: string) => s.slice(0, 2).toUpperCase();

export const ProjectCard = ({ project, isTop }: { project: ContentRow; isTop?: boolean }) => {
  const creator = project.profiles?.username ?? "anonymous";
  const stage = project.stage ?? "Idea";
  return (
    <div className="glass group relative flex flex-col rounded-xl p-5 transition-all duration-150 hover:border-primary/30">
      {isTop && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-lg">
          <Trophy className="h-3 w-3" /> Top
        </div>
      )}
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${stageColors[stage] ?? stageColors.Idea}`}>{stage}</span>
        {project.model && <span className="text-xs text-muted-foreground">{project.model}</span>}
      </div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">{project.title}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
      {project.skills && project.skills.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.skills.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
            {initials(creator)}
          </div>
          <span className="truncate text-xs text-muted-foreground">@{creator}</span>
        </div>
        <LikeButton contentId={project.id} count={project.likes_count} />
      </div>
    </div>
  );
};
