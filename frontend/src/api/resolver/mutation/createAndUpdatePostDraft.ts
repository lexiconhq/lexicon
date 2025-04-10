import { Resolver } from '@apollo/client';

import {
  CreateAndUpdatePostDraftMutationVariables,
  CreateAndUpdatePostDraftRestDocument,
  CreateAndUpdatePostDraftRestMutationVariables,
  CreateAndUpdatePostDraftRestMutation as CreateAndUpdatePostDraftRestType,
  NewPrivateMessageDraft,
  PostReplyDraft,
} from '../../../generatedAPI/server';
import { Apollo } from '../../../types';

type DraftDataInput =
  | Omit<PostReplyDraft, 'content' | 'postId'>
  | (Omit<NewPrivateMessageDraft, 'content' | 'recipients' | 'title'> & {
      reply: string;
      archetypeId: string;
      metaData: string | null;
      title?: string;
      postId?: number | null;
      recipients?: string;
    });

export let createAndUpdatePostDraftResolver: Resolver = async (
  _,
  { draftData, draftKey, sequence }: CreateAndUpdatePostDraftMutationVariables,
  { client }: { client: Apollo },
) => {
  const {
    type,
    content,
    categoryId,
    tags,
    title,
    postId,
    recipients,
    topicId,
  } = draftData;
  const isNewTopic = type === 'NewTopic';
  const isNewPrivateMessage = type === 'NewPrivateMessage';

  if (!isNewTopic && !isNewPrivateMessage && !topicId) {
    throw Error('Invalid input');
  }

  let dataInput: DraftDataInput = {
    reply: content,
    categoryId:
      isNewPrivateMessage || type === 'PrivateMessageReply'
        ? null
        : categoryId || null,
    tags: tags || [],
    archetypeId: isNewPrivateMessage ? 'private_message' : 'regular',
    metaData: null,
    action: isNewTopic
      ? 'createTopic'
      : isNewPrivateMessage
      ? 'privateMessage'
      : 'reply',
  };

  if (isNewTopic || isNewPrivateMessage) {
    dataInput = { ...dataInput, title: title || '' };
  }

  if (!isNewTopic && !isNewPrivateMessage && postId) {
    dataInput = { ...dataInput, postId: postId };
  }

  if (isNewPrivateMessage) {
    dataInput = {
      ...dataInput,
      recipients: recipients?.join(',') ?? '',
    };
  }

  let dataInputStringify = JSON.stringify(dataInput);

  // Check if draftKey exists. If it does, this is an update; otherwise, generate a new draft key.
  let newDraftKey = draftKey;
  if (!newDraftKey) {
    let time = new Date().getTime();
    newDraftKey = isNewTopic
      ? 'new_topic_' + time
      : isNewPrivateMessage
      ? 'new_private_message_' + time
      : 'topic_' + topicId?.toString();
  }

  try {
    const { data } = await client.mutate<
      CreateAndUpdatePostDraftRestType,
      CreateAndUpdatePostDraftRestMutationVariables
    >({
      mutation: CreateAndUpdatePostDraftRestDocument,
      variables: {
        createAndUpdatePostDraftInputRest: {
          draftKey: newDraftKey,
          data: dataInputStringify,
          // If forceSave is true, the draft will be saved regardless of the sequence.
          forceSave: true,
          sequence,
        },
      },
    });

    return {
      draftSequence: data?.createAndUpdatePostDraftRest?.draftSequence,
      success: data?.createAndUpdatePostDraftRest?.success || '',
      draftKey: newDraftKey,
    };
  } catch {
    throw new Error('Failed to save draft please try again');
  }
};
