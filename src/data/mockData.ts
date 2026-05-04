export type ContentType = "project" | "music";

export interface BaseContent {
  id: string;
  contentType: ContentType;
  title: string;
  description: string;
  creator: string;
  creatorAvatar: string;
  createdAt: string;
  likes: number;
}

export interface ProjectContent extends BaseContent {
  contentType: "project";
  vision: string;
  skills: string[];
  stage: "Idea" | "MVP" | "Growth" | "Scaling";
  model: "Equity" | "Paid" | "Volunteer";
  applicants: number;
}

export interface MusicContent extends BaseContent {
  contentType: "music";
  genre?: string;
  audioUrl: string;
  coverGradient: string;
}

export type Content = ProjectContent | MusicContent;

// Backward-compat alias
export type Project = ProjectContent & { owner: string; ownerAvatar: string };

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  reputation: number;
  completedTasks: number;
  skills: string[];
  activeProjects: string[];
  creatorTypes: ContentType[];
  contributions: { project: string; role: string; date: string }[];
}

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

export const ALL_SKILLS = [
  "React", "TypeScript", "Node.js", "Python", "Figma", "UI/UX", "Flutter",
  "AWS", "Docker", "PostgreSQL", "GraphQL", "Rust", "Go", "Swift",
  "Machine Learning", "Blockchain", "DevOps", "Product Management",
];

export const STAGES = ["Idea", "MVP", "Growth", "Scaling"] as const;

export const GENRES = ["Lo-fi", "Hip-Hop", "Electronic", "Synthwave", "Rock", "Ambient", "Indie", "Other"] as const;

const mkProject = (
  id: string, title: string, description: string, vision: string,
  skills: string[], stage: ProjectContent["stage"], model: ProjectContent["model"],
  owner: string, ownerAvatar: string, applicants: number, createdAt: string, likes: number,
): ProjectContent & { owner: string; ownerAvatar: string } => ({
  id, contentType: "project", title, description, vision, skills, stage, model,
  creator: owner, creatorAvatar: ownerAvatar, owner, ownerAvatar,
  applicants, createdAt, likes,
});

export const projects: Project[] = [
  mkProject("p1", "EcoTrack", "A carbon footprint tracker for individuals and small businesses with gamification elements.", "Make sustainability accessible through data-driven insights.", ["React", "Node.js", "PostgreSQL", "UI/UX"], "MVP", "Equity", "Sarah Chen", "SC", 12, "2026-02-15", 142),
  mkProject("p2", "MedConnect", "Telemedicine platform connecting rural patients with specialists via AI-assisted triage.", "Bridge the healthcare gap in underserved communities.", ["React", "Python", "Machine Learning", "AWS"], "Idea", "Equity", "Dr. Amir Patel", "AP", 8, "2026-03-01", 98),
  mkProject("p3", "SkillForge", "Peer-to-peer skill exchange marketplace with reputation-based matching.", "Democratize learning through community.", ["TypeScript", "GraphQL", "Figma", "DevOps"], "Growth", "Paid", "Maya Johnson", "MJ", 23, "2025-11-20", 230),
  mkProject("p4", "ChainVote", "Decentralized voting platform for DAOs and community organizations.", "Transparent governance for the decentralized future.", ["Blockchain", "Rust", "React", "TypeScript"], "MVP", "Equity", "Liam O'Brien", "LO", 15, "2026-01-10", 176),
  mkProject("p5", "NomadHub", "All-in-one workspace finder and community platform for digital nomads.", "Make remote work seamless anywhere in the world.", ["React", "Node.js", "UI/UX", "PostgreSQL"], "Scaling", "Paid", "Yuki Tanaka", "YT", 31, "2025-08-05", 312),
  mkProject("p6", "ArtLens", "AR-powered app that identifies artworks and provides curator-level context.", "Turn every museum visit into a masterclass.", ["Flutter", "Machine Learning", "Python", "UI/UX"], "Idea", "Volunteer", "Isabella Rossi", "IR", 5, "2026-03-10", 64),
  mkProject("p7", "FreightSync", "Logistics optimization tool for small freight companies using real-time data.", "Level the playing field for independent haulers.", ["Go", "AWS", "React", "Docker"], "Growth", "Paid", "Marcus Webb", "MW", 9, "2025-12-01", 87),
  mkProject("p8", "Lingua", "AI-powered language learning that adapts to your native tongue's grammar patterns.", "Language learning that actually sticks.", ["Python", "Machine Learning", "React", "TypeScript"], "MVP", "Equity", "Fatima Al-Rashid", "FA", 19, "2026-02-28", 201),
  mkProject("p9", "GreenGrid", "Smart energy management dashboard for residential solar panel owners.", "Empower homeowners to optimize renewable energy.", ["React", "Node.js", "DevOps", "UI/UX"], "Idea", "Volunteer", "Erik Lindström", "EL", 3, "2026-03-12", 41),
  mkProject("p10", "CodeMentor Pro", "Live code review marketplace pairing junior devs with senior mentors.", "Accelerate developer growth through real mentorship.", ["TypeScript", "React", "GraphQL", "Product Management"], "Scaling", "Paid", "James Kim", "JK", 42, "2025-06-15", 389),
];

const SAMPLE = (n: number) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

