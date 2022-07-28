import { Topic } from '../../types';

const defaultDateString = '2022-07-01T00:00:00Z';

const defaultProperties = {
  id: 0,
  title: 'title',
  fancyTitle: 'title',
  slug: 'title',
  postsCount: 0,
  replyCount: 0,
  highestPostNumber: 0,
  imageUrl: null,
  createdAt: defaultDateString,
  lastPostedAt: defaultDateString,
  bumped: true,
  bumpedAt: defaultDateString,
  archetype: 'regular',
  unseen: false,
  lastReadPostNumber: 0,
  unread: 0,
  newPosts: 0,
  pinned: false,
  visible: true,
  closed: false,
  archived: false,
  notificationLevel: 3,
  bookmarked: false,
  liked: false,
  views: 0,
  likeCount: 0,
  hasSummary: false,
  lastPosterUsername: 'username',
  categoryId: null,
  pinnedGlobally: false,
  posters: [],

  // Not-yet supported properties:
  // participants: [],
  // allowedUserCount: 2,
  // hasAcceptedAnswer: false,
  // voteCount: 0,
  // canVote: false,
  // userVoted: false,
  // featuredLink: null,
  // unpinned: null,
};

export type TopicOptions = Partial<Topic>;

export default function createTopic(options: TopicOptions = {}): Topic {
  return { ...defaultProperties, ...options };
}
