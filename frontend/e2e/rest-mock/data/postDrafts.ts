export type ListPostDraft = {
  excerpt: string;
  created_at: string;
  draft_key: string;
  sequence: number;
  draft_username: string;
  avatar_template: string;
  data: string;
  topic_id?: number | null;
  username: string;
  username_lower: string;
  name?: string | null;
  user_id: number;
  title?: string | null;
  archetype?: string | null;
};

export const mockListPostDrafts: Array<ListPostDraft> = [];

export const mockNewTopicDraft = {
  title: 'New Draft Topic',
  content: 'save new topic draft',
};

export const mockEditNewTopicDraft = {
  title: 'Edit New Draft Topic',
  content: 'save new topic draft second times',
};

export const mockPostReplyDraft = {
  content: 'save reply post',
};

export const mockNewPrivateMessageDraft = {
  title: 'New Draft Private message',
  content: 'save new private draft',
};

export const mockPrivateMessageReplyDraft = {
  content: 'private message reply draft',
};
