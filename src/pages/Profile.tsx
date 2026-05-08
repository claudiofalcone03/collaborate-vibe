import { useEffect, useState } from "react";
import { Briefcase, History, Award, Star, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const profileTypeLabel: Record<string, string> = {
  music_creator: "Music Creator",
  project_creator: "Project Creator",
  visitor: "Visitor",
};

const Profile = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [bio, setBio] = useState("");
  const [profileType, setProfileType] = useState<"music_creator" | "project_creator" | "visitor">("visitor");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio ?? "");
      setProfileType(profile.profile_type);
    }
  }, [profile]);

  const { data: myContents = [] } = useQuery({
    queryKey: ["my-contents", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contents")
        .select("id, title, description, content_type, stage, created_at, likes_count")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ bio: bio.slice(0, 500), profile_type: profileType })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Could not save", description: error.message, variant: "destructive" });
      return;
    }
    await refreshProfile();
    toast({ title: "Profile updated" });
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const initials = profile.username.slice(0, 2).toUpperCase();
  const totalLikes = myContents.reduce((s, c) => s + (c.likes_count ?? 0), 0);

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <div className="glass mb-6 flex flex-col items-center gap-6 rounded-xl p-8 sm:flex-row sm:items-start">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-2xl font-bold text-primary">
          {initials}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-foreground">@{profile.username}</h1>
          <p className="text-sm text-primary">{profileTypeLabel[profile.profile_type]}</p>
          {profile.bio && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>}
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Badge variant="secondary" className="bg-primary/10 text-primary">{profileTypeLabel[profile.profile_type]}</Badge>
          </div>
        </div>
      </div>

      <form onSubmit={save} className="glass mb-6 rounded-xl p-6">
        <h2 className="mb-3 font-semibold text-foreground">Edit Profile</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" className="mt-1.5 border-border bg-secondary" value={bio} maxLength={500} onChange={(e) => setBio(e.target.value)} placeholder="Tell the community about yourself..." />
          </div>
          <div>
            <Label>Profile Type</Label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {(["visitor", "project_creator", "music_creator"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setProfileType(t)}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition-all ${profileType === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground"}`}
                >
                  {profileTypeLabel[t]}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
        </div>
      </form>

      <div className="glass mb-6 rounded-xl p-6">
        <div className="mb-4 flex items-center gap-2 text-foreground">
          <Award className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Stats</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">{myContents.length}</div>
            <div className="text-xs text-muted-foreground">Published</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{totalLikes}</div>
            <div className="text-xs text-muted-foreground">Total likes</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground"><Star className="h-5 w-5 text-amber-400" /></div>
            <div className="text-xs text-muted-foreground">Reputation soon</div>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="mb-3 flex items-center gap-2 text-foreground">
          <Briefcase className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">My Content</h2>
        </div>
        {myContents.length === 0 ? (
          <p className="text-sm text-muted-foreground">You haven't published anything yet.</p>
        ) : (
          <div className="space-y-3">
            {myContents.map((c) => (
              <div key={c.id} className="rounded-lg border border-border bg-secondary/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{c.title}</span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                    {c.content_type === "project" ? c.stage ?? "Project" : "Music"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <History className="h-3 w-3" /> {new Date(c.created_at).toLocaleDateString()}
                  <span>· {c.likes_count} likes</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
