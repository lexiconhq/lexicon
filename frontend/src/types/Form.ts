import { PollType } from '../generated/server';
import { PollOption } from '../helpers';

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
  oldContent?: string;
  oldTitle?: string;
  polls?: Array<PollFormContextValues>;
};

export type PollFormValues = {
  title?: string;
  minChoice: number;
  maxChoice: number;
  step: number;
  pollOptions: Array<PollOption | string>;
  results: number;
  chartType: number;
  groups: Array<string>;
  closeDate: Date | undefined;
  isPublic: boolean;
};

export type PollFormContextValues = PollFormValues & {
  pollChoiceType: PollType;
  pollContent: string;
};
