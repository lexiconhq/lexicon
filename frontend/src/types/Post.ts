import { Channel } from './Types';

export type User = {
  id: number;
  username: string;
  avatar: string;
  name?: string | null;
};

export type Post = {
  id: number;
  topicId: number;
  title: string;
  content: string;
  hidden?: boolean;
  images?: Array<string>;
  mentionedUsers?: Array<string>;
  username: string;
  avatar: string;
  viewCount: number;
  replyCount: number;
  pinned?: boolean;
  likeCount: number;
  isLiked: boolean;
  channel: Channel;
  tags?: Array<string>;
  createdAt: string;
  freqPosters: Array<User>;
  postNumber?: number;
  replyToPostNumber?: number | null;
  canEdit?: boolean;
  canFlag?: boolean;
};

export type Topic = {
  id: number;
  firstPostId: number;
  title: string;
  canEditTopic: boolean;
  viewCount: number;
  likeCount: number;
  replyCount: number;
  selectedTag: Array<string>;
  selectedChanelId: number;
};

export type NewPost = {
  title: string;
  content: string;
  images?: Array<string>;
  channelId: number;
  tagIds: Array<string>;
  createdAt: string;
};

export type ReplyPost = {
  title: string;
  content: string;
  topicId: number;
  createdAt: string;
  post?: Post;
};
