import { Star, Briefcase, History, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { currentUser, projects } from "@/data/mockData";

const Profile = () => {
  const activeProjects = projects.filter((p) => currentUser.activeProjects.includes(p.id));

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      {/* Header */}
      <div className="glass mb-6 flex flex-col items-center gap-6 rounded-xl p-8 sm:flex-row sm:items-start">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-2xl font-bold text-primary">
          {currentUser.avatar}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-foreground">{currentUser.name}</h1>
          <p className="text-sm text-primary">{currentUser.role}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{currentUser.bio}</p>
        </div>
      </div>

      {/* Reputation */}
      <div className="glass mb-6 rounded-xl p-6">
        <div className="mb-4 flex items-center gap-2 text-foreground">
          <Award className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Reputation</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${currentUser.reputation * 2.64} 264`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">
              {currentUser.reputation}
            </div>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">{currentUser.completedTasks}</span> tasks completed</p>
            <p><span className="font-medium text-foreground">{currentUser.contributions.length}</span> project contributions</p>
            <p className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-400" /> Top 15% contributor</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="glass mb-6 rounded-xl p-6">
        <h2 className="mb-3 font-semibold text-foreground">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {currentUser.skills.map((s) => (
            <Badge key={s} variant="secondary">{s}</Badge>
          ))}
        </div>
      </div>

      {/* Active Projects */}
      <div className="glass mb-6 rounded-xl p-6">
        <div className="mb-3 flex items-center gap-2 text-foreground">
          <Briefcase className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Active Projects</h2>
        </div>
        <div className="space-y-3">
          {activeProjects.map((p) => (
            <div key={p.id} className="rounded-lg border border-border bg-secondary/50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{p.title}</span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{p.stage}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contributions */}
      <div className="glass rounded-xl p-6">
        <div className="mb-3 flex items-center gap-2 text-foreground">
          <History className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Past Contributions</h2>
        </div>
        <div className="space-y-2">
          {currentUser.contributions.map((c, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-3">
              <div>
                <span className="font-medium text-foreground">{c.project}</span>
                <span className="ml-2 text-sm text-muted-foreground">— {c.role}</span>
              </div>
              <span className="text-xs text-muted-foreground">{c.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
