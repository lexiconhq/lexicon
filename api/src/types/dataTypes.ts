import { z } from 'zod';

export type LikedTopic = {
  id: number;
  topicId: number;
  postId: number;
  likeCount: number;
  liked: boolean;
};

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

export const UserIcon = z.object({
  id: z.number(),
  username: z.string(),
  name: z.optional(z.nullable(z.string())),
  avatarTemplate: z.string(),
});

export type UserIcon = z.infer<typeof UserIcon>;

// TODO: #1174: get to the bottom of why we have both `userId` and
// `user`, and why both can be nullable. Seems we made a mistake somewhere.
export const TopicPoster = z.object({
  extras: z.optional(z.nullable(z.string())),
  description: z.string(),
  userId: z.optional(z.nullable(z.number())),
  user: z.optional(z.nullable(UserIcon)),
});

export type TopicPoster = z.infer<typeof TopicPoster>;

export type Topic = {
  id: number;
  title: string;
  fancyTitle: string;
  slug: string;
  postsCount: number;
  replyCount: number;
  highestPostNumber: number;
  createdAt: string;
  lastPostedAt: string;
  bumped: boolean;
  bumpedAt: string;
  archetype: string;
  imageUrl?: string | null;
  unseen: boolean;
  pinned: boolean;
  excerpt?: string | null;
  visible: boolean;
  closed: boolean;
  archived: boolean;
  bookmarked?: boolean | null;
  liked?: boolean | null;
  tags?: Array<string> | null;
  views: number;
  likeCount: number;
  lastReadPostNumber?: number | null;
  newPosts?: number | null;
  notificationLevel?: number | null;
  unread?: number | null;
  hasSummary?: boolean;
  lastPosterUsername?: string | null;
  categoryId?: number | null;
  pinnedGlobally: boolean | null;
  posters: Array<TopicPoster>;
  authorUserId?: number | null;
  frequentPosterUserId?: number | null;
};

type TagFilter = {
  id: string;
  name: string;
  topicCount: number;
  staff: boolean;
};

type TopicList = {
  canCreateTopic: boolean;
  draft?: boolean | null;
  draftKey: string;
  draftSequence?: number | null;
  forPeriod?: string | null;
  perPage: number;
  topTags: Array<string>;
  tags?: Array<TagFilter> | null;
  topics?: Array<Topic> | null;
};

export type PMOutput = {
  primaryGroups?: Array<number> | null;
  topicList: TopicList;
  users?: Array<UserIcon> | null;
};

type DiscoursePMGroup = number | { id: number; name: string };

export type DiscoursePMInput = Omit<PMOutput, 'primaryGroups'> & {
  primaryGroups?: Array<DiscoursePMGroup> | null;
};

type Notif = {
  read: boolean;
};

export type NotificationOutput = {
  notifications: Array<Notif>;
};

export type UserAction = {
  actingAvatarTemplate: string;
  actingName: string;
  actingUserId: number;
  actionCode?: number;
  actionType: number;
  archived: boolean;
  avatarTemplate: string;
  categoryId: number;
  closed: boolean;
  createdAt: string;
  deleted: boolean;
  excerpt: string;
  hidden?: string;
  name?: string;
  postId?: number;
  postNumber: number;
  postType?: number;
  slug: string;
  targetName: string;
  targetUserId: number;
  targetUsername: string;
  title: string;
  topicId: number;
  userId: number;
};

type ActionSummary = {
  id: number;
  hidden?: boolean;
  acted?: boolean;
  canUndo?: boolean;
  canAct?: boolean;
  count?: number;
};
export type ActionsSummary = Array<ActionSummary>;
