import { UseFormReset, UseFormSetValue } from 'react-hook-form';
import { Alert } from 'react-native';

import {
  FORM_DEFAULT_VALUES,
  NO_CHANNEL_FILTER_ID,
  refetchQueriesPostDraft,
} from '../constants';
import { CheckPostDraftResult } from '../generatedAPI/server';
import {
  DeletePostDraftMutateFnInput,
  NewPostForm,
  RootStackParamList,
} from '../types';

import { convertPollMarkdown } from './convertPollMarkdown';
import { filterMarkdownContentPoll } from './processRawContent';

type BaseDraftAlertInput = {
  deletePostDraft: (args: DeletePostDraftMutateFnInput) => void;
  checkPostDraft: CheckPostDraftResult;
  navigate: {
    (screen: 'PostReply', params: RootStackParamList['PostReply']): void;
  };
  resetForm: UseFormReset<NewPostForm>;
  setValue: UseFormSetValue<NewPostForm>;
};

type PostReplyDraftAlertInput = BaseDraftAlertInput & {
  replyToPostId?: number;
  titleTopic: string;
  topicId: number;
  channelId: number;
  focusedPostNumber?: number;
};

/**
 * Based on the new design, post drafts are only checked when replying to a post.
 * New post replies and new private messages will always create a new post
 * according to the updated Discourse flow.
 */

export function checkDraftAlert(input: PostReplyDraftAlertInput) {
  const {
    deletePostDraft,
    checkPostDraft,
    navigate,
    resetForm,
    setValue,
    focusedPostNumber,
  } = input;

  let draftData = checkPostDraft.draft;

  const channelId =
    draftData && 'categoryId' in draftData && draftData.categoryId
      ? draftData.categoryId
      : NO_CHANNEL_FILTER_ID;

  Alert.alert(
    t('You Have Drafts Saved'),
    t(
      'It appears you have drafts saved. Would you like to continue editing from one of them?',
    ),
    [
      {
        text: t('Create New Post Reply & Discard Draft'),
        onPress: () => {
          const { topicId, titleTopic, replyToPostId, channelId } = input;
          deletePostDraft({
            variables: {
              draftKey: `topic_${topicId}`,
              sequence: checkPostDraft.sequence,
            },
            refetchQueries: refetchQueriesPostDraft,
          });
          resetForm(FORM_DEFAULT_VALUES);

          setValue('sequence', checkPostDraft.sequence);
          setValue('channelId', channelId);

          navigate('PostReply', {
            topicId: topicId || 0,
            title: titleTopic || '',
            replyToPostId,
            focusedPostNumber,
          });
        },
      },
      {
        text: t('Continue from Draft'),
        onPress: () => {
          const { topicId, titleTopic, replyToPostId } = input;
          const newContentFilter = filterMarkdownContentPoll(
            draftData?.content,
          );

          resetForm({
            raw: newContentFilter.filteredMarkdown,
            tags: draftData?.tags || [],
            channelId,
            sequence: checkPostDraft.sequence,
            isDraft: true,
            polls: convertPollMarkdown(newContentFilter.pollMarkdowns),
            draftKey: `topic_${topicId}`,
          });
          setValue('oldContent', newContentFilter.filteredMarkdown);

          navigate('PostReply', {
            topicId: topicId,
            title: titleTopic,
            replyToPostId: replyToPostId || undefined, // Here, we want to update the postId reply to the latest value when the user taps on the screen.
            focusedPostNumber,
          });
        },
      },
      {
        text: t('Cancel'),
        style: 'destructive',
      },
    ],
  );
}
