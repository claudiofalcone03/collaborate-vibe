import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, and underscores only"),
  profile_type: z.enum(["music_creator", "project_creator", "visitor"]),
});

export const signInSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(72),
});

export const projectContentSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  vision: z.string().trim().min(1).max(1000),
  skills: z.array(z.string()).max(20).optional(),
  stage: z.enum(["Idea", "MVP", "Growth", "Scaling"]),
  model: z.enum(["Equity", "Paid", "Volunteer"]),
});

export const musicContentSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(2000),
  genre: z.string().trim().min(1).max(40),
});

export const AUDIO_MIMES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav"];
export const IMAGE_MIMES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_AUDIO_SIZE = 20 * 1024 * 1024;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
