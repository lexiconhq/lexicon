import { EventArg, NavigationAction } from '@react-navigation/native';
import { UseFormGetValues, UseFormReset } from 'react-hook-form';
import { Alert } from 'react-native';

import {
  draftSaveManager,
  FORM_DEFAULT_VALUES,
  refetchQueriesPostDraft,
} from '../constants';
import {
  CreateAndUpdatePostDraftMutationFn,
  CreatePostDraftDataInput,
  PostDraftType,
} from '../generatedAPI/server';
import {
  DeletePostDraftMutateFnInput,
  NewPostForm,
  RootStackNavProp,
} from '../types';

import { combineContentWithPollContent } from './pollUtility';
import { combineDataMarkdownPollAndImageList } from './processRawContent';

type SaveDraftAlertInput = {
  getValues: UseFormGetValues<NewPostForm>;
  resetForm: UseFormReset<NewPostForm>;
  createPostDraft: CreateAndUpdatePostDraftMutationFn;
  deletePostDraft: (args: DeletePostDraftMutateFnInput) => void;
  navigation: RootStackNavProp<
    'NewPost' | 'PostReply' | 'NewMessage' | 'MessageDetail'
  >;
  event: EventArg<'beforeRemove', true, { action: NavigationAction }>;
  draftType: PostDraftType;
  topicId?: number;
  replyToPostId?: number;
};

export function saveAndDiscardPostDraftAlert(input: SaveDraftAlertInput) {
  const {
    getValues,
    createPostDraft,
    deletePostDraft,
    resetForm,
    navigation,
    event,
    draftType,
    topicId,
    replyToPostId,
  } = input;

  const isNewTopic = draftType === PostDraftType.NewTopic;
  const isNewPrivateMessage = draftType === PostDraftType.NewPrivateMessage;

  const isMessageReply = draftType === PostDraftType.PrivateMessageReply;

  const handleSaveDraft = async () => {
    // make sure auto save draft not save draft at same time
    if (draftSaveManager.isDraftSaving()) {
      return;
    }
    draftSaveManager.startSaving();
    let {
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

    let updatedContent = combineContentWithPollContent({
      content,
      polls: polls ?? [],
    });

    let draftData: CreatePostDraftDataInput = {
      content: updatedContent,
      type: draftType,
    };

    // handle data draft based on type
    if (isNewTopic) {
      draftData = {
        ...draftData,
        categoryId: channelId,
        tags: tags || [],
        title,
      };
    } else if (isNewPrivateMessage) {
      draftData = {
        ...draftData,
        tags: [],
        recipients: messageTargetSelectedUsers,
        title,
      };
    } else {
      // if message reply using content with image
      if (isMessageReply) {
        updatedContent = combineDataMarkdownPollAndImageList({
          content,
          polls,
          imageList: imageMessageReplyList,
        });
      }

      draftData = {
        ...draftData,
        tags: tags || [],
        content: updatedContent,
        topicId,
        postId: replyToPostId,
      };

      // if post reply added channel id
      if (!isMessageReply) {
        draftData.categoryId = channelId;
      }
    }

    await createPostDraft({
      variables: { draftData, draftKey, sequence: sequence || 0 },
      refetchQueries: refetchQueriesPostDraft,
    });

    draftSaveManager.finishSaving();
    resetForm(FORM_DEFAULT_VALUES);
    navigation.dispatch(event.data.action);
  };

  const handleDiscardDraft = () => {
    let { sequence, isDraft, draftKey } = getValues();
    if (typeof sequence === 'number' && isDraft && draftKey) {
      deletePostDraft({
        variables: { draftKey, sequence },
        refetchQueries: refetchQueriesPostDraft,
      });
    }

    resetForm(FORM_DEFAULT_VALUES);
    navigation.dispatch(event.data.action);
  };
  const getAlertMessage = () => {
    if (isNewTopic) {
      return t(
        'Would you like to discard changes, save as a draft, or continue editing this post?',
      );
    }
    if (isNewPrivateMessage) {
      return t(
        'Would you like to discard changes, save as a draft, or continue editing this private message?',
      );
    }
    if (isMessageReply) {
      return t(
        'Would you like to discard changes, save as a draft, or continue editing this private message reply?',
      );
    }
    return t(
      'Would you like to discard changes, save as a draft, or continue editing this post reply?',
    );
  };

  Alert.alert(t('Save as Draft?'), getAlertMessage(), [
    {
      text: t('Save as Draft'),
      onPress: handleSaveDraft,
    },
    { text: t('Keep Editing') },
    {
      text: t('Discard Changes'),
      style: 'destructive',
      onPress: handleDiscardDraft,
    },
  ]);
}
