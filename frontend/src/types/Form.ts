export type Form = {
  raw: string;
};

export type FormTitle = Form & {
  title: string;
};

export type NewPostForm = FormTitle & {
  channelId: number;
  tags: Array<string>;
  editPostId?: number;
  editTopicId?: number;
};
