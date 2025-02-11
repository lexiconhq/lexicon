import { z } from 'zod';

const UserActionSchema = z.object({
  actionType: z.number().int(),
  avatarTemplate: z.string(),
  categoryId: z.number().int().nullable(),
  createdAt: z.string(),
  excerpt: z.string(),
  hidden: z.boolean().nullable(),
  markdownContent: z.string().nullable(),
  postId: z.number().int().nullable(),
  postNumber: z.number().int(),
  title: z.string(),
  topicId: z.number().int(),
  username: z.string(),
});

export type UserAction = z.infer<typeof UserActionSchema>;
