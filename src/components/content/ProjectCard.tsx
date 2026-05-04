import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/LikeButton";
import type { ProjectContent } from "@/data/mockData";

const stageColors: Record<string, string> = {
  Idea: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  MVP: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Growth: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Scaling: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export const ProjectCard = ({ project, isTop }: { project: ProjectContent; isTop?: boolean }) => (
  <div className="glass group relative flex flex-col rounded-xl p-5 transition-all duration-150 hover:border-primary/30">
    {isTop && (
      <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-lg">
        <Trophy className="h-3 w-3" /> Top
      </div>
    )}
    <div className="mb-3 flex items-center justify-between">
      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${stageColors[project.stage]}`}>{project.stage}</span>
      <span className="text-xs text-muted-foreground">{project.applicants} applicants</span>
    </div>
    <h3 className="mb-1 text-lg font-semibold text-foreground">{project.title}</h3>
    <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
    <div className="mb-4 flex flex-wrap gap-1.5">
      {project.skills.map((s) => (
        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
      ))}
    </div>
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
          {project.creatorAvatar}
        </div>
        <span className="truncate text-xs text-muted-foreground">{project.creator}</span>
      </div>
      <div className="flex items-center gap-2">
        <LikeButton content={project} />
        <Button size="sm" className="h-8 text-xs">Apply</Button>
      </div>
    </div>
  </div>
);
