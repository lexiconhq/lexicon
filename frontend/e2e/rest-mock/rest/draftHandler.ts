import { http, HttpResponse } from 'msw';
import { z } from 'zod';

import { CreateAndUpdatePostDraftInputRest } from '../../../src/generatedAPI/server';
import {
  ListPostDraft,
  mockListPostDrafts,
  mockMessages,
  mockTopicsRest,
  mockUsers,
} from '../data';
import { KeysToSnakeCase } from '../utils';

type DraftKeyParam = {
  draftKey: string;
};

const DraftDataInputSchema = z.object({
  reply: z.string(),
  categoryId: z.number().nullable(),
  tags: z.array(z.string()),
  archetypeId: z.enum(['private_message', 'regular']),
  metaData: z.string().nullable(),
  action: z.enum(['createTopic', 'privateMessage', 'reply']),
  title: z.string().optional(),
  postId: z.number().nullable().optional(),
  recipients: z.string().optional(),
});

function parseDraftKey(draftKey: string) {
  if (draftKey.startsWith('new_topic_')) {
    return { type: 'newTopic', id: null };
  } else if (draftKey.startsWith('new_private_message_')) {
    return { type: 'newPrivateMessage', id: null };
  } else if (draftKey.startsWith('topic_')) {
    const id = draftKey.replace('topic_', '');
    return { type: 'topic', id: Number(id) };
  }

  return { type: 'unknown', id: null };
}

export const draftHandler = [
  // List Post Draft
  http.get(`/drafts.json`, () => {
    return HttpResponse.json({
      drafts: mockListPostDrafts,
    });
  }),

  // Check post draft list
  http.get<DraftKeyParam>(`/drafts/:draftKey.json`, (req) => {
    const { draftKey } = req.params;
    if (!draftKey) {
      throw new Error('Draft key empty');
    }

    let findDraft = mockListPostDrafts.find(
      (draft) => draftKey === draft.draft_key,
    );

    if (!findDraft) {
      return HttpResponse.json({
        draft_sequence: 0,
        draft: null,
      });
    }

    return HttpResponse.json({
      draft_sequence: findDraft.sequence,
      draft: findDraft.data,
    });
  }),

  // Delete post draft
  http.delete<DraftKeyParam>('/drafts/:draftKey.json', (req) => {
    let uri = new URL(req.request.url);
    let draftKey = uri.searchParams.get('draft_key') || '';
    if (!draftKey) {
      throw new Error('Draft key empty');
    }

    let indexToRemove = mockListPostDrafts.findIndex(
      (draft) => draftKey === draft.draft_key,
    );

    if (indexToRemove !== -1) {
      mockListPostDrafts.splice(indexToRemove, 1);
    }

    return HttpResponse.json({
      success: 'OK',
    });
  }),

  // create and update post draft
  http.post<never, KeysToSnakeCase<CreateAndUpdatePostDraftInputRest>>(
    '/drafts.json',
    async (req) => {
      // Parse and validate request payload
      const {
        draft_key: dataDraftKey,
        data,
        sequence,
      } = await req.request.json();

      const validationResult = DraftDataInputSchema.safeParse(JSON.parse(data));
      if (!validationResult.success) {
        throw new Error('Invalid draft data.');
      }

      const { reply, categoryId, title } = validationResult.data;

      // Create initial draft structure
      let newDraft: ListPostDraft = {
        excerpt: reply,
        created_at: new Date().toISOString(),
        draft_key: dataDraftKey,
        sequence,
        draft_username: mockUsers[0].username,
        avatar_template: mockUsers[0].avatarTemplate,
        data,
        topic_id: null,
        user_id: mockUsers[0].id,
        username: mockUsers[0].username,
        username_lower: mockUsers[0].username,
        name: mockUsers[0].name,
        title: null,
        archetype: null,
      };

      // Parse draft key and update draft accordingly
      const { type, id } = parseDraftKey(dataDraftKey);

      switch (type) {
        case 'newTopic':
        case 'newPrivateMessage':
          newDraft.title = title;
          break;

        case 'topic': {
          newDraft.topic_id = id;
          newDraft.archetype = categoryId ? 'regular' : 'private_message';

          const topic = [...mockTopicsRest, ...mockMessages].find(
            (t) => t.id === id,
          );
          if (!topic) {
            throw new Error(`Topic with ID ${id} not found.`);
          }

          newDraft.title = topic.title;

          const author = mockUsers.find(
            (u) => u.id === topic.posters[0].userId,
          );
          if (author) {
            newDraft.username = author.username;
            newDraft.username_lower = author.username.toLowerCase();
            newDraft.name = author.name;
          }

          break;
        }

        default:
          throw new Error(`Invalid draft key: ${dataDraftKey}`);
      }

      // Check if the draft already exists, update or insert accordingly
      const existingDraftIndex = mockListPostDrafts.findIndex(
        (draft) => draft.draft_key === dataDraftKey,
      );

      if (existingDraftIndex !== -1) {
        newDraft.created_at = mockListPostDrafts[existingDraftIndex].created_at;
        newDraft.sequence = sequence + 1;
        mockListPostDrafts[existingDraftIndex] = newDraft;
      } else {
        mockListPostDrafts.unshift(newDraft);
      }

      // Return response
      return HttpResponse.json({
        success: 'OK',
        draft_sequence: sequence + 1,
      });
    },
  ),
];
