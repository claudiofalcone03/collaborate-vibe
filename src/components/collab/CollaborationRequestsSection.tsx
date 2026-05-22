import { Link } from "react-router-dom";
import { Check, X, ExternalLink, Inbox, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { collabRoleLabel } from "@/lib/validation";
import {
  useIncomingRequests,
  useOutgoingRequests,
  useUpdateRequestStatus,
  type CollabRequestRow,
} from "@/hooks/useCollabRequests";
import { useToast } from "@/hooks/use-toast";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  accepted: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  declined: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

export const CollaborationRequestsSection = () => {
  const { user } = useAuth();
  const incoming = useIncomingRequests(user?.id);
  const outgoing = useOutgoingRequests(user?.id);
  const update = useUpdateRequestStatus();
  const { toast } = useToast();

  const act = async (id: string, status: "accepted" | "declined") => {
    try {
      await update.mutateAsync({ id, status });
      toast({ title: status === "accepted" ? "Request accepted" : "Request declined" });
    } catch (e: any) {
      toast({ title: "Action failed", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="mb-4 font-semibold text-foreground">Collaboration Requests</h2>
      <Tabs defaultValue="incoming">
        <TabsList className="mb-4">
          <TabsTrigger value="incoming" className="gap-1.5">
            <Inbox className="h-3.5 w-3.5" /> Incoming
            {(incoming.data?.filter((r) => r.status === "pending").length ?? 0) > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                {incoming.data!.filter((r) => r.status === "pending").length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-1.5">
            <Send className="h-3.5 w-3.5" /> Sent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-3">
          {incoming.isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {!incoming.isLoading && (incoming.data?.length ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground">No incoming requests yet.</p>
          )}
          {incoming.data?.map((r) => (
            <RequestCard key={r.id} request={r} side="incoming" onAct={act} acting={update.isPending} />
          ))}
        </TabsContent>

        <TabsContent value="sent" className="space-y-3">
          {outgoing.isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {!outgoing.isLoading && (outgoing.data?.length ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground">You haven't sent any requests yet.</p>
          )}
          {outgoing.data?.map((r) => (
            <RequestCard key={r.id} request={r} side="outgoing" onAct={act} acting={update.isPending} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const RequestCard = ({
  request,
  side,
  onAct,
  acting,
}: {
  request: CollabRequestRow;
  side: "incoming" | "outgoing";
  onAct: (id: string, status: "accepted" | "declined") => void;
  acting: boolean;
}) => {
  const who = side === "incoming" ? request.sender?.username : request.receiver?.username;
  return (
    <div className="rounded-lg border border-border bg-secondary/50 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">@{who ?? "unknown"}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <Badge variant="secondary" className="bg-primary/10 text-primary">{collabRoleLabel[request.role]}</Badge>
        </div>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[request.status]}`}>
          {request.status}
        </span>
      </div>
      {request.content && (
        <p className="mb-2 text-xs text-muted-foreground">
          On <span className="text-foreground">{request.content.title}</span> ({request.content.content_type})
        </p>
      )}
      <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">{request.message}</p>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {request.portfolio_url ? (
          <a
            href={request.portfolio_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" /> Portfolio
          </a>
        ) : (
          <span />
        )}
        {side === "incoming" && request.status === "pending" && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={acting} onClick={() => onAct(request.id, "declined")}>
              <X className="mr-1 h-3.5 w-3.5" /> Decline
            </Button>
            <Button size="sm" disabled={acting} onClick={() => onAct(request.id, "accepted")}>
              <Check className="mr-1 h-3.5 w-3.5" /> Accept
            </Button>
          </div>
        )}
        {request.status === "accepted" && (
          <Link to="/chat" className="text-xs text-primary hover:underline">
            Open chat →
          </Link>
        )}
      </div>
    </div>
  );
};
