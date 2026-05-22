import { useEffect, useMemo, useRef, useState } from "react";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useConversations, useMessages, useSendMessage } from "@/hooks/useConversations";
import { useToast } from "@/hooks/use-toast";

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();
  const { data: conversations = [], isLoading } = useConversations(user?.id);
  const initial = params.get("c");
  const [activeId, setActiveId] = useState<string | null>(initial);
  const [showList, setShowList] = useState(false);
  const [draft, setDraft] = useState("");
  const send = useSendMessage();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  useEffect(() => {
    if (activeId) setParams({ c: activeId }, { replace: true });
  }, [activeId, setParams]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );
  const { data: messages = [] } = useMessages(activeId ?? undefined);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeId || !draft.trim()) return;
    const body = draft.trim().slice(0, 2000);
    setDraft("");
    try {
      await send.mutateAsync({ conversationId: activeId, senderId: user.id, body });
    } catch (err: any) {
      toast({ title: "Could not send", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div
        className={cn(
          "w-72 shrink-0 border-r border-border bg-card/40 flex-col",
          showList ? "flex absolute inset-0 z-40 w-full sm:relative sm:w-72" : "hidden sm:flex"
        )}
      >
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-semibold text-foreground">Conversations</h2>
        </div>
        <div className="flex-1 overflow-auto p-2">
          {isLoading && (
            <div className="flex justify-center p-6 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          {!isLoading && conversations.length === 0 && (
            <p className="px-3 py-4 text-xs text-muted-foreground">
              Accept a collaboration request to start chatting.
            </p>
          )}
          {conversations.map((c) => {
            const name = c.other?.username ?? "user";
            const isActive = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveId(c.id);
                  setShowList(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                  {name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">@{name}</div>
                  {c.content && (
                    <div className="truncate text-xs text-muted-foreground">on {c.content.title}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <button className="text-muted-foreground sm:hidden" onClick={() => setShowList(true)}>
            <MessageCircle className="h-5 w-5" />
          </button>
          <span className="font-medium text-foreground">
            {active ? `@${active.other?.username ?? "user"}` : "Select a conversation"}
          </span>
          {active?.content && (
            <span className="text-xs text-muted-foreground">· {active.content.title}</span>
          )}
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-auto p-4">
          {active && messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No messages yet. Say hello!
            </p>
          )}
          {messages.map((m) => {
            const own = m.sender_id === user?.id;
            return (
              <div key={m.id} className={cn("flex", own ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    own
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "glass rounded-bl-md"
                  )}
                >
                  {m.body}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border p-4">
          <form className="flex gap-2" onSubmit={submit}>
            <Input
              placeholder={active ? "Type a message..." : "Select a conversation to start"}
              className="bg-secondary border-border"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={!active}
              maxLength={2000}
            />
            <Button size="icon" type="submit" disabled={!active || !draft.trim() || send.isPending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
