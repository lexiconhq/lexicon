import { z } from 'zod';

import { UserIcon } from './user';

export const TopicPosterNewUnion = z.object({
  extras: z.optional(z.nullable(z.string())),
  description: z.string(),
  userId: z.number(),
  user: UserIcon,
});

export const SuggestionTopicPoster = z.object({
  extras: z.optional(z.nullable(z.string())),
  description: z.string(),
  user: UserIcon,
});

export const PosterUnion = z.union([
  TopicPosterNewUnion,
  SuggestionTopicPoster,
]);

export const MessageParticipant = z.object({
  extras: z.string().nullable().optional(),
  userId: z.number(),
});

export const TopicSchema = z.object({
  id: z.number(),
  title: z.string(),
  fancyTitle: z.string(),
  slug: z.string(),
  postsCount: z.number(),
  replyCount: z.number(),
  highestPostNumber: z.number(),
  createdAt: z.string(),
  lastPostedAt: z.string(),
  bumped: z.boolean(),
  bumpedAt: z.string(),
  archetype: z.string(),
  imageUrl: z.string().nullable().optional(),
  unseen: z.boolean(),
  pinned: z.boolean(),
  excerpt: z.string().nullable().optional(),
  visible: z.boolean(),
  closed: z.boolean(),
  archived: z.boolean(),
  bookmarked: z.boolean().nullable().optional(),
  liked: z.boolean().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  views: z.number(),
  likeCount: z.number(),
  lastReadPostNumber: z.number().nullable().optional(),
  newPosts: z.number().nullable().optional(),
  notificationLevel: z.number().nullable().optional(),
  unread: z.number().nullable().optional(),
  hasSummary: z.boolean().optional(),
  lastPosterUsername: z.string().nullable().optional(),
  categoryId: z.number().nullable().optional(),
  pinnedGlobally: z.boolean().nullable(),
  posters: z.array(PosterUnion),
  authorUserId: z.number().nullable().optional(),
  allowedUserCount: z.number().nullable().optional(),
  participants: z.array(MessageParticipant).nullable().optional(),
});

export type Topic = z.infer<typeof TopicSchema>;

export const MostRecentPoster = z.literal('MostRecentPoster');
export const OriginalPoster = z.literal('OriginalPoster');
export const FrequentPoster = z.literal('FrequentPoster');
export const UnknownPosterType = z.literal('UnknownPosterType');
export const PosterType = z.union([
  FrequentPoster,
  MostRecentPoster,
  OriginalPoster,
  UnknownPosterType,
]);
export type PosterType = z.infer<typeof PosterType>;
