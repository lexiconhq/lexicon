import {
  NewPostDraft,
  NewPrivateMessageDraft,
  PostReplyDraft,
  PrivateMessageReplyDraft,
} from '../../../generatedAPI/server';
import { Apollo } from '../../../types';
import { DraftData } from '../../../types/api';
import { createSearchUsersDataLoader } from '../../dataLoader';

/*
 * This function parses the draft data, determines its type,
 * and enriches it with necessary information.
 *
 * **Draft Type Rules:**
 * - If `archetypeId` is **not** `"regular"`, it must be a `NewPrivateMessageDraft`.
 * - If `action` is `"reply"` **and** `categoryId` is present, it is a `PostReplyDraft`.
 * - If `action` is `"reply"` **and** `categoryId` is missing, it is a `PrivateMessageReplyDraft`.
 * - If `action` is **not** `"reply"` and `archetypeId` is `"regular"`, it is a `NewPostDraft`.
 * */

export async function transformDraftData(rawData: string, client: Apollo) {
  // Parse the draft data safely using zod schema validation
  const draftParse = DraftData.safeParse(JSON.parse(rawData));

  if (!draftParse.success) {
    return null;
  }

  const draftData = draftParse.data;

  let newDraftData:
    | NewPostDraft
    | PostReplyDraft
    | NewPrivateMessageDraft
    | PrivateMessageReplyDraft = {
    content: draftData.reply || '',
    action: draftData.action || '',
    tags: draftData.tags || [],
    archetypeId: draftData.archetypeId || '',
    postId: 'postId' in draftData ? draftData.postId ?? null : null,
  };

  // Determine the correct draft type based on `archetypeId` and `action`
  if (draftData.archetypeId === 'regular') {
    if (draftData.action === 'reply') {
      // If the draft is a reply in a category, treat it as a `PostReplyDraft`
      if (draftData.categoryId) {
        newDraftData = {
          ...newDraftData,
          __typename: 'PostReplyDraft',
          categoryId: draftData.categoryId,
        };
      } else {
        // Otherwise, it's a private message reply
        newDraftData = {
          ...newDraftData,
          __typename: 'PrivateMessageReplyDraft',
        };
      }
    } else {
      // If it's a new post, treat it as `NewPostDraft`
      newDraftData = {
        ...newDraftData,
        __typename: 'NewPostDraft',
        title: 'title' in draftData ? draftData.title : '',
        categoryId: draftData.categoryId || 0,
      };
    }
  } else {
    // If the `archetypeId` is not 'regular', treat it as a private message draft
    newDraftData = {
      ...newDraftData,
      __typename: 'NewPrivateMessageDraft',
      title: 'title' in draftData ? draftData.title : '',
      recipients: [],
    };

    // If recipients exist, fetch their details using DataLoader
    if ('recipients' in draftData && draftData.recipients) {
      const recipientList = draftData.recipients.split(',');
      // Create a DataLoader instance to batch and cache user lookup queries
      const recipientPromises = recipientList.map(async (recipient) => {
        const searchUsersLoader = createSearchUsersDataLoader(client);
        const user = await searchUsersLoader.load(recipient);

        return {
          __typename: 'NewPrivateMessageReceiptsDraft' as const,
          recipientData: user,
          recipient,
        };
      });

      // Wait for all recipient data to be resolved
      newDraftData.recipients = await Promise.all(recipientPromises);
    }
  }

  return newDraftData;
}
