import { useState } from "react";
import { Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ALL_SKILLS } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const MODELS = ["Equity", "Paid", "Volunteer"] as const;

const Publish = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [vision, setVision] = useState("");
  const [objectives, setObjectives] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [model, setModel] = useState<string>("Equity");
  const [showSkillPicker, setShowSkillPicker] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !vision) {
      toast({ title: "Missing fields", description: "Please fill in the project name and vision.", variant: "destructive" });
      return;
    }
    toast({ title: "Idea published! 🚀", description: `"${name}" is now live on the feed.` });
    setName(""); setVision(""); setObjectives(""); setSelectedSkills([]); setModel("Equity");
  };

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-6">
      <h1 className="mb-1 text-2xl font-bold text-foreground">Publish an Idea</h1>
      <p className="mb-8 text-sm text-muted-foreground">Share your vision and find the team to build it.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <Label>Collaborative Model</Label>
          <div className="mt-1.5 flex gap-3">
            {MODELS.map((m) => (
              <button type="button" key={m} onClick={() => setModel(m)} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${model === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full gap-2 glow">
          <Send className="h-4 w-4" /> Publish Idea
        </Button>
      </form>
    </div>
  );
};

export default Publish;
