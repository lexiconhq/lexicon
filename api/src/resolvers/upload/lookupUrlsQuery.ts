import camelcaseKeys from 'camelcase-keys';
import { FieldResolver, queryField, stringArg } from '@nexus/schema';

import { CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

let lookupUrlsQueryResolver: FieldResolver<'Query', 'lookupUrls'> = async (
  _,
  { shortUrls },
  context: Context,
) => {
  let body = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    short_urls: shortUrls,
  };
  const config = {
    headers: {
      'Content-Type': CONTENT_JSON,
    },
  };
  try {
    let url = '/uploads/lookup-urls.json';
    let { data: lookupUrlsResult } = await context.client.post(
      url,
      JSON.stringify(body),
      config,
    );

    return camelcaseKeys(lookupUrlsResult, { deep: true });
  } catch (error) {
    throw errorHandler(error);
  }
};

let lookupUrlsQuery = queryField('lookupUrls', {
  type: 'LookupUrl',
  list: true,
  args: {
    shortUrls: stringArg({ required: true, list: true }),
  },
  resolve: lookupUrlsQueryResolver,
});

export { lookupUrlsQuery };
