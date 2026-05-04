import { useState } from "react";
import { Lightbulb, Music, ArrowLeft, Send, X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ALL_SKILLS, GENRES, currentUser, type ProjectContent, type MusicContent } from "@/data/mockData";
import { addContent } from "@/data/contentStore";
import { useToast } from "@/hooks/use-toast";

type ContentChoice = null | "project" | "music";
const MODELS = ["Equity", "Paid", "Volunteer"] as const;

const Publish = () => {
  const [choice, setChoice] = useState<ContentChoice>(null);

  if (!choice) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-6">
        <h1 className="mb-1 text-2xl font-bold text-foreground">Publish</h1>
        <p className="mb-8 text-sm text-muted-foreground">What kind of content are you sharing?</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => setChoice("project")}
            className="glass group flex flex-col items-start gap-3 rounded-xl p-6 text-left transition-all hover:border-primary/40"
          >
            <div className="rounded-lg bg-primary/15 p-3 text-primary">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Project / Startup Idea</h3>
            <p className="text-sm text-muted-foreground">Describe your vision and find collaborators to build it.</p>
          </button>
          <button
            onClick={() => setChoice("music")}
            className="glass group flex flex-col items-start gap-3 rounded-xl p-6 text-left transition-all hover:border-primary/40"
          >
            <div className="rounded-lg bg-primary/15 p-3 text-primary">
              <Music className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Music Content</h3>
            <p className="text-sm text-muted-foreground">Upload an audio track and share it with the community.</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-6">
      <button onClick={() => setChoice(null)} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Change type
      </button>
      {choice === "project" ? <ProjectForm /> : <MusicForm />}
    </div>
  );
};

