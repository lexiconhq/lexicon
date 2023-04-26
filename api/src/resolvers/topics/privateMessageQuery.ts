import camelcaseKeys from 'camelcase-keys';
import { FieldResolver, queryField, intArg, stringArg, nullable } from 'nexus';

import { errorHandler, privateMessagesMerger } from '../../helpers';
import { Context, PMOutput } from '../../types';
import { ACCEPTED_LANGUAGE } from '../../constants';

let privateMessageQueryResolver: FieldResolver<
  'Query',
  'privateMessage'
> = async (_, { username, page = 0 }, context: Context) => {
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
    },
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
    username: stringArg(),
    page: nullable(intArg()),
  },
  resolve: privateMessageQueryResolver,
});

export { privateMessageQuery };
