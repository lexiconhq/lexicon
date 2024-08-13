import { FieldResolver, queryField } from 'nexus';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';
import { ACCEPTED_LANGUAGE, CONTENT_JSON } from '../../constants';

let pluginStatusResolver: FieldResolver<'Query', 'pluginStatus'> = async (
  _,
  __,
  context: Context,
) => {
  try {
    const config = {
      headers: {
        'Accept-Language': ACCEPTED_LANGUAGE,
        'Content-Type': CONTENT_JSON,
      },
    };
    let {
      data: { apple, loginLink },
    } = await context.client.get(`/lexicon/auth/status.json`, config);

    return {
      appleLoginEnabled: apple,
      loginLinkEnabled: loginLink,
    };
  } catch (error) {
    throw errorHandler(error);
  }
};

let pluginStatusQuery = queryField('pluginStatus', {
  type: 'PluginStatus',
  resolve: pluginStatusResolver,
});

export { pluginStatusQuery };
