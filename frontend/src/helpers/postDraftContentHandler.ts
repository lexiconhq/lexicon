/* eslint-disable no-underscore-dangle */
import { ListPostDraftsResult } from '../generatedAPI/server';

import {
  convertPrivateMessageRecipientsDraftIntoUserObject,
  UserMap,
} from './privateMessageRecipientsDraft';

type PostDraftData = {
  title?: string | null;
  content: string;
  categoryId?: number | null;
  tags: Array<string>;
  action: string;
  archetypeId: string;
  recipients?: UserMap | null;
  draftType:
    | 'NewTopic'
    | 'PostReply'
    | 'NewPrivateMessage'
    | 'PrivateMessageReply';
  postId?: number | null;
};

export type PostDraftList = Omit<ListPostDraftsResult, 'draft' | 'title'> & {
  draft?: PostDraftData | null;
  topicTitle?: string | null;
  isReply: boolean;
  isPrivateMessage: boolean;
};

export function postDraftContentHandler(
  drafts: Array<ListPostDraftsResult>,
): Array<PostDraftList> {
  return drafts.map((item) => {
    const { title, draft, ...others } = item;

    if (!draft) {
      return {
        ...others,
        topicTitle: title,
        draft: null,
        isReply: false,
        isPrivateMessage: false,
      };
    }

    const draftType =
      draft.__typename === 'NewPostDraft'
        ? 'NewTopic'
        : draft.__typename === 'NewPrivateMessageDraft'
        ? 'NewPrivateMessage'
        : draft.__typename === 'PostReplyDraft'
        ? 'PostReply'
        : 'PrivateMessageReply';

    const isReply =
      draft.__typename === 'PostReplyDraft' ||
      draft.__typename === 'PrivateMessageReplyDraft';

    const isPrivateMessage =
      draft.__typename === 'NewPrivateMessageDraft' ||
      draft.__typename === 'PrivateMessageReplyDraft';

    let recipients = undefined;
    if (draft.__typename === 'NewPrivateMessageDraft' && draft.recipients) {
      recipients = convertPrivateMessageRecipientsDraftIntoUserObject(
        draft.recipients ?? [],
      );
    }
    return {
      ...others,
      topicTitle: title,
      draft: { ...draft, recipients, draftType },
      isReply,
      isPrivateMessage,
    };
  });
}
