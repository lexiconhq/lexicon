import { z } from 'zod';

import { Poll, PollsVotes } from './poll';

const ActionSummarySchema = z.object({
  canAct: z.boolean().nullable().optional(),
  canUndo: z.boolean().nullable().optional(),
  count: z.number().nullable().optional(),
  id: z.number(),
  hidden: z.boolean().nullable().optional(),
  acted: z.boolean().nullable().optional(),
});

export type ActionSummary = z.infer<typeof ActionSummarySchema>;
export type ActionsSummary = Array<ActionSummary>;

const Post = z.object({
  id: z.number(),
  name: z.optional(z.nullable(z.string())),
  username: z.string(),
  avatarTemplate: z.string(),
  createdAt: z.string(),
  cooked: z.string(),
  postNumber: z.number(),
  postType: z.number(),
  updatedAt: z.string(),
  replyCount: z.number(),
  replyToPostNumber: z.optional(z.nullable(z.number())),
  quoteCount: z.number(),
  incomingLinkCount: z.number(),
  reads: z.number(),
  readersCount: z.number(),
  score: z.number(),
  yours: z.boolean(),
  topicId: z.number(),
  topicSlug: z.string(),
  displayUsername: z.optional(z.nullable(z.string())),
  primaryGroupName: z.optional(z.nullable(z.string())),
  primaryGroupFlairUrl: z.optional(z.nullable(z.string())),
  primaryGroupFlairColor: z.optional(z.nullable(z.string())),
  primaryGroupFlairBgColor: z.optional(z.nullable(z.string())),
  version: z.number(),
  canEdit: z.boolean(),
  canDelete: z.boolean(),
  canRecover: z.boolean(),
  canSeeHiddenPost: z.boolean(),
  canWiki: z.boolean(),
  read: z.boolean(),
  userTitle: z.string(),
  bookmarked: z.boolean(),
  raw: z.string(),
  moderator: z.boolean(),
  admin: z.boolean(),
  staff: z.boolean(),
  userId: z.number(),
  hidden: z.boolean(),
  draftSequence: z.number(),
  trustLevel: z.number(),
  deletedAt: z.string(),
  userDeleted: z.boolean(),
  editReason: z.string(),
  canViewEditHistory: z.boolean(),
  wiki: z.boolean(),
  reviewableId: z.number(),
  reviewableScoreCount: z.number(),
  reviewableScorePendingCount: z.number(),
  mentionedUsers: z.array(z.string()),
  polls: z.optional(z.nullable(z.array(Poll))),
  pollsVotes: z.optional(z.nullable(PollsVotes)),
  actionsSummary: z.array(ActionSummarySchema).nullable(),
});

export type Post = z.infer<typeof Post>;

const LikedTopic = z.object({
  id: z.number(),
  topicId: z.number(),
  postId: z.number(),
  likeCount: z.number().optional().nullable(),
  liked: z.boolean(),
});

export type LikedTopic = z.infer<typeof LikedTopic>;
