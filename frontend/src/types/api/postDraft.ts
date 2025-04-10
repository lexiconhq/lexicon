import { z } from 'zod';

const DraftBase = z.object({
  reply: z.string(),
  action: z.string(),
  categoryId: z.number(),
  tags: z.array(z.string()),
  archetypeId: z.optional(z.string()),
});

const NewTopicDraft = DraftBase.extend({
  title: z.string(),
});

const PostReplyDraft = DraftBase.extend({
  postId: z.optional(z.number()),
});

const NewPrivateMessageDraft = DraftBase.extend({
  title: z.string(),
  recipients: z.string(),
  categoryId: z.nullable(z.number()),
});

const PrivateMessageReplyDraft = DraftBase.extend({
  categoryId: z.nullable(z.number()),
  postId: z.optional(z.number()),
});

export const DraftData = z.union([
  NewPrivateMessageDraft,
  NewTopicDraft,
  PostReplyDraft,
  PrivateMessageReplyDraft,
]);

export type DraftData = z.infer<typeof DraftData>;

const CheckDraft = z.object({
  draft: z.string().nullable(),
  draft_sequence: z.number(),
});

export type CheckDraft = z.infer<typeof CheckDraft>;
