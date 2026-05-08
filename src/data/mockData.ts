// Static reference lists used in forms + filters.
// Real content/users now live in the database (see src/hooks/useContents.ts).

export const ALL_SKILLS = [
  "React", "TypeScript", "Node.js", "Python", "Figma", "UI/UX", "Flutter",
  "AWS", "Docker", "PostgreSQL", "GraphQL", "Rust", "Go", "Swift",
  "Machine Learning", "Blockchain", "DevOps", "Product Management",
];

export const STAGES = ["Idea", "MVP", "Growth", "Scaling"] as const;

export const GENRES = ["Lo-fi", "Hip-Hop", "Electronic", "Synthwave", "Rock", "Ambient", "Indie", "Other"] as const;

// Chat is mocked for the MVP — the messaging feature ships in a later phase.
export interface ChatChannel {
  id: string;
  name: string;
  type: "project" | "dm";
  avatar?: string;
  unread: number;
  lastMessage: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export const chatChannels: ChatChannel[] = [
  { id: "ch1", name: "EcoTrack — General", type: "project", unread: 3, lastMessage: "Let's finalize the dashboard layout" },
  { id: "ch2", name: "SkillForge — Dev", type: "project", unread: 0, lastMessage: "PR merged, deploying now" },
  { id: "ch3", name: "Sarah Chen", type: "dm", avatar: "SC", unread: 1, lastMessage: "Can you review the API specs?" },
];

export const chatMessages: ChatMessage[] = [
  { id: "msg1", channelId: "ch1", senderId: "u2", senderName: "Sarah Chen", senderAvatar: "SC", content: "Hey team! I've updated the Figma file with the new dashboard wireframes.", timestamp: "10:24 AM", isOwn: false },
  { id: "msg2", channelId: "ch1", senderId: "u1", senderName: "You", senderAvatar: "ME", content: "Looks great! I'll start implementing the card components today.", timestamp: "10:31 AM", isOwn: true },
];
