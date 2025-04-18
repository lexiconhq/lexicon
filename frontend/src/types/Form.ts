import { PollType } from '../generatedAPI/server';
import { PollOption } from '../helpers';

import { UserMessageProps } from './Types';

export type Form = {
  raw: string;
};

export type FormTitle = Form & {
  title: string;
};

export type FormPostDraft = {
  isDraft?: boolean;
  draftKey?: string;
  sequence?: number;
};

export type NewPostForm = FormTitle &
  FormPostDraft & {
    channelId: number;
    tags: Array<string>;
    editPostId?: number;
    editTopicId?: number;
    oldContent?: string;
    oldTitle?: string;
    polls?: Array<PollFormContextValues>;
    messageTargetSelectedUsers?: Array<string>;
    messageUsersList?: Array<UserMessageProps>;
    imageMessageReplyList?: Array<ImageFormContextValues>;
  };

export type PollFormValues = {
  title?: string;
  minChoice: number;
  maxChoice: number;
  step: number;
  pollOptions: Array<PollOption | string>;
  results: number;
  chartType?: number;
  groups: Array<string>;
  closeDate: Date | undefined;
  isPublic: boolean;
};

export type PollFormContextValues = PollFormValues & {
  pollChoiceType: PollType;
  pollContent: string;
};

export type ImageFormContextValues = {
  url: string;
  shortUrl: string;
  imageMarkdown: string;
};
