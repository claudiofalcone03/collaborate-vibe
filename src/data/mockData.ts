export interface Project {
  id: string;
  title: string;
  description: string;
  vision: string;
  skills: string[];
  stage: "Idea" | "MVP" | "Growth" | "Scaling";
  model: "Equity" | "Paid" | "Volunteer";
  owner: string;
  ownerAvatar: string;
  applicants: number;
  createdAt: string;
}

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

export const projects: Project[] = [
  {
    id: "p1", title: "EcoTrack", description: "A carbon footprint tracker for individuals and small businesses with gamification elements.",
    vision: "Make sustainability accessible through data-driven insights.", skills: ["React", "Node.js", "PostgreSQL", "UI/UX"],
    stage: "MVP", model: "Equity", owner: "Sarah Chen", ownerAvatar: "SC", applicants: 12, createdAt: "2026-02-15",
  },
  {
    id: "p2", title: "MedConnect", description: "Telemedicine platform connecting rural patients with specialists via AI-assisted triage.",
    vision: "Bridge the healthcare gap in underserved communities.", skills: ["React", "Python", "Machine Learning", "AWS"],
    stage: "Idea", model: "Equity", owner: "Dr. Amir Patel", ownerAvatar: "AP", applicants: 8, createdAt: "2026-03-01",
  },
  {
    id: "p3", title: "SkillForge", description: "Peer-to-peer skill exchange marketplace with reputation-based matching.",
    vision: "Democratize learning through community.", skills: ["TypeScript", "GraphQL", "Figma", "DevOps"],
    stage: "Growth", model: "Paid", owner: "Maya Johnson", ownerAvatar: "MJ", applicants: 23, createdAt: "2025-11-20",
  },
  {
    id: "p4", title: "ChainVote", description: "Decentralized voting platform for DAOs and community organizations.",
    vision: "Transparent governance for the decentralized future.", skills: ["Blockchain", "Rust", "React", "TypeScript"],
    stage: "MVP", model: "Equity", owner: "Liam O'Brien", ownerAvatar: "LO", applicants: 15, createdAt: "2026-01-10",
  },
  {
    id: "p5", title: "NomadHub", description: "All-in-one workspace finder and community platform for digital nomads.",
    vision: "Make remote work seamless anywhere in the world.", skills: ["React", "Node.js", "UI/UX", "PostgreSQL"],
    stage: "Scaling", model: "Paid", owner: "Yuki Tanaka", ownerAvatar: "YT", applicants: 31, createdAt: "2025-08-05",
  },
  {
    id: "p6", title: "ArtLens", description: "AR-powered app that identifies artworks and provides curator-level context.",
    vision: "Turn every museum visit into a masterclass.", skills: ["Flutter", "Machine Learning", "Python", "UI/UX"],
    stage: "Idea", model: "Volunteer", owner: "Isabella Rossi", ownerAvatar: "IR", applicants: 5, createdAt: "2026-03-10",
  },
  {
    id: "p7", title: "FreightSync", description: "Logistics optimization tool for small freight companies using real-time data.",
    vision: "Level the playing field for independent haulers.", skills: ["Go", "AWS", "React", "Docker"],
    stage: "Growth", model: "Paid", owner: "Marcus Webb", ownerAvatar: "MW", applicants: 9, createdAt: "2025-12-01",
  },
  {
    id: "p8", title: "Lingua", description: "AI-powered language learning that adapts to your native tongue's grammar patterns.",
    vision: "Language learning that actually sticks.", skills: ["Python", "Machine Learning", "React", "TypeScript"],
    stage: "MVP", model: "Equity", owner: "Fatima Al-Rashid", ownerAvatar: "FA", applicants: 19, createdAt: "2026-02-28",
  },
  {
    id: "p9", title: "GreenGrid", description: "Smart energy management dashboard for residential solar panel owners.",
    vision: "Empower homeowners to optimize renewable energy.", skills: ["React", "Node.js", "DevOps", "UI/UX"],
    stage: "Idea", model: "Volunteer", owner: "Erik Lindström", ownerAvatar: "EL", applicants: 3, createdAt: "2026-03-12",
  },
  {
    id: "p10", title: "CodeMentor Pro", description: "Live code review marketplace pairing junior devs with senior mentors.",
    vision: "Accelerate developer growth through real mentorship.", skills: ["TypeScript", "React", "GraphQL", "Product Management"],
    stage: "Scaling", model: "Paid", owner: "James Kim", ownerAvatar: "JK", applicants: 42, createdAt: "2025-06-15",
  },
];

export const currentUser: User = {
  id: "u1", name: "Alex Rivera", role: "Full-Stack Developer", avatar: "AR",
  bio: "Passionate builder obsessed with clean architecture and impactful products. 4+ years shipping production apps.",
  reputation: 87, completedTasks: 34,
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "GraphQL"],
  activeProjects: ["p1", "p3"],
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
  { id: "m1", channelId: "ch1", senderId: "u2", senderName: "Sarah Chen", senderAvatar: "SC", content: "Hey team! I've updated the Figma file with the new dashboard wireframes.", timestamp: "10:24 AM", isOwn: false },
  { id: "m2", channelId: "ch1", senderId: "u1", senderName: "Alex Rivera", senderAvatar: "AR", content: "Looks great! I'll start implementing the card components today.", timestamp: "10:31 AM", isOwn: true },
  { id: "m3", channelId: "ch1", senderId: "u3", senderName: "Liam O'Brien", senderAvatar: "LO", content: "Should we use Chart.js or Recharts for the emissions graph?", timestamp: "10:45 AM", isOwn: false },
  { id: "m4", channelId: "ch1", senderId: "u1", senderName: "Alex Rivera", senderAvatar: "AR", content: "I'd recommend Recharts — it integrates better with our React setup and has better tree-shaking.", timestamp: "10:48 AM", isOwn: true },
  { id: "m5", channelId: "ch1", senderId: "u2", senderName: "Sarah Chen", senderAvatar: "SC", content: "Agreed. Let's finalize the dashboard layout by end of day and push to staging.", timestamp: "11:02 AM", isOwn: false },
  { id: "m6", channelId: "ch1", senderId: "u4", senderName: "Yuki Tanaka", senderAvatar: "YT", content: "I can help with the responsive breakpoints if needed 🙌", timestamp: "11:15 AM", isOwn: false },
  { id: "m7", channelId: "ch1", senderId: "u1", senderName: "Alex Rivera", senderAvatar: "AR", content: "That would be awesome, Yuki! I'll tag you on the PR.", timestamp: "11:18 AM", isOwn: true },
];
