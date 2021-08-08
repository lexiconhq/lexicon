import camelcaseKeys from 'camelcase-keys';
import { FieldResolver, queryField, intArg, stringArg } from '@nexus/schema';

import { errorHandler, privateMessagesMerger } from '../../helpers';
import { Context, PMOutput } from '../../types';

let privateMessageQueryResolver: FieldResolver<
  'Query',
  'privateMessage'
> = async (_, { username, page = 0 }, context: Context) => {
  const config = {
    params: {
      page,
    },
  };

  try {
    let urlInbox = `/topics/private-messages/${username}.json`;
    let { data: privateMessageInboxResult } = await context.client.get(
      urlInbox,
      config,
    );

    let urlSent = `/topics/private-messages-sent/${username}.json`;
    let { data: privateMessageSentResult } = await context.client.get(
      urlSent,
      config,
    );
    let camelcasePMInbox: PMOutput = camelcaseKeys(privateMessageInboxResult, {
      deep: true,
    });
    let camelcasePMSent: PMOutput = camelcaseKeys(privateMessageSentResult, {
      deep: true,
    });

    return privateMessagesMerger(camelcasePMInbox, camelcasePMSent);
  } catch (error) {
    throw errorHandler(error);
  }
};

let privateMessageQuery = queryField('privateMessage', {
  type: 'PrivateMessageOutput',
  args: {
    username: stringArg({ required: true }),
    page: intArg(),
  },
  resolve: privateMessageQueryResolver,
});

export { privateMessageQuery };
