import camelcaseKeys from 'camelcase-keys';
import { FieldResolver, list, queryField, stringArg } from 'nexus';

import { ACCEPTED_LANGUAGE, CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

let lookupUrlsQueryResolver: FieldResolver<'Query', 'lookupUrls'> = async (
  _,
  { shortUrls },
  context: Context,
) => {
  let body = {
    short_urls: shortUrls,
  };
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_JSON,
    },
  };
  try {
    let url = '/uploads/lookup-urls.json';
    let { data: lookupUrlsResult } = await context.client.post(
      url,
      body,
      config,
    );

    return camelcaseKeys(lookupUrlsResult, { deep: true });
  } catch (error) {
    throw errorHandler(error);
  }
};

let lookupUrlsQuery = queryField('lookupUrls', {
  type: list('LookupUrl'),
  args: {
    shortUrls: list(stringArg()),
  },
  resolve: lookupUrlsQueryResolver,
});

export { lookupUrlsQuery };
