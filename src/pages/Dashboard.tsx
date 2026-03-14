import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projects, ALL_SKILLS, STAGES, type Project } from "@/data/mockData";

const stageColors: Record<string, string> = {
  Idea: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  MVP: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Growth: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Scaling: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState<string>("");
  const [stageFilter, setStageFilter] = useState<string>("");
  const [showSkills, setShowSkills] = useState(false);
  const [showStages, setShowStages] = useState(false);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      const matchSkill = !skillFilter || p.skills.includes(skillFilter);
      const matchStage = !stageFilter || p.stage === stageFilter;
      return matchSearch && matchSkill && matchStage;
    });
  }, [search, skillFilter, stageFilter]);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Project Feed</h1>
        <p className="text-sm text-muted-foreground">Discover projects that match your skills</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-10 bg-secondary border-border" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <Button variant="outline" className="gap-2" onClick={() => { setShowSkills(!showSkills); setShowStages(false); }}>
            <Filter className="h-4 w-4" /> {skillFilter || "Skill"} <ChevronDown className="h-3 w-3" />
          </Button>
          {showSkills && (
            <div className="absolute right-0 top-full z-50 mt-1 max-h-60 w-48 overflow-auto rounded-lg border border-border bg-card p-1 shadow-xl">
              <button className="w-full rounded px-3 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent" onClick={() => { setSkillFilter(""); setShowSkills(false); }}>All Skills</button>
              {ALL_SKILLS.map((s) => (
                <button key={s} className="w-full rounded px-3 py-1.5 text-left text-sm text-foreground hover:bg-accent" onClick={() => { setSkillFilter(s); setShowSkills(false); }}>{s}</button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <Button variant="outline" className="gap-2" onClick={() => { setShowStages(!showStages); setShowSkills(false); }}>
            {stageFilter || "Stage"} <ChevronDown className="h-3 w-3" />
          </Button>
          {showStages && (
            <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-border bg-card p-1 shadow-xl">
              <button className="w-full rounded px-3 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent" onClick={() => { setStageFilter(""); setShowStages(false); }}>All Stages</button>
              {STAGES.map((s) => (
                <button key={s} className="w-full rounded px-3 py-1.5 text-left text-sm text-foreground hover:bg-accent" onClick={() => { setStageFilter(s); setShowStages(false); }}>{s}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted-foreground">No projects match your filters.</div>
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({ project }: { project: Project }) => (
  <div className="glass group flex flex-col rounded-xl p-5 transition-all duration-150 hover:border-primary/30">
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
          {project.ownerAvatar}
        </div>
        <span className="text-xs text-muted-foreground">{project.owner}</span>
      </div>
      <Button size="sm" className="h-8 text-xs">Apply</Button>
    </div>
  </div>
);

export default Dashboard;
