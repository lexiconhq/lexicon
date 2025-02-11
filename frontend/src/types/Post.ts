import {
  Poll as BasePoll,
  PollOption as BasePollOption,
  PollsVotes as BasePollsVotes,
} from '../generatedAPI/server';

import { PostReplyParams } from './Navigation';
import { Channel } from './Types';

export type User = {
  id: number;
  username: string;
  avatar: string;
  name?: string | null;
};

export type Poll = Omit<BasePoll, '__typename'>;
export type PollOption = Omit<BasePollOption, '__typename'>;
export type PollsVotes = Omit<BasePollsVotes, '__typename'>;

export type Post = {
  id: number;
  topicId: number;
  title: string;
  content: string;
  username: string;
  avatar: string;
  viewCount: number;
  replyCount: number;
  likeCount: number;
  isLiked: boolean;
  channel: Channel;
  freqPosters: Array<User>;
  createdAt: string;
  hidden?: boolean;
  mentionedUsers?: Array<string>;
  pinned?: boolean;
  tags?: Array<string>;
  postNumber?: number;
  replyToPostNumber?: number | null;
  canEdit?: boolean;
  canFlag?: boolean;
  imageUrls?: Array<string>;
  emojiStatus?: string;
  polls?: Array<Poll>;
  pollsVotes?: Array<PollsVotes>;
};

export type PostWithoutId = Omit<Post, 'id'>;

export type Topic = {
  id: number;
  firstPostId: number;
  title: string;
  canEditTopic: boolean;
  viewCount: number;
  likeCount: number;
  replyCount: number;
  selectedTag: Array<string>;
  selectedChannelId: number;
};

export type PostData = {
  images?: Array<string>;
  topicId: number;
  postNumber?: number;
} & Pick<PostReplyParams, 'replyToPostId'>;
