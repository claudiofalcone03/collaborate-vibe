import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, Users, Trophy, Rocket, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";

const features = [
  { icon: Lightbulb, title: "Structured Ideas", desc: "Publish your vision with clear objectives, required skills, and collaboration models." },
  { icon: Users, title: "Skill Matching", desc: "Get matched with the right executors based on expertise, availability, and interests." },
  { icon: Trophy, title: "Reputation System", desc: "Build credibility through completed projects, peer reviews, and contribution history." },
];

const stats = [
  { value: "2,400+", label: "Projects Published" },
  { value: "8,100+", label: "Active Builders" },
  { value: "94%", label: "Match Success Rate" },
  { value: "150+", label: "Skills Tracked" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(239_84%_67%/0.15),transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Now in Public Beta
          </div>
          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-7xl">
            Turn Ideas into{" "}
            <span className="text-gradient">Execution.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            VETRA connects visionaries who dream big with executors who build real.
            Publish your idea, find your team, and ship together.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="glow gap-2 px-8" asChild>
              <Link to="/dashboard">
                Find a Project <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 px-8" asChild>
              <Link to="/publish">
                <Rocket className="h-4 w-4" /> Publish an Idea
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-primary">
            Why VETRA
          </div>
          <h2 className="mb-16 text-center text-3xl font-bold text-foreground md:text-4xl">
            Everything you need to go from idea to impact
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="glass group rounded-xl p-8 transition-all duration-150 hover:border-primary/30">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border px-4 py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-gradient md:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span className="text-sm">© 2026 VETRA. Built for builders.</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">About</a>
            <a href="#" className="hover:text-foreground">Blog</a>
            <a href="#" className="hover:text-foreground">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
