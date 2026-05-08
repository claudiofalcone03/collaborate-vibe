import { useMemo, useState } from "react";
import { Search, Filter, ChevronDown, ArrowUpDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_SKILLS, STAGES } from "@/data/mockData";
import { useContents } from "@/hooks/useContents";
import { ProjectCard } from "@/components/content/ProjectCard";
import { MusicCard } from "@/components/content/MusicCard";
import { cn } from "@/lib/utils";

type Tab = "all" | "project" | "music";
type Sort = "top" | "recent";

const Dashboard = () => {
  const { data: contents = [], isLoading } = useContents();
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
    const list = contents.filter((c) => {
      if (tab !== "all" && c.content_type !== tab) return false;
      if (q && !c.title.toLowerCase().includes(q) && !(c.description ?? "").toLowerCase().includes(q)) return false;
      if (c.content_type === "project") {
        if (skillFilter && !(c.skills ?? []).includes(skillFilter)) return false;
        if (stageFilter && c.stage !== stageFilter) return false;
      } else if (skillFilter || stageFilter) {
        return tab === "project";
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "top") {
        const diff = b.likes_count - a.likes_count;
        if (diff !== 0) return diff;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [contents, tab, search, skillFilter, stageFilter, sort]);

  const trending = useMemo(
    () =>
      [...contents]
        .filter((c) => (tab === "all" ? true : c.content_type === tab))
        .sort((a, b) => b.likes_count - a.likes_count)
        .slice(0, 3),
    [contents, tab],
  );

  const showProjectFilters = tab !== "music";
  const showSections = tab === "all" && !search && !skillFilter && !stageFilter;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Discover</h1>
        <p className="text-sm text-muted-foreground">Top ideas and tracks from the community</p>
      </div>

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

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="border-border bg-secondary pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="relative">
          <Button variant="outline" className="gap-2" onClick={() => { setShowSort(!showSort); setShowSkills(false); setShowStages(false); }}>
            <ArrowUpDown className="h-4 w-4" /> {sort === "top" ? "Trending" : "Latest"} <ChevronDown className="h-3 w-3" />
          </Button>
          {showSort && (
            <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-border bg-card p-1 shadow-xl">
              <button className="w-full rounded px-3 py-1.5 text-left text-sm text-foreground hover:bg-accent" onClick={() => { setSort("top"); setShowSort(false); }}>Trending (likes)</button>
              <button className="w-full rounded px-3 py-1.5 text-left text-sm text-foreground hover:bg-accent" onClick={() => { setSort("recent"); setShowSort(false); }}>Latest</button>
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

      {isLoading ? (
        <div className="flex justify-center py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          {showSections && trending.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Trending</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {trending.map((c, i) =>
                  c.content_type === "project" ? (
                    <ProjectCard key={c.id} project={c} isTop={i === 0} />
                  ) : (
                    <MusicCard key={c.id} track={c} isTop={i === 0} />
                  ),
                )}
              </div>
            </section>
          )}

          {showSections && (
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Latest</h2>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((c, i) =>
              c.content_type === "project" ? (
                <ProjectCard key={c.id} project={c} isTop={!showSections && sort === "top" && i === 0} />
              ) : (
                <MusicCard key={c.id} track={c} isTop={!showSections && sort === "top" && i === 0} />
              ),
            )}
            {visible.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                No content yet — be the first to publish!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