const ProjectForm = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [vision, setVision] = useState("");
  const [objectives, setObjectives] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [model, setModel] = useState<typeof MODELS[number]>("Equity");
  const [stage, setStage] = useState<ProjectContent["stage"]>("Idea");
  const [showSkillPicker, setShowSkillPicker] = useState(false);

  const toggleSkill = (s: string) =>
    setSelectedSkills((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !vision) {
      toast({ title: "Missing fields", description: "Project name and vision are required.", variant: "destructive" });
      return;
    }
    const content: ProjectContent = {
      id: `up-${Date.now()}`,
      contentType: "project",
      title: name,
      description: objectives || vision,
      vision,
      skills: selectedSkills,
      stage,
      model,
      creator: currentUser.name,
      creatorAvatar: currentUser.avatar,
      applicants: 0,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    addContent(content);
    toast({ title: "Idea published! 🚀", description: `"${name}" is now live on the feed.` });
    setName(""); setVision(""); setObjectives(""); setSelectedSkills([]); setModel("Equity"); setStage("Idea");
  };

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-foreground">Publish an Idea</h1>
      <p className="mb-8 text-sm text-muted-foreground">Share your vision and find the team to build it.</p>
      <form onSubmit={submit} className="space-y-6">
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input id="name" placeholder="e.g. EcoTrack" className="mt-1.5 bg-secondary border-border" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="vision">Vision</Label>
          <Textarea id="vision" placeholder="Describe the big picture..." className="mt-1.5 min-h-[120px] bg-secondary border-border" value={vision} onChange={(e) => setVision(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="obj">Objectives</Label>
          <Textarea id="obj" placeholder="Key milestones and goals..." className="mt-1.5 bg-secondary border-border" value={objectives} onChange={(e) => setObjectives(e.target.value)} />
        </div>
        <div>
          <Label>Required Skills</Label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {selectedSkills.map((s) => (
              <Badge key={s} className="cursor-pointer gap-1" onClick={() => toggleSkill(s)}>
                {s} <X className="h-3 w-3" />
              </Badge>
            ))}
            <button type="button" className="rounded-full border border-dashed border-border px-3 py-0.5 text-xs text-muted-foreground hover:border-primary hover:text-primary" onClick={() => setShowSkillPicker(!showSkillPicker)}>
              + Add Skill
            </button>
          </div>
          {showSkillPicker && (
            <div className="mt-2 flex flex-wrap gap-1.5 rounded-lg border border-border bg-secondary p-3">
              {ALL_SKILLS.filter((s) => !selectedSkills.includes(s)).map((s) => (
                <button type="button" key={s} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary" onClick={() => toggleSkill(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <Label>Stage</Label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {(["Idea", "MVP", "Growth", "Scaling"] as const).map((s) => (
              <button type="button" key={s} onClick={() => setStage(s)} className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${stage === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground"}`}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <Label>Collaborative Model</Label>
          <div className="mt-1.5 flex gap-3">
            {MODELS.map((m) => (
              <button type="button" key={m} onClick={() => setModel(m)} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${model === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground"}`}>{m}</button>
            ))}
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full gap-2 glow">
          <Send className="h-4 w-4" /> Publish Idea
        </Button>
      </form>
    </>
  );
};

const MusicForm = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState<string>("Lo-fi");
  const [creator, setCreator] = useState(currentUser.name);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/audio\/(mpeg|wav|x-wav|mp3)/.test(f.type) && !/\.(mp3|wav)$/i.test(f.name)) {
      toast({ title: "Unsupported file", description: "Please upload an MP3 or WAV file.", variant: "destructive" });
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum size is 20MB.", variant: "destructive" });
      return;
    }
    setAudioUrl(URL.createObjectURL(f));
    setFileName(f.name);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !audioUrl) {
      toast({ title: "Missing fields", description: "Title, description, and audio file are required.", variant: "destructive" });
      return;
    }
    const gradients = ["from-fuchsia-500 to-indigo-600", "from-amber-400 to-rose-500", "from-cyan-400 to-blue-700", "from-pink-500 to-purple-700"];
    const content: MusicContent = {
      id: `um-${Date.now()}`,
      contentType: "music",
      title,
      description,
      genre,
      creator: creator || currentUser.name,
      creatorAvatar: (creator || currentUser.name).slice(0, 2).toUpperCase(),
      audioUrl,
      coverGradient: gradients[Math.floor(Math.random() * gradients.length)],
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    addContent(content);
    toast({ title: "Track published! 🎵", description: `"${title}" is now live on the feed.` });
    setTitle(""); setDescription(""); setGenre("Lo-fi"); setAudioUrl(""); setFileName("");
  };

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-foreground">Upload Music</h1>
      <p className="mb-8 text-sm text-muted-foreground">Share a track with the VETRA community.</p>
      <form onSubmit={submit} className="space-y-6">
        <div>
          <Label htmlFor="m-title">Title</Label>
          <Input id="m-title" placeholder="e.g. Midnight Circuits" className="mt-1.5 bg-secondary border-border" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="m-desc">Description</Label>
          <Textarea id="m-desc" placeholder="What's the vibe?" className="mt-1.5 bg-secondary border-border" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="m-creator">Creator name</Label>
          <Input id="m-creator" className="mt-1.5 bg-secondary border-border" value={creator} onChange={(e) => setCreator(e.target.value)} />
        </div>
        <div>
          <Label>Genre</Label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button type="button" key={g} onClick={() => setGenre(g)} className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${genre === g ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground"}`}>{g}</button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="m-file">Audio file (MP3 / WAV, ≤20MB)</Label>
          <label htmlFor="m-file" className="mt-1.5 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-secondary px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <Upload className="h-5 w-5" />
            <span>{fileName || "Click to choose an audio file"}</span>
          </label>
          <input id="m-file" type="file" accept="audio/mpeg,audio/wav,audio/mp3,.mp3,.wav" className="hidden" onChange={onFile} />
          {audioUrl && <audio controls src={audioUrl} className="mt-3 w-full" />}
        </div>
        <Button type="submit" size="lg" className="w-full gap-2 glow">
          <Send className="h-4 w-4" /> Publish Track
        </Button>
      </form>
    </>
  );
};

export default Publish;
