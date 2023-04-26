import { FieldResolver, queryField } from 'nexus';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';

let aboutResolver: FieldResolver<'Query', 'about'> = async (
  _,
  __,
  context: Context,
) => {
  try {
    let siteUrl = `/about.json`;

    let {
      data: {
        about: {
          stats: { topic_count: topicCount, post_count: postCount },
        },
      },
    } = await context.client.get(siteUrl);

    return {
      topicCount,
      postCount,
    };
  } catch (error) {
    throw errorHandler(error);
  }
};

let aboutQuery = queryField('about', {
  type: 'About',
  resolve: aboutResolver,
});

export { aboutQuery };
