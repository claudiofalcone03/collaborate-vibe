import { useState } from "react";
import { Send, Hash, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { chatChannels, chatMessages, type ChatChannel } from "@/data/mockData";
import { cn } from "@/lib/utils";

const Chat = () => {
  const [activeChannel, setActiveChannel] = useState(chatChannels[0].id);
  const [message, setMessage] = useState("");
  const [showChannels, setShowChannels] = useState(false);

  const messages = chatMessages.filter((m) => m.channelId === activeChannel);
  const active = chatChannels.find((c) => c.id === activeChannel)!;

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Channel sidebar - desktop */}
      <div className={cn(
        "w-72 shrink-0 border-r border-border bg-card/40 flex-col",
        showChannels ? "flex absolute inset-0 z-40 w-full sm:relative sm:w-72" : "hidden sm:flex"
      )}>
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-semibold text-foreground">Channels</h2>
        </div>
        <div className="flex-1 overflow-auto p-2">
          {chatChannels.map((ch) => (
            <ChannelItem key={ch.id} channel={ch} active={ch.id === activeChannel} onClick={() => { setActiveChannel(ch.id); setShowChannels(false); }} />
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <button className="text-muted-foreground sm:hidden" onClick={() => setShowChannels(true)}>
            <MessageCircle className="h-5 w-5" />
          </button>
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{active.name}</span>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex gap-3", m.isOwn && "flex-row-reverse")}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                {m.senderAvatar}
              </div>
              <div className={cn("max-w-[70%]", m.isOwn && "text-right")}>
                <div className="mb-1 flex items-center gap-2" style={{ flexDirection: m.isOwn ? "row-reverse" : "row" }}>
                  <span className="text-sm font-medium text-foreground">{m.senderName}</span>
                  <span className="text-xs text-muted-foreground">{m.timestamp}</span>
                </div>
                <div className={cn(
                  "inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.isOwn ? "bg-primary text-primary-foreground rounded-br-md" : "glass rounded-bl-md"
                )}>
                  {m.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-4">
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setMessage(""); }}>
            <Input placeholder="Type a message..." className="bg-secondary border-border" value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button size="icon" type="submit" disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ChannelItem = ({ channel, active, onClick }: { channel: ChatChannel; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={cn(
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
  )}>
    {channel.type === "project" ? <Hash className="h-4 w-4 shrink-0" /> : (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-medium text-primary">{channel.avatar}</div>
    )}
    <div className="min-w-0 flex-1">
      <div className="truncate text-sm font-medium">{channel.name}</div>
      <div className="truncate text-xs text-muted-foreground">{channel.lastMessage}</div>
    </div>
    {channel.unread > 0 && (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{channel.unread}</span>
    )}
  </button>
);

export default Chat;
