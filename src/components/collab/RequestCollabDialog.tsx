import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { collabRequestSchema, COLLAB_ROLES, collabRoleLabel } from "@/lib/validation";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  contentId: string;
  contentTitle: string;
}

export const RequestCollabDialog = ({ open, onOpenChange, contentId, contentTitle }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<(typeof COLLAB_ROLES)[number] | "">("");
  const [portfolio, setPortfolio] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setMessage("");
    setRole("");
    setPortfolio("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = collabRequestSchema.safeParse({
      message,
      role,
      portfolio_url: portfolio || undefined,
    });
    if (!parsed.success) {
      toast({ title: "Check your input", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("collaboration_requests").insert({
      sender_id: user.id,
      receiver_id: user.id, // overridden by trigger
      content_id: contentId,
      message: parsed.data.message,
      role: parsed.data.role,
      portfolio_url: parsed.data.portfolio_url || null,
    });
    setSubmitting(false);
    if (error) {
      let desc = error.message;
      if (/duplicate key/i.test(desc)) desc = "You already have a pending request for this content.";
      else if (/limit reached/i.test(desc)) desc = "Daily limit reached (5 requests / 24h).";
      else if (/your own content/i.test(desc)) desc = "You can't request collaboration on your own content.";
      toast({ title: "Could not send request", description: desc, variant: "destructive" });
      return;
    }
    toast({ title: "Request sent", description: "The creator will be notified." });
    qc.invalidateQueries({ queryKey: ["collab-outgoing"] });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request collaboration</DialogTitle>
          <DialogDescription className="truncate">on “{contentTitle}”</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger id="role" className="mt-1.5 bg-secondary border-border">
                <SelectValue placeholder="What role are you offering?" />
              </SelectTrigger>
              <SelectContent>
                {COLLAB_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{collabRoleLabel[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="msg">Introduction</Label>
            <Textarea
              id="msg"
              className="mt-1.5 bg-secondary border-border"
              placeholder="Briefly introduce yourself and how you'd like to contribute..."
              value={message}
              maxLength={500}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <div className="mt-1 text-right text-xs text-muted-foreground">{message.length}/500</div>
          </div>
          <div>
            <Label htmlFor="portfolio">Portfolio link <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              id="portfolio"
              type="url"
              className="mt-1.5 bg-secondary border-border"
              placeholder="https://soundcloud.com/... or https://github.com/..."
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              maxLength={300}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send request"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
