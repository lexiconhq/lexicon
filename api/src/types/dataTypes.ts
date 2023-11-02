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
  userId: z.number(),
  user: UserIcon,
});

export const SuggestionTopicPoster = z.object({
  extras: z.optional(z.nullable(z.string())),
  description: z.string(),
  user: UserIcon,
});

export const PosterUnion = z.union([TopicPoster, SuggestionTopicPoster]);

export type PosterUnion = z.infer<typeof PosterUnion>;

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
  posters: Array<PosterUnion>;
  authorUserId?: number | null;
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

const ActionSummary = z.array(
  z.object({
    id: z.number(),
    hidden: z.optional(z.nullable(z.boolean())),
    acted: z.optional(z.nullable(z.boolean())),
    canUndo: z.optional(z.nullable(z.boolean())),
    canAct: z.optional(z.nullable(z.boolean())),
    count: z.optional(z.nullable(z.number())),
  }),
);
const ActionsSummary = z.array(ActionSummary);

const PollOption = z.object({
  id: z.string(),
  html: z.string(),
  votes: z.number(),
});

const PreloadedVotersUser = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string(),
  avatarTemplate: z.string(),
  title: z.optional(z.nullable(z.string())),
});

const PreloadedVoters = z.record(z.string(), z.array(PreloadedVotersUser));

const PollsVotes = z.record(z.string(), z.array(z.string()));
export type PollsVotes = z.infer<typeof PollsVotes>;

export const POLL_TYPE = ['regular', 'multiple', 'number'] as const;
export const POLL_RESULTS = ['always', 'on_vote', 'on_close'] as const;
export const POLL_STATUS = ['open', 'closed'] as const;
export const POLL_CHART_TYPE = ['bar', 'pie'] as const;

const Poll = z.object({
  name: z.string(),
  type: z.enum(POLL_TYPE),
  status: z.enum(POLL_STATUS),
  public: z.boolean(),
  results: z.enum(POLL_RESULTS),
  options: z.array(PollOption),
  voters: z.number(),
  preloadedVoters: PreloadedVoters,
  chartType: z.enum(POLL_CHART_TYPE),
  groups: z.optional(z.nullable(z.string())),
  title: z.optional(z.nullable(z.string())),
  close: z.optional(z.nullable(z.string())),
  min: z.optional(z.nullable(z.number())),
  max: z.optional(z.nullable(z.number())),
  step: z.optional(z.nullable(z.number())),
});
export type Poll = z.infer<typeof Poll>;

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
  actionsSummary: ActionsSummary,
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
});
export type Post = z.infer<typeof Post>;
