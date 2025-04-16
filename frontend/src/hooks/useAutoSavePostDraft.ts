import { UseFormGetValues } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';

import { draftSaveManager, refetchQueriesPostDraft } from '../constants';
import {
  CreateAndUpdatePostDraftMutationFn,
  CreatePostDraftDataInput,
  PostDraftType,
} from '../generatedAPI/server';
import {
  combineContentWithPollContent,
  combineDataMarkdownPollAndImageList,
} from '../helpers';
import { NewPostForm } from '../types';

type UseAutoSavePostDraftProps = {
  createPostDraft: CreateAndUpdatePostDraftMutationFn;
  type: PostDraftType;
  getValues: UseFormGetValues<NewPostForm>;
  topicId?: number;
  replyToPostId?: number;
  skip?: boolean;
};

/**
 * Custom hook to automatically save post drafts with debouncing.
 * This hook is used in different scenes to handle draft-saving logic for
 * new topics, private messages, post replies, and message replies.
 *
 * @param {UseAutoSavePostDraftProps} params - The parameters required for draft saving.
 * @param {CreateAndUpdatePostDraftMutationFn} params.createPostDraft - GraphQL mutation function to save drafts.
 * @param {PostDraftType} params.type - The type of the post draft (new topic, private message, post reply, and message reply.).
 * @param {UseFormGetValues<NewPostForm>} params.getValues - retrieve form values.
 * @param {number} [params.topicId] - Optional topic ID for replies.
 * @param {number} [params.replyToPostId] - Optional post ID when replying to a specific message.
 * @param {boolean} params.skip - optional skip condition if do not want to run debounce
 *
 * @returns {Function} - A debounced function that saves the post draft when invoked.
 */

export function useAutoSavePostDraft({
  createPostDraft,
  type,
  getValues,
  topicId,
  replyToPostId,
  skip,
}: UseAutoSavePostDraftProps) {
  const debounceSaveDraft = useDebouncedCallback(() => {
    // return if already start save from saveAndDiscardPostDraftAlert and change scene

    if (
      draftSaveManager.isDraftSaving() ||
      !draftSaveManager.isCanStartAutoSave() ||
      skip
    ) {
      return;
    }

    draftSaveManager.startSaving();

    const {
      raw: content,
      title,
      polls,
      channelId,
      tags,
      sequence,
      draftKey,
      messageTargetSelectedUsers,
      imageMessageReplyList,
    } = getValues();

    const updatedContentWithPoll = combineContentWithPollContent({
      content,
      polls: polls ?? [],
    });

    let draftData: CreatePostDraftDataInput = {
      content: updatedContentWithPoll,
      type,
    };

    if (type === PostDraftType.NewTopic) {
      draftData = {
        ...draftData,
        categoryId: channelId,
        tags: tags || [],
        title,
      };
    } else if (type === PostDraftType.NewPrivateMessage) {
      draftData = {
        ...draftData,
        tags: [],
        recipients: messageTargetSelectedUsers,
        title,
      };
    } else {
      // Post reply or message reply
      const isMessageReply = type === PostDraftType.PrivateMessageReply;
      let updatedContent = isMessageReply
        ? combineDataMarkdownPollAndImageList({
            content,
            polls,
            imageList: imageMessageReplyList,
          })
        : updatedContentWithPoll;

      draftData = {
        ...draftData,
        tags: tags || [],
        content: updatedContent,
        topicId,
        postId: replyToPostId,
      };

      if (!isMessageReply) {
        draftData.categoryId = channelId;
      }
    }

    try {
      createPostDraft({
        variables: {
          draftData,
          draftKey,
          sequence: sequence || 0,
        },
        refetchQueries: refetchQueriesPostDraft,
      });
    } finally {
      draftSaveManager.finishSaving();
    }
  }, 3000);

  return { debounceSaveDraft };
}
