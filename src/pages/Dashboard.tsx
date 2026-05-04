import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_SKILLS, STAGES } from "@/data/mockData";
import { useAllContent } from "@/data/contentStore";
import { useLikes } from "@/hooks/useLikes";
import { ProjectCard } from "@/components/content/ProjectCard";
import { MusicCard } from "@/components/content/MusicCard";
import { cn } from "@/lib/utils";

type Tab = "all" | "project" | "music";
type Sort = "top" | "recent";

const Dashboard = () => {
  const allContent = useAllContent();
  const { isLiked } = useLikes();
  const [tab, setTab] = useState<Tab>("all");
  const [sort, setSort] = useState<Sort>("top");
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState<string>("");
  const [stageFilter, setStageFilter] = useState<string>("");
  const [showSkills, setShowSkills] = useState(false);
  const [showStages, setShowStages] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    const list = allContent.filter((c) => {
      if (tab !== "all" && c.contentType !== tab) return false;
      if (q && !c.title.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false;
      if (c.contentType === "project") {
        if (skillFilter && !c.skills.includes(skillFilter)) return false;
        if (stageFilter && c.stage !== stageFilter) return false;
      } else if (tab === "all" && (skillFilter || stageFilter)) {
        return false;
      }
      return true;
    });

    const score = (id: string, baseLikes: number) => baseLikes + (isLiked(id) ? 1 : 0);

    return [...list].sort((a, b) => {
      if (sort === "top") {
        const diff = score(b.id, b.likes) - score(a.id, a.likes);
        if (diff !== 0) return diff;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [allContent, tab, search, skillFilter, stageFilter, sort, isLiked]);

  const showProjectFilters = tab !== "music";

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Discover</h1>
        <p className="text-sm text-muted-foreground">Top ideas and tracks from the community</p>
      </div>

      {/* Tabs */}
      <div className="mb-4 inline-flex rounded-lg border border-border bg-secondary p-1">
        {([
          { v: "all", label: "All" },
          { v: "project", label: "Projects" },
          { v: "music", label: "Music" },
        ] as const).map((t) => (
          <button
            key={t.v}
            onClick={() => setTab(t.v)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10 bg-secondary border-border" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="relative">
          <Button variant="outline" className="gap-2" onClick={() => { setShowSort(!showSort); setShowSkills(false); setShowStages(false); }}>
            <ArrowUpDown className="h-4 w-4" /> {sort === "top" ? "Top" : "Recent"} <ChevronDown className="h-3 w-3" />
          </Button>
          {showSort && (
            <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-border bg-card p-1 shadow-xl">
              <button className="w-full rounded px-3 py-1.5 text-left text-sm text-foreground hover:bg-accent" onClick={() => { setSort("top"); setShowSort(false); }}>Top (likes)</button>
              <button className="w-full rounded px-3 py-1.5 text-left text-sm text-foreground hover:bg-accent" onClick={() => { setSort("recent"); setShowSort(false); }}>Most Recent</button>
            </div>
          )}
        </div>

        {showProjectFilters && (
          <>
            <div className="relative">
              <Button variant="outline" className="gap-2" onClick={() => { setShowSkills(!showSkills); setShowStages(false); setShowSort(false); }}>
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
              <Button variant="outline" className="gap-2" onClick={() => { setShowStages(!showStages); setShowSkills(false); setShowSort(false); }}>
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
          </>
        )}
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((c, i) =>
          c.contentType === "project" ? (
            <ProjectCard key={c.id} project={c} isTop={sort === "top" && i === 0} />
          ) : (
            <MusicCard key={c.id} track={c} isTop={sort === "top" && i === 0} />
          ),
        )}
        {visible.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted-foreground">No content matches your filters.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