export const musicTracks: MusicContent[] = [
  { id: "m1", contentType: "music", title: "Midnight Circuits", description: "A hypnotic synthwave journey through neon-lit cityscapes.", creator: "Nova Pulse", creatorAvatar: "NP", createdAt: "2026-03-08", likes: 254, genre: "Synthwave", audioUrl: SAMPLE(1), coverGradient: "from-fuchsia-500 to-indigo-600" },
  { id: "m2", contentType: "music", title: "Cafe Window", description: "Chill lo-fi beats perfect for late-night coding sessions.", creator: "Kai Mori", creatorAvatar: "KM", createdAt: "2026-02-20", likes: 412, genre: "Lo-fi", audioUrl: SAMPLE(2), coverGradient: "from-amber-400 to-rose-500" },
  { id: "m3", contentType: "music", title: "Concrete Verses", description: "Boom-bap hip-hop instrumental with classic vinyl warmth.", creator: "Marcus Vega", creatorAvatar: "MV", createdAt: "2026-01-15", likes: 188, genre: "Hip-Hop", audioUrl: SAMPLE(3), coverGradient: "from-emerald-500 to-teal-700" },
  { id: "m4", contentType: "music", title: "Glacier Drift", description: "Slow ambient textures inspired by arctic landscapes.", creator: "Lena Frost", creatorAvatar: "LF", createdAt: "2026-03-01", likes: 96, genre: "Ambient", audioUrl: SAMPLE(4), coverGradient: "from-cyan-400 to-blue-700" },
  { id: "m5", contentType: "music", title: "Voltage", description: "High-energy electronic anthem made for the dancefloor.", creator: "DJ Helix", creatorAvatar: "DH", createdAt: "2026-02-12", likes: 327, genre: "Electronic", audioUrl: SAMPLE(5), coverGradient: "from-pink-500 to-purple-700" },
  { id: "m6", contentType: "music", title: "Front Porch", description: "Warm indie acoustic track about home and nostalgia.", creator: "Hazel Rivers", creatorAvatar: "HR", createdAt: "2026-01-28", likes: 143, genre: "Indie", audioUrl: SAMPLE(6), coverGradient: "from-orange-400 to-red-600" },
];

export const currentUser: User = {
  id: "u1", name: "Alex Rivera", role: "Full-Stack Developer", avatar: "AR",
  bio: "Passionate builder obsessed with clean architecture and impactful products. 4+ years shipping production apps.",
  reputation: 87, completedTasks: 34,
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "GraphQL"],
  activeProjects: ["p1", "p3"],
  creatorTypes: ["project", "music"],
  contributions: [
    { project: "EcoTrack", role: "Frontend Lead", date: "2026-02" },
    { project: "SkillForge", role: "API Developer", date: "2025-12" },
    { project: "NomadHub", role: "Code Reviewer", date: "2025-09" },
    { project: "CodeMentor Pro", role: "Mentor", date: "2025-07" },
  ],
};

export const chatChannels: ChatChannel[] = [
  { id: "ch1", name: "EcoTrack — General", type: "project", unread: 3, lastMessage: "Let's finalize the dashboard layout" },
  { id: "ch2", name: "SkillForge — Dev", type: "project", unread: 0, lastMessage: "PR merged, deploying now" },
  { id: "ch3", name: "Sarah Chen", type: "dm", avatar: "SC", unread: 1, lastMessage: "Can you review the API specs?" },
  { id: "ch4", name: "Maya Johnson", type: "dm", avatar: "MJ", unread: 0, lastMessage: "Great work on the component!" },
  { id: "ch5", name: "ChainVote — Design", type: "project", unread: 5, lastMessage: "New mockups are up for review" },
];

export const chatMessages: ChatMessage[] = [
  { id: "msg1", channelId: "ch1", senderId: "u2", senderName: "Sarah Chen", senderAvatar: "SC", content: "Hey team! I've updated the Figma file with the new dashboard wireframes.", timestamp: "10:24 AM", isOwn: false },
  { id: "msg2", channelId: "ch1", senderId: "u1", senderName: "Alex Rivera", senderAvatar: "AR", content: "Looks great! I'll start implementing the card components today.", timestamp: "10:31 AM", isOwn: true },
  { id: "msg3", channelId: "ch1", senderId: "u3", senderName: "Liam O'Brien", senderAvatar: "LO", content: "Should we use Chart.js or Recharts for the emissions graph?", timestamp: "10:45 AM", isOwn: false },
  { id: "msg4", channelId: "ch1", senderId: "u1", senderName: "Alex Rivera", senderAvatar: "AR", content: "I'd recommend Recharts — it integrates better with our React setup and has better tree-shaking.", timestamp: "10:48 AM", isOwn: true },
  { id: "msg5", channelId: "ch1", senderId: "u2", senderName: "Sarah Chen", senderAvatar: "SC", content: "Agreed. Let's finalize the dashboard layout by end of day and push to staging.", timestamp: "11:02 AM", isOwn: false },
  { id: "msg6", channelId: "ch1", senderId: "u4", senderName: "Yuki Tanaka", senderAvatar: "YT", content: "I can help with the responsive breakpoints if needed 🙌", timestamp: "11:15 AM", isOwn: false },
  { id: "msg7", channelId: "ch1", senderId: "u1", senderName: "Alex Rivera", senderAvatar: "AR", content: "That would be awesome, Yuki! I'll tag you on the PR.", timestamp: "11:18 AM", isOwn: true },
];
