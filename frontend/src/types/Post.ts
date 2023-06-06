import { PostReplyParams } from './Navigation';
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
  postNumber?: number;
  channelId?: number;
} & Pick<PostReplyParams, 'replyToPostId'>;
