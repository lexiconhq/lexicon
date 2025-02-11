import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import {
  ReplyPrivateMessageMutationVariables as ReplyPrivateMessageVariables,
  ReplyTopicDocument,
  ReplyTopicMutationVariables,
  ReplyTopicMutation as ReplyTopicType,
  UploadDocument,
  UploadMutationVariables,
  UploadMutation as UploadType,
} from '../../../generatedAPI/server';

export let replyResolver = async (
  _: Record<string, unknown>,
  { replyInput, file, type, userId }: ReplyPrivateMessageVariables,
  { client }: { client: ApolloClient<NormalizedCacheObject> },
) => {
  if (file && type) {
    let { data } = await client.mutate<UploadType, UploadMutationVariables>({
      mutation: UploadDocument,
      variables: {
        input: {
          file,
          userId,
          type,
        },
      },
    });
    let {
      originalFilename: name,
      width,
      height,
      shortUrl,
    } = data?.upload || {};
    let image = `![${name}|${width} x ${height}](${shortUrl})`;

    replyInput.raw = image + '\n' + replyInput.raw;
  }

  let { data: replyPostData } = await client.mutate<
    ReplyTopicType,
    ReplyTopicMutationVariables
  >({
    mutation: ReplyTopicDocument,
    variables: { replyInput: { ...replyInput, archetype: 'regular' } },
  });

  return {
    ...replyPostData?.replyPost,
  };
};
