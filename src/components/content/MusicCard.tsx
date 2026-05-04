import { Music, Trophy } from "lucide-react";
import { LikeButton } from "@/components/LikeButton";
import type { MusicContent } from "@/data/mockData";

export const MusicCard = ({ track, isTop }: { track: MusicContent; isTop?: boolean }) => (
  <div className="glass group relative flex flex-col overflow-hidden rounded-xl transition-all duration-150 hover:border-primary/30">
    {isTop && (
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-lg">
        <Trophy className="h-3 w-3" /> Top
      </div>
    )}
    <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${track.coverGradient}`}>
      <Music className="h-12 w-12 text-white/80" />
    </div>
    <div className="flex flex-1 flex-col p-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {track.genre || "Music"}
        </span>
        <LikeButton content={track} />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">{track.title}</h3>
      <p className="mb-3 flex-1 text-sm leading-relaxed text-muted-foreground">{track.description}</p>
      <audio controls preload="none" src={track.audioUrl} className="mb-3 w-full" />
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
          {track.creatorAvatar}
        </div>
        <span className="truncate text-xs text-muted-foreground">{track.creator}</span>
      </div>
    </div>
  </div>
);
