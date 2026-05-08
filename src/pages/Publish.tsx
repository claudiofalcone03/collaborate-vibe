import { useState } from "react";
import { Lightbulb, Music, ArrowLeft, Send, X, Upload, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ALL_SKILLS, GENRES } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  projectContentSchema,
  musicContentSchema,
  AUDIO_MIMES,
  IMAGE_MIMES,
  MAX_AUDIO_SIZE,
  MAX_IMAGE_SIZE,
} from "@/lib/validation";

type ContentChoice = null | "project" | "music";
const MODELS = ["Equity", "Paid", "Volunteer"] as const;
type Stage = "Idea" | "MVP" | "Growth" | "Scaling";

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
            <p className="text-sm text-muted-foreground">Describe your vision and find collaborators.</p>
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
  const { user } = useAuth();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [vision, setVision] = useState("");
  const [objectives, setObjectives] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [model, setModel] = useState<typeof MODELS[number]>("Equity");
  const [stage, setStage] = useState<Stage>("Idea");
  const [showSkillPicker, setShowSkillPicker] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggleSkill = (s: string) =>
    setSelectedSkills((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = projectContentSchema.safeParse({
      title: name,
      description: objectives,
      vision,
      skills: selectedSkills,
      stage,
      model,
    });
    if (!parsed.success) {
      toast({ title: "Invalid input", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("contents").insert({
      owner_id: user.id,
      content_type: "project",
      title: parsed.data.title,
      description: parsed.data.description || parsed.data.vision,
      vision: parsed.data.vision,
      skills: parsed.data.skills ?? [],
      stage: parsed.data.stage,
      model: parsed.data.model,
    });
    setBusy(false);
    if (error) {
      toast({ title: "Could not publish", description: error.message, variant: "destructive" });
      return;
    }
    qc.invalidateQueries({ queryKey: ["contents"] });
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
          <Input id="name" placeholder="e.g. EcoTrack" className="mt-1.5 border-border bg-secondary" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="vision">Vision</Label>
          <Textarea id="vision" placeholder="Describe the big picture..." className="mt-1.5 min-h-[120px] border-border bg-secondary" value={vision} onChange={(e) => setVision(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="obj">Objectives</Label>
          <Textarea id="obj" placeholder="Key milestones and goals..." className="mt-1.5 border-border bg-secondary" value={objectives} onChange={(e) => setObjectives(e.target.value)} />
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
        <Button type="submit" size="lg" className="glow w-full gap-2" disabled={busy}>
          <Send className="h-4 w-4" /> {busy ? "Publishing..." : "Publish Idea"}
        </Button>
      </form>
    </>
  );
};

const MusicForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState<string>("Lo-fi");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const onAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!AUDIO_MIMES.includes(f.type) && !/\.(mp3|wav)$/i.test(f.name)) {
      toast({ title: "Unsupported file", description: "Please upload an MP3 or WAV file.", variant: "destructive" });
      return;
    }
    if (f.size > MAX_AUDIO_SIZE) {
      toast({ title: "File too large", description: "Maximum size is 20MB.", variant: "destructive" });
      return;
    }
    setAudioFile(f);
    setAudioPreview(URL.createObjectURL(f));
  };

  const onCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!IMAGE_MIMES.includes(f.type)) {
      toast({ title: "Unsupported image", description: "Use PNG, JPG, or WEBP.", variant: "destructive" });
      return;
    }
    if (f.size > MAX_IMAGE_SIZE) {
      toast({ title: "Image too large", description: "Maximum size is 5MB.", variant: "destructive" });
      return;
    }
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = musicContentSchema.safeParse({ title, description, genre });
    if (!parsed.success) {
      toast({ title: "Invalid input", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    if (!audioFile) {
      toast({ title: "Audio required", description: "Please attach an MP3 or WAV file.", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const audioPath = `${user.id}/${Date.now()}-${audioFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const audioUp = await supabase.storage.from("audio").upload(audioPath, audioFile, {
        contentType: audioFile.type || "audio/mpeg",
        cacheControl: "3600",
      });
      if (audioUp.error) throw audioUp.error;
      const { data: audioPublic } = supabase.storage.from("audio").getPublicUrl(audioPath);

      let imageUrl: string | null = null;
      if (coverFile) {
        const coverPath = `${user.id}/${Date.now()}-${coverFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const coverUp = await supabase.storage.from("covers").upload(coverPath, coverFile, {
          contentType: coverFile.type,
          cacheControl: "3600",
        });
        if (coverUp.error) throw coverUp.error;
        imageUrl = supabase.storage.from("covers").getPublicUrl(coverPath).data.publicUrl;
      }

      const { error } = await supabase.from("contents").insert({
        owner_id: user.id,
        content_type: "music",
        title: parsed.data.title,
        description: parsed.data.description,
        genre: parsed.data.genre,
        audio_url: audioPublic.publicUrl,
        image_url: imageUrl,
      });
      if (error) throw error;

      qc.invalidateQueries({ queryKey: ["contents"] });
      toast({ title: "Track published! 🎵", description: `"${title}" is now live on the feed.` });
      setTitle(""); setDescription(""); setGenre("Lo-fi"); setAudioFile(null); setAudioPreview(""); setCoverFile(null); setCoverPreview("");
    } catch (err) {
      const e = err as Error;
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-foreground">Upload Music</h1>
      <p className="mb-8 text-sm text-muted-foreground">Share a track with the VETRA community.</p>
      <form onSubmit={submit} className="space-y-6">
        <div>
          <Label htmlFor="m-title">Title</Label>
          <Input id="m-title" placeholder="e.g. Midnight Circuits" className="mt-1.5 border-border bg-secondary" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="m-desc">Description</Label>
          <Textarea id="m-desc" placeholder="What's the vibe?" className="mt-1.5 border-border bg-secondary" value={description} onChange={(e) => setDescription(e.target.value)} />
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
            <span>{audioFile?.name || "Click to choose an audio file"}</span>
          </label>
          <input id="m-file" type="file" accept="audio/mpeg,audio/wav,audio/mp3,.mp3,.wav" className="hidden" onChange={onAudio} />
          {audioPreview && <audio controls src={audioPreview} className="mt-3 w-full" />}
        </div>
        <div>
          <Label htmlFor="m-cover">Cover image (optional, ≤5MB)</Label>
          <label htmlFor="m-cover" className="mt-1.5 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-secondary px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <ImageIcon className="h-5 w-5" />
            <span>{coverFile?.name || "Click to choose a cover image"}</span>
          </label>
          <input id="m-cover" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onCover} />
          {coverPreview && <img src={coverPreview} alt="cover preview" className="mt-3 h-32 w-full rounded-lg object-cover" />}
        </div>
        <Button type="submit" size="lg" className="glow w-full gap-2" disabled={busy}>
          <Send className="h-4 w-4" /> {busy ? "Publishing..." : "Publish Track"}
        </Button>
      </form>
    </>
  );
};

export default Publish;
