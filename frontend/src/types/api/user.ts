import { z } from 'zod';

const UserActionSchema = z.object({
  actingAvatarTemplate: z.string(),
  actingName: z.string(),
  actingUserId: z.number(),
  actionCode: z.number().optional(), // Optional field
  actionType: z.number(),
  archived: z.boolean(),
  avatarTemplate: z.string(),
  categoryId: z.number(),
  closed: z.boolean(),
  createdAt: z.string(), // Consider using z.date() if this is a date
  deleted: z.boolean(),
  excerpt: z.string(),
  hidden: z.string().optional(), // Optional field
  name: z.string().optional(), // Optional field
  postId: z.number().optional(), // Optional field
  postNumber: z.number(),
  postType: z.number().optional(), // Optional field
  slug: z.string(),
  targetName: z.string(),
  targetUserId: z.number(),
  targetUsername: z.string(),
  title: z.string(),
  topicId: z.number(),
  userId: z.number(),
});

export type UserAction = z.infer<typeof UserActionSchema>;

export const UserIcon = z.object({
  id: z.number(),
  username: z.string(),
  name: z.optional(z.nullable(z.string())),
  avatarTemplate: z.string(),
});

export type UserIcon = z.infer<typeof UserIcon>;

export const User = z.object({
  id: z.number(),
  username: z.string(),
  name: z.optional(z.nullable(z.string())),
  avatar: z.string(),
});
export type User = z.infer<typeof User>;
