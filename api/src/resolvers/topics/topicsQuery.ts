import camelcaseKey from 'camelcase-keys';
import {
  FieldResolver,
  queryField,
  arg,
  intArg,
  stringArg,
} from '@nexus/schema';

import { errorHandler, parseTopicUrl } from '../../helpers';
import { Context } from '../../types';
import { ACCEPTED_LANGUAGE } from '../../constants';

let topicsQueryResolver: FieldResolver<'Query', 'topics'> = async (
  _,
  { page, ...filterInput },
  context: Context,
) => {
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
    },
    params: {
      page: page || 0,
    },
  };
  try {
    let { data: topicResult } = await context.client.get(
      `/${parseTopicUrl(filterInput)}.json`,
      config,
    );

    return camelcaseKey(topicResult, { deep: true });
  } catch (error) {
    throw errorHandler(error);
  }
};

let topicsQuery = queryField('topics', {
  type: 'TopicsOutput',
  args: {
    sort: arg({ type: 'TopicsSortEnum', required: true }),
    categoryId: intArg(),
    topPeriod: arg({ type: 'TopPeriodEnum' }),
    tag: stringArg(),
    page: intArg(),
  },
  resolve: topicsQueryResolver,
});

export { topicsQuery };
